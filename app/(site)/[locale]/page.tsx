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
import { HOME_LOCALES } from '@/lib/seo/pillars';
import { i18nContent } from '@/lib/content/i18n';
import { routing } from '@/i18n/routing';

const BASE = 'https://opusx.world';
const OG_LOCALE: Record<string, string> = { en: 'en_US', fr: 'fr_FR', es: 'es_ES' };

// Archétype éditorial : source unique des traductions publiées de la Homepage.
// Les 3 locales sont TOUTES pré-générées → rendu STATIQUE préservé : /en rend le contenu,
// /fr /es émettent une REDIRECTION STATIQUE vers /en (guardArchetypeLocale, redirect() en
// SSG). dynamicParams=false → /xyz (hors routing) = 404. Ajouter une locale à TRANSLATED
// (+ sa traduction) fait rendre son contenu et DISPARAÎTRE sa redirection d'elle-même.
const TRANSLATED = HOME_LOCALES;
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const home = i18nContent(locale).home;
  const title = home.seoTitle;
  const description = home.seoDescription;
  // hreflang : l'accueil est traduit dans HOME_LOCALES + x-default → /en (fallback strict).
  const languages: Record<string, string> = Object.fromEntries(HOME_LOCALES.map((l) => [l, `${BASE}/${l}`]));
  languages['x-default'] = `${BASE}/en`;
  return {
    title: { absolute: title }, // Title SEO localisé, sans suffixe de template
    description,
    alternates: { canonical: `${BASE}/${locale}`, languages },
    openGraph: {
      type: 'website',
      siteName: 'Opus X',
      locale: OG_LOCALE[locale] ?? 'en_US',
      url: `${BASE}/${locale}`,
      title,
      description,
      images: ['/og-image.png'],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
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
  const home = i18nContent(locale).home;
  const url = `${BASE}/${locale}`;
  const ld = [
    organizationLd(),
    breadcrumbLd([{ name: 'Opus X', url }]),
    webSiteLd(),
    webPageLd({ name: home.seoTitle, description: home.seoDescription, url }),
  ];

  return (
    <>
      <JsonLd blocks={ld} />
      <HomePage content={content} />
    </>
  );
}
