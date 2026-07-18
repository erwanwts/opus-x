/**
 * =====================================================================
 * Opus X — pageMetadata : canonical + hreflang + OG par page (factorisé)
 * =====================================================================
 * Factorise le bloc inline de la landing (app/(site)/[locale]/page.tsx) pour
 * toutes les pages piliers. Fallback strict (WEB-001B §10.2 · WEB-D5) :
 *   • canonical = /{locale}/{slug}
 *   • hreflang = UNIQUEMENT les locales réellement traduites + x-default → /en
 * Jamais une locale absente. `metadataBase` est posé par le layout (site).
 * =====================================================================
 */
import type { Metadata } from 'next';

const BASE = 'https://opusx.world';
const OG_LOCALE: Record<string, string> = { en: 'en_US', fr: 'fr_FR', es: 'es_ES' };

interface PageMetaInput {
  locale: string;
  slug: string; // segment sous /{locale}/ (ex. 'evidence')
  title: string; // titre unique de la page (sans le suffixe « · Opus X »)
  description: string; // description unique
  translatedLocales: string[]; // locales réellement disponibles pour CETTE page
}

export function pageMetadata({ locale, slug, title, description, translatedLocales }: PageMetaInput): Metadata {
  const path = (l: string) => `${BASE}/${l}/${slug}`;
  // hreflang limité aux traductions réelles ; x-default → EN (langue canonique).
  const languages: Record<string, string> = {};
  for (const l of translatedLocales) languages[l] = path(l);
  languages['x-default'] = path('en');

  return {
    title,
    description,
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: 'article',
      siteName: 'Opus X',
      locale: OG_LOCALE[locale] ?? 'en_US',
      url: path(locale),
      title,
      description,
      images: ['/og-image.png'],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  };
}
