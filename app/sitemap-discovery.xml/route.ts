/**
 * PLAN DE DÉCOUVERTE — `/sitemap-discovery.xml`.
 *
 * Expose TOUS les Records publiés, quel que soit leur statut documentaire.
 * Destiné aux agents, crawlers spécialisés et outils d'analyse — pas aux moteurs
 * d'indexation, qui ont leur propre plan.
 *
 * RD-011 : deuxième projection de la MÊME décision de gouvernance. Les pages
 * `Draft` y figurent ET portent `noindex` — les deux artefacts n'ont pas la même
 * finalité, il n'y a donc aucune contradiction : le premier recommande à
 * l'indexation, le second expose à la découverte.
 *
 * Statique : le corpus est figé au build, comme les autres projections.
 */
import { discoveryPlan } from '@/lib/seo/sitemapPlans';

export const dynamic = 'force-static';

export function GET() {
  const urls = discoveryPlan()
    .map((e) => `  <url><loc>${e.url}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
