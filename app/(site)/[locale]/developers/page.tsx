/**
 * Archétype éditorial — /[locale]/developers.
 * Prose VERBATIM de l'architecte (lib/content/developers). EN d'abord :
 * /fr et /es redirigent vers /en (guardArchetypeLocale, dérivé du registre).
 */
import { archetypeRoute } from '@/lib/seo/archetypePage';
import { buildDevelopers } from '@/lib/content/developers';

const route = archetypeRoute({ slug: 'developers', build: buildDevelopers });

export const dynamic = 'force-static';
export const dynamicParams = false; // locale hors routing → 404

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
