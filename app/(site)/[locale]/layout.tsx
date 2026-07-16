import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
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
