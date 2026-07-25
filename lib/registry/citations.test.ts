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

  it('OCR-000..005 : compte de citations mesuré (amendement OCR-006 → 000/005 à 7)', () => {
    // Mesure du DOSSIER = 6 chacun AVANT l'amendement d'OCR-006 (étape 1). Depuis, OCR-006 défère au
    // régime documentaire et cite les BORNES de la plage « OCR-000 through OCR-005 » (+ §291/§295, renvoi
    // P8) : OCR-000 et OCR-005 passent à 7 ; les bornes internes 001..004, non citées littéralement par la
    // plage, restent à 6. Valeurs re-mesurées, non figées à la main.
    const expected: Record<string, number> = {
      'OCR-000': 7, 'OCR-001': 6, 'OCR-002': 6, 'OCR-003': 6, 'OCR-004': 6, 'OCR-005': 7,
    };
    for (const [id, n] of Object.entries(expected)) {
      expect(citedBy(id, correct(id)), id).toBe(n);
    }
  });

  it('MUTATION — le matcher fautif (`\\b` → backspace) rend 0, le correct rend 6', () => {
    // Preuve, comme l'attestation : le test distingue le bon matcher du mauvais.
    // Un critère « ≥ 1 » ÉCHOUERAIT avec le matcher fautif et PASSE avec le correct.
    expect(citedBy('OCR-004', buggy('OCR-004'))).toBe(0);
    expect(citedBy('OCR-004', correct('OCR-004'))).toBe(6);
  });

  it('INVENTAIRE mesuré — les Records cités par 0 (échec « cité ≥ 1 »)', () => {
    const uncited = RECORDS.filter((r) => citedBy(r.id, correct(r.id)) === 0).map((r) => r.id).sort();
    // Constat, pas seuil. OCR-006 est en Phase 3 ; OCR-123 est en Phase 1 sous la
    // partition 30·2·1 (dette, pas citation, y est discriminante) — donc un Record
    // de Phase 1 échoue CE critère dérivable, même si la partition ne l'emploie pas.
    // À l'Architecte de décider si le critère de la grille s'applique.
    expect(uncited).toEqual(['OCR-006', 'OCR-123']);
  });
});
