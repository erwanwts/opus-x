/**
 * =====================================================================
 * Homepage — /[locale]  (archétype institutionnel, remplace la landing WEB-002)
 * =====================================================================
 * Prose VERBATIM de l'architecte (lib/content/homepage). EN d'abord (fallback
 * strict) : seule /en est générée, /fr et /es ne le sont pas. La racine / redirige
 * vers la langue servie via next-intl (middleware INCHANGÉ).
 * Schema.org : Organization + BreadcrumbList + WebSite + WebPage. Signature
 * éditoriale SANS Last Updated tant que le statut est Draft.
 * =====================================================================
 */
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { HomePage } from '@/components/geo/HomePage';
import { buildHomepage } from '@/lib/content/homepage';
import { JsonLd, organizationLd, breadcrumbLd, webSiteLd, webPageLd } from '@/lib/seo/jsonld';
import { guardArchetypeLocale } from '@/lib/seo/archetype';
import { routing } from '@/i18n/routing';

const BASE = 'https://opusx.world';
const TITLE = 'Opus X — Professional Identity Built on Verifiable Skills';
const DESCRIPTION =
  'Build a professional identity based on verifiable skills, trusted evidence and open verification through the World Skills Protocol.';

// Archétype éditorial : source unique des traductions publiées de la Homepage.
// Les 3 locales sont TOUTES pré-générées → rendu STATIQUE préservé : /en rend le contenu,
// /fr /es émettent une REDIRECTION STATIQUE vers /en (guardArchetypeLocale, redirect() en
// SSG). dynamicParams=false → /xyz (hors routing) = 404. Ajouter une locale à TRANSLATED
// (+ sa traduction) fait rendre son contenu et DISPARAÎTRE sa redirection d'elle-même.
const TRANSLATED = ['en'];
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: TITLE }, // Title SEO gravé, sans suffixe de template
    description: DESCRIPTION,
    alternates: {
      canonical: `${BASE}/en`,
      languages: { en: `${BASE}/en`, 'x-default': `${BASE}/en` },
    },
    openGraph: {
      type: 'website',
      siteName: 'Opus X',
      locale: 'en_US',
      url: `${BASE}/en`,
      title: TITLE,
      description: DESCRIPTION,
      images: ['/og-image.png'],
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.png'] },
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  // Locale invalide → 404 ; locale valide non traduite → 307 vers /en (dérivé, disparaît
  // dès qu'une traduction est publiée). Ne concerne QUE cet archétype.
  guardArchetypeLocale(locale, '', TRANSLATED);
  setRequestLocale(locale);

  const content = buildHomepage(locale);
  const url = `${BASE}/${locale}`;
  const ld = [
    organizationLd(),
    breadcrumbLd([{ name: 'Opus X', url }]),
    webSiteLd(),
    webPageLd({ name: TITLE, description: DESCRIPTION, url }),
  ];

  return (
    <>
      <JsonLd blocks={ld} />
      <HomePage content={content} />
    </>
  );
}
