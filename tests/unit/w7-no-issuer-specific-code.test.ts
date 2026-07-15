/**
 * =====================================================================
 * W7 — AUCUN CODE SPÉCIFIQUE À UN ISSUER (SPRINT-002 §4, matrice QA)
 * =====================================================================
 * « Une recherche de la chaîne "commando" (insensible à la casse) dans le
 *   code d'Opus X ne renvoie AUCUN résultat, hors documentation et données
 *   de test. »
 *
 * Test STRUCTUREL : on scanne le code source d'Opus X (app/, lib/,
 * supabase/migrations/) et on échoue si le nom d'un Issuer particulier y
 * apparaît. Le système est multi-Issuer PAR CONCEPTION (D9) : aucune table,
 * colonne, route, variable ou logique conditionnelle ne nomme un Issuer.
 *
 * Exclusions LÉGITIMES (spec) : la documentation (docs/) et les données/
 * fichiers de test — un Issuer d'exemple y est nommé pour éprouver la chaîne.
 * =====================================================================
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../../');

// Répertoires de code d'Opus X à auditer (jamais docs/, jamais node_modules).
const SCAN_DIRS = ['app', 'lib', 'supabase/migrations'];

// Noms d'Issuers particuliers qui ne doivent JAMAIS apparaître dans le code.
const FORBIDDEN = [/commando/i];

// Fichiers exclus : tests (données de test légitimes) et cartes de types.
function isExcluded(file: string): boolean {
  return /\.test\.[cm]?tsx?$/.test(file) || file.endsWith('.d.ts');
}

function walk(dir: string, acc: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === '.next' || entry === 'dist') continue;
      walk(full, acc);
    } else if (!isExcluded(full)) {
      acc.push(full);
    }
  }
  return acc;
}

describe('W7 — aucun code spécifique à un Issuer', () => {
  it('la chaîne « commando » (et tout nom d’Issuer) est absente du code d’Opus X', () => {
    const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
    // Garde-fou : on a bien scanné quelque chose (sinon le test serait vert à vide).
    expect(files.length).toBeGreaterThan(0);

    const hits: string[] = [];
    for (const file of files) {
      let content: string;
      try {
        content = readFileSync(file, 'utf8');
      } catch {
        continue;
      }
      for (const pattern of FORBIDDEN) {
        if (pattern.test(content)) {
          hits.push(`${path.relative(ROOT, file)} → ${pattern}`);
        }
      }
    }

    expect(hits, `Nom d'Issuer trouvé dans le code d'Opus X :\n${hits.join('\n')}`).toEqual([]);
  });
});
