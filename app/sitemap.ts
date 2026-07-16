import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

/**
 * Sitemap (WEB-002 Lot D · WEB-001B §12 · fallback strict §10.2).
 *
 * PRINCIPE : le sitemap ne décrit QUE le réel. À ce stade, la SEULE page
 * publique de contenu est la home /[locale], traduite dans les 3 langues.
 * Aucun autre chemin (passport/wsp/issuers/glossary/faq/…) n'existe encore
 * (WEB-003+) → aucun n'est émis. Pas de chemin fantôme.
 *
 * EXTENSION (WEB-003+) : ajouter ici les routes PUBLIÉES, en n'émettant, pour
 * chaque entrée, QUE les locales réellement traduites (mêmes règles hreflang) —
 * jamais une locale absente, jamais une route non publiée.
 */
const BASE = 'https://opusx.world';

export default function sitemap(): MetadataRoute.Sitemap {
  // hreflang cluster de la home : les 3 locales réelles.
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${BASE}/${locale}`])
  );

  return routing.locales.map((locale) => ({
    url: `${BASE}/${locale}`,
    alternates: { languages },
  }));
}
