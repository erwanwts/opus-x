/**
 * Garde du DECISIONS-LOG — même classe que `manifest.attestation`, autorisé.
 *
 * Motif : le contrôle du 2026-07-25 a débusqué une **impossibilité temporelle** —
 * D-016/D-017 citaient `c678947` comme commit d'application, or ce commit est
 * ANTÉRIEUR au rendu des décisions (il ne les mentionne même pas). Une trace non
 * testée n'atteste pas (proposition (6), 2ᵉ occurrence). Ce garde teste ce qui
 * aurait attrapé l'écart sans l'humain.
 *
 * Deux colonnes du log : « Inscrite par » (rendu gravé) et « Appliquée par (code
 * existe) ». Pour chaque décision de la table principale, ce test assère :
 *   A. tout commit cité EXISTE (`git cat-file`) ;
 *   B. le commit « Inscrite par » **mentionne l'id de la décision** (`git show`)
 *      — une citation sans rapport (ex. c678947 pour D-016) échoue ;
 *   C. quand les deux colonnes portent un commit,
 *      **date(appliquée) ≥ date(inscrite)** — une application antérieure à son
 *      inscription est l'anachronisme même que le contrôle a trouvé.
 *
 * Prouvé par mutation (dernier bloc) : citer c678947 en « appliquée » pour D-016
 * viole B **et** C.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const LOG = path.join(process.cwd(), 'docs/registry/DECISIONS-LOG.md');

interface Row {
  id: string;
  inscrite: string | null; // 1er commit cité de la colonne « Inscrite par »
  appliquee: string | null; // 1er commit cité de la colonne « Appliquée par »
}

/** 1er SHA (7–40 hex, entre backticks) d'une cellule, ou null. Ignore les notes en aval. */
function firstSha(cell: string | undefined): string | null {
  const m = (cell ?? '').match(/`([0-9a-f]{7,40})`/);
  return m ? m[1] : null;
}

/** Parse la table principale (jusqu'à la 1ʳᵉ ligne hors `|` après l'en-tête). */
function parseMainTable(): Row[] {
  const lines = readFileSync(LOG, 'utf8').split(/\r?\n/);
  const rows: Row[] = [];
  let inTable = false;
  for (const l of lines) {
    if (/^\|\s*Décision\s*\|/.test(l)) { inTable = true; continue; }
    if (!inTable) continue;
    if (!/^\|/.test(l)) break; // fin de la table principale
    if (/^\|\s*-+/.test(l)) continue; // séparateur
    const cells = l.split('|').map((c) => c.trim()); // ['', déc, objet, état, inscrite, appliquée, '']
    const idm = cells[1]?.match(/D-0\d{2}/);
    if (!idm) continue;
    rows.push({ id: idm[0], inscrite: firstSha(cells[4]), appliquee: firstSha(cells[5]) });
  }
  return rows;
}

const exists = (sha: string): boolean => {
  // NB : pas de suffixe `^{commit}` — sous Windows, execSync passe par cmd.exe où
  // `^` est un caractère d’échappement. `cat-file -e <sha>` suffit (ce sont des commits).
  try { execSync(`git cat-file -e ${sha}`, { stdio: 'ignore' }); return true; }
  catch { return false; }
};
const mentions = (sha: string, id: string): boolean =>
  execSync(`git show --format=%B --stat ${sha}`, { encoding: 'utf8' }).includes(id);
const committerDate = (sha: string): number =>
  Number(execSync(`git show -s --format=%ct ${sha}`, { encoding: 'utf8' }).trim());

describe('DECISIONS-LOG — garde inscrite/appliquée (anti-anachronisme)', () => {
  const rows = parseMainTable();

  it('la table principale est lue (≥ 17 décisions D-0xx)', () => {
    expect(rows.length).toBeGreaterThanOrEqual(17);
  });

  it('A — tout commit cité (inscrite | appliquée) existe', () => {
    const missing: string[] = [];
    for (const r of rows) {
      for (const sha of [r.inscrite, r.appliquee]) {
        if (sha && !exists(sha)) missing.push(`${r.id}:${sha}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('B — le commit « Inscrite par » mentionne l’id de la décision', () => {
    const orphan: string[] = [];
    for (const r of rows) {
      if (r.inscrite && !mentions(r.inscrite, r.id)) orphan.push(`${r.id}:${r.inscrite}`);
    }
    expect(orphan).toEqual([]);
  });

  it('C — quand les deux existent, date(appliquée) ≥ date(inscrite)', () => {
    const anachronisms: string[] = [];
    for (const r of rows) {
      if (r.inscrite && r.appliquee) {
        if (committerDate(r.appliquee) < committerDate(r.inscrite)) {
          anachronisms.push(`${r.id}: appliquée ${r.appliquee} < inscrite ${r.inscrite}`);
        }
      }
    }
    expect(anachronisms).toEqual([]);
  });

  // Preuve par mutation : la citation qui a été débusquée DOIT échouer aux gardes.
  it('MUTATION — c678947 cité pour D-016 échoue B et C', () => {
    const bad = 'c678947';
    const good = 'abbdd03'; // l’inscription réelle de D-016
    expect(exists(bad)).toBe(true); // le commit existe (A ne suffit pas)…
    expect(mentions(bad, 'D-016')).toBe(false); // …mais il ne mentionne pas D-016 (B échoue)
    expect(committerDate(bad)).toBeLessThan(committerDate(good)); // …et il précède l’inscription (C échoue)
  });
});
