import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';

/**
 * PROBE de plomberie C1 (PAS le portage de la landing — c'est le Lot C3).
 * But unique : prouver que /en /fr /es rendent une chaîne DIFFÉRENTE par langue,
 * en STATIQUE. La clé common.localeProbe est NEUTRE et TEMPORAIRE (remplacée au C3).
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };

export default async function LocaleProbePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProbeContent />;
}

function ProbeContent() {
  const t = useTranslations('common');
  return <main>{t('localeProbe')}</main>;
}
