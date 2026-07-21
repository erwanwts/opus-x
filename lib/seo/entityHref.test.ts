/**
 * CHAÎNE DE RÉSOLUTION DES LIENS D'ENTITÉS.
 *
 * Ce test est écrit pour l'ÉTAT ACTUEL, AVANT tout amendement — même discipline
 * que la matrice de `routeKind` et que le garde-fou de `ctaHref` : on fige d'abord
 * ce que le résolveur fait, on l'amende ensuite au grand jour.
 *
 * ÉTAT D'ORIGINE : `entityHref` ne connaissait QUE les pages piliers. Un Record
 * sans pilier restait du texte brut, alors même que sa page `/records/{id}` existe
 * et répond 200 — c'est l'écart de maillage mesuré en production.
 *
 * AMENDÉ (Lot D) : la chaîne devient pilier → page Record → texte brut, l'étape 2
 * étant BORNÉE À LA LOCALE CANONIQUE. L'amendement initial étendait le repli à
 * toutes les locales ; la mesure a établi qu'il ne servait alors QUE le chemin
 * fr/es, qu'aucune page n'emprunte — les 64 liens gagnés sont tous en `en`. Le
 * garde-fou d'origine est donc RÉTABLI, et il rouvrira la question de lui-même le
 * jour où une locale publiera des pages piliers.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { entityHref, PILLARS } from './pillars';
import { hasRecordPage, recordPagePath } from '@/lib/registry/publishedRecords';

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');
const RECORD_IDS = readdirSync(DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.split('_')[0])
  .sort();

const WITH_PILLAR = PILLARS.filter((p) => p.recordId).map((p) => p.recordId!);

describe('ÉTAT D’ORIGINE — inchangé par l’amendement', () => {
  it('un Record AVEC pilier résout vers sa page pilier localisée', () => {
    for (const id of WITH_PILLAR) {
      const slug = PILLARS.find((p) => p.recordId === id)!.slug;
      expect(entityHref(id, 'en'), id).toBe(`/en/${slug}`);
    }
  });

  it('les 7 Records à pilier sont exactement ceux du registre', () => {
    expect(WITH_PILLAR.sort()).toEqual(
      ['OCR-100', 'OCR-101', 'OCR-105', 'OCR-107', 'OCR-110', 'OCR-115', 'OCR-124'].sort(),
    );
  });

  it('une locale non traduite ne résout jamais — GARDE-FOU RÉTABLI', () => {
    // Cette assertion avait été amendée lors de l'extension d'entityHref. La mesure
    // a établi que l'amendement ne servait QUE le chemin fr/es, qu'aucune page
    // n'emprunte : les 64 liens gagnés sont tous en `en`. Le garde-fou est donc
    // rétabli, et l'étape 2 de la chaîne bornée à la locale canonique.
    expect(entityHref('OCR-110', 'fr')).toBeNull();
    expect(entityHref('OCR-110', 'es')).toBeNull();
  });

  it('un Record SANS pilier ne résout pas davantage hors locale canonique', () => {
    expect(entityHref('OCR-114', 'en')).toBe('/records/ocr-114');
    expect(entityHref('OCR-114', 'fr')).toBeNull();
    expect(entityHref('OCR-114', 'es')).toBeNull();
  });

  it('un identifiant inconnu ne résout jamais', () => {
    expect(entityHref('OCR-999', 'en')).toBeNull();
  });

  it('le corpus compte 33 Records, dont 26 SANS pilier', () => {
    expect(RECORD_IDS).toHaveLength(33);
    expect(RECORD_IDS.filter((id) => !WITH_PILLAR.includes(id))).toHaveLength(26);
  });
});

describe('AMENDEMENT — la chaîne de résolution, dans l’ordre strict', () => {
  it('1. le pilier PRIME quand il existe dans la locale', () => {
    expect(entityHref('OCR-110', 'en')).toBe('/en/evidence');
    expect(hasRecordPage('OCR-110')).toBe(true); // la page Record existe AUSSI
  });

  it('2. à défaut de pilier, la page Record — non localisée', () => {
    for (const id of RECORD_IDS.filter((x) => !WITH_PILLAR.includes(x))) {
      expect(entityHref(id, 'en'), id).toBe(recordPagePath(id));
      expect(entityHref(id, 'en'), id).not.toContain('/en/');
      expect(entityHref(id, 'fr'), id).toBeNull(); // borné à la locale canonique
    }
  });

  it('3. à défaut des deux, null — jamais une destination fabriquée', () => {
    expect(hasRecordPage('OCR-999')).toBe(false);
    expect(entityHref('OCR-999', 'en')).toBeNull();
    expect(entityHref('OCR-999', 'fr')).toBeNull();
  });

  it('les 33 Records résolvent tous EN LOCALE CANONIQUE, aucun ne reste muet', () => {
    for (const id of RECORD_IDS) expect(entityHref(id, 'en'), id).not.toBeNull();
  });

  it('aucun href ne pointe vers une page NON générée', () => {
    for (const id of RECORD_IDS) {
      const href = entityHref(id, 'en')!;
      if (href.startsWith('/records/')) {
        expect(hasRecordPage(href.replace('/records/', '')), href).toBe(true);
      }
    }
  });
});
