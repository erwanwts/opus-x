-- =====================================================================
-- Opus X — WSP → Passport : LE PONT (Palier 1, À VIDE)
-- =====================================================================
-- Établit la RÉSOLUTION d'un sujet WSP vers son Passport, et le REJET
-- D-035 (sujet sans Passport). AUCUNE écriture, AUCUN passport_update,
-- AUCUNE mutation de l'ingestion. Créer wsp_passport_updates, ajouter
-- passport_update_id, toucher trust_index, câbler la branche accept =
-- PALIER 2 (pas ici).
--
-- Chaîne de résolution (mesurée) :
--   wsp_evidence.subject_id (opus_id)
--     → profiles.opus_id → profiles.id
--     → passports.profile_id → passports.id
-- La chaîne EXISTE en schéma mais n'était CÂBLÉE nulle part ; ce pont la
-- rend, en lecture seule.
--
-- Décisions gravées :
--   D-035 — preuve pour un sujet SANS Passport = REJETER (erreur nommée
--           `subject_has_no_passport`) ; jamais d'auto-émission, jamais de
--           silence, jamais de crash non nommé.
-- =====================================================================

-- ── 1. RÉSOLUTION PURE ───────────────────────────────────────────────
-- Retourne le `passports.id` du sujet, ou NULL (= absence de Passport,
-- OU opus_id inexistant). Fonction STABLE, en LECTURE SEULE, sans aucun
-- effet de bord : elle n'écrit rien. `security definer` pour franchir la
-- RLS comme le fait l'ingestion (barrière = la RLS, pas cette lecture
-- interne). `search_path=''` → tout est schéma-qualifié.
create or replace function public.wsp_resolve_subject_passport(p_opus_id text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select pa.id
  from public.profiles pr
  join public.passports pa on pa.profile_id = pr.id
  where pr.opus_id = p_opus_id;
$$;

comment on function public.wsp_resolve_subject_passport(text) is
  'Pont WSP→Passport (Palier 1). Résout un opus_id de sujet vers son passports.id via profiles. NULL = le sujet n''a pas de Passport (ou l''opus_id n''existe pas). Lecture seule, aucun effet de bord ; n''écrit rien (le passport_update est le Palier 2).';

-- ── 2. REJET D-035 ───────────────────────────────────────────────────
-- Exige que le sujet ait un Passport : retourne le `passports.id`, sinon
-- LÈVE `subject_has_no_passport` (errcode 22000, famille des rejets de
-- contenu de l'ingestion). C'est le COMPORTEMENT DE REJET prêt à câbler.
--
-- POINT D'INSERTION (Palier 2, PAS FAIT ICI) : dans `wsp_ingest_evidence`,
-- APRÈS l'étape 6 (existence du profil confirmée, ~ligne 172) et AVANT
-- l'écriture append-only (étape 10). La branche accept n'est pas touchée
-- à ce palier : on établit seulement la fonction que le Palier 2 appellera
--   v_passport := public.wsp_require_subject_passport(v_subject);
-- juste avant d'écrire le fait et, ensuite (Palier 2), le passport_update.
create or replace function public.wsp_require_subject_passport(p_opus_id text)
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_passport uuid;
begin
  v_passport := public.wsp_resolve_subject_passport(p_opus_id);
  if v_passport is null then
    -- D-035 : rejet EXPLICITE et nommé. Jamais d'auto-émission, jamais de
    -- silence. Le sujet doit posséder un Passport pour recevoir une preuve.
    raise exception 'subject_has_no_passport' using errcode = '22000';
  end if;
  return v_passport;
end;
$$;

comment on function public.wsp_require_subject_passport(text) is
  'Pont WSP→Passport (Palier 1, D-035). Exige un Passport pour le sujet : retourne passports.id, sinon lève subject_has_no_passport (jamais d''auto-émission, jamais de silence). Point d''insertion Palier 2 : dans wsp_ingest_evidence, après l''étape 6 (profil confirmé), avant l''écriture. NON câblé à ce palier.';

-- ── Accès : fonctions INTERNES (comme wsp_consent_active). Les clients
-- (anon/authenticated) ne doivent PAS les appeler — pas d'énumération de
-- l'existence d'un Passport par RPC. Seul le backend (service_role) et,
-- au Palier 2, l'ingestion security-definer (qui s'exécute comme owner)
-- y accèdent.
revoke all on function public.wsp_resolve_subject_passport(text) from public, anon, authenticated;
revoke all on function public.wsp_require_subject_passport(text) from public, anon, authenticated;
grant execute on function public.wsp_resolve_subject_passport(text) to service_role;
grant execute on function public.wsp_require_subject_passport(text) to service_role;
