/**
 * Archétype éditorial — /[locale]/knowledge-graph.
 * Prose VERBATIM de l'architecte (lib/content/knowledgeGraph). EN d'abord :
 * /fr et /es redirigent vers /en (guardArchetypeLocale, dérivé du registre).
 */
import { archetypeRoute } from '@/lib/seo/archetypePage';
import { buildKnowledgeGraph } from '@/lib/content/knowledgeGraph';

const route = archetypeRoute({ slug: 'knowledge-graph', build: buildKnowledgeGraph });

export const dynamic = 'force-static';
export const dynamicParams = false; // locale hors routing → 404

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
