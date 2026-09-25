-- =====================================================================
-- Opus X — Sprint 2 — 2b : pré-contrôle HMAC+issuer (ORDRE STRICT D-050)
-- =====================================================================
-- D-050 exige : HMAC transport → résolution issuer → vérif signature badge
-- (obVerify, TS) → cross-check → … Or le HMAC est vérifié EN BASE (temps
-- constant), et obVerify est du TS (route). Pour que obVerify s'exécute APRÈS
-- le HMAC, la route appelle d'abord cette fonction (étapes 1-2 SEULES), puis
-- obVerify, puis wsp_ingest_evidence (qui re-vérifie le HMAC en étape 1 —
-- redondance de défense en profondeur, la transaction d'écriture reste atomique).
--
-- Extrait VERBATIM de l'étape 1 de wsp_ingest_evidence : même secret, même
-- fenêtre ±300 s, même comparaison temps constant, hex minuscule. Aucune écriture.
-- =====================================================================
create or replace function public.wsp_verify_issuer_request(
  p_issuer_id text,
  p_timestamp text,
  p_body      text,
  p_signature text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_secret   text;
  v_now      bigint := floor(extract(epoch from now()))::bigint;
  v_ts       bigint;
  v_expected text;
begin
  select s.hmac_secret into v_secret
  from public.wsp_issuer_secrets s
  join public.wsp_issuers i on i.id = s.issuer_id and i.status = 'active'
  where s.issuer_id = p_issuer_id;
  if v_secret is null then
    raise exception 'unauthorized' using errcode = '28000';
  end if;
  begin
    v_ts := p_timestamp::bigint;
  exception when others then
    raise exception 'unauthorized' using errcode = '28000';
  end;
  if abs(v_now - v_ts) > 300 then
    raise exception 'unauthorized' using errcode = '28000';
  end if;
  v_expected := encode(extensions.hmac(p_timestamp || '.' || p_body, v_secret, 'sha256'), 'hex');
  if not public.wsp_ct_eq(v_expected, lower(coalesce(p_signature, ''))) then
    raise exception 'unauthorized' using errcode = '28000';
  end if;
end;
$$;

comment on function public.wsp_verify_issuer_request(text, text, text, text) is
  'Pré-contrôle 2b (D-050) : HMAC transport + issuer actif SEULS (miroir de l''étape 1 de wsp_ingest_evidence). Permet à la route de vérifier le HMAC AVANT obVerify (TS). Aucune écriture. unauthorized sinon.';

-- Serveur à serveur (l'Issuer n'est pas un utilisateur) : la sécurité est le HMAC
-- vérifié À L'INTÉRIEUR, pas l'appartenance d'un rôle. Même exposition que le RPC d'ingestion.
revoke all on function public.wsp_verify_issuer_request(text, text, text, text) from public;
grant execute on function public.wsp_verify_issuer_request(text, text, text, text) to anon, authenticated;

-- ════════════════════════════════════════════════════════
-- POST-MIGRATION VERIFICATIONS
-- ════════════════════════════════════════════════════════
-- 1. Fonction présente :
--    select count(*) from pg_proc where proname='wsp_verify_issuer_request';  → 1
-- 2. Un HMAC valide passe (void), un invalide lève 'unauthorized' :
--    select public.wsp_verify_issuer_request('issuer:qa','<ts>','<body>','<sig>');
