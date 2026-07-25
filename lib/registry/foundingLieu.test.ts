/**
 * Étape 0a — le LIEU de l'acte fondateur : garde de plage `RATIF` (même dispositif que D-004).
 *
 * Le lieu (`content/registry/founding/`) porte la ratification fondatrice (D-019/D-020) SANS être un OCR
 * ratifié par l'acte qu'il contient — il brise l'amorçage. Ce test **arme** la garde de plage `RATIF` et la
 * **prouve par mutation** : un `RATIF-xxx` dans la plage passe ; hors plage, il échoue. Il vérifie aussi la
 * **non-circularité** : le lieu n'est pas un OCR, n'a pas de `Status`, n'est pas dans le manifeste OCR, et la
 * série `RATIF` est hors des plages OCR et PROMO. **Aucun `RATIF-001` n'est émis (le lieu, pas l'acte).**
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const FOUNDING = path.join(process.cwd(), 'content/registry/founding');
const OCR_MANIFEST = path.join(process.cwd(), 'content/registry/_manifest.json');

// ── Dispositif de plage, identique à D-004 (manifest.attestation.test) ────────
type Range = { prefix: string; start: number; end: number };
function parseRanges(spec: string | null): Range[] {
  if (!spec) return [];
  return spec.split(',').map((tok) => {
    const m = tok.trim().match(/^([A-Z]+)-(\d+)\.\.(\d+)$/);
    if (!m) throw new Error(`plage invalide : ${tok}`);
    return { prefix: m[1], start: +m[2], end: +m[3] };
  });
}
function idInRanges(id: string, ranges: Range[]): boolean {
  const m = id.match(/^([A-Z]+)-(\d+)$/);
  if (!m) return false;
  const [, prefix, num] = m;
  return ranges.some((r) => r.prefix === prefix && +num >= r.start && +num <= r.end);
}

const manifest = JSON.parse(readFileSync(path.join(FOUNDING, 'founding.manifest.json'), 'utf8'));

// ── Garde de CONTENU : declares_normative = un ENSEMBLE de deux Records distincts nommés ──
// Décide par ensemble : ni l'ordre ni les doublons ne comptent — [005,000] passe, [000,000] échoue.
function declaresExactSet(declares: unknown, expected: string[]): boolean {
  if (!Array.isArray(declares)) return false;
  if (new Set(declares).size !== declares.length) return false; // aucun doublon (Records DISTINCTS)
  if (declares.length !== expected.length) return false; // même cardinalité
  const got = new Set(declares);
  return expected.every((e) => got.has(e)); // même ensemble
}
// Le fait RATIF-001, où qu'il soit émis (fichier dédié OU entrée du manifeste) — null tant qu'absent (0a).
function findRatif001(): { id?: string; declares_normative?: unknown } | null {
  const file = path.join(FOUNDING, 'RATIF-001.json');
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  const rec = (manifest.records ?? []).find((r: { id?: string }) => r.id === 'RATIF-001');
  return rec ?? null;
}

describe('0a — lieu de l’acte fondateur : garde de plage RATIF (dispositif D-004)', () => {
  it('le lieu existe, avec sa série RATIF et son schéma — records VIDE (le lieu, pas l’acte)', () => {
    expect(existsSync(FOUNDING), 'content/registry/founding/ doit exister').toBe(true);
    expect(manifest.series).toBe('RATIF');
    expect(existsSync(path.join(FOUNDING, 'RATIF.schema.json')), 'le schéma RATIF doit exister').toBe(true);
    expect(manifest.records, 'aucun RATIF émis en 0a (le lieu, pas l’acte)').toEqual([]);
    // Aucun fichier RATIF-xxx émis : le répertoire ne porte que manifeste + schéma + readme.
    const ratifFiles = readdirSync(FOUNDING).filter((f) => /^RATIF-\d+\./.test(f));
    expect(ratifFiles, 'aucun fichier RATIF-xxx en 0a').toEqual([]);
  });

  it('la plage RATIF est déclarée, prouvée PAR MUTATION (dans la plage passe, hors plage échoue)', () => {
    const ranges = parseRanges(manifest.expected_ranges);
    expect(ranges.some((r) => r.prefix === 'RATIF'), 'la plage RATIF doit être déclarée (0a)').toBe(true);
    // Dans la plage → accepté ; hors plage → rejeté (la fente fondatrice est unique, RATIF-001..001).
    expect(idInRanges('RATIF-001', ranges), 'RATIF-001 : en plage, accepté').toBe(true);
    expect(idInRanges('RATIF-002', ranges), 'RATIF-002 : hors plage, rejeté').toBe(false);
    // MUTATION (comme D-004) : sans la plage RATIF déclarée, RATIF-001 est rejeté → c'est la déclaration
    // qui l'admet, rien d'autre. La garde décide bien sur RATIF-001.
    const sansRatif = ranges.filter((r) => r.prefix !== 'RATIF');
    expect(idInRanges('RATIF-001', sansRatif), 'sans la plage RATIF : rejeté').toBe(false);
  });

  it('RATIF est HORS des plages OCR et PROMO (préfixe distinct, aucune collision)', () => {
    const ocrRanges = parseRanges(JSON.parse(readFileSync(OCR_MANIFEST, 'utf8')).expected_ranges);
    // Un id RATIF ne tombe dans aucune plage du corpus OCR (OCR-… ni PROMO-…).
    expect(idInRanges('RATIF-001', ocrRanges), 'RATIF-001 hors des plages OCR/PROMO').toBe(false);
    // Réciproquement, un OCR ou un PROMO ne tombe pas dans la plage RATIF.
    const ratifRanges = parseRanges(manifest.expected_ranges);
    expect(idInRanges('OCR-000', ratifRanges), 'OCR-000 hors plage RATIF').toBe(false);
    expect(idInRanges('PROMO-001', ratifRanges), 'PROMO-001 hors plage RATIF').toBe(false);
  });

  it('non-circularité : le lieu n’est pas un OCR (pas de Status, pas de promotion, hors manifeste OCR)', () => {
    expect(manifest.not_an_ocr).toBe(true);
    expect(manifest.no_status).toBe(true);
    expect(manifest.no_promotion).toBe(true);
    // La série RATIF n'est PAS déclarée dans le manifeste OCR (sinon le lieu tomberait sous sa garde).
    const ocrSpec: string = JSON.parse(readFileSync(OCR_MANIFEST, 'utf8')).expected_ranges ?? '';
    expect(ocrSpec.includes('RATIF'), 'RATIF ne doit PAS être dans le manifeste OCR').toBe(false);
    // Le schéma RATIF ne porte aucun champ Status.
    const schema = JSON.parse(readFileSync(path.join(FOUNDING, 'RATIF.schema.json'), 'utf8'));
    expect(Object.keys(schema.fields)).not.toContain('status');
    expect(Object.keys(schema.fields)).not.toContain('Status');
  });
});

describe('0a — garde de CONTENU de RATIF-001 : declares_normative = {OCR-000, OCR-005} EXACTEMENT', () => {
  // L'ensemble minimal MESURÉ (M3, D-019/D-020) : la ratification fondatrice ne peut déclarer que lui.
  const EXPECTED = ['OCR-000', 'OCR-005'];

  it('décide par ENSEMBLE (pas ordre, pas doublon) — prouvé par MUTATION', () => {
    expect(declaresExactSet(['OCR-000', 'OCR-005'], EXPECTED), 'l’exact → passe').toBe(true);
    expect(declaresExactSet(['OCR-005', 'OCR-000'], EXPECTED), 'même ensemble, autre ordre → passe').toBe(true);
    expect(declaresExactSet(['OCR-000', 'OCR-005', 'OCR-001'], EXPECTED), '3 Records → échec').toBe(false);
    expect(declaresExactSet(['OCR-000'], EXPECTED), '1 seul → échec').toBe(false);
    expect(declaresExactSet(['OCR-001', 'OCR-002'], EXPECTED), '2 autres → échec').toBe(false);
    expect(declaresExactSet(['OCR-000', 'OCR-000'], EXPECTED), 'doublon (pas 2 distincts) → échec').toBe(false);
    expect(declaresExactSet(['OCR-000', 'OCR-005', 'OCR-000'], EXPECTED), 'doublon + 3 positions → échec').toBe(false);
  });

  it('armée à VIDE aujourd’hui (aucun RATIF-001) ; elle MORD à l’émission 0b', () => {
    const fact = findRatif001();
    if (fact === null) {
      // 0a = le lieu, pas l'acte : records vide, aucun fichier RATIF-001. La garde est armée.
      expect(manifest.records, 'aucun RATIF-001 émis en 0a').toEqual([]);
    } else {
      // 0b a émis RATIF-001 → son ensemble DOIT être exactement {OCR-000, OCR-005}, sinon échec nommé.
      expect(
        declaresExactSet(fact.declares_normative, EXPECTED),
        `RATIF-001 doit déclarer exactement {OCR-000, OCR-005} — a déclaré ${JSON.stringify(fact.declares_normative)}`,
      ).toBe(true);
    }
  });
});
