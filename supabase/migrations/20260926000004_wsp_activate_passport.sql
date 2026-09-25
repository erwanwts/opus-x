-- =====================================================================
-- Opus X — Sprint 2 — O-E : CRÉER OU LIER (D-056)
-- =====================================================================
-- Décision D-056 : à l'activation, un sujet NOUVEAU fonde son Passeport
-- (decision='create', par l'émission) ; un sujet DÉJÀ passeporté qui ré-active
-- RELIE seulement (decision='link') — AUCUN 2e Passeport, MÊME passport_id.
--
-- La branche est câblée ici, autoritaire, sujet dérivé de la SESSION (P3) :
--   • Passeport présent  → 'link'  : on inscrit le consentement de reliage
--     (store dédié O-B, decision='link', idempotent) et on renvoie le
--     passport_id EXISTANT. Cette fonction ne crée JAMAIS de Passeport.
--   • Passeport absent    → 'create': la décision est FONDER, mais la création
--     appartient à l'émission (issue_passport / trigger), jamais à cette
--     fonction. On renvoie 'needs_emission' sans rien créer.
--
-- L'invariant « pas de 2e Passeport » n'est pas défendu par cette fonction
-- seule : il est STRUCTUREL (passports.profile_id UNIQUE, prouvé O-A). Ici on
-- ne fait qu'exprimer et enregistrer la décision, sans jamais insérer un
-- Passeport. Idempotent. STAGING d'abord, jamais prod.
-- =====================================================================
create or replace function public.wsp_activate_passport()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user     uuid := (select auth.uid());
  v_opus     text;
  v_passport uuid;
  v_decision text;
begin
  if v_user is null then
    raise exception 'Non authentifié.' using errcode = '42501';
  end if;

  select pr.opus_id, pa.id
    into v_opus, v_passport
  from public.profiles pr
  left join public.passports pa on pa.profile_id = pr.id
  where pr.id = v_user;

  if v_opus is null then
    -- Identité non établie (aucun profil).
    raise exception 'Non authentifié.' using errcode = '42501';
  end if;

  if v_passport is not null then
    -- DÉJÀ passeporté : on RELIE. Jamais un 2e Passeport.
    v_decision := 'link';
    insert into public.passport_creation_consents
      (profile_id, decision, granted, version, effective_date, granted_at)
    values (
      v_user, 'link', true,
      public.consent_default_version(), public.consent_default_effective_date(), now()
    )
    on conflict (profile_id, decision, version) do nothing;
  else
    -- Pas encore de Passeport : décision = FONDER ; la création appartient à
    -- l'émission, jamais à cette fonction (on ne crée rien ici).
    v_decision := 'create';
  end if;

  return jsonb_build_object(
    'opus_id',     v_opus,
    'passport_id', v_passport,   -- MÊME passport_id (ou null si non encore émis)
    'decision',    v_decision,   -- 'link' (déjà passeporté) | 'create' (à émettre)
    'status',      case when v_passport is not null then 'linked' else 'needs_emission' end
  );
end;
$$;

comment on function public.wsp_activate_passport() is
  'CRÉER OU LIER (D-056) : sujet dérivé de la session (P3). Passeport présent → decision=''link'' (inscrit le consentement de reliage, renvoie le passport_id EXISTANT) ; absent → decision=''create'' (needs_emission, ne crée rien). Ne crée JAMAIS de Passeport : l''unicité passports.profile_id est l''invariant.';

revoke all on function public.wsp_activate_passport() from public, anon;
grant execute on function public.wsp_activate_passport() to authenticated;

-- ════════════════════════════════════════════════════════
-- POST-MIGRATION VERIFICATIONS
-- ════════════════════════════════════════════════════════
-- 1. Fonction présente :
--    select count(*) from pg_proc where proname='wsp_activate_passport';  → 1
-- 2. Ré-activation d'un sujet déjà passeporté → 'link', même passport_id, 0
--    nouveau Passeport : voir le test d'intégration O-E (staging).
