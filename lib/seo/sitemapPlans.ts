/**
 * =====================================================================
 * Opus X — LES DEUX PLANS DE SITE (LOT GEO 2 · Lot D)
 * =====================================================================
 * RD-011 — « Une même décision de gouvernance peut produire plusieurs projections
 * spécialisées répondant à des usages différents, à condition qu'aucune de ces
 * projections ne porte sa propre logique décisionnelle. »
 *
 * Règle gravée : « Il n'existe qu'une seule décision de gouvernance : le statut
 * documentaire du Record. Toutes les représentations techniques qui en découlent
 * sont des projections dérivées. »
 *
 * LA CHAÎNE, À UN SEUL MAILLON DÉCISIONNEL :
 *
 *     Status du Record  ──►  robots  ──►  plan d'INDEXATION
 *            │
 *            └───────────────────────►  plan de DÉCOUVERTE
 *
 * Le plan d'indexation NE RELIT PAS le statut : il dérive de `robots`, qui en
 * dérive déjà. Une projection qui consulterait le statut pour son propre compte
 * porterait une seconde logique décisionnelle, et deux sources finiraient par
 * diverger — c'est précisément ce que RD-011 interdit.
 *
 * PAS DE CONTRADICTION entre les deux plans : ils ont des finalités différentes.
 * Le premier RECOMMANDE À L'INDEXATION, le second EXPOSE À LA DÉCOUVERTE. Les
 * pages `Draft` continuent de porter `noindex`, et rien dans le second ne le
 * contredit — il s'adresse aux agents, crawlers spécialisés et outils d'analyse.
 * =====================================================================
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { PILLARS } from './pillars';
import { buildRecordPage, RECORDS_ROOT } from '@/lib/registry/recordPage';
import { allPredicates, allFamilies, allTypes } from '@/lib/registry/registryEntities';

export const BASE = 'https://opusx.world';

/** Chemins des deux plans — tranchés par l'architecte. */
export const INDEX_PLAN_PATH = '/sitemap.xml';
export const DISCOVERY_PLAN_PATH = '/sitemap-discovery.xml';

const RECORDS_DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');

export interface PlanEntry {
  url: string;
  /** Locales réellement traduites — absent pour les projections non localisées. */
  languages?: Record<string, string>;
}

/** Les pages éditoriales, avec leur cluster hreflang limité aux traductions réelles. */
function editorialEntries(): PlanEntry[] {
  const out: PlanEntry[] = [{ url: `${BASE}/en`, languages: { en: `${BASE}/en` } }];
  for (const p of PILLARS) {
    const languages = Object.fromEntries(
      p.translatedLocales.map((l) => [l, `${BASE}/${l}/${p.slug}`]),
    );
    for (const locale of p.translatedLocales) {
      out.push({ url: `${BASE}/${locale}/${p.slug}`, languages });
    }
  }
  return out;
}

/**
 * Les pages de Record, avec leur verdict d'indexation DÉRIVÉ de `robots`.
 * Aucune relecture du statut ici — `buildRecordPage` l'a déjà dérivé une fois.
 */
export function recordPlanEntries(): { url: string; indexable: boolean }[] {
  const out: { url: string; indexable: boolean }[] = [];
  for (const f of readdirSync(RECORDS_DIR).filter((x) => x.endsWith('.md')).sort()) {
    const raw = readFileSync(path.join(RECORDS_DIR, f), 'utf8');
    const page = buildRecordPage(raw);
    if (!page) continue;
    out.push({
      url: `${BASE}${RECORDS_ROOT}/${page.id.toLowerCase()}`,
      indexable: page.meta.robots === 'index,follow',
    });
  }
  return out;
}

/**
 * PLAN D'INDEXATION — uniquement ce qui est indexable.
 * Un plan qui déclarerait une page en `noindex` enverrait deux signaux
 * contradictoires au même moteur. Il remonte de lui-même à mesure des promotions.
 */
export function indexPlan(): PlanEntry[] {
  return [
    ...editorialEntries(),
    ...recordPlanEntries().filter((r) => r.indexable).map((r) => ({ url: r.url })),
  ];
}

/**
 * PLAN DE DÉCOUVERTE — tous les Records publiés, quel que soit leur statut.
 * Destiné aux agents, crawlers spécialisés et outils d'analyse. Les pages `Draft`
 * y figurent ET portent `noindex` : les deux artefacts n'ont pas la même finalité.
 */
export function discoveryPlan(): PlanEntry[] {
  return [
    ...editorialEntries(),
    { url: `${BASE}${RECORDS_ROOT}` },
    ...recordPlanEntries().map((r) => ({ url: r.url })),
    ...allPredicates().map((p) => ({ url: `${BASE}${RECORDS_ROOT}/predicates/${p.id.toLowerCase()}` })),
    ...allFamilies().map((f) => ({ url: `${BASE}${RECORDS_ROOT}/families/${f.id}` })),
    ...allTypes().map((t) => ({ url: `${BASE}${RECORDS_ROOT}/types/${t.id.toLowerCase()}` })),
  ];
}
