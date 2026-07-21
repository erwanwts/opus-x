/**
 * =====================================================================
 * Opus X — Décision d'aiguillage du middleware, EXTRAITE en fonction pure
 * =====================================================================
 * EXTRACTION SANS CHANGEMENT DE COMPORTEMENT. La logique ci-dessous est celle
 * qui vivait en ligne dans `middleware.ts` (WEB-002 Lot C2) ; elle en sort pour
 * être couverte par un test, pas pour évoluer.
 *
 * Motif : le middleware décide du sort de TOUTES les requêtes du site et de
 * l'application, et cette décision n'était couverte par AUCUN test unitaire.
 * Avant d'y ajouter quoi que ce soit, on établit le filet.
 *
 * ⚠️ AUCUNE CATÉGORIE N'EST AJOUTÉE ICI. Le Lot GEO 2 aura besoin d'un troisième
 * régime (chemins de site publics NON localisés, pour les projections du corpus) ;
 * il n'est pas introduit dans cette extraction — le filet d'abord, l'ajout ensuite.
 * =====================================================================
 */
import { routing } from '@/i18n/routing';

/**
 * Régime d'une requête, tel que le middleware l'applique aujourd'hui :
 *   • `intl` → next-intl (rendu localisé, ou ajout de la locale en 307) ;
 *   • `app`  → garde de session de l'application (`appSession`), JAMAIS d'intl.
 */
export type RouteKind = 'intl' | 'app';

/**
 * Premiers segments RÉSERVÉS à l'application / aux handlers (jamais localisés).
 * Validés contre l'arborescence réelle (route groups dépliés) au Lot C2.
 *
 * SOURCE UNIQUE : `middleware.ts` importe cette table, il n'en garde pas de copie.
 * Deux listes qui divergent seraient exactement le genre de panne silencieuse que
 * cette extraction cherche à rendre impossible.
 */
export const RESERVED = new Set([
  'dashboard', 'emission', 'establish', 'verify-email', 'passport', 'link',
  'me', 'p', 'passports', 'auth', 'api', 'frameworks', 'issuers',
]);

/** Le 1er segment du chemin est-il une locale du routage (`en` / `fr` / `es`) ? */
export function hasLocalePrefix(seg: string): boolean {
  return (routing.locales as readonly string[]).includes(seg);
}

/**
 * Le 1er segment d'un chemin. `/en/evidence` → `en` · `/` → `''` ·
 * `/api/registry` → `api`. Reproduit exactement `pathname.split('/')[1] ?? ''`.
 */
export function firstSegment(pathname: string): string {
  return pathname.split('/')[1] ?? '';
}

/**
 * Aiguillage. Ordre STRICTEMENT identique à celui du middleware d'origine :
 *   1. déjà localisé (`/en` `/fr` `/es`) → `intl` ;
 *   2. segment réservé app/handler       → `app` ;
 *   3. sinon (`/`, `/about`, …)          → `intl` (next-intl ajoute la locale).
 *
 * Noter que (1) et (3) rendent le même verdict : la distinction n'est pas
 * observable ici, elle l'est dans next-intl. L'ordre est néanmoins conservé tel
 * quel — une extraction ne simplifie pas, elle déplace.
 */
export function routeKind(pathname: string): RouteKind {
  const first = firstSegment(pathname);
  if (hasLocalePrefix(first)) return 'intl';
  if (RESERVED.has(first)) return 'app';
  return 'intl';
}
