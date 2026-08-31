/**
 * =====================================================================
 * Opus X — Contenu éditorial localisé (source unique par locale)
 * =====================================================================
 * `content/i18n/{en,fr,es}.json` : la prose de la Home et les labels/CTA des
 * pages piliers, par locale. Lu par `buildHomepage` et `buildGeoContent` (via
 * GeoPage). Import statique → figé au build (force-static), aucun accès runtime.
 *
 * Fallback : locale inconnue → `en`. Les termes canoniques (Evidence, World
 * Skills Protocol, Framework…) restent en anglais DANS le texte traduit (lexique
 * verrouillé, CLAUDE.md) — c'est une propriété du contenu, pas du câblage.
 *
 * Le CORPS des pages piliers (GEO Summary, Canonical Definition, etc.) vient du
 * corpus (Records .md, anglais, source de vérité) et n'est PAS ici.
 * =====================================================================
 */
import en from '@/content/i18n/en.json';
import fr from '@/content/i18n/fr.json';
import es from '@/content/i18n/es.json';

export type LocalizedContent = typeof en;

const BY_LOCALE: Record<string, LocalizedContent> = {
  en,
  fr: fr as LocalizedContent,
  es: es as LocalizedContent,
};

export function i18nContent(locale: string): LocalizedContent {
  return BY_LOCALE[locale] ?? en;
}
