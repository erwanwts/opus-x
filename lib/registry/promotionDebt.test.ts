/**
 * Critère « aucune dette ouverte » — promu de liste manuelle en test rejouable.
 *
 * Possible depuis la structuration Q2 (D-008) : le registre des dettes porte une
 * table « Records concernés », attribution EXPLICITE seulement. Ce test lit cette
 * table, extrait les Records sujets d'une dette OUVERTE, et vérifie qu'aucun
 * Record de PHASE 1 (partition 29·3·1, D-005) n'y figure — sinon il échoue le
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

// Partition 29·3·1 (D-005) : Phase 2/3 = retenus hors Phase 1.
const HORS_PHASE_1 = new Set(['OCR-100', 'OCR-114', 'OCR-123', 'OCR-006']);

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
  it('aucun Record de Phase 1 (29·3·1) ne figure dans une dette ouverte', () => {
    const enDette = recordsEnDetteOuverte();
    const phase1EnDette = enDette.filter((id) => !HORS_PHASE_1.has(id));
    // Un Record de Phase 1 sujet d'une dette ouverte échoue le critère : le test
    // le NOMME au lieu de dire seulement « faux ».
    expect(phase1EnDette).toEqual([]);
  });

  it('les Records en dette ouverte sont exactement {OCR-100, OCR-114} — tous Phase 2', () => {
    expect(recordsEnDetteOuverte().sort()).toEqual(['OCR-100', 'OCR-114']);
  });

  it('la partition couvre 33 Records ; Phase 1 = 29', () => {
    const total = readdirSync(CORPUS).filter((f) => /^OCR-\d+_.*\.md$/.test(f)).length;
    expect(total).toBe(33);
    expect(total - HORS_PHASE_1.size).toBe(29);
  });
});
