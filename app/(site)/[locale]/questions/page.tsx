/**
 * Archétype éditorial — /[locale]/questions (Cross-cutting Questions).
 * Prose VERBATIM de l'architecte (lib/content/questions). EN d'abord :
 * /fr et /es redirigent vers /en (guardArchetypeLocale, dérivé du registre).
 *
 * FAQPage JSON-LD : les 41 paires de CETTE page, toutes inédites — contrôlées
 * contre les 145 questions déjà couvertes par les piliers (docs/geo/FAQ-anti-
 * duplication-phase-a.md). Aucune duplication du corpus.
 */
import { archetypeRoute } from '@/lib/seo/archetypePage';
import { buildQuestions, questionsFaqPairs } from '@/lib/content/questions';

const route = archetypeRoute({
  slug: 'questions',
  build: buildQuestions,
  faqPairs: questionsFaqPairs,
});

export const dynamic = 'force-static';
export const dynamicParams = false; // locale hors routing → 404

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
