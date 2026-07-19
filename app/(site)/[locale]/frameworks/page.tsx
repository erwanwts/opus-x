/**
 * Page pilier GEO — /[locale]/frameworks (fiche concept, OCR-115).
 * Câblage factorisé (lib/seo/pillarPage) ; contenu projeté VERBATIM de OCR-115 (Framework).
 */
import { pillarRoute } from '@/lib/seo/pillarPage';

const route = pillarRoute('frameworks');

export const dynamic = 'force-static';
export const dynamicParams = false; // locale non générée → 404 (fallback strict)

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
