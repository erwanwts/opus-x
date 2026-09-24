-- =====================================================================
-- Opus X — TRUST ENGINE (palier 4) : Trust PAR COMPÉTENCE (OCR-105, D-041)
-- =====================================================================
-- La formule d'OCR-105 prend vie : un état de Trust PAR COMPÉTENCE, dérivé des
-- preuves ACTIVES selon le niveau atteint, contre une version de Framework.
-- Déterministe et reproductible : mêmes preuves actives → même état, toujours.
-- AUCUN facteur de volume, d'Issuer, de temps, ni de score numérique (OCR-105).
--
-- ⚠️ Le Trust par compétence reflète l'INSTANT : il monte ET descend selon les
-- preuves actives (une révocation peut faire retomber established → establishing).
-- C'est l'INVERSE du lifecycle (monotone, D-040). Ne pas confondre les deux.
--
-- D-041 : established = ≥1 preuve active de niveau proficient|mastery.
--   Formule : aucune preuve active → establishing ; applied (rien de plus haut)
--   → emerging ; proficient|mastery → established. Volume EXCLU.
--
-- NE TOUCHE PAS : la vue publique (palier 5), le front. Le trust_index par-passport
-- n'est PAS détruit (son sort est signalé, non tranché — cf. commentaire).
-- =====================================================================

-- ── 1. REPRÉSENTATION PAR COMPÉTENCE (la granularité qu'OCR-105 exige) ────────
-- Une ligne par (passport, compétence). basis_level = niveau actif le plus haut
-- qui JUSTIFIE l'état (traçabilité + reproductibilité : état = f(basis_level)).
-- Table DÉRIVÉE (recalculée), pas un fait append-only. Pas de colonne score
-- (OCR-105 : jamais de score numérique).
create table if not exists public.wsp_competency_trust (
  passport_id       uuid        not null references public.passports(id) on delete cascade,
  skill_id          text        not null references public.wsp_skills(id),
  framework_version text        not null,
  state             text        not null check (state in ('establishing', 'emerging', 'established')),
  basis_level       text,       -- niveau actif le plus haut (NULL = aucune preuve active)
  computed_at       timestamptz not null default now(),
  primary key (passport_id, skill_id, framework_version)
);

comment on table public.wsp_competency_trust is
  'Trust PAR COMPÉTENCE (palier 4, OCR-105). État dérivé des preuves ACTIVES selon le niveau atteint (D-041 : proficient|mastery → established). Reflète l''instant : monte ET descend (contrairement au lifecycle monotone D-040). basis_level = niveau justifiant l''état. Aucun score numérique (OCR-105).';

-- Note sur trust_index (par-passport, 1:1) : NON détruit. Deux lecteurs l'utilisent
-- (DashboardService, finalize_emission). Son sort — devenir un RÉSUMÉ dérivé du
-- par-compétence (« established si ≥1 compétence established », le « somewhere »
-- d'OCR-126) ou être déprécié — est une DÉCISION à trancher plus tard. Ici on ne
-- le touche pas ; le par-compétence est la nouvelle source de vérité.

-- Accès : table interne (comme wsp_evidence). Lecture par le sujet via fonctions.
revoke all on public.wsp_competency_trust from anon, authenticated;

-- ── 2. LE CALCUL — déterministe, par compétence (OCR-105, D-041) ──────────────
-- Recalcule TOUTES les compétences que le passport a jamais touchées (active ou
-- révoquée : une compétence dont la preuve est révoquée doit redescendre). Pour
-- chacune : niveau ACTIF le plus haut → état, par le mapping D-041.
create or replace function public.wsp_recompute_passport_trust(p_passport_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_subject  text;
  r          record;
  v_top_slug text;
  v_state    text;
begin
  select pr.opus_id into v_subject
  from public.passports pa
  join public.profiles pr on pr.id = pa.profile_id
  where pa.id = p_passport_id;
  if v_subject is null then return; end if;

  for r in
    select distinct ds.skill_id, ds.framework_version
    from public.wsp_evidence_demonstrates_skill ds
    join public.wsp_evidence ev on ev.id = ds.evidence_id
    where ev.subject_id = v_subject
  loop
    -- Niveau le plus haut parmi les preuves ACTIVES (non révoquées, D-036) de
    -- cette compétence. NULL si toutes révoquées.
    select l.slug into v_top_slug
    from public.wsp_evidence_demonstrates_skill ds
    join public.wsp_evidence ev on ev.id = ds.evidence_id
    join public.wsp_skill_levels l
      on l.skill_id = ds.skill_id and l.framework_version = ds.framework_version and l.slug = ds.claimed_level
    where ev.subject_id = v_subject
      and ds.skill_id = r.skill_id and ds.framework_version = r.framework_version
      and not exists (select 1 from public.wsp_fact_revocations rv where rv.revokes_evidence_id = ev.id)
    order by l.rank desc
    limit 1;

    -- D-041 — mapping niveau → état (fidèle à OCR-105, par niveau atteint).
    -- Framework-spécifique (niveaux wtr) ; généralisable quand un 2e Framework
    -- existera. AUCUN volume, Issuer, temps, ni score.
    v_state := case
      when v_top_slug is null                       then 'establishing'  -- aucune preuve active
      when v_top_slug in ('proficient', 'mastery')  then 'established'    -- D-041
      when v_top_slug = 'applied'                    then 'emerging'
      else 'establishing'                                                 -- aware : sous le seuil emerging
    end;

    insert into public.wsp_competency_trust (passport_id, skill_id, framework_version, state, basis_level, computed_at)
    values (p_passport_id, r.skill_id, r.framework_version, v_state, v_top_slug, now())
    on conflict (passport_id, skill_id, framework_version)
    do update set state = excluded.state, basis_level = excluded.basis_level, computed_at = excluded.computed_at;
  end loop;
end;
$$;

comment on function public.wsp_recompute_passport_trust(uuid) is
  'Trust engine (palier 4, OCR-105) : recalcule le Trust PAR COMPÉTENCE d''un passport depuis ses preuves ACTIVES. Déterministe. D-041 : proficient|mastery → established. Reflète l''instant (non monotone).';

revoke all on function public.wsp_recompute_passport_trust(uuid) from public, anon, authenticated;
grant execute on function public.wsp_recompute_passport_trust(uuid) to service_role;

-- ── 3. LIEN AU LIFECYCLE — « Trust Established » (étape 4, high-water D-040) ───
-- L'avancée gagne la branche trust_established : elle se déclenche quand ≥1
-- compétence atteint established. L'étape reste MONOTONE (high-water) : une fois
-- franchie, elle ne recule pas, même si la compétence redescend ensuite.
-- (create or replace de la fonction du palier D-040, + la branche haute.)
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
  if v_current is null then return; end if;

  select count(*) into v_active_ev
  from public.wsp_passport_updates
  where passport_id = p_passport_id and update_type = 'evidence' and revoked_at is null;

  select count(distinct ds.skill_id) into v_active_sk
  from public.wsp_evidence_demonstrates_skill ds
  join public.wsp_evidence ev on ev.id = ds.evidence_id
  join public.profiles pr on pr.opus_id = ev.subject_id
  join public.passports pa on pa.profile_id = pr.id
  where pa.id = p_passport_id
    and not exists (select 1 from public.wsp_fact_revocations r where r.revokes_evidence_id = ev.id);

  -- Cible = plus haute étape atteignable. La branche trust_established (palier 4)
  -- s'ajoute au-dessus des 2 transitions basses. Les étapes 5+ restent hors
  -- périmètre (verification, gouvernance). Le SAUT vaut toujours (plus haute
  -- étape satisfaite).
  v_target := case
    when exists (
      select 1 from public.wsp_competency_trust
      where passport_id = p_passport_id and state = 'established'
    ) then 'trust_established'
    when v_active_sk >= 1 then 'skills_emerging'
    when v_active_ev >= 1 then 'receiving_evidence'
    else 'identity_established'
  end;

  -- HIGH-WATER MARK (D-040) : monter seulement. Une révocation qui fait retomber
  -- la compétence abaisse la cible, mais le jalon reste (jamais de descente).
  if public.wsp_lifecycle_rank(v_target) > public.wsp_lifecycle_rank(v_current) then
    update public.passports
       set lifecycle_stage = v_target, updated_at = now()
     where id = p_passport_id;
  end if;
end;
$$;

comment on function public.wsp_advance_lifecycle(uuid) is
  'Avancée du lifecycle, high-water mark (D-040) + branche Trust Established (palier 4) : monte vers la plus haute étape atteignable — receiving_evidence, skills_emerging (bas), trust_established (≥1 compétence established, D-041). Ne recule jamais. Étapes 5+ (verification/gouvernance) hors périmètre.';

-- ── 4. DÉCLENCHEMENT ─────────────────────────────────────────────────────────
-- (a) À l'acceptation d'une preuve : recalculer le Trust PUIS avancer le lifecycle
--     (l'avancée voit le Trust frais). create or replace du trigger fn du palier D-040.
create or replace function public.wsp_pu_advance_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.wsp_recompute_passport_trust(new.passport_id);  -- Trust d'abord (palier 4)
  perform public.wsp_advance_lifecycle(new.passport_id);          -- puis lifecycle (voit le Trust)
  return new;
end;
$$;

-- (b) À la révocation d'une preuve : recalculer le Trust (il peut DESCENDRE), mais
--     NE PAS avancer le lifecycle (le jalon est monotone, D-040 — il ne recule pas).
create or replace function public.wsp_revocation_recompute_trust()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_passport uuid;
begin
  select pa.id into v_passport
  from public.wsp_evidence ev
  join public.profiles pr on pr.opus_id = ev.subject_id
  join public.passports pa on pa.profile_id = pr.id
  where ev.id = new.revokes_evidence_id;
  if v_passport is not null then
    perform public.wsp_recompute_passport_trust(v_passport);
    -- PAS d'avancée : le lifecycle ne recule jamais (D-040). Le Trust, lui, reflète l'instant.
  end if;
  return new;
end;
$$;

drop trigger if exists wsp_fact_revocations_recompute_trust on public.wsp_fact_revocations;
create trigger wsp_fact_revocations_recompute_trust
  after insert on public.wsp_fact_revocations
  for each row execute function public.wsp_revocation_recompute_trust();

-- ── 5. LECTURE owner-scopée pour le Dashboard (verified_count réel, palier 3) ─
-- Le verified_count du Dashboard valait 0 en attendant le trust engine. Il peut
-- désormais refléter le Trust RÉEL : nombre de compétences ACTIVES du caller à
-- l'état established. Owner-scopé (current_opus_id), comme wsp_my_active_skills.
create or replace function public.wsp_my_established_count()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.wsp_competency_trust ct
  join public.passports pa on pa.id = ct.passport_id
  join public.profiles pr on pr.id = pa.profile_id
  where pr.opus_id = public.current_opus_id() and ct.state = 'established';
$$;

comment on function public.wsp_my_established_count() is
  'Palier 4 → 3 : nombre de compétences du caller à l''état Trust established. Alimente le verified_count du Dashboard (qui valait 0 avant le trust engine). Owner-scopé.';

revoke all on function public.wsp_my_established_count() from public, anon;
grant execute on function public.wsp_my_established_count() to authenticated, service_role;
