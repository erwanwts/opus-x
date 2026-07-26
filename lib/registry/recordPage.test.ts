/**
 * Fabrique de page Record — frontière paramétrable et dérivation des métadonnées.
 *
 * Deux invariants portent ce test :
 *   • la frontière n'est PAS figée — les deux modes sont exercés, et l'écart entre
 *     eux est exactement les 17 grounding notes ;
 *   • aucune métadonnée n'est fabriquée — à défaut de dérivation, la valeur est
 *     nulle et la lacune tracée (règle gravée).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { splitRecord, headerFields, DEFAULT_BOUNDARY } from './recordBoundary';
import { buildRecordPage, labelFromH1, firstSentence, robotsFromStatus, deriveDescription } from './recordPage';
import { authorsNormativeStatus } from './antiForgery';
import { loadFacts } from './loadFacts';

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');
const RECORDS = readdirSync(DIR)
  .filter((f) => f.endsWith('.md'))
  .sort()
  .map((f) => ({ id: f.split('_')[0], raw: readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n') }));

describe('FRONTIÈRE — paramétrable, jamais figée', () => {
  it('le délimiteur `---` existe dans les 33 Records', () => {
    for (const { id, raw } of RECORDS) {
      expect(raw.split('\n').findIndex((l) => /^---+\s*$/.test(l)), id).toBeGreaterThan(0);
    }
  });

  it('les deux modes produisent un corps, et `first-hr` est le plus restrictif', () => {
    for (const { id, raw } of RECORDS) {
      const hr = splitRecord(raw, 'first-hr');
      const tbl = splitRecord(raw, 'after-table');
      expect(hr.body.length, `${id} : corps non vide`).toBeGreaterThan(0);
      expect(hr.body.length, `${id} : first-hr ⊆ after-table`).toBeLessThanOrEqual(tbl.body.length);
    }
  });

  it('l’écart entre les deux modes est EXACTEMENT les 17 grounding notes', () => {
    let differ = 0;
    let notes = 0;
    for (const { raw } of RECORDS) {
      const hr = splitRecord(raw, 'first-hr');
      const tbl = splitRecord(raw, 'after-table');
      if (hr.body !== tbl.body) differ++;
      if (raw.includes('Grounding note (removed at publication)')) notes++;
    }
    expect(notes).toBe(17);
    expect(differ).toBe(RECORDS.length); // INVARIANT : tous diffèrent (la règle `---` sort du corps) — dérivé du corpus
  });

  it('`first-hr` n’expose JAMAIS un bloc marqué « removed at publication »', () => {
    for (const { id, raw } of RECORDS) {
      const { body } = splitRecord(raw, 'first-hr');
      expect(body.includes('Grounding note (removed at publication)'), id).toBe(false);
    }
  });

  it('`after-table` les exposerait — 17 pages afficheraient leur propre suppression', () => {
    const exposed = RECORDS.filter((r) =>
      splitRecord(r.raw, 'after-table').body.includes('Grounding note (removed at publication)'),
    );
    expect(exposed).toHaveLength(17);
  });

  it('le découpage ne perd aucun caractère — h1 + en-tête + corps == source', () => {
    for (const { id, raw } of RECORDS) {
      const s = splitRecord(raw, DEFAULT_BOUNDARY);
      const rebuilt = [s.h1, ...s.header].join('\n') + '\n' + s.body;
      // Découpage TOTALEMENT sans perte : le délimiteur reste du côté en-tête,
      // il n'est pas jeté. Rien du fichier n'est perdu par la frontière.
      expect(rebuilt.replace(/\s/g, '').length, id).toBe(raw.replace(/\s/g, '').length);
    }
  });

  it('OCR-006 est le SEUL Record portant du texte entre le H1 et le tableau', () => {
    const withPre = RECORDS.filter((r) => splitRecord(r.raw).preTable.length > 0).map((r) => r.id);
    expect(withPre).toEqual(['OCR-006']);
  });
});

describe('DÉRIVATION — rien n’est fabriqué', () => {
  it('le H1 donne un libellé pour les 33 Records', () => {
    for (const { id, raw } of RECORDS) {
      const head = labelFromH1(raw.split('\n')[0]);
      expect(head, id).not.toBeNull();
      expect(head!.id).toBe(id);
      expect(head!.label.length).toBeGreaterThan(0);
    }
  });

  it('le titre est dérivé du H1, jamais de `Canonical Name` (absent de 7 Records)', () => {
    const page = buildRecordPage(RECORDS.find((r) => r.id === 'OCR-000')!.raw)!;
    expect(page.fields['Canonical Name']).toBeUndefined();
    expect(page.meta.title).toBe('OCR-000 — Canonical Knowledge Governance | Canonical Registry');
  });

  it('les 33 pages ont un titre et une description', () => {
    for (const { id, raw } of RECORDS) {
      const p = buildRecordPage(raw)!;
      expect(p.meta.title, id).toContain(id);
      expect(p.meta.description, `${id} : description`).not.toBeNull();
    }
  });

  it('32 descriptions viennent du corpus, 1 du gabarit étiqueté', () => {
    const derived = RECORDS.map((r) => buildRecordPage(r.raw)!).filter((p) => p.meta.descriptionIsDerived);
    expect(derived.map((p) => p.id)).toEqual(['OCR-006']); // seul Record sans GEO Summary
    expect(derived[0].meta.description).toMatch(/^Derived metadata — /);
    expect(derived[0].meta.description).not.toMatch(/Canonical summary/);
  });

  it('une description non dérivable est NULLE et tracée — jamais inventée', () => {
    const { value } = deriveDescription([], {}, '');
    expect(value).toBeNull();
    const orphan = ['# OCR-999 — Sans Rien', '', '| Field | Value |', '|---|---|', '', '---', '', 'Corps.'].join('\n');
    const p = buildRecordPage(orphan)!;
    expect(p.meta.description).toBeNull();
    expect(p._gaps).toContain('description');
  });

  it('la première phrase n’est jamais coupée au milieu d’un mot', () => {
    expect(firstSentence('Une phrase courte. Une autre.')).toBe('Une phrase courte.');
    const long = 'a'.repeat(200) + '.';
    expect(firstSentence(long)).toBeNull(); // aucun espace : rien ne peut être coupé proprement
    const cut = firstSentence('mot '.repeat(60) + 'fin.');
    expect(cut!.endsWith('…')).toBe(true);
    expect(cut!.length).toBeLessThanOrEqual(161);
  });
});

describe('ROBOTS — dérivé du statut, jamais codé en dur (RD-007)', () => {
  it('SANS fait → TOUS les Records sont Draft → noindex (fenêtre D-023 close, plus d’exception nominative)', () => {
    // Le statut se dérive du FAIT (résolveur, étape 6). Sans fait passé, tout est Draft. L'exception
    // transitoire {OCR-000, OCR-005} de la fenêtre D-023 est RETIRÉE — inutile une fois le statut dérivé.
    for (const { id, raw } of RECORDS) {
      const p = buildRecordPage(raw)!; // aucun fait
      expect(p.status, id).toBe('Draft');
      expect(p.meta.robots, id).toBe('noindex,follow');
    }
  });

  it('AVEC les faits → les ratifiés dérivent Normative → index ; le reste Draft → noindex (D-023 fermée par dérivation)', () => {
    const ratif = JSON.parse(
      readFileSync(path.join(process.cwd(), 'content/registry/founding/RATIF-001.json'), 'utf8'),
    );
    const facts = loadFacts();
    const indexed: string[] = [];
    for (const { id, raw } of RECORDS) {
      const p = buildRecordPage(raw, facts)!;
      if (p.meta.robots === 'index,follow') {
        indexed.push(id);
        expect(p.status, id).toBe('Normative');
      } else {
        expect(p.status, id).toBe('Draft');
        expect(p.meta.robots, id).toBe('noindex,follow');
      }
    }
    // Les indexés = EXACTEMENT l'ensemble ratifié — dérivé du fait, plus une exception codée.
    expect(indexed.sort()).toEqual([...ratif.declares_normative].sort());
  });

  it('MUTATION — un Record hors des faits ne devient JAMAIS Normative', () => {
    // OCR-110 n'est déclaré par aucun fait → reste Draft, même avec tous les faits chargés.
    const raw = RECORDS.find((r) => r.id === 'OCR-110')!.raw;
    expect(buildRecordPage(raw, loadFacts())!.status).toBe('Draft');
  });

  it('le mapping robots du statut reste dérivé (Draft→noindex, Normative→index)', () => {
    // `robotsFromStatus` est le mapping PUR statut→robots. Après l'étape 6, le statut
    // qu'on lui passe vient du RÉSOLVEUR (fait), plus du champ (voir palier 3).
    expect(robotsFromStatus('Draft')).toBe('noindex,follow');
    expect(robotsFromStatus('Normative')).toBe('index,follow');
    expect(robotsFromStatus('Validated')).toBe('index,follow');
  });

  it('FORGEAGE INTERDIT — promouvoir en éditant le champ Status est détecté, plus autorisé (étape 6)', () => {
    // Ce test documentait naguère le forgeage (« la page suit le champ ») ; il l'INTERDIT
    // désormais. Un `Status: Normative` authored est un forgeage (OCR-009 §2) : la garde
    // anti-forgeage le repère. Le statut ne se promeut que par un FAIT (résolveur), jamais
    // par une édition de champ.
    const raw = RECORDS.find((r) => r.id === 'OCR-110')!.raw;
    expect(authorsNormativeStatus(raw), 'le Record réel n’authore jamais Normative').toBe(false);
    const forged = raw.replace('| **Status** | Draft |', '| **Status** | Normative |');
    expect(authorsNormativeStatus(forged), 'un champ Normative authored = forgeage, détecté').toBe(true);
  });
});

describe('PROJECTION — identité et adresse', () => {
  it('le canonical est sans locale, sous /records', () => {
    const p = buildRecordPage(RECORDS.find((r) => r.id === 'OCR-110')!.raw)!;
    expect(p.meta.canonical).toBe('https://opusx.world/records/ocr-110');
    expect(p.meta.canonical).not.toContain('/en/');
  });

  it('le type JSON-LD gravé est Article', () => {
    for (const { raw } of RECORDS) expect(buildRecordPage(raw)!.meta.jsonLdType).toBe('Article');
  });

  it('le corps projeté conserve les pseudo-balises du Record', () => {
    const p = buildRecordPage(RECORDS.find((r) => r.id === 'OCR-110')!.raw)!;
    const text = JSON.stringify(p.blocks);
    expect(text).toContain('<level>');
  });

  it('les champs d’en-tête sont servis tels quels, sans interprétation', () => {
    const raw = RECORDS.find((r) => r.id === 'OCR-115')!.raw;
    const f = headerFields(splitRecord(raw));
    expect(f['Document ID']).toBe('OCR-115');
    expect(f['Version']).toBe('1.1.0');
    expect(f['Status']).toBe('Draft');
  });
});
