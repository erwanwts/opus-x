/**
 * =====================================================================
 * Opus X — Les Records dont la page est RÉELLEMENT générée
 * =====================================================================
 * Source unique de la question « `/records/{id}` existe-t-il ? ».
 *
 * Elle est lue au même endroit que `generateStaticParams` de la route : le dossier
 * du corpus. Deux listes qui divergeraient produiraient exactement la panne que le
 * résolveur canonique cherche à empêcher — un `href` vers une page non générée.
 *
 * Module SANS dépendance interne : il est importé par `lib/seo/pillars`, qui est
 * lui-même importé partout. Aucun cycle possible.
 * =====================================================================
 */
import { readdirSync } from 'node:fs';
import path from 'node:path';

const RECORDS_DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');

let _ids: Set<string> | null = null;

/**
 * Identifiants (`OCR-nnn`) dont la page de projection est générée. Dérivé du
 * corpus, jamais d'une liste tenue à la main.
 */
export function publishedRecordIds(): Set<string> {
  if (_ids) return _ids;
  _ids = new Set(
    readdirSync(RECORDS_DIR)
      .filter((f) => /^OCR-\d+_.*\.md$/i.test(f))
      .map((f) => f.split('_')[0].toUpperCase()),
  );
  return _ids;
}

/** La page `/records/{id}` est-elle générée ? */
export function hasRecordPage(id: string): boolean {
  return publishedRecordIds().has(id.toUpperCase());
}

/** Adresse de la page d'un Record — NON localisée : un Record est en anglais. */
export function recordPagePath(id: string): string {
  return `/records/${id.toLowerCase()}`;
}
