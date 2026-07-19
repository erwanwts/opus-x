import { describe, it, expect } from 'vitest';
import { transitionalRedirects } from './transitional-redirects';

/**
 * Vérifie la redirection transitoire wtf → world-trader (compat migration).
 * 301 (permanent), cible canonique unique. C'est la SEULE survivance légitime
 * du slug `wtf` après migration.
 */
describe('transitionalRedirects', () => {
  it('redirige /frameworks/wtf/skills → /frameworks/world-trader/skills en 301', () => {
    const r = transitionalRedirects.find((x) => x.source === '/frameworks/wtf/skills');
    expect(r).toBeDefined();
    expect(r!.destination).toBe('/frameworks/world-trader/skills');
    expect(r!.statusCode).toBe(301); // 301 Moved Permanently (exigence architecte)
  });

  it('n’expose aucune autre survivance de wtf (une seule entrée transitoire)', () => {
    const withWtf = transitionalRedirects.filter((x) => /\bwtf\b/.test(x.source));
    expect(withWtf).toHaveLength(1);
    // La destination ne contient jamais wtf.
    for (const r of transitionalRedirects) expect(r.destination).not.toMatch(/wtf/);
  });
});
