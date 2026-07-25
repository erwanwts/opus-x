/**
 * « cité ≥ 1 » — critère de promotion PROMU de script en test rejouable.
 *
 * Pourquoi ce test existe. Un script de session a mesuré « cité par 0 » pour
 * OCR-000..005 (compte réel : 6) et en aurait conclu que 6 Records de Phase 1
 * échouaient « cité ≥ 1 ». Cause EXACTE, mesurée — et ce n'était PAS le trait
 * d'union : un `\b` construit à travers une couche shell (`node -e`, heredoc)
 * voit ses backslashes réduits, et `\b` y devient le caractère BACKSPACE
 * (U+0008), pas une frontière de mot. Le motif ne pouvait jamais matcher. Dans
 * un FICHIER, avec un double backslash (`\\b`), la frontière compte bien 6.
 *
 * Le script n'a pas été arrêté par un test — il n'y en avait pas — mais par
 * contradiction avec une mesure enregistrée (le DOSSIER portait « cité par 6 »).
 * Ce test EST le test manquant : il vit dans un fichier (pas de shell), mesure
 * les citations correctement, et PROUVE par mutation qu'il attrape le défaut.
 *
 * Aucun seuil de promotion, aucun statut — la seule mesure du critère.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');
const RECORDS = readdirSync(DIR)
  .filter((f) => /^OCR-\d+_.*\.md$/.test(f))
  .map((f) => ({ id: f.split('_')[0], txt: readFileSync(path.join(DIR, f), 'utf8') }));

/** Nombre d'AUTRES Records mentionnant l'identifiant, selon un matcher donné. */
function citedBy(id: string, matcher: (txt: string) => boolean): number {
  return RECORDS.filter((r) => r.id !== id && matcher(r.txt)).length;
}
// CORRECT : frontière de mot doublement échappée — dans un fichier, `\\b` = frontière.
const correct = (id: string) => (txt: string) => new RegExp('\\b' + id + '\\b').test(txt);
// FAUTIF : un seul backslash — en JS, '\b' est le BACKSPACE, jamais une frontière. Rend 0.
const buggy = (id: string) => (txt: string) => new RegExp('\b' + id + '\b').test(txt);

describe('« cité ≥ 1 » — critère promu en test rejouable', () => {
  it('chaque Record porte un compte de citations dérivé du corpus (mesure, pas seuil)', () => {
    for (const r of RECORDS) expect(citedBy(r.id, correct(r.id))).toBeGreaterThanOrEqual(0);
  });

  it('OCR-000..005 sont tous cités ≥ 1 — INVARIANT du critère, jamais un compte figé', () => {
    // INVARIANT : chaque méta de gouvernance est cité au moins une fois. Le nombre EXACT est une
    // conséquence du corpus (il bouge à chaque Record ajouté — proposition (8) à l'échelle) ; on n'en
    // fige aucune valeur. Reste vrai à 36, 40, 100 Records.
    for (const id of ['OCR-000', 'OCR-001', 'OCR-002', 'OCR-003', 'OCR-004', 'OCR-005']) {
      expect(citedBy(id, correct(id)), id).toBeGreaterThanOrEqual(1);
    }
  });

  it('MUTATION — le matcher fautif (`\\b` → backspace) rend 0, le correct rend > 0', () => {
    // Preuve, comme l'attestation : le test distingue le bon matcher du mauvais — sans figer le nombre.
    expect(citedBy('OCR-004', buggy('OCR-004'))).toBe(0);
    expect(citedBy('OCR-004', correct('OCR-004'))).toBeGreaterThan(0);
  });

  it('INVENTAIRE mesuré — les Records cités par 0 (échec « cité ≥ 1 »)', () => {
    const uncited = RECORDS.filter((r) => citedBy(r.id, correct(r.id)) === 0).map((r) => r.id).sort();
    // Constat mesuré, pas seuil. OCR-006 est désormais CITÉ (par OCR-007/009 qui y défèrent) — il quitte
    // l'ensemble. Restent deux orphelins, de motifs DISTINCTS :
    //  · OCR-123 — hors Phase 1 (partition), motif Phase-2.
    //  · OCR-009 — ORPHELIN ATTENDU (Voie 3, décidée) : le lien de fond EXISTE (OCR-000:47 exige
    //    l'approbation, OCR-005:55 la trace en release — l'objet qu'OCR-009 forme), mais son inscription
    //    ATTEND un PATCH d'OCR-000/005 à l'ÉTAPE 8 — par VERSIONING (OCR-005:46), plus d'édition en place :
    //    OCR-000/005 sont ratifiés Normative (D-022), donc figés au champ. La citation OCR-000/005 → OCR-009
    //    s'ajoutera dans le MÊME mouvement que leur promotion.
    //    « Cité ≥ 1 » est une porte de promotion (étape 8), pas d'écriture — l'orphelinat ne bloque rien.
    expect(uncited).toEqual(['OCR-009', 'OCR-123']);
  });
});
