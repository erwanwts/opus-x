/**
 * Page pilier GEO — /[locale]/trust (fiche concept, OCR-105).
 * Câblage factorisé (lib/seo/pillarPage) ; contenu projeté VERBATIM de OCR-105 (Trust).
 */
import { pillarRoute } from '@/lib/seo/pillarPage';

const route = pillarRoute('trust');

export const dynamic = 'force-static';
export const dynamicParams = false; // locale non générée → 404 (fallback strict)

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
