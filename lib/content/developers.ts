/**
 * =====================================================================
 * Archétype éditorial — Developers (/[locale]/developers)
 * =====================================================================
 * Prose LOCALISÉE (content/i18n/{locale}.json, clé `developers`) — verbatim
 * architecte en anglais, traductions fondateur en fr/es. Ce module n'assemble que
 * la STRUCTURE : destinations des CTA (fixes) appariées aux libellés localisés.
 *
 * DESTINATIONS : hero → /registry, /records ; §9 → /registry ; §10 → /knowledge-graph ;
 * finalCta → /registry, /records, /knowledge-graph. `/records` résout (index publié) ;
 * chaque destination passe par ctaHref (jamais un lien mort). Termes canoniques
 * (World Skills Protocol, Records, Framework, Canonical Registry) non traduits.
 * =====================================================================
 */
import { type ArchetypeContent, hydrateArchetype } from './archetype';
import { i18nContent } from './i18n';

export function buildDevelopers(locale: string): ArchetypeContent {
  return hydrateArchetype(locale, i18nContent(locale).developers, {
    slug: 'developers',
    heroDest: ['/registry', '/records'],
    sectionDest: { 8: '/registry', 9: '/knowledge-graph' }, // §9 (index 8) · §10 (index 9)
    finalDest: ['/registry', '/records', '/knowledge-graph'],
  });
}
