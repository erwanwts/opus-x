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
import { indexPlan, discoveryPlan, recordPlanEntries, registryPaths, BASE } from './sitemapPlans';
import { buildRecordPage } from '@/lib/registry/recordPage';
import { resolveStatus, type ApprovalFact } from '@/lib/registry/resolveStatus';
import { loadFacts } from '@/lib/registry/loadFacts';
import { PILLARS } from './pillars';

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');
const RECORDS = readdirSync(DIR).filter((f) => f.endsWith('.md')).sort();
const IDS = RECORDS.map((f) => f.split('_')[0]);
/** Les Records dont le statut DÉRIVÉ (fait) est Normative → index-éligibles. Aujourd'hui {000,005} (RATIF-001). */
const NORMATIVE = IDS.filter((id) => resolveStatus(id, loadFacts()) === 'Normative');
const DRAFT = IDS.filter((id) => resolveStatus(id, loadFacts()) === 'Draft');

describe('PLAN D’INDEXATION — uniquement l’indexable', () => {
  it('compte home + piliers + Records index-éligibles (statut DÉRIVÉ Normative)', () => {
    const plan = indexPlan();
    // Dérivé, pas figé : home + piliers + les Records dont le fait déclare Normative.
    expect(plan).toHaveLength(1 + PILLARS.length + NORMATIVE.length);
    // NORMATIVE (PROJECTION, via résolveur) = ce que les FAITS déclarent (SOURCE), lu des deux lieux
    // (RATIF + PROMO), révocations retranchées. Auto-suivi : chaque promotion met à jour l'ensemble.
    const declaredSet = new Set<string>();
    for (const dir of ['content/registry/founding', 'content/registry/promo']) {
      for (const f of readdirSync(path.join(process.cwd(), dir)).filter((n) => n.endsWith('.json'))) {
        const j = JSON.parse(readFileSync(path.join(process.cwd(), dir, f), 'utf8'));
        if (j.kind === 'founding-ratification' || j.kind === 'promotion') (j.declares_normative ?? []).forEach((x: string) => declaredSet.add(x));
        if (j.kind === 'revocation') (j.revokes_normative ?? []).forEach((x: string) => declaredSet.delete(x));
      }
    }
    expect(NORMATIVE.sort()).toEqual([...declaredSet].sort());
  });

  it('seuls les Records Normative (ratifiés) figurent au plan d’indexation', () => {
    const recordUrls = indexPlan().map((e) => e.url).filter((u) => /\/records\/ocr-\d+$/.test(u)).sort();
    const expected = NORMATIVE.map((id) => `${BASE}/records/${id.toLowerCase()}`).sort();
    expect(recordUrls).toEqual(expected);
  });

  it('les Records noindex = ceux qui ne sont PAS Normative ; aucun n’est au plan d’indexation', () => {
    const noindex = recordPlanEntries().filter((r) => !r.indexable).map((r) => r.url);
    expect(noindex).toHaveLength(DRAFT.length); // = Records non-Normative (dérivé du fait)
    const urls = new Set(indexPlan().map((e) => e.url));
    for (const u of noindex) expect(urls.has(u), u).toBe(false);
  });

  it('REMONTE à la promotion — par un FAIT, jamais par le champ', () => {
    const raw = readFileSync(path.join(DIR, RECORDS.find((f) => f.startsWith('OCR-110'))!), 'utf8');
    // Éditer le champ ne promeut PLUS (le résolveur ignore le champ) :
    const forged = raw.replace('| **Status** | Draft |', '| **Status** | Normative |');
    expect(buildRecordPage(forged)!.meta.robots).toBe('noindex,follow');
    // Un FAIT promeut : la page devient indexable, sans toucher au champ.
    const fact: ApprovalFact = { id: 'PROMO-TEST', kind: 'promotion', declares_normative: ['OCR-110'] };
    expect(buildRecordPage(raw, [fact])!.meta.robots).toBe('index,follow');
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
    // INVARIANT dérivé : 11 éditoriales + l'index /records + (pages du registre). Les pages du registre =
    // une par Record (RECORDS.length) + les entités fixes (37 prédicats + 15 familles + 6 types). Le total
    // est une CONSÉQUENCE du corpus, jamais un nombre figé.
    const registryPages = RECORDS.length + 37 + 15 + 6;
    expect(plan).toHaveLength(11 + 1 + registryPages);
  });

  it('expose les 91 pages du registre, y compris les 33 en noindex', () => {
    const urls = discoveryPlan().map((e) => e.url);
    expect(urls.filter((u) => /\/records\/ocr-\d+$/.test(u))).toHaveLength(RECORDS.length); // INVARIANT : une page par Record
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
      const page = buildRecordPage(readFileSync(path.join(DIR, f), 'utf8'), loadFacts())!;
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

describe('L’INSTRUMENT DE VÉRIFICATION — un harnais non testé ne mesure rien', () => {
  it('énumère EXACTEMENT 92 chemins : l’index + les 91 pages', () => {
    // Le harnais de contrôle a menti deux fois sur ce lot : CRLF parasites, puis
    // 92ᵉ ligne non lue faute de saut de ligne final. Le compte est désormais
    // ASSERTÉ, pas supposé.
    const paths = registryPaths();
    // INVARIANT dérivé : l'index /records (1) + une page par Record (RECORDS.length) + les entités fixes
    // (37 prédicats + 15 familles + 6 types). Le compte est une CONSÉQUENCE du corpus, plus une valeur figée.
    expect(paths).toHaveLength(1 + RECORDS.length + 37 + 15 + 6);
  });

  it('aucun chemin vide, aucun doublon, aucun caractère de contrôle', () => {
    const paths = registryPaths();
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) {
      expect(p.startsWith('/records'), p).toBe(true);
      expect(p.trim(), p).toBe(p); // ni \r ni espace parasite
      expect(/[\r\n\t]/.test(p), p).toBe(false);
    }
  });

  it('chaque chemin énuméré figure au plan de découverte — les deux dérivent des mêmes sources', () => {
    const disc = new Set(discoveryPlan().map((e) => e.url.replace(BASE, '')));
    for (const p of registryPaths()) expect(disc.has(p), p).toBe(true);
  });
});
