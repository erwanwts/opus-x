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
 * LOT D — le troisième régime est désormais introduit : `public`, pour les chemins
 * de site publics NON localisés (projections du corpus). Il a été ajouté APRÈS
 * l'extraction et sa matrice, jamais avant : le filet d'abord, l'ajout ensuite.
 * L'ajout n'intercepte qu'un segment que personne ne servait — aucun chemin
 * existant ne change de branche, et la matrice le prouve chemin par chemin.
 * =====================================================================
 */
import { routing } from '@/i18n/routing';

/**
 * Régime d'une requête, tel que le middleware l'applique aujourd'hui :
 *   • `intl` → next-intl (rendu localisé, ou ajout de la locale en 307) ;
 *   • `app`    → garde de session de l'application (`appSession`), JAMAIS d'intl ;
 *   • `public` → chemin de site public NON localisé : ni intl, ni garde de session.
 */
export type RouteKind = 'intl' | 'app' | 'public';

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

/**
 * Chemins de SITE publics, NON localisés — les projections du Canonical Corpus.
 *
 * Un Record est en anglais et le restera : lui donner un préfixe de locale
 * annoncerait une traduction qui n'existera pas, et produirait une redirection
 * `/fr/records/… → /en/records/…` doctrinalement fausse — exactement ce qu'était
 * le 301 `wtf → world-trader`.
 *
 * `/records` et non `/registry` : 4 CTA gravés par l'architecte y pointent déjà,
 * et aucun texte ne désigne un index nommé `/registry`. Le choix honore l'existant
 * au lieu de créer une collision avec la page pilier `/en/registry` (OCR-124).
 */
export const PUBLIC_NO_LOCALE = new Set(['records']);

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
 * Aiguillage. L'ordre d'origine est conservé ; le régime `public` s'insère APRÈS
 * le test de locale et AVANT les segments réservés :
 *   1. déjà localisé (`/en` `/fr` `/es`) → `intl` ;
 *   2. chemin public non localisé        → `public` ;
 *   3. segment réservé app/handler       → `app` ;
 *   4. sinon (`/`, `/about`, …)          → `intl` (next-intl ajoute la locale).
 *
 * Les ensembles (2) et (3) sont disjoints : la position de (2) ne change aucun
 * verdict existant. Elle est placée là pour que l'intention se lise.
 *
 * Noter que (1) et (4) rendent le même verdict : la distinction n'est pas
 * observable ici, elle l'est dans next-intl. L'ordre est néanmoins conservé tel
 * quel — une extraction ne simplifie pas, elle déplace.
 */
export function routeKind(pathname: string): RouteKind {
  const first = firstSegment(pathname);
  if (hasLocalePrefix(first)) return 'intl';
  if (PUBLIC_NO_LOCALE.has(first)) return 'public';
  if (RESERVED.has(first)) return 'app';
  return 'intl';
}
