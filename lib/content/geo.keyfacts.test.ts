/**
 * Key Facts — projection SANS PERTE de Design Goals, garantie sur TOUT le corpus.
 * L'assertion vit dans keyFactsFromProse (throw si concat !== source) ; ce test
 * l'exerce sur les 32 Records. Si un futur Record fait perdre un caractère à la
 * projection, le test (et le build) casse — jamais un fait tronqué en silence.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { keyFactsFromProse } from './geo';

const DIR = path.join(process.cwd(), 'docs', 'web', 'registry-import', 'OCR-100');

function designGoals(md: string): string | undefined {
  const m = md.match(/\n## Design Goals\s*\n([\s\S]*?)(?=\n## |\n# |$)/);
  const body = m?.[1]?.trim();
  return body || undefined;
}

const records = readdirSync(DIR).filter((f) => f.endsWith('.md'));

describe('keyFactsFromProse — sans perte sur tout le corpus OCR-100', () => {
  it.each(records)('%s : Design Goals projeté sans perte (ou absent)', (file) => {
    const dg = designGoals(readFileSync(path.join(DIR, file), 'utf8'));
    // Ne doit JAMAIS jeter : l'assertion interne garantit concat === source.
    expect(() => keyFactsFromProse(dg)).not.toThrow();
    if (dg) expect(keyFactsFromProse(dg).length).toBeGreaterThan(0);
  });
});
