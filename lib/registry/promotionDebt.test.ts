/**
 * Critère « aucune dette ouverte » — promu de liste manuelle en test rejouable.
 *
 * Possible depuis la structuration Q2 (D-008) : le registre des dettes porte une
 * table « Records concernés », attribution EXPLICITE seulement. Ce test lit cette
 * table, extrait les Records sujets d'une dette OUVERTE, et vérifie qu'aucun
 * Record de PHASE 1 (partition D-005, membres corrigés 006/D-024) n'y figure — sinon il échoue le
 * critère, nommé par son id.
 *
 * Portée honnête (D-009 action 3) : le test atteste les dettes ATTRIBUÉES. Une
 * entrée reste en LACUNE (verbatim-code 449/300) : son sujet sont les orphelins
 * `[GRAVÉ]`, pas des Records — Records concernés vide, elle ne flague personne.
 * Si l'Architecte décidait que les 33 pages affectées valent attribution, le
 * critère changerait ; en l'état, aucun Record n'est sujet de cette dette.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const DETTES = path.join(process.cwd(), 'docs/registry/DETTES-ouvertes.md');
const CORPUS = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');

// Partition (D-005) : Phase 2/3 = retenus hors Phase 1. Membres MESURÉS, pas figés d'origine.
// CORRECTION 006 : retiré — D-021 (postérieur à cette partition) le promeut 2ᵉ (Phase 1) ; sa présence
//   était un reliquat d'avant D-021 (`c82f8f7`).
// D-024 : OCR-112 ajouté — descendu en Phase 2 (même bloqueur GAP-F1-01 que 114 ; le GAP se lève en lot
//   de code propre, 112 et 114 remontent ensemble plus tard). NE PAS coder la supersession pour le débloquer.
// Net : swap 006↔112, HORS reste 4 → Phase 1 = 32.
const HORS_PHASE_1 = new Set(['OCR-100', 'OCR-112', 'OCR-114', 'OCR-123']);

/** Ids de Records concernés par une dette OUVERTE, lus dans la SEULE table d'attribution. */
function recordsEnDetteOuverte(): string[] {
  const lines = readFileSync(DETTES, 'utf8').split(/\r?\n/);
  // Borner à la section « ## Attribution … » (jusqu'au prochain titre `## ` ou `---`).
  const start = lines.findIndex((l) => /^##\s+Attribution/.test(l));
  if (start < 0) throw new Error('section « ## Attribution » introuvable');
  let end = lines.findIndex((l, i) => i > start && (/^##\s/.test(l) || /^---\s*$/.test(l)));
  if (end < 0) end = lines.length;
  const found = new Set<string>();
  for (const l of lines.slice(start, end)) {
    if (!/^\|/.test(l) || /Attribution\s*\|/.test(l) || /^\|\s*-+/.test(l)) continue;
    const cells = l.split('|').map((c) => c.trim());
    if (cells.length < 4) continue;
    if (cells[3].toLowerCase().includes('close')) continue; // dette close → ignorée
    for (const m of cells[2].matchAll(/OCR-\d+/g)) found.add(m[0]);
  }
  return [...found];
}

describe('« aucune dette ouverte » — critère de Phase 1, rejoué depuis la table structurée', () => {
  it('aucun Record de Phase 1 (D-005) ne figure dans une dette ouverte', () => {
    const enDette = recordsEnDetteOuverte();
    const phase1EnDette = enDette.filter((id) => !HORS_PHASE_1.has(id));
    // Un Record de Phase 1 sujet d'une dette ouverte échoue le critère : le test
    // le NOMME au lieu de dire seulement « faux ».
    expect(phase1EnDette).toEqual([]);
  });

  it('les Records en dette ouverte sont exactement {OCR-100, OCR-114} — tous Phase 2', () => {
    expect(recordsEnDetteOuverte().sort()).toEqual(['OCR-100', 'OCR-114']);
  });

  it('la partition couvre 36 Records ; Phase 1 = 32 (mesuré ; swap 006↔112, D-024)', () => {
    const total = readdirSync(CORPUS).filter((f) => /^OCR-\d+_.*\.md$/.test(f)).length;
    // FAIT, PAS invariant : 33 + 3 Records du régime (OCR-007/008/009) = 36. Un 37ᵉ Record DOIT
    // casser ce test — la population de promotion est un nombre attendu, pas une conséquence à dériver.
    // Phase 1 = 32 : le swap 006(sort)↔112(entre) laisse HORS à 4. 007/008/009 sont DANS Phase 1 (régime doc).
    expect(total).toBe(36);
    expect(total - HORS_PHASE_1.size).toBe(32); // HORS_PHASE_1 = {OCR-100, OCR-112, OCR-114, OCR-123} (4)
  });
});
