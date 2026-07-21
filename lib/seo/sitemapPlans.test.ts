/**
 * LES DEUX PLANS DE SITE — une seule décision, deux projections (RD-011).
 *
 * L'invariant vérifié ici n'est pas le contenu des plans mais leur **chaîne de
 * dérivation** : le plan d'indexation ne doit jamais relire le statut du Record,
 * il dérive de `robots`, qui en dérive déjà. Une seconde lecture du statut serait
 * une seconde logique décisionnelle — exactement ce que RD-011 interdit.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { indexPlan, discoveryPlan, recordPlanEntries, BASE } from './sitemapPlans';
import { buildRecordPage } from '@/lib/registry/recordPage';
import { PILLARS } from './pillars';

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');
const RECORDS = readdirSync(DIR).filter((f) => f.endsWith('.md')).sort();

describe('PLAN D’INDEXATION — uniquement l’indexable', () => {
  it('compte 11 URLs aujourd’hui : la home et les 10 piliers publiés', () => {
    const plan = indexPlan();
    expect(plan).toHaveLength(1 + PILLARS.length);
    expect(plan).toHaveLength(11);
  });

  it('AUCUNE page de Record — les 33 sont en Draft', () => {
    const urls = indexPlan().map((e) => e.url);
    expect(urls.filter((u) => u.includes('/records/'))).toEqual([]);
  });

  it('ne déclare jamais une URL en noindex — les deux signaux ne se contredisent pas', () => {
    const noindex = recordPlanEntries().filter((r) => !r.indexable).map((r) => r.url);
    expect(noindex).toHaveLength(33);
    const urls = new Set(indexPlan().map((e) => e.url));
    for (const u of noindex) expect(urls.has(u), u).toBe(false);
  });

  it('REMONTE de lui-même à la promotion, sans intervention', () => {
    // Le seul champ modifié est Status : la page devient indexable, donc éligible.
    const raw = readFileSync(path.join(DIR, RECORDS.find((f) => f.startsWith('OCR-110'))!), 'utf8');
    const promoted = raw.replace('| **Status** | Draft |', '| **Status** | Normative |');
    expect(buildRecordPage(promoted)!.meta.robots).toBe('index,follow');
  });

  it('les clusters hreflang restent limités aux locales traduites', () => {
    for (const e of indexPlan()) {
      if (!e.languages) continue;
      expect(Object.keys(e.languages)).toEqual(['en']);
    }
  });
});

describe('PLAN DE DÉCOUVERTE — tout le corpus publié', () => {
  it('compte 103 URLs : 11 éditoriales + l’index + les 91 pages du registre', () => {
    // ⚠️ ÉCART SIGNALÉ : l'architecture annonce 102 (11 + 91). Le 103ᵉ est l'INDEX
    // /records lui-même, qui n'est aucune des 91 pages mais est bien une URL
    // publiée et découvrable. Mesuré, non arrondi.
    const plan = discoveryPlan();
    expect(plan).toHaveLength(11 + 1 + 91);
    expect(plan).toHaveLength(103);
  });

  it('expose les 91 pages du registre, y compris les 33 en noindex', () => {
    const urls = discoveryPlan().map((e) => e.url);
    expect(urls.filter((u) => /\/records\/ocr-\d+$/.test(u))).toHaveLength(33);
    expect(urls.filter((u) => u.includes('/records/predicates/'))).toHaveLength(37);
    expect(urls.filter((u) => u.includes('/records/families/'))).toHaveLength(15);
    expect(urls.filter((u) => u.includes('/records/types/'))).toHaveLength(6);
    expect(urls).toContain(`${BASE}/records`);
  });

  it('contient STRICTEMENT le plan d’indexation, plus le corpus', () => {
    const disc = new Set(discoveryPlan().map((e) => e.url));
    for (const e of indexPlan()) expect(disc.has(e.url), e.url).toBe(true);
    expect(disc.size).toBeGreaterThan(indexPlan().length);
  });
});

describe('CHAÎNE DE DÉRIVATION — un seul maillon décisionnel (RD-011)', () => {
  it('le verdict d’indexation vient de `robots`, jamais d’une relecture du statut', () => {
    for (const f of RECORDS) {
      const page = buildRecordPage(readFileSync(path.join(DIR, f), 'utf8'))!;
      const entry = recordPlanEntries().find((r) => r.url.endsWith(page.id.toLowerCase()))!;
      expect(entry.indexable, page.id).toBe(page.meta.robots === 'index,follow');
    }
  });

  it('les deux plans partent de la MÊME source — aucune divergence possible', () => {
    // Si l'un relisait le statut pour son compte, ce test finirait par diverger.
    const byUrl = new Map(recordPlanEntries().map((r) => [r.url, r.indexable]));
    const inIndex = new Set(indexPlan().map((e) => e.url));
    for (const [url, indexable] of byUrl) expect(inIndex.has(url), url).toBe(indexable);
  });
});
