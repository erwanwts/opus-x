/**
 * Étape 2 — cohérence de la plage MÉTA : OCR-001 (source normative) ↔ expected_ranges (manifeste, dérivé).
 *
 * Deux gardes, prouvées par mutation :
 *  (d) OCR-006 est DANS la plage méta déclarée par OCR-001. L'anomalie du 20 juillet — OCR-006 créé au n°6,
 *      hors de la plage « 000–005 » d'alors, sans amender OCR-001 — ne peut plus réapparaître.
 *  (c) la plage méta d'OCR-001 ÉGALE la portion OCR (débutant à 000) de `expected_ranges` du manifeste.
 *
 * ⚖️ AUTORITÉ (opposable) : **OCR-001 fait foi.** OCR-001 est la RÈGLE de nommage (source normative) ;
 * `expected_ranges` du manifeste en est DÉRIVÉ — le manifeste se régénère DEPUIS OCR-001, **jamais l'inverse**.
 * En cas de divergence, on corrige le manifeste, pas OCR-001. Sans cette règle, la garde signalerait une
 * divergence sans dire qui a raison (le défaut d'`edge_attribution` : signaler sans trancher).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const OCR001 = path.join(
  process.cwd(),
  'docs/web/registry-import/OCR-100/OCR-001_Canonical_Registry_Structure.md',
);
const MANIFEST = path.join(process.cwd(), 'content/registry/_manifest.json');

type Range = { start: number; end: number };

// Source de vérité : la ligne normative d'OCR-001 « - **OCR-000–NNN** — meta/governance documents. »
function metaRangeFromOCR001(txt: string): Range {
  const line = txt.split(/\r?\n/).find((l) => /meta\/governance documents/.test(l));
  if (!line) throw new Error('OCR-001 : ligne « meta/governance documents » introuvable');
  const m = line.match(/OCR-(\d+)\D+?(\d+)/); // « OCR-000–009 » : deux nombres séparés par le tiret
  if (!m) throw new Error(`OCR-001 : plage méta illisible : ${line}`);
  return { start: +m[1], end: +m[2] };
}
// Dérivé : la plage OCR débutant à 000 dans expected_ranges (la portion MÉTA ; 100..125 = concepts).
function metaRangeFromManifest(spec: string): Range {
  const all = [...spec.matchAll(/OCR-(\d+)\.\.(\d+)/g)].map((m) => ({ start: +m[1], end: +m[2] }));
  const meta = all.find((r) => r.start === 0);
  if (!meta) throw new Error(`manifeste : plage méta (OCR-000..) absente d'expected_ranges : ${spec}`);
  return meta;
}
// Prédicats purs — prouvés par mutation, indépendamment des fichiers.
const inRange = (n: number, r: Range) => n >= r.start && n <= r.end;
const rangesEqual = (a: Range, b: Range) => a.start === b.start && a.end === b.end;

const ocr001Txt = readFileSync(OCR001, 'utf8');
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));

describe('Étape 2 — plage méta : OCR-001 fait foi, le manifeste en dérive', () => {
  it('(d) OCR-006 est dans la plage méta d’OCR-001 — l’anomalie du 20 juillet ne peut plus réapparaître', () => {
    const meta = metaRangeFromOCR001(ocr001Txt);
    expect(inRange(6, meta), `OCR-006 doit être dans la plage méta ${meta.start}–${meta.end}`).toBe(true);
  });

  it('(d) MUTATION — une plage excluant 006 échoue, une plage l’incluant passe', () => {
    expect(inRange(6, { start: 0, end: 5 }), 'plage 000–005 (avant) : 006 hors → échec').toBe(false);
    expect(inRange(6, { start: 0, end: 9 }), 'plage 000–009 (après) : 006 dedans → passe').toBe(true);
  });

  it('(c) la plage méta d’OCR-001 ÉGALE la portion méta d’expected_ranges (OCR-001 fait foi)', () => {
    const source = metaRangeFromOCR001(ocr001Txt);
    const derived = metaRangeFromManifest(manifest.expected_ranges);
    expect(
      rangesEqual(source, derived),
      `divergence plage méta : OCR-001=${source.start}–${source.end} (fait foi) vs manifeste=${derived.start}–${derived.end} → régénérer le manifeste DEPUIS OCR-001`,
    ).toBe(true);
  });

  it('(c) MUTATION — la divergence du 20 juillet (OCR-001 000–005 vs manifeste 000–006) échouerait', () => {
    expect(rangesEqual({ start: 0, end: 9 }, { start: 0, end: 9 }), 'égales → passe').toBe(true);
    expect(rangesEqual({ start: 0, end: 5 }, { start: 0, end: 6 }), 'divergentes (l’anomalie) → échec').toBe(false);
  });
});
