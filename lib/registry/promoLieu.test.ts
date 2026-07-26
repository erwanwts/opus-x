/**
 * Lieu de promotion (`content/registry/promo/`) — GARDE DE CONTENU (D-027, grain souple).
 *
 * Miroir du lieu fondateur, mais le grain est SOUPLE : un fait PROMO déclare UN OU PLUSIEURS
 * Records (`declares_normative` = tableau). L'identifiant fait foi par le CONTENU (champ `id`),
 * plus par le nom de fichier — donc la garde s'appuie sur le CONTENU de l'ensemble des fichiers.
 *
 * Elle vérifie, mutation-prouvée sur des FIXTURES (aucun PROMO réel n'existe) :
 *   R1 — chaque id déclaré existe dans le corpus ;
 *   R2 — aucun id dupliqué dans un même fichier ;
 *   R3 — aucun id promu deux fois à travers l'ensemble des fichiers ;
 *   R4 — la plage est respectée (id du contenu dans la plage PROMO), cohérente avec le manifeste OCR (D-004).
 * Le lieu est créé À VIDE : aucun Record n'est promu, le corpus n'est pas touché.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const PROMO = path.join(process.cwd(), 'content/registry/promo');
const CORPUS_DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');
const OCR_MANIFEST = path.join(process.cwd(), 'content/registry/_manifest.json');

const manifest = JSON.parse(readFileSync(path.join(PROMO, 'promo.manifest.json'), 'utf8'));

// ── Dispositif de plage (identique à D-004 / foundingLieu) ────────────────────
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

/** Les ids OCR réellement présents au corpus — pour R1 (« l'id déclaré existe »). */
const CORPUS_IDS = new Set(
  readdirSync(CORPUS_DIR).filter((f) => /^OCR-\d+_.*\.md$/.test(f)).map((f) => f.split('_')[0]),
);

/** Un fait tel qu'il vivrait dans promo/ (contenu). */
interface PromoFact {
  id: string;
  kind: 'promotion' | 'revocation';
  declares_normative?: string[];
  revokes_normative?: string[];
}

// ── LA GARDE DE CONTENU ───────────────────────────────────────────────────────
/** Erreurs d'un fait PROMO isolé (R1, R2, R4). Un fait bien formé → []. */
function validatePromoFact(f: PromoFact, corpus: Set<string>, ranges: Range[]): string[] {
  const errs: string[] = [];
  if (f.kind !== 'promotion') return errs; // les révocations ne promeuvent pas ; hors R1/R2
  if (!idInRanges(f.id, ranges)) errs.push(`${f.id} : hors plage PROMO (R4)`); // R4 — sur le CONTENU id
  const declares = f.declares_normative;
  if (!Array.isArray(declares) || declares.length < 1) {
    errs.push(`${f.id} : declares_normative doit être un tableau non vide (grain souple = 1+)`);
    return errs;
  }
  if (new Set(declares).size !== declares.length) errs.push(`${f.id} : id dupliqué dans le fichier (R2)`); // R2
  for (const rid of declares) if (!corpus.has(rid)) errs.push(`${f.id} : déclare ${rid} absent du corpus (R1)`); // R1
  return errs;
}
/** Erreurs de l'ENSEMBLE des fichiers (R1/R2/R4 par fait + R3 : aucun id promu deux fois à travers l'ensemble). */
function validatePromoSet(facts: PromoFact[], corpus: Set<string>, ranges: Range[]): string[] {
  const errs: string[] = [];
  const promotedBy = new Map<string, string>(); // OCR id → fichier PROMO qui l'a promu
  for (const f of facts) {
    errs.push(...validatePromoFact(f, corpus, ranges));
    if (f.kind === 'promotion') {
      for (const rid of f.declares_normative ?? []) {
        if (promotedBy.has(rid)) errs.push(`${rid} : promu deux fois (${promotedBy.get(rid)} et ${f.id}) (R3)`); // R3
        else promotedBy.set(rid, f.id);
      }
    }
  }
  return errs;
}

// Un id OCR réel du corpus, pour les fixtures (pris déterministe : le premier trié).
const SOME = [...CORPUS_IDS].sort()[0]; // OCR-000
const OTHER = [...CORPUS_IDS].sort()[1]; // OCR-001

describe('lieu promo/ — existence, non-OCR, plage cohérente (D-027)', () => {
  it('le lieu existe (série PROMO, schéma, grain souple documenté)', () => {
    expect(existsSync(PROMO), 'content/registry/promo/ doit exister').toBe(true);
    expect(manifest.series).toBe('PROMO');
    expect(manifest.not_an_ocr).toBe(true);
    expect(manifest.no_status).toBe(true);
    expect(existsSync(path.join(PROMO, 'PROMO.schema.json')), 'le schéma PROMO doit exister').toBe(true);
    // Le schéma ne porte aucun champ Status (le statut est dérivé, jamais authored).
    const schema = JSON.parse(readFileSync(path.join(PROMO, 'PROMO.schema.json'), 'utf8'));
    expect(Object.keys(schema.promotion_fields)).not.toContain('status');
  });

  it('la plage PROMO du lieu est COHÉRENTE avec le manifeste OCR (D-004, source unique — pas de divergence)', () => {
    const lieuPromo = parseRanges(manifest.expected_ranges).filter((r) => r.prefix === 'PROMO');
    const ocrPromo = parseRanges(JSON.parse(readFileSync(OCR_MANIFEST, 'utf8')).expected_ranges).filter(
      (r) => r.prefix === 'PROMO',
    );
    expect(lieuPromo.length, 'le lieu déclare une plage PROMO').toBe(1);
    expect(ocrPromo.length, 'le manifeste OCR réserve la plage PROMO (D-004)').toBe(1);
    // Même borne des deux côtés : l'id à source unique vaut aussi pour la plage.
    expect(lieuPromo[0]).toEqual(ocrPromo[0]);
  });
});

describe('lieu promo/ — GARDE DE CONTENU, mutation-prouvée (grain souple)', () => {
  const ranges = parseRanges(manifest.expected_ranges);

  it('GRAIN SOUPLE — 1 OU plusieurs ids passent (un fait à un Record, un fait à plusieurs)', () => {
    expect(validatePromoFact({ id: 'PROMO-001', kind: 'promotion', declares_normative: [SOME] }, CORPUS_IDS, ranges)).toEqual([]);
    expect(validatePromoFact({ id: 'PROMO-001', kind: 'promotion', declares_normative: [SOME, OTHER] }, CORPUS_IDS, ranges)).toEqual([]);
  });

  it('R1 — chaque id déclaré existe dans le corpus (MUTATION : un id fantôme échoue)', () => {
    expect(validatePromoFact({ id: 'PROMO-001', kind: 'promotion', declares_normative: [SOME] }, CORPUS_IDS, ranges)).toEqual([]);
    const errs = validatePromoFact({ id: 'PROMO-001', kind: 'promotion', declares_normative: [SOME, 'OCR-999'] }, CORPUS_IDS, ranges);
    expect(errs.some((e) => e.includes('OCR-999') && e.includes('R1'))).toBe(true);
  });

  it('R2 — aucun id dupliqué dans un même fichier (MUTATION : un doublon échoue)', () => {
    expect(validatePromoFact({ id: 'PROMO-001', kind: 'promotion', declares_normative: [SOME, OTHER] }, CORPUS_IDS, ranges)).toEqual([]);
    const errs = validatePromoFact({ id: 'PROMO-001', kind: 'promotion', declares_normative: [SOME, SOME] }, CORPUS_IDS, ranges);
    expect(errs.some((e) => e.includes('R2'))).toBe(true);
  });

  it('R3 — aucun id promu deux fois à travers l’ensemble (MUTATION : deux fichiers, même id, échoue)', () => {
    // R3 est INDÉPENDANT de la plage : pour l'isoler, une plage-fixture qui admet deux fichiers (001..002).
    const wide = parseRanges('PROMO-001..002');
    const clean = [
      { id: 'PROMO-001', kind: 'promotion' as const, declares_normative: [SOME] },
      { id: 'PROMO-002', kind: 'promotion' as const, declares_normative: [OTHER] },
    ];
    expect(validatePromoSet(clean, CORPUS_IDS, wide)).toEqual([]);
    const collide = [
      { id: 'PROMO-001', kind: 'promotion' as const, declares_normative: [SOME] },
      { id: 'PROMO-002', kind: 'promotion' as const, declares_normative: [SOME] }, // SOME deux fois
    ];
    const errs = validatePromoSet(collide, CORPUS_IDS, wide);
    expect(errs.some((e) => e.includes(SOME) && e.includes('R3'))).toBe(true);
  });

  it('R4 — la plage est respectée sur le CONTENU id (MUTATION : hors plage échoue ; sans la plage, rejeté)', () => {
    expect(validatePromoFact({ id: 'PROMO-001', kind: 'promotion', declares_normative: [SOME] }, CORPUS_IDS, ranges).length).toBe(0);
    const hors = validatePromoFact({ id: 'PROMO-999', kind: 'promotion', declares_normative: [SOME] }, CORPUS_IDS, ranges);
    expect(hors.some((e) => e.includes('PROMO-999') && e.includes('R4'))).toBe(true);
    // Sans la plage PROMO déclarée, même PROMO-001 est rejeté → c'est la déclaration qui l'admet.
    const sansPromo = ranges.filter((r) => r.prefix !== 'PROMO');
    expect(idInRanges('PROMO-001', sansPromo)).toBe(false);
  });

  it('SYNTHÈSE — la garde ACCEPTE un ensemble bien formé et REJETTE chaque forme mal formée', () => {
    const bienForme = [
      { id: 'PROMO-001', kind: 'promotion' as const, declares_normative: [SOME, OTHER] }, // grain souple
    ];
    expect(validatePromoSet(bienForme, CORPUS_IDS, ranges)).toEqual([]);
    // Un ensemble cumulant toutes les fautes → au moins une erreur par règle, chacune NOMMÉE.
    const malForme = [
      { id: 'PROMO-999', kind: 'promotion' as const, declares_normative: [SOME, SOME, 'OCR-999'] }, // R4 + R2 + R1
      { id: 'PROMO-001', kind: 'promotion' as const, declares_normative: [SOME] }, // R3 (SOME déjà promu)
    ];
    const errs = validatePromoSet(malForme, CORPUS_IDS, ranges);
    expect(errs.some((e) => e.includes('R1'))).toBe(true);
    expect(errs.some((e) => e.includes('R2'))).toBe(true);
    expect(errs.some((e) => e.includes('R3'))).toBe(true);
    expect(errs.some((e) => e.includes('R4'))).toBe(true);
  });
});

describe('lieu promo/ — armé À VIDE : aucun PROMO réel émis', () => {
  it('le lieu ne contient AUCUN fait de promotion réel (records vide, aucun fichier promotion)', () => {
    expect(manifest.records, 'records: [] à la création du lieu').toEqual([]);
    // Aucun fichier .json du lieu n'est un fait de promotion/révocation (seuls manifeste + schéma).
    const factFiles = readdirSync(PROMO)
      .filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(readFileSync(path.join(PROMO, f), 'utf8')))
      .filter((j) => j && (j.kind === 'promotion' || j.kind === 'revocation'));
    expect(factFiles, 'aucun fait réel dans le lieu (à vide)').toEqual([]);
  });

  it('la garde appliquée à l’ensemble RÉEL (vide) passe — armée, aucune faute', () => {
    expect(validatePromoSet([], CORPUS_IDS, parseRanges(manifest.expected_ranges))).toEqual([]);
  });
});
