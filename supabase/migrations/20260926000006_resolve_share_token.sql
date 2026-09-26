-- =====================================================================
-- Opus X — Sprint 2 — T-B : RÉSOLUTION DU TOKEN DE PARTAGE (D-058→D-062)
-- =====================================================================
-- resolve_share_token(token) : la lecture TOKEN-SCOPÉE d'un passeport, qui
-- ENACTE les deux garanties de l'amendement D-043 :
--   ⭐ le token OUTREPASSE le privé (D-T1) — AUCUN filtre visibility ; un
--      passeport `private` est révélé à qui présente un token ACTIF ;
--   ⭐ D-042 JAMAIS contourné — le filtre `published = true` est CONSERVÉ ;
--      une compétence non publiée reste absente, même via token.
--
-- ⚠️ REFINEMENT de sécurité sur D-T4 : la fonction renvoie DIRECTEMENT la
-- projection whitelistée (jamais juste le handle). Rendre le handle puis lire
-- « par handle » sans filtre visibility OUVRIRAIT le privé à quiconque connaît
-- le handle (qui n'est pas un secret). La lecture DOIT être gardée par le
-- TOKEN. La projection est identique à public_passport_competencies (mêmes
-- jointures + provenance), au filtre visibility près (remplacé par le token).
--
-- Résolution par LOOKUP indexé sur le hash (patron wsp_exchange_code) : le
-- token en clair n'est jamais comparé, seul son sha256. Token inconnu OU
-- révoqué OU passeport sans compétence publiée → `null` UNIFORME (404 non-
-- énumérant : indistincts, même chemin). JAMAIS exposés : opus_id, passport_id,
-- le token, le contenu de preuve brut.
--
-- security definer ; appelable par anon (la page /verify est publique) : la
-- sécurité est la DÉTENTION du token (256 bits), pas l'appartenance d'un rôle.
-- Idempotent (create or replace). STAGING d'abord, jamais prod.
-- =====================================================================
create or replace function public.resolve_share_token(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hash        text;
  v_passport    uuid;
  v_handle      text;
  v_lifecycle   text;
  v_issued_at   timestamptz;
  v_name        text;
  v_headline    text;
  v_competencies jsonb;
begin
  if coalesce(btrim(p_token), '') = '' then
    return null;
  end if;

  -- Lookup par digest indexé (le clair n'est jamais stocké). Token ACTIF requis :
  -- révoqué et inexistant tombent tous deux ici en « non trouvé » → null uniforme.
  v_hash := encode(extensions.digest(p_token, 'sha256'), 'hex');
  select st.passport_id into v_passport
  from public.passport_share_tokens st
  where st.token_hash = v_hash and st.revoked_at is null;
  if v_passport is null then
    return null;
  end if;

  -- Identité publique du passeport — SANS filtre visibility (le token autorise).
  select pa.handle, pa.lifecycle_stage, pa.issued_at, pr.full_name, pr.headline
    into v_handle, v_lifecycle, v_issued_at, v_name, v_headline
  from public.passports pa
  join public.profiles pr on pr.id = pa.profile_id
  where pa.id = v_passport;

  -- Compétences PUBLIÉES uniquement (D-042 conservé) + Trust + provenance
  -- publique (NOM d'émetteur + date, jamais le contenu). Mêmes jointures que
  -- public_passport_competencies, au filtre visibility près (absent ici).
  select coalesce(jsonb_agg(
           jsonb_build_object(
             'skill_id',   ct.skill_id,
             'skill_name', sk.name,
             'state',      ct.state,
             'basis_level',ct.basis_level,
             'evidence_provenance', (
               select coalesce(
                 jsonb_agg(
                   jsonb_build_object('issuer_name', iss.display_name, 'occurred_at', ev.occurred_at)
                   order by ev.occurred_at
                 ), '[]'::jsonb)
               from public.wsp_evidence_demonstrates_skill ds
               join public.wsp_evidence ev  on ev.id = ds.evidence_id
               join public.wsp_issuers   iss on iss.id = ev.issuer_id
               where ev.subject_id = (select opus_id from public.profiles where id = (select profile_id from public.passports where id = v_passport))
                 and ds.skill_id = ct.skill_id and ds.framework_version = ct.framework_version
                 and not exists (select 1 from public.wsp_fact_revocations rv where rv.revokes_evidence_id = ev.id)
             )
           )
         ), '[]'::jsonb)
    into v_competencies
  from public.wsp_competency_trust ct
  join public.wsp_skills sk on sk.id = ct.skill_id
  join public.wsp_competency_publication cp
    on  cp.passport_id = ct.passport_id
    and cp.skill_id = ct.skill_id
    and cp.framework_version = ct.framework_version
    and cp.published = true
  where ct.passport_id = v_passport;

  -- Périmètre vide (aucune compétence publiée) → rien ne sort → 404 (non-énumérant).
  if v_competencies is null or jsonb_array_length(v_competencies) = 0 then
    return null;
  end if;

  return jsonb_build_object(
    'handle',          v_handle,
    'display_name',    v_name,
    'headline',        v_headline,
    'lifecycle_stage', v_lifecycle,
    'issued_at',       v_issued_at,
    'competencies',    v_competencies
  );
end;
$$;

comment on function public.resolve_share_token(text) is
  'T-B (D-058→D-062) : lecture TOKEN-SCOPÉE. Token actif → projection whitelistée (handle + nom + date + compétences PUBLIÉES + provenance), SANS filtre visibility (le token outrepasse le privé, D-T1) mais published CONSERVÉ (D-042 non contourné). Token inconnu/révoqué/périmètre vide → null uniforme (404 non-énumérant). Jamais opus_id/passport_id/preuve brute.';

-- Appelable sans session (page publique /verify) : la sécurité est la détention
-- du token (256 bits), vérifiée À L'INTÉRIEUR par le hash.
revoke all on function public.resolve_share_token(text) from public;
grant execute on function public.resolve_share_token(text) to anon, authenticated;

-- ════════════════════════════════════════════════════════
-- POST-MIGRATION VERIFICATIONS
-- ════════════════════════════════════════════════════════
-- 1. Fonction présente :
--    select count(*) from pg_proc where proname='resolve_share_token';  → 1
-- 2. Les 2 garanties + 404 non-énumérant + published-mordant : test T-B (staging).
