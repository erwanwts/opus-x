/**
 * Page pilier GEO — /[locale]/verification (fiche concept, OCR-107).
 * Câblage factorisé (lib/seo/pillarPage) ; contenu projeté VERBATIM de OCR-107 (Verification).
 */
import { pillarRoute } from '@/lib/seo/pillarPage';

const route = pillarRoute('verification');

export const dynamic = 'force-static';
export const dynamicParams = false; // locale non générée → 404 (fallback strict)

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
