-- =====================================================================
-- Opus X — AVANCÉE du lifecycle (étapes basses) — JALON MONOTONE (D-040)
-- =====================================================================
-- L'étape de lifecycle est un JALON high-water mark, imposé EN BASE (D-040) :
-- elle avance vers la plus haute étape BASSE atteignable et ne recule JAMAIS.
-- Une révocation (D-036) n'affecte que le CONTENU (skills/evidence actifs),
-- jamais le jalon. Cohérent avec D-039 (monotonie) et OCR-126 (ordre linéaire).
--
-- PÉRIMÈTRE STRICT — 2 transitions basses seulement :
--   identity_established → receiving_evidence : ≥ 1 passport_update evidence ACTIF ;
--   receiving_evidence  → skills_emerging     : ≥ 1 compétence ACTIVE.
-- Les étapes HAUTES (trust_established+, rang ≥ 4) ne sont JAMAIS calculées ici
-- (trust engine = palier 4). NE TOUCHE PAS trust_index, ni l'UI.
-- =====================================================================

-- ── 1. ORDINAL des étapes (l'ordre linéaire d'OCR-126) — pour comparer « plus
--    haut que ». Pure/IMMUTABLE. Laissée exécutable par tous : le garde
--    anti-régression (ci-dessous) l'appelle dans le contexte de l'appelant qui
--    modifie un Passport (ex. le Dashboard authentifié), pas seulement en interne.
create or replace function public.wsp_lifecycle_rank(p_stage text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select array_position(
    array[
      'identity_established', 'receiving_evidence', 'skills_emerging',
      'trust_established', 'passport_verified', 'trusted_professional', 'authority'
    ],
    p_stage
  );
$$;

comment on function public.wsp_lifecycle_rank(text) is
  'Rang (1..7) d''une étape de lifecycle dans l''ordre linéaire d''OCR-126. Pure. Sert au high-water mark (D-040) et au garde anti-régression.';

-- ── 2. GARDE ANTI-RÉGRESSION (D-040, structurel — pas une convention) ────────
-- Un trigger BEFORE UPDATE qui REJETTE toute tentative de faire DESCENDRE
-- lifecycle_stage. La monotonie devient impossible à violer, quel que soit
-- l'appelant (sœur de l'append-only du palier 2). Non security-definer : il
-- s'exécute dans le contexte de l'appelant (d'où le rang laissé public).
create or replace function public.wsp_lifecycle_no_regress()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.wsp_lifecycle_rank(new.lifecycle_stage) < public.wsp_lifecycle_rank(old.lifecycle_stage) then
    raise exception 'WSP_LIFECYCLE_MONOTONE: lifecycle_stage ne peut jamais reculer (% -> %). Jalon high-water mark (D-040 / D-039).',
      old.lifecycle_stage, new.lifecycle_stage
      using errcode = 'restrict_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists wsp_passports_lifecycle_monotone on public.passports;
create trigger wsp_passports_lifecycle_monotone
  before update of lifecycle_stage on public.passports
  for each row execute function public.wsp_lifecycle_no_regress();

-- ── 3. L'AVANCÉE — high-water mark, étapes basses seulement ───────────────────
-- Calcule la cible = plus haute étape BASSE satisfaite par l'état ACTIF courant,
-- puis MONTE seulement (jamais de descente). Une révocation abaisse la cible mais
-- laisse le jalon inchangé — c'est le high-water mark.
create or replace function public.wsp_advance_lifecycle(p_passport_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current   text;
  v_active_ev integer;
  v_active_sk integer;
  v_target    text;
begin
  select lifecycle_stage into v_current from public.passports where id = p_passport_id;
  if v_current is null then return; end if;  -- Passport absent : rien.

  -- Compteurs ACTIFS (non révoqués, D-036).
  select count(*) into v_active_ev
  from public.wsp_passport_updates
  where passport_id = p_passport_id and update_type = 'evidence' and revoked_at is null;

  select count(distinct ds.skill_id) into v_active_sk
  from public.wsp_evidence_demonstrates_skill ds
  join public.wsp_evidence ev on ev.id = ds.evidence_id
  join public.profiles pr on pr.opus_id = ev.subject_id
  join public.passports pa on pa.profile_id = pr.id
  where pa.id = p_passport_id
    and not exists (
      select 1 from public.wsp_fact_revocations r where r.revokes_evidence_id = ev.id
    );

  -- Cible = plus haute étape BASSE satisfaite. Le SAUT : une skill active ⇒
  -- skills_emerging directement (pas de blocage étape par étape). Les étapes
  -- HAUTES (rang ≥ 4) ne sont JAMAIS produites ici (trust engine, palier 4).
  v_target := case
    when v_active_sk >= 1 then 'skills_emerging'
    when v_active_ev >= 1 then 'receiving_evidence'
    else 'identity_established'
  end;

  -- HIGH-WATER MARK (D-040) : ne monter que si la cible est PLUS HAUTE. Sinon
  -- rien (jamais de descente ; une révocation ne fait pas reculer le jalon).
  if public.wsp_lifecycle_rank(v_target) > public.wsp_lifecycle_rank(v_current) then
    update public.passports
       set lifecycle_stage = v_target, updated_at = now()
     where id = p_passport_id;
  end if;
end;
$$;

comment on function public.wsp_advance_lifecycle(uuid) is
  'Avancée du lifecycle (D-040), high-water mark, étapes BASSES seulement (≤ skills_emerging). Monte vers la plus haute étape basse satisfaite par l''état actif ; ne recule jamais. Étapes hautes = palier 4 (non calculées ici).';

-- ── 4. DÉCLENCHEMENT — à l'acceptation d'une preuve (palier 2), transactionnel ─
-- L'avancée se déclenche quand un passport_update de type evidence est créé — ce
-- qui n'arrive qu'à l'acceptation d'une preuve (wsp_ingest_evidence), APRÈS que le
-- fait et sa skill démontrée sont écrits. Les deux transitions basses sont des
-- conséquences de l'evidence (les skills en dérivent), d'où un seul déclencheur.
create or replace function public.wsp_pu_advance_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.wsp_advance_lifecycle(new.passport_id);
  return new;
end;
$$;

drop trigger if exists wsp_passport_updates_advance on public.wsp_passport_updates;
create trigger wsp_passport_updates_advance
  after insert on public.wsp_passport_updates
  for each row when (new.update_type = 'evidence')
  execute function public.wsp_pu_advance_lifecycle();

-- ── Accès : fonctions internes. Le rang reste public (appelé par le garde dans
-- le contexte de l'appelant). L'avancée : service_role (tests + backend) ;
-- appelée en interne par le trigger security-definer.
revoke all on function public.wsp_advance_lifecycle(uuid) from public, anon, authenticated;
grant execute on function public.wsp_advance_lifecycle(uuid) to service_role;
