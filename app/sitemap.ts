import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { PILLARS } from '@/lib/seo/pillars';

/**
 * Sitemap (WEB-002 Lot D · WEB-001B §12 · fallback strict §10.2).
 *
 * PRINCIPE : le sitemap ne décrit QUE le réel. Émet la home /[locale] (3 langues)
 * + les pages piliers PUBLIÉES, chacune UNIQUEMENT dans ses locales réellement
 * traduites (registre PILLARS, source unique aussi des generateStaticParams).
 * Jamais un chemin fantôme, jamais une locale absente.
 */
const BASE = 'https://opusx.world';

/** Cluster hreflang pour un ensemble de locales (chemins réels seulement). */
function cluster(locales: string[], pathFor: (l: string) => string): Record<string, string> {
  return Object.fromEntries(locales.map((l) => [l, pathFor(l)]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Home : les 3 locales réelles.
  const homeLangs = cluster([...routing.locales], (l) => `${BASE}/${l}`);
  for (const locale of routing.locales) {
    entries.push({ url: `${BASE}/${locale}`, alternates: { languages: homeLangs } });
  }

  // Pages piliers : par route, hreflang limité aux locales traduites de CETTE page.
  for (const p of PILLARS) {
    const langs = cluster(p.translatedLocales, (l) => `${BASE}/${l}/${p.slug}`);
    for (const locale of p.translatedLocales) {
      entries.push({ url: `${BASE}/${locale}/${p.slug}`, alternates: { languages: langs } });
    }
  }

  return entries;
}
