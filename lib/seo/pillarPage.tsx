/**
 * =====================================================================
 * Opus X — Fabrique de page pilier GEO (fiche concept)
 * =====================================================================
 * Factorise le câblage validé de la page pilote /evidence : une fiche concept =
 * un Record OCR projeté par buildGeoContent dans <GeoPage>, + Schema.org
 * (Organization · BreadcrumbList · WebPage · FAQPage). EN d'abord (fallback
 * strict), force-static, 404 non-énumérant sur locale non traduite.
 *
 * Le CTA (éditorial/UI) est TEMPLATÉ depuis le titre du Record ; son état
 * actif/inerte reste décidé par le flag UNIQUE lib/seo/flags (via buildGeoContent).
 * Ordre des sections, résolveur entityHref : FIGÉS (dans GeoPage / pillars).
 * =====================================================================
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { GeoPage } from '@/components/geo/GeoPage';
import { buildGeoContent, spansToText } from '@/lib/content/geo';
import { pageMetadata } from '@/lib/seo/metadata';
import { pillarBySlug } from '@/lib/seo/pillars';
import { JsonLd, organizationLd, breadcrumbLd, webPageLd, faqPageLd } from '@/lib/seo/jsonld';

const BASE = 'https://opusx.world';

type Params = { params: Promise<{ locale: string }> };

/** Construit les exports Next d'une page pilier à partir de son slug (∈ PILLARS). */
export function pillarRoute(slug: string) {
  const pillar = pillarBySlug(slug)!;
  const recordId = pillar.recordId!;

  return {
    generateStaticParams: () => pillar.translatedLocales.map((locale) => ({ locale })),

    generateMetadata: async ({ params }: Params): Promise<Metadata> => {
      const { locale } = await params;
      const c = buildGeoContent(slug, recordId, { label: '', href: '' }, locale);
      return pageMetadata({
        locale,
        slug,
        title: c?.title ?? slug,
        description: c ? spansToText(c.directAnswer) : '',
        translatedLocales: pillar.translatedLocales,
      });
    },

    Page: async ({ params }: Params) => {
      const { locale } = await params;
      setRequestLocale(locale);

      const content = buildGeoContent(slug, recordId, { label: '', href: '' }, locale);
      if (!content) notFound();

      // CTA éditorial templaté (le flag lib/seo/flags décide de l'état, déjà appliqué).
      content.cta.label = `Explore ${content.title} in the canonical registry`;
      content.cta.href = `/api/registry/${recordId}`;

      const url = `${BASE}/${locale}/${slug}`;
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
    },
  };
}
