/**
 * INVARIANT DE PROJECTION — le test qui valide le moteur de rendu.
 *
 * « Le nombre de caractères significatifs du corps publié doit être identique avant
 *   et après projection, à l'exception des transformations explicitement autorisées
 *   par le moteur de rendu. »
 *
 * Il porte sur le TEXTE, jamais sur le HTML : c'est ce qui le rend insensible à la
 * mise en forme et sensible à la PERTE DE CONTENU. Le corpus vient du dépôt — le
 * risque n'est pas l'injection, c'est qu'une séquence disparaisse en silence.
 *
 * MÉTHODE — comme pour l'extraction de `routeKind`, le contrôle central n'est pas
 * une attente écrite à la main : c'est la confrontation du moteur à un ORACLE
 * INDÉPENDANT, qui retire les 11 marqueurs autorisés sans rien savoir du moteur.
 * Deux implémentations comparées sur les 33 Records.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { parseRecordBody, projectedText, nonBlank, inlineSpans } from './markdown';

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');

function recordBodies(): { id: string; body: string }[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => {
      const raw = readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n');
      return { id: f.split('_')[0], body: raw.split('\n').slice(1).join('\n') };
    });
}

/**
 * ORACLE — retire les SEULS 11 marqueurs autorisés. Écrit indépendamment du
 * moteur, sans partager une ligne avec lui. Les blocs de code sont opaques.
 */
function stripAuthorizedMarkers(body: string): string {
  const out: string[] = [];
  for (const part of body.split(/(^```[\s\S]*?^```)/m)) {
    if (part.startsWith('```')) {
      out.push(part.split('\n').slice(1, -1).join('\n')); // contenu, sans les clôtures
      continue;
    }
    const lines: string[] = [];
    for (let l of part.split('\n')) {
      if (/^---+\s*$/.test(l)) continue;
      if (/^\|[\s:|-]+\|$/.test(l)) continue;
      l = l.replace(/^#{1,4} +/, '');
      l = l.replace(/^(\s*)[-*+] +/, '$1');
      l = l.replace(/^(\s*)\d+\. +/, '$1');
      l = l.replace(/^> ?/, '');
      if (l.startsWith('|')) l = l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim()).join(' ');
      l = l.replace(/\*\*([^*\n]+)\*\*/g, '$1');
      l = l.replace(/\*([^*\n]+)\*/g, '$1');
      l = l.replace(/`([^`\n]+)`/g, '$1');
      lines.push(l);
    }
    out.push(lines.join('\n'));
  }
  return out.join('\n');
}

const PSEUDO = /<[a-zA-Z][a-zA-Z0-9_ -]*>/g;
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;

const RECORDS = recordBodies();

describe('INVARIANT — caractères non blancs conservés, Record par Record', () => {
  it.each(RECORDS.map((r) => [r.id, r.body] as const))(
    '%s — projection == source moins les seuls marqueurs autorisés',
    (id, body) => {
      const projected = projectedText(parseRecordBody(body));
      expect(nonBlank(projected), `${id} : caractères non blancs`).toBe(
        nonBlank(stripAuthorizedMarkers(body)),
      );
    },
  );

  it('sur le corpus entier — aucun caractère significatif perdu', () => {
    let src = 0;
    let out = 0;
    for (const { body } of RECORDS) {
      src += nonBlank(stripAuthorizedMarkers(body));
      out += nonBlank(projectedText(parseRecordBody(body)));
    }
    expect(out).toBe(src);
    expect(out).toBeGreaterThan(400_000); // le corpus est bien parcouru en entier
  });
});

describe('PSEUDO-BALISES — traitées comme du texte, jamais comme du balisage', () => {
  it.each(RECORDS.map((r) => [r.id, r.body] as const))(
    '%s — chaque séquence <…> survit, au même compte',
    (id, body) => {
      const projected = projectedText(parseRecordBody(body));
      const before = body.match(PSEUDO) ?? [];
      const after = projected.match(PSEUDO) ?? [];
      const tally = (xs: string[]) =>
        xs.reduce<Record<string, number>>((a, x) => ((a[x] = (a[x] ?? 0) + 1), a), {});
      expect(tally(after), `${id} : pseudo-balises`).toEqual(tally(before));
    },
  );

  it('le corpus en compte 73, et les 73 survivent', () => {
    let before = 0;
    let after = 0;
    for (const { body } of RECORDS) {
      before += count(body, PSEUDO);
      after += count(projectedText(parseRecordBody(body)), PSEUDO);
    }
    expect(before).toBe(73);
    expect(after).toBe(73);
  });

  it("CAS RÉEL D'OCR-110 — `<level>` en code inline survit au retrait des accents graves", () => {
    // Extrait VERBATIM du corpus. Le rendu retire légitimement les accents graves
    // (transformation n° 5) ; `<level>` se retrouve alors en TEXTE NU. Remis à
    // innerHTML il disparaîtrait : « Levels shown as  are placeholders ».
    const src =
      '> Levels shown as `<level>` are placeholders. Levels are defined by the Framework and published by Opus X.';
    const text = projectedText(parseRecordBody(src));
    expect(text).toContain('<level>');
    expect(text).toContain('Levels shown as <level> are placeholders.');
    expect(text).not.toContain('`'); // les accents graves, eux, sont bien retirés
  });

  it("CAS RÉEL D'OCR-110 — la pseudo-balise dans un objet JSON inline survit", () => {
    const src = '- **Criterion Levels** — the object mapping each criterion, e.g. `{ "S03.C08": <level> }`.';
    const text = projectedText(parseRecordBody(src));
    expect(text).toContain('{ "S03.C08": <level> }');
    expect(text).toContain('Criterion Levels');
  });
});

describe('OPACITÉ DES BLOCS DE CODE — aucune transformation à l’intérieur', () => {
  it('une pseudo-balise vivant dans un bloc de code ressort à l’identique', () => {
    const src = ['```json', '{', '  "opus_id": "<opus_id>",', '  "digest": "<jcs-digest>"', '}', '```'].join('\n');
    const [block] = parseRecordBody(src);
    expect(block.kind).toBe('code');
    if (block.kind === 'code') {
      expect(block.lang).toBe('json');
      expect(block.text).toBe('{\n  "opus_id": "<opus_id>",\n  "digest": "<jcs-digest>"\n}');
    }
  });

  it('gras, italique, code inline et puces ne sont PAS interprétés dans un bloc de code', () => {
    const src = ['```json', '{ "a": "**pas du gras**", "b": "*pas un italique*" }', '- pas une puce', '# pas un titre', '```'].join('\n');
    const [block] = parseRecordBody(src);
    if (block.kind !== 'code') throw new Error('bloc de code attendu');
    expect(block.text).toContain('**pas du gras**');
    expect(block.text).toContain('*pas un italique*');
    expect(block.text).toContain('- pas une puce');
    expect(block.text).toContain('# pas un titre');
  });

  it('les 52 blocs de code du corpus ressortent à l’octet près', () => {
    let checked = 0;
    for (const { body } of RECORDS) {
      const fences = body.match(/^```[\s\S]*?^```/gm) ?? [];
      const codes = parseRecordBody(body).filter((b) => b.kind === 'code');
      expect(codes.length).toBe(fences.length);
      for (let i = 0; i < fences.length; i++) {
        const inner = fences[i].split('\n').slice(1, -1).join('\n');
        const block = codes[i];
        if (block.kind === 'code') expect(block.text).toBe(inner);
        checked++;
      }
    }
    expect(checked).toBe(52);
  });
});

describe('ORDRE DE RETRAIT — le gras avant l’italique', () => {
  it('`**gras**` est un gras, jamais un italique contenant un astérisque', () => {
    const spans = inlineSpans('**gras**');
    expect(spans).toEqual([{ text: 'gras', strong: true }]);
  });

  it('gras et italique coexistent sans se confondre', () => {
    const spans = inlineSpans('un **gras** et un *italique* ensemble');
    expect(spans.filter((s) => s.strong).map((s) => s.text)).toEqual(['gras']);
    expect(spans.filter((s) => s.em).map((s) => s.text)).toEqual(['italique']);
    expect(spans.map((s) => s.text).join('')).toBe('un gras et un italique ensemble');
  });

  it('le code inline conserve son texte, même s’il ressemble à du balisage', () => {
    expect(inlineSpans('`<level>`')).toEqual([{ text: '<level>', code: true }]);
  });
});

describe('EXHAUSTIVITÉ — le corpus n’emploie que les 11 constructions autorisées', () => {
  it('aucun lien ni image dans le corpus', () => {
    for (const { id, body } of RECORDS) {
      const prose = body.split(/(^```[\s\S]*?^```)/m).filter((p) => !p.startsWith('```')).join('\n');
      expect(count(prose, /\[[^\]]+\]\([^)]+\)/g), `${id} : liens`).toBe(0);
      expect(count(prose, /!\[/g), `${id} : images`).toBe(0);
    }
  });

  it('tous les blocs de code sont en json — un seul langage à rendre', () => {
    for (const { body } of RECORDS) {
      for (const b of parseRecordBody(body)) {
        if (b.kind === 'code') expect(b.lang).toBe('json');
      }
    }
  });
});
