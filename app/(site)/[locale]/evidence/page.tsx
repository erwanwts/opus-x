/**
 * Page pilier GEO — /[locale]/evidence  (WEB-001B §11 · Lot GEO 1a).
 * Contenu projeté VERBATIM d'OCR-110 (aucun fait fabriqué). Schema.org émis :
 * Organization + BreadcrumbList + WebPage + FAQPage. EN d'abord (fallback strict).
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { GeoPage } from '@/components/geo/GeoPage';
import { buildGeoContent, spansToText } from '@/lib/content/geo';
import { pageMetadata } from '@/lib/seo/metadata';
import { pillarBySlug } from '@/lib/seo/pillars';
import { JsonLd, organizationLd, breadcrumbLd, webPageLd, faqPageLd } from '@/lib/seo/jsonld';

const SLUG = 'evidence';
const BASE = 'https://opusx.world';
const pillar = pillarBySlug(SLUG)!;
// L'état du CTA (actif/inerte) est décidé par le flag UNIQUE lib/seo/flags, appliqué
// dans buildGeoContent. La page ne fournit que label + href ; elle ne peut pas le forcer.

export const dynamic = 'force-static';
export const dynamicParams = false; // locale non générée → 404 (fallback strict)

export function generateStaticParams() {
  return pillar.translatedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = buildGeoContent(SLUG, pillar.recordId!, { label: '', href: '' }, locale);
  return pageMetadata({
    locale,
    slug: SLUG,
    title: c?.title ?? 'Evidence',
    description: c ? spansToText(c.directAnswer) : '',
    translatedLocales: pillar.translatedLocales,
  });
}

export default async function EvidencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = buildGeoContent(SLUG, pillar.recordId!, {
    label: 'Explore Evidence in the canonical registry',
    href: `/api/registry/${pillar.recordId}`,
  }, locale);
  if (!content) notFound();

  const url = `${BASE}/${locale}/${SLUG}`;
  const description = spansToText(content.directAnswer);
  const ld = [
    organizationLd(),
    breadcrumbLd([
      { name: 'Opus X', url: `${BASE}/${locale}` },
      { name: content.title, url },
    ]),
    webPageLd({ name: content.title, description, url, datePublished: content.meta.date, version: content.meta.version }),
    ...(content.faq.length ? [faqPageLd(content.faq.map((qa) => ({ q: spansToText(qa.q), a: spansToText(qa.a) })))] : []),
  ];

  return (
    <>
      <JsonLd blocks={ld} />
      <GeoPage content={content} />
    </>
  );
}
