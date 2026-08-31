/**
 * =====================================================================
 * Archétype éditorial — Cross-cutting Questions (/[locale]/questions)
 * =====================================================================
 * Prose LOCALISÉE (content/i18n/{locale}.json, clé `questions`) — 41 Q&R en
 * anglais (verbatim architecte), traduites fr/es. Structure seule ici : hero →
 * /records ; finalCta → /records, /knowledge-graph, /developers. Termes canoniques
 * (World Skills Protocol, Records, Knowledge Graph) non traduits.
 *
 * `questionsFaqPairs` aplati les Q&R pour le FAQPage JSON-LD (questions inédites).
 * =====================================================================
 */
import { type ArchetypeContent, hydrateArchetype } from './archetype';
import { i18nContent } from './i18n';

export function buildQuestions(locale: string): ArchetypeContent {
  return hydrateArchetype(locale, i18nContent(locale).questions, {
    slug: 'questions',
    heroDest: ['/records'],
    sectionDest: {},
    finalDest: ['/records', '/knowledge-graph', '/developers'],
  });
}

/** Les paires Q/R à plat — alimente le FAQPage JSON-LD (questions inédites seulement). */
export function questionsFaqPairs(content: ArchetypeContent): { q: string; a: string }[] {
  return content.qaSections.flatMap((s) =>
    s.qa.map((item) => ({
      q: item.q,
      a: item.a
        .map((b) => (b.kind === 'ul' ? b.items.join(' ') : b.kind === 'p' ? b.text : ''))
        .filter(Boolean)
        .join(' '),
    })),
  );
}
