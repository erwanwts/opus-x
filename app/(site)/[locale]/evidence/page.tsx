/**
 * Page pilier GEO — /[locale]/evidence (fiche concept, OCR-110).
 * Câblage factorisé (lib/seo/pillarPage) ; contenu projeté VERBATIM d'OCR-110.
 * Page pilote historique : migrée vers la fabrique commune (un seul chemin de code).
 */
import { pillarRoute } from '@/lib/seo/pillarPage';

const route = pillarRoute('evidence');

export const dynamic = 'force-static';
export const dynamicParams = false; // locale non générée → 404 (fallback strict)

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
