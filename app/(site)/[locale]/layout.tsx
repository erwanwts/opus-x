import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { fontVars } from '@/lib/site/fonts';
import '@/app/globals.css';

/**
 * ROOT LAYOUT du SITE public (WEB-002 Lot C1 · WEB-001B §10.1).
 * Pattern « multiple root layouts » : rend <html lang={locale}> pour /en /fr /es.
 * STATIQUE : generateStaticParams + setRequestLocale(locale) APRÈS le check et
 * AVANT toute API next-intl → aucun accès dynamique (headers/cookies).
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Mapping technique locale → étiquette Open Graph (convention OG, pas de la copie).
const OG_LOCALE: Record<string, string> = { en: 'en_US', fr: 'fr_FR', es: 'es_ES' };

/**
 * Metadata SEO par défaut du site (WEB-002 Lot D · WEB-001B §12). Per-locale.
 * `description` = landing.subhead (voix validée, réellement traduite en/fr/es).
 * Les `alternates` (canonical + hreflang) sont posés PAR PAGE (generateMetadata
 * de la page) : seuls les chemins réels et traduits y figurent (fallback strict).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'landing' });
  const description = t('subhead');

  return {
    metadataBase: new URL('https://opusx.world'),
    title: { default: 'Opus X', template: '%s · Opus X' },
    description,
    openGraph: {
      type: 'website',
      siteName: 'Opus X',
      locale: OG_LOCALE[locale] ?? 'en_US',
      title: 'Opus X',
      description,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Opus X',
      description,
      images: ['/og-image.png'],
    },
  };
}

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export default async function SiteRootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={fontVars}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
