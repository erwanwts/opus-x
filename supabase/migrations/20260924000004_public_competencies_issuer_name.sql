-- =====================================================================
-- Opus X — PALIER 5 (front) : nom d'émetteur lisible dans la provenance (D-044)
-- =====================================================================
-- La page publique montre « vérifié par [ÉMETTEUR] · [date] ». La vue exposait
-- issuer_id ; on ajoute le NOM PUBLIC de l'émetteur (wsp_issuers.display_name —
-- identité publique, déjà lisible). On n'expose QUE le nom public + la date ;
-- l'issuer_id brut sort de la provenance publique.
--
-- Rien d'autre ne change : DOUBLE FILTRE (visibility='public' ET published),
-- whitelist, JAMAIS de contenu brut. security_invoker reste DEFINER (dette
-- signalée, non soldée — D-042).
-- =====================================================================

-- `create or replace view` interdit d'INSÉRER une colonne au milieu (il verrait
-- un renommage de colonne). La vue est une FEUILLE (aucun objet n'en dépend, seul
-- anon la lit) : on la DROP puis RECRÉE. Le grant to anon est reposé juste après.
drop view if exists public.public_passport_competencies;

create view public.public_passport_competencies
  with (security_invoker = false) as
  select
    pa.handle,
    ct.skill_id,
    sk.name as skill_name,   -- nom lisible ('Intention vs Engagement'), pas l'id brut
    ct.state,
    ct.basis_level,
    -- Provenance publiée : NOM de l'émetteur (pas l'id brut) + date. JAMAIS le
    -- contenu de la preuve (observation/hash/artefacts).
    (
      select coalesce(
        jsonb_agg(
          jsonb_build_object('issuer_name', iss.display_name, 'occurred_at', ev.occurred_at)
          order by ev.occurred_at
        ),
        '[]'::jsonb
      )
      from public.wsp_evidence_demonstrates_skill ds
      join public.wsp_evidence ev  on ev.id = ds.evidence_id
      join public.wsp_issuers    iss on iss.id = ev.issuer_id
      where ev.subject_id = pr.opus_id
        and ds.skill_id = ct.skill_id and ds.framework_version = ct.framework_version
        and not exists (select 1 from public.wsp_fact_revocations rv where rv.revokes_evidence_id = ev.id)
    ) as evidence_provenance
  from public.wsp_competency_trust ct
  join public.passports pa on pa.id = ct.passport_id
  join public.profiles   pr on pr.id = pa.profile_id
  join public.wsp_skills sk on sk.id = ct.skill_id
  join public.wsp_competency_publication cp
    on  cp.passport_id = ct.passport_id
    and cp.skill_id = ct.skill_id
    and cp.framework_version = ct.framework_version
    and cp.published = true
  where pa.visibility = 'public';

comment on view public.public_passport_competencies is
  'Palier 5 — compétences PUBLIÉES d''un passeport PUBLIC + Trust par compétence + provenance publique (NOM d''émetteur + date, jamais l''id brut ni le contenu). DOUBLE FILTRE visibility=public ET published (D-042/D-043). Security-definer assumé.';

grant select on public.public_passport_competencies to anon;
