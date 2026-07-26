/**
 * Garde anti-forgeage (étape 6, palier 2) — AVANT la migration des lecteurs.
 *
 * Interdit tout `Status: Normative`/`Validated` authored sur un Record : le statut est
 * dérivé d'un fait (`resolveStatus`), jamais écrit dans le Record. Prouvée par mutation.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { authorsNormativeStatus } from './antiForgery';

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');
const RECORDS = readdirSync(DIR)
  .filter((f) => /^OCR-\d+_.*\.md$/.test(f))
  .map((f) => ({ id: f.split('_')[0], raw: readFileSync(path.join(DIR, f), 'utf8') }));

describe('anti-forgeage — aucun statut Normative n’est authored sur un Record', () => {
  it('les 36 Records : le champ Status n’authore JAMAIS Normative/Validated', () => {
    const forged = RECORDS.filter((r) => authorsNormativeStatus(r.raw)).map((r) => r.id);
    // Un Record forgé (statut authored) échoue le critère en se NOMMANT.
    expect(forged).toEqual([]);
  });

  it('MUTATION — un champ Status forgé en Normative est DÉTECTÉ', () => {
    const real = RECORDS.find((r) => r.id === 'OCR-104')!.raw;
    expect(authorsNormativeStatus(real)).toBe(false); // le Record réel : Draft, non forgé
    const forged = real.replace('| **Status** | Draft |', '| **Status** | Normative |');
    expect(authorsNormativeStatus(forged)).toBe(true); // le forgeage est attrapé
    const forgedV = real.replace('| **Status** | Draft |', '| **Status** | Validated |');
    expect(authorsNormativeStatus(forgedV)).toBe(true);
  });

  it('ne confond PAS le champ Status avec les mentions « Normative » en prose ou dans « Normative / Informative »', () => {
    // OCR-000 mentionne « Normative » en prose et porte un champ « Normative / Informative » ;
    // seul un champ **Status** = Normative doit déclencher.
    const ocr000 = RECORDS.find((r) => r.id === 'OCR-000')!.raw;
    expect(ocr000.includes('Normative')).toBe(true); // présent en prose / autre champ
    expect(authorsNormativeStatus(ocr000)).toBe(false); // mais pas dans le champ Status
  });
});
