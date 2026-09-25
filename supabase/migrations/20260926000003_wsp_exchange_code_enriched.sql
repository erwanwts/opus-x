-- =====================================================================
-- Opus X — Sprint 2 — O-D : RETOUR ENRICHI DE L'ÉCHANGE (D-055)
-- =====================================================================
-- Amendement de contrat ENG-002 v0.4 §13 (versionné, jamais un patch silencieux).
-- Le retour de l'échange passe de {opus_id} à :
--   { opus_id, passport_id, link_status, issuer_authorization_id }
-- pour que l'Issuer mette en cache le reliage en UN aller-retour,
-- SANS jamais devenir autoritaire dessus (D-053).
--
--   • passport_id            → indice de cache (D-053) ; JAMAIS un ancrage de
--     fait (ENG-002 §4 : les faits s'ancrent sur profiles(opus_id)).
--   • link_status            → 'linked' (première autorisation du couple) vs
--     'relinked' (rafraîchie). DÉRIVÉ par Opus X, jamais asserté par l'Issuer
--     (D-051, ENG-002 §6.1.1).
--   • issuer_authorization_id→ id de wsp_issuer_authorizations pour le couple ;
--     le jeton reste le secret.
--
-- Corps VERBATIM de wsp_exchange_code (étapes 1→5 inchangées, non-énumération
-- préservée : tout échec = même exception) + le SEUL ajout au SUCCÈS. Le
-- create or replace préserve les grants existants. Idempotent. STAGING d'abord.
-- =====================================================================
create or replace function public.wsp_exchange_code(
  p_issuer_id  text,
  p_timestamp  text,
  p_code       text,
  p_signature  text,
  p_token_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_secret   text;
  v_expected text;
  v_now      bigint := floor(extract(epoch from now()))::bigint;
  v_ts       bigint;
  v_code_hash text;
  v_subject  text;
  v_seq      integer;
  -- O-D (D-055) — champs du retour enrichi.
  v_iaz         text;
  v_link_status text;
  v_passport_id uuid;
  -- Une SEULE exception pour TOUS les échecs : indifférenciée (anti-énumération).
  c_fail     constant text := 'exchange_failed';
begin
  -- 1. Authentification : l'Issuer possède un secret.
  select hmac_secret into v_secret from public.wsp_issuer_secrets where issuer_id = p_issuer_id;
  if v_secret is null then
    raise exception '%', c_fail using errcode = '28000';
  end if;

  -- 2. Fraîcheur de l'horodatage.
  begin
    v_ts := p_timestamp::bigint;
  exception when others then
    raise exception '%', c_fail using errcode = '28000';
  end;
  if abs(v_now - v_ts) > 300 then
    raise exception '%', c_fail using errcode = '28000';
  end if;

  -- 3. Signature HMAC (temps constant).
  v_expected := encode(extensions.hmac(p_timestamp || '.' || p_code, v_secret, 'sha256'), 'hex');
  if not public.wsp_ct_eq(v_expected, lower(coalesce(p_signature, ''))) then
    raise exception '%', c_fail using errcode = '28000';
  end if;

  -- 4. Consommation ATOMIQUE du code, lié à CET Issuer, non expiré, non consommé.
  v_code_hash := encode(extensions.digest(p_code, 'sha256'), 'hex');
  update public.wsp_exchange_codes
     set consumed_at = now()
   where code_hash   = v_code_hash
     and issuer_id   = p_issuer_id       -- le code d'un autre Issuer ne matche pas
     and consumed_at is null
     and expires_at  > now()
  returning subject_id, consent_seq into v_subject, v_seq;
  if not found then
    raise exception '%', c_fail using errcode = '28000';
  end if;

  -- 5. Consentement toujours ACTIF (révocation entre octroi et échange → refus).
  if not public.wsp_consent_active(v_subject, p_issuer_id) then
    raise exception '%', c_fail using errcode = '28000';
  end if;

  -- O-D (D-055) — link_status DÉRIVÉ : l'autorisation du couple existe-t-elle
  -- DÉJÀ ? (avant l'upsert). 'linked' = première ; 'relinked' = rafraîchie.
  select id into v_iaz
  from public.wsp_issuer_authorizations
  where subject_id = v_subject and issuer_id = p_issuer_id;
  v_link_status := case when v_iaz is null then 'linked' else 'relinked' end;

  -- Succès : mint le jeton (empreinte), une autorisation par couple.
  insert into public.wsp_issuer_authorizations (subject_id, issuer_id, token_hash)
  values (v_subject, p_issuer_id, p_token_hash)
  on conflict (subject_id, issuer_id)
    do update set token_hash = excluded.token_hash, updated_at = now()
  returning id into v_iaz;

  -- passport_id : indice de cache pour l'Issuer (D-053). JAMAIS un ancrage de
  -- fait (§4 : les faits s'ancrent sur l'opus_id). null si non émis (théorique).
  select pa.id into v_passport_id
  from public.profiles pr
  join public.passports pa on pa.profile_id = pr.id
  where pr.opus_id = v_subject;

  return jsonb_build_object(
    'opus_id',                 v_subject,
    'passport_id',             v_passport_id,     -- uuid ou null (indice de cache)
    'link_status',             v_link_status,     -- 'linked' | 'relinked'
    'issuer_authorization_id', v_iaz
  );
end;
$$;

comment on function public.wsp_exchange_code(text, text, text, text, text) is
  'ÉCHANGE canal arrière : code + HMAC → jeton, minté une fois. Retour ENRICHI (ENG-002 v0.4 §13, D-055) : opus_id + passport_id (indice de cache, D-053) + link_status (linked/relinked, dérivé) + issuer_authorization_id. Consommation atomique ; tout échec = même exception (non-énumération).';

-- ════════════════════════════════════════════════════════
-- POST-MIGRATION VERIFICATIONS
-- ════════════════════════════════════════════════════════
-- 1. Fonction présente (1 ligne) :
--    select count(*) from pg_proc where proname='wsp_exchange_code';  → 1
-- 2. Le retour enrichi : voir le test d'intégration O-D (staging), un vrai
--    échange bout-en-bout renvoie les 4 champs.
