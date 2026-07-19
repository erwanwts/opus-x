-- =====================================================================
-- ROLLBACK de la migration forward : wtr -> wtf  (INVERSE EXACT)
-- =====================================================================
-- Annule 20260718000001_wtf_to_wtr.sql : remet framework:wtr -> framework:wtf,
-- world-trader -> wtf, wtr:NNN -> wtf:NNN, WTR-NNN -> WTF-NNN.
--
-- ⚠️ NON APPLIQUÉE. Filet de rollback. DOIT être TESTÉE sur staging avant toute
-- application prod (séquence : forward -> contrôles -> rollback -> contrôles ->
-- forward -> contrôles). Un rollback jamais exécuté n'est pas un rollback.
--
-- Symétrique au forward : mêmes tables, même stratégie (drop FK dynamique -> UPDATE
-- inverses -> recreate 6 FK), transactionnel. La FK evidence_id -> wsp_evidence(id)
-- n'est pas touchée (l'id d'Evidence ne change pas).
-- =====================================================================

begin;

-- 1) DROP des FK référençant les tables dont l'id change (frameworks, skills,
--    skill_levels) — dynamique car FK non nommées.
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

-- 2) UPDATE inverses — PRÉFIXE SEUL, numérotation/version conservées.
update public.wsp_frameworks
   set id = 'framework:wtf',
       slug = 'wtf'
 where id = 'framework:wtr';

update public.wsp_framework_versions
   set id = replace(id, 'framework:wtr', 'framework:wtf'),
       framework_id = 'framework:wtf'
 where framework_id = 'framework:wtr';

update public.wsp_skills
   set id = replace(id, 'wtr:', 'wtf:'),
       framework_id = 'framework:wtf',
       code = replace(code, 'WTR-', 'WTF-')
 where framework_id = 'framework:wtr';

update public.wsp_skill_levels
   set id = replace(id, 'wtr:', 'wtf:'),
       skill_id = replace(skill_id, 'wtr:', 'wtf:')
 where skill_id like 'wtr:%';

update public.wsp_evidence_demonstrates_skill
   set skill_id = replace(skill_id, 'wtr:', 'wtf:')
 where skill_id like 'wtr:%';

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
