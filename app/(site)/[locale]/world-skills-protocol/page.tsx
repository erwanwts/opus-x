/**
 * Page pilier GEO — /[locale]/world-skills-protocol (fiche concept, OCR-100).
 * Câblage factorisé (lib/seo/pillarPage) ; contenu projeté VERBATIM de OCR-100 (World Skills Protocol).
 */
import { pillarRoute } from '@/lib/seo/pillarPage';

const route = pillarRoute('world-skills-protocol');

export const dynamic = 'force-static';
export const dynamicParams = false; // locale non générée → 404 (fallback strict)

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
