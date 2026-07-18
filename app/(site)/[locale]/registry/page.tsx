/**
 * Page pilier GEO — /[locale]/registry (fiche concept, OCR-124).
 * Câblage factorisé (lib/seo/pillarPage) ; contenu projeté VERBATIM de OCR-124 (Canonical Registry).
 */
import { pillarRoute } from '@/lib/seo/pillarPage';

const route = pillarRoute('registry');

export const dynamic = 'force-static';
export const dynamicParams = false; // locale non générée → 404 (fallback strict)

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
