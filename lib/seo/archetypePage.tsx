/**
 * =====================================================================
 * Opus X — Fabrique de page ARCHÉTYPE
 * =====================================================================
 * Factorise le câblage d'un archétype éditorial : contenu résolu (lib/content)
 * rendu par <ArchetypePage>, + Schema.org (Organization · BreadcrumbList ·
 * WebPage [· FAQPage]).
 *
 * GARDE DE LOCALE — différente des fiches concept, et c'est délibéré : un
 * archétype REDIRIGE (307) vers l'anglais depuis une locale non traduite
 * (`guardArchetypeLocale`), là où une fiche concept renvoie 404. Les 3 locales
 * sont donc pré-générées : /en rend le contenu, /fr et /es émettent une
 * redirection STATIQUE. La redirection est DÉRIVÉE de `translatedLocales` : elle
 * disparaît d'elle-même le jour où la traduction est publiée. Aucun `/fr → /en`
 * codé en dur, donc aucune dette à retirer.
 * =====================================================================
 */
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArchetypePage } from '@/components/geo/ArchetypePage';
import type { ArchetypeContent } from '@/lib/content/archetype';
import { pageMetadata } from '@/lib/seo/metadata';
import { pillarBySlug } from '@/lib/seo/pillars';
import { guardArchetypeLocale } from '@/lib/seo/archetype';
import { routing } from '@/i18n/routing';
import { JsonLd, organizationLd, breadcrumbLd, webPageLd, faqPageLd } from '@/lib/seo/jsonld';

const BASE = 'https://opusx.world';

type Params = { params: Promise<{ locale: string }> };

interface ArchetypeRouteInput {
  slug: string;
  build: (locale: string) => ArchetypeContent;
  /** Paires Q/R alimentant le FAQPage. Omis → aucun FAQPage émis. */
  faqPairs?: (content: ArchetypeContent) => { q: string; a: string }[];
}

/** Construit les exports Next d'un archétype à partir de son slug (∈ PILLARS). */
export function archetypeRoute({ slug, build, faqPairs }: ArchetypeRouteInput) {
  const pillar = pillarBySlug(slug)!;

  return {
    // Les 3 locales sont générées : /en rend, /fr et /es redirigent statiquement.
    generateStaticParams: () => routing.locales.map((locale) => ({ locale })),

    generateMetadata: async ({ params }: Params): Promise<Metadata> => {
      const { locale } = await params;
      const c = build(locale);
      return pageMetadata({
        locale,
        slug,
        title: c.seoTitle,
        description: c.seoDescription,
        translatedLocales: pillar.translatedLocales,
      });
    },

    Page: async ({ params }: Params) => {
      const { locale } = await params;
      // Locale hors routing → 404 ; locale valide non traduite → 307 vers /en.
      guardArchetypeLocale(locale, slug, pillar.translatedLocales);
      setRequestLocale(locale);

      const content = build(locale);
      const url = `${BASE}/${locale}/${slug}`;
      const pairs = faqPairs ? faqPairs(content) : [];

      const ld = [
        organizationLd(),
        breadcrumbLd([
          { name: 'Opus X', url: `${BASE}/${locale}` },
          { name: content.hero.h1, url },
        ]),
        webPageLd({
          name: content.seoTitle,
          description: content.seoDescription,
          url,
          version: content.signature.documentVersion,
        }),
        ...(pairs.length ? [faqPageLd(pairs)] : []),
      ];

      return (
        <>
          <JsonLd blocks={ld} />
          <ArchetypePage content={content} />
        </>
      );
    },
  };
}
