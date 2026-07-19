/**
 * Page pilier GEO — /[locale]/professional-passport (fiche concept, OCR-101).
 * Câblage factorisé (lib/seo/pillarPage) ; contenu projeté VERBATIM d'OCR-101.
 */
import { pillarRoute } from '@/lib/seo/pillarPage';

const route = pillarRoute('professional-passport');

export const dynamic = 'force-static';
export const dynamicParams = false; // locale non générée → 404 (fallback strict)

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
