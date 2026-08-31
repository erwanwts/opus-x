/**
 * =====================================================================
 * Archétype éditorial — Knowledge Graph (/[locale]/knowledge-graph)
 * =====================================================================
 * Prose LOCALISÉE (content/i18n/{locale}.json, clé `knowledgeGraph`). Structure
 * seule ici : hero et finalCta pointent vers /knowledge-graph. Termes canoniques
 * (Knowledge Graph, World Skills Protocol, Records, Framework) non traduits.
 * =====================================================================
 */
import { type ArchetypeContent, hydrateArchetype } from './archetype';
import { i18nContent } from './i18n';

export function buildKnowledgeGraph(locale: string): ArchetypeContent {
  return hydrateArchetype(locale, i18nContent(locale).knowledgeGraph, {
    slug: 'knowledge-graph',
    heroDest: ['/knowledge-graph'],
    sectionDest: {},
    finalDest: ['/knowledge-graph'],
  });
}
