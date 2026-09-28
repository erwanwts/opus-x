/**
 * Générateur du seed framework:wts@1 — À PARTIR DU FICHIER SOURCE (jamais à la main).
 * Aucune donnée inventée : tout vient de referentiel-wts-v1-data.json.
 *
 * Sortie : supabase/migrations/20260926000010_seed_framework_wts_v1.sql
 * Règles : S11.C01 (non certifiable, activité — D-070) EXCLUE ; framework:wts
 * publisher='Opus X' (comme wtr) ; version @1 status 'published' ; garde en tête
 * (si framework:wts existe → exception, rien n'écrit). Neutralité D-069.
 *
 * Usage : node docs/referentiels/wts/generate-wts-seed.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const DATA = path.join(HERE, 'referentiel-wts-v1-data.json');
const OUT = path.join(ROOT, 'supabase/migrations/20260926000010_seed_framework_wts_v1.sql');
const EXPECTED_SHA = 'aa0b4f89098b43546a20f18fd17da9437b6146f4c5a541acd562ce0eccb6aace';

const raw = readFileSync(DATA);
const sha = createHash('sha256').update(raw).digest('hex');
if (sha !== EXPECTED_SHA) {
  throw new Error(`SHA256 du fichier source (${sha}) ≠ attendu (${EXPECTED_SHA}). ARRÊT — aucune génération.`);
}
const j = JSON.parse(raw.toString('utf8'));

// ── Constantes du framework (id/slug/name par mandat ; publisher repris de wtr) ──
const FW_ID = 'framework:wts';
const FW_SLUG = 'world-trader-skills';
const FW_NAME = 'World Trader Skills';
const FW_DESC = 'Référentiel World Trader Skills v1 de World Trading Skool : 144 compétences de trading observables, évaluées par un coach sur 4 niveaux (Aware, Applied, Proficient, Mastery).';
// D-071 (aucun champ qui ment) : c'est World Trading Skool qui ÉDITE ce référentiel.
// Opus X l'HÉBERGE et le VÉRIFIE (correspondance figée, niveau dérivé — §5.3/D-051),
// il ne l'édite pas → publisher = 'World Trading Skool', pas 'Opus X'.
const FW_PUBLISHER = 'World Trading Skool';
const FW_VERSION = '1';
const FW_VERSION_ID = 'framework:wts@1';

const q = (s) => (s === null || s === undefined ? 'null' : `'${String(s).replace(/'/g, "''")}'`);
const skillId = (code) => 'wts:' + String(code).toLowerCase().replace(/\./g, '');
const humanCode = (code) => 'WTS-' + String(code);
const criteria = (lvl) => `Observé : ${lvl.observed} — Preuve attendue : ${lvl.evidence}`;

// ── Sélection : compétences CERTIFIABLES uniquement (S11.C01 exclue, D-070) ──
const comps = [...j.competencies].sort((a, b) => (a.code < b.code ? -1 : a.code > b.code ? 1 : 0));
const certifiable = comps.filter((c) => c.certifiable === true);
const excluded = comps.filter((c) => c.certifiable !== true).map((c) => c.code);

let skillsN = 0;
let levelsN = 0;

const skillRows = certifiable.map((c) => {
  skillsN += 1;
  return `  (${q(skillId(c.code))}, ${q(FW_ID)}, ${q(FW_VERSION)}, ${q(humanCode(c.code))}, ${q(c.name)}, ${q(c.description)})`;
});

const levelRows = [];
for (const c of certifiable) {
  const levels = [...(c.levels || [])].sort((a, b) => a.rank - b.rank);
  for (const l of levels) {
    levelsN += 1;
    levelRows.push(
      `  (${q(l.level_id)}, ${q(skillId(c.code))}, ${q(FW_VERSION)}, ${q(l.slug)}, ${q(l.level)}, ${l.rank}, ${q(criteria(l))}, ${l.observation_min}, ${l.observation_max})`,
    );
  }
}

const sql = `-- =====================================================================
-- Opus X — Phase 2 (étape 1) : SEED du référentiel framework:wts@1
-- =====================================================================
-- GÉNÉRÉ par docs/referentiels/wts/generate-wts-seed.mjs à partir de
-- referentiel-wts-v1-data.json (sha256 ${EXPECTED_SHA}).
-- NE PAS ÉDITER À LA MAIN : régénérer via le script. Aucune donnée inventée.
--
-- Contenu : 1 framework + 1 version + ${skillsN} skills + ${levelsN} niveaux.
-- S11.C01 est EXCLUE (non certifiable = ACTIVITÉ, jamais émise — D-070).
--   Compétences exclues : ${excluded.join(', ') || '(aucune)'}.
-- Neutralité (D-069) : aucun outil/marque dans les libellés (axe AX1–AX6 et
--   groupe S01–S11 restent dans le fichier source, hors DB — option (i)).
-- Bandes d'observation (§5.3/P1) : 0–1 = rien démontré ; 2/3/4/5 = Aware/Applied/
--   Proficient/Mastery. Zone sémantique APPEND-ONLY : une fois publié, figé à vie.
--
-- GARDE : si framework:wts existe déjà → exception, RIEN n'est écrit.
-- ATOMIQUE : tout est dans une transaction begin/commit — si une ligne échoue
--   (ou la garde lève), la transaction est annulée et RIEN n'est écrit.
-- STAGING d'abord (aucune application par le script).
-- =====================================================================

begin;

do $$
begin
  if exists (select 1 from public.wsp_frameworks where id = 'framework:wts') then
    raise exception 'framework:wts existe deja — seed REFUSE (rien ecrit).';
  end if;
end $$;

-- ── 1. Framework (publisher = World Trading Skool ; Opus X héberge/vérifie, n'édite pas — D-071) ──
insert into public.wsp_frameworks (id, slug, name, description, publisher)
values (${q(FW_ID)}, ${q(FW_SLUG)}, ${q(FW_NAME)}, ${q(FW_DESC)}, ${q(FW_PUBLISHER)});

-- ── 2. Version (publiée = figée) ───────────────────────────────────────
insert into public.wsp_framework_versions (id, framework_id, version, status)
values (${q(FW_VERSION_ID)}, ${q(FW_ID)}, ${q(FW_VERSION)}, 'published');

-- ── 3. ${skillsN} skills certifiables (S11.C01 exclue — activité, D-070) ─
insert into public.wsp_skills (id, framework_id, framework_version, code, name, description) values
${skillRows.join(',\n')};

-- ── 4. ${levelsN} niveaux (criteria = observed + evidence ; bandes = note) ─
insert into public.wsp_skill_levels
  (id, skill_id, framework_version, slug, label, rank, criteria, observation_min, observation_max) values
${levelRows.join(',\n')};

commit;

-- ════════════════════════════════════════════════════════════════════
-- VÉRIFICATION — à lancer APRÈS application (hors de la transaction ci-dessus)
-- ════════════════════════════════════════════════════════════════════
-- select
--   (select count(*) from public.wsp_frameworks where id='framework:wts')                              as framework,        -- 1
--   (select count(*) from public.wsp_framework_versions where id='framework:wts@1')                     as version,          -- 1
--   (select count(*) from public.wsp_skills where framework_id='framework:wts')                         as skills,           -- 144
--   (select count(*) from public.wsp_skill_levels sl join public.wsp_skills s on s.id=sl.skill_id
--      where s.framework_id='framework:wts')                                                            as niveaux,          -- 576
--   (select count(*) from (select s.id from public.wsp_skills s
--      left join public.wsp_skill_levels sl on sl.skill_id=s.id
--      where s.framework_id='framework:wts' group by s.id having count(sl.id) <> 4) x)                  as skills_sans_4,    -- 0
--   (select count(*) from public.wsp_skill_levels sl join public.wsp_skills s on s.id=sl.skill_id
--      where s.framework_id='framework:wts' and (sl.criteria is null or btrim(sl.criteria)=''))          as criteria_vides,   -- 0
--   (select publisher from public.wsp_frameworks where id='framework:wts')                               as publisher;        -- 'World Trading Skool'
-- select count(*) from public.wsp_skills where id='wts:s11c01';                                          -- 0 (S11.C01 activité, exclue)
-- select id, slug, rank, observation_min, observation_max from public.wsp_skill_levels
--   where skill_id='wts:s01c10' order by rank;  -- 4 lignes : aware/applied/proficient/mastery = 2/3/4/5
`;

writeFileSync(OUT, sql, 'utf8');
console.log(`OK — ${OUT}`);
console.log(`framework=1 version=1 skills=${skillsN} levels=${levelsN} exclues=[${excluded.join(', ')}]`);
