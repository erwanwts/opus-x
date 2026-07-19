-- =====================================================================
-- Migration forward : wtf -> wtr  (framework_id + slug + coordonnées)
-- =====================================================================
-- Pour les bases DÉJÀ seedées (staging/prod). Le seed 20260713000001 a été
-- édité pour les installations fraîches ; celui-ci met à jour le vivant.
--
-- ÉCRIRE N'EST PAS APPLIQUER : l'application en staging/prod est un acte de
-- déploiement séparé, hors du commit de migration.
--
-- Trois niveaux d'identification (amendement architecte 2026-07-18) :
--   nom public   = World Trader Framework  (INCHANGÉ)
--   id canonique = framework:wtr           (était framework:wtf)
--   slug public  = world-trader            (était wtf)
--
-- CONTRAINTES SIGNALÉES : l'id du framework est INCORPORÉ dans les PK/FK de 5
-- tables (framework:wtf, framework:wtf@0.1, wtf:212, wtf:212#applied, code
-- WTF-212, slug wtf). Aucune FK n'a `on update cascade` et aucune n'est
-- deferrable → un simple UPDATE du parent violerait les FK. On les DROP puis
-- RECREATE explicitement, dans une transaction. Le drop est dynamique
-- (pg_constraint) car les FK sont NON NOMMÉES (noms auto-générés, parfois
-- tronqués à 63 car.).
--
-- REDIRECTION TRANSITOIRE associée : /frameworks/wtf/skills -> 301 ->
-- /frameworks/world-trader/skills (lib/seo/transitional-redirects.ts).
-- Retrait : date À FIXER par l'architecte (point ouvert). Voir
-- docs/migration/MIG-wtf-to-wtr-2026-07-18.md.
-- =====================================================================

begin;

-- 1) DROP des FK qui référencent les tables dont l'id change (frameworks,
--    skills, skill_levels). La FK evidence_id -> wsp_evidence(id) N'EST PAS
--    touchée (l'id d'Evidence ne change pas).
do $$
declare r record;
begin
  for r in
    select con.conname, con.conrelid::regclass as tbl
    from pg_constraint con
    where con.contype = 'f'
      and con.confrelid::regclass::text in (
        'public.wsp_frameworks',
        'public.wsp_skills',
        'public.wsp_skill_levels'
      )
  loop
    execute format('alter table %s drop constraint %I', r.tbl, r.conname);
  end loop;
end $$;

-- 2) UPDATE des ids incorporés — PRÉFIXE SEUL, numérotation/version conservées.
update public.wsp_frameworks
   set id = 'framework:wtr',
       slug = 'world-trader'
 where id = 'framework:wtf';

update public.wsp_framework_versions
   set id = replace(id, 'framework:wtf', 'framework:wtr'),
       framework_id = 'framework:wtr'
 where framework_id = 'framework:wtf';

update public.wsp_skills
   set id = replace(id, 'wtf:', 'wtr:'),
       framework_id = 'framework:wtr',
       code = replace(code, 'WTF-', 'WTR-')
 where framework_id = 'framework:wtf';

update public.wsp_skill_levels
   set id = replace(id, 'wtf:', 'wtr:'),
       skill_id = replace(skill_id, 'wtf:', 'wtr:')
 where skill_id like 'wtf:%';

update public.wsp_evidence_demonstrates_skill
   set skill_id = replace(skill_id, 'wtf:', 'wtr:')
 where skill_id like 'wtf:%';

-- 3) RECREATE des FK (définitions identiques au schéma d'origine).
alter table public.wsp_framework_versions
  add foreign key (framework_id) references public.wsp_frameworks(id);

alter table public.wsp_skills
  add foreign key (framework_id) references public.wsp_frameworks(id);
alter table public.wsp_skills
  add foreign key (framework_id, framework_version)
  references public.wsp_framework_versions(framework_id, version);

alter table public.wsp_skill_levels
  add foreign key (skill_id) references public.wsp_skills(id);

alter table public.wsp_evidence_demonstrates_skill
  add foreign key (skill_id) references public.wsp_skills(id);
alter table public.wsp_evidence_demonstrates_skill
  add foreign key (skill_id, framework_version, claimed_level)
  references public.wsp_skill_levels(skill_id, framework_version, slug);

commit;
