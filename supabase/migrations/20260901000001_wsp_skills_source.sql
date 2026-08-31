-- =====================================================================
-- Opus X — PALIER 3 (skills, #5) : rebranchement de la source des skills
-- =====================================================================
-- La source Sprint-1 (public.skills) est VIDE et ne se remplit jamais. On
-- rebranche la lecture sur la source RÉELLE : wsp_evidence_demonstrates_skill,
-- les compétences que les preuves ACCEPTÉES démontrent. Lecture dérivée, pas de
-- copie (source unique = le fait).
--
-- D-036 (faits actifs seuls) : on EXCLUT les preuves révoquées. Une preuve est
-- révoquée s'il existe un fait wsp_fact_revocations qui la vise — la même source
-- de vérité que la marque revoked_at du palier 2 (le trigger du palier 2 pose
-- revoked_at À PARTIR de ce fait ; les deux sont équivalents pour une preuve
-- acceptée). On lit ici le fait, la couche fondamentale.
--
-- PÉRIMÈTRE STRICT : la lecture des skills, rien d'autre. NE FAIT PAS l'avancée
-- du lifecycle_stage, le trust engine, ni la vue publique.
--
-- ── TRANSFORMATION SIGNALÉE (à valider, NON décidée ici) ─────────────────
-- Grain : wsp_evidence_demonstrates_skill est PAR PREUVE (evidence_id, skill_id,
-- claimed_level). Un même skill peut être démontré par PLUSIEURS preuves, à des
-- niveaux revendiqués éventuellement DIFFÉRENTS. Cette fonction retourne les
-- paires (skill, niveau) ACTIVES DISTINCTES — elle N'AGRÈGE PAS un "niveau du
-- skill" quand plusieurs niveaux coexistent (max ? dernier ? par version ?). Le
-- décompte de skills en aval compte les skill_uri DISTINCTS. Le choix d'un
-- niveau unique par skill est une DÉCISION à trancher (couplée au trust, palier 4).
-- =====================================================================

-- Compétences ACTIVES du CALLER (owner-scopé via current_opus_id → auth.uid).
-- security definer : franchit le verrouillage des tables wsp_ (comme les RLS) ;
-- le scoping au caller reste sûr (jamais les skills d'un autre sujet).
create or replace function public.wsp_my_active_skills()
returns table (skill_uri text, claimed_level text, framework_version text)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct ds.skill_id, ds.claimed_level, ds.framework_version
  from public.wsp_evidence_demonstrates_skill ds
  join public.wsp_evidence ev on ev.id = ds.evidence_id
  where ev.subject_id = public.current_opus_id()
    and not exists (
      select 1
      from public.wsp_fact_revocations r
      where r.revokes_evidence_id = ev.id
    );
$$;

comment on function public.wsp_my_active_skills() is
  'Palier 3 (#5) — compétences ACTIVES du caller, dérivées de wsp_evidence_demonstrates_skill (preuves acceptées), preuves révoquées EXCLUES (D-036, via wsp_fact_revocations). Owner-scopé (current_opus_id). Retourne les paires (skill_uri, claimed_level) DISTINCTES ; l''agrégation d''un niveau unique par skill n''est PAS décidée (couplée au trust, palier 4).';

-- Accès : le caller lit SES compétences ; interne sinon (comme wsp_consent_active).
revoke all on function public.wsp_my_active_skills() from public, anon;
grant execute on function public.wsp_my_active_skills() to authenticated, service_role;
