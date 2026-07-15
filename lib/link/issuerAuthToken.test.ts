/**
 * Jeton d'autorisation (Lot O2a) — discipline « clé d'API » :
 * aléatoire, préfixé neutre (W7), hashé de façon déterministe.
 */
import { describe, it, expect } from 'vitest';
import {
  generateLinkToken,
  hashLinkToken,
  LINK_TOKEN_PREFIX,
} from './issuerAuthToken';

describe('issuerAuthToken', () => {
  it('génère un jeton préfixé, neutre (jamais un nom d’Issuer)', () => {
    const token = generateLinkToken();
    expect(token.startsWith(LINK_TOKEN_PREFIX)).toBe(true);
    expect(token.toLowerCase()).not.toContain('commando');
    expect(token.length).toBeGreaterThan(LINK_TOKEN_PREFIX.length + 40);
  });

  it('génère des jetons uniques', () => {
    const a = generateLinkToken();
    const b = generateLinkToken();
    expect(a).not.toBe(b);
  });

  it('hashe de façon déterministe (SHA-256 hex, 64 car.)', () => {
    const token = 'wsplnk_exemple';
    const h1 = hashLinkToken(token);
    const h2 = hashLinkToken(token);
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[0-9a-f]{64}$/);
    // Le hash ne contient jamais le clair.
    expect(h1).not.toContain(token);
  });

  it('des jetons différents produisent des hash différents', () => {
    expect(hashLinkToken(generateLinkToken())).not.toBe(hashLinkToken(generateLinkToken()));
  });
});
