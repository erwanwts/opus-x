/**
 * Forme canonique (RFC 8785 / JCS) — vérifiée contre les CAS OFFICIELS du RFC,
 * pas le README. Sorties confirmées avec canonicalize@3.0.0 (erdtman, co-auteur
 * du RFC 8785). Ce module est sur le chemin critique : ces assertions gardent
 * la stabilité perpétuelle de chaque canonical_hash.
 */
import { describe, it, expect } from 'vitest';
import {
  canonicalJson,
  canonicalHash,
  CANONICALIZATION_ALGORITHM,
  HASH_ALGORITHM,
} from './canonical';

const CTRL_0F = String.fromCharCode(0x0f);
const NL = String.fromCharCode(10);
const ALGO = { canonicalization_algorithm: 'RFC8785', hash_algorithm: 'SHA-256' };

describe('canonical — RFC 8785 (JCS)', () => {
  it('tri des clés par unités de code UTF-16', () => {
    expect(canonicalJson({ b: 1, a: 2, 'é': 3, '10': 4, '2': 5 })).toBe(
      '{"10":4,"2":5,"a":2,"b":1,"é":3}'
    );
  });

  it('nombres ECMAScript (annexe RFC 8785)', () => {
    expect(
      canonicalJson({
        numbers: [333333333.33333329, 1e30, 4.5, 2e-3, 0.000000000000000000000000001],
      })
    ).toBe('{"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27]}');
  });

  it('échappement Unicode : contrôle → \\u000f · saut de ligne → \\n · € littéral', () => {
    expect(canonicalJson({ s: CTRL_0F + NL + '€' })).toBe('{"s":"\\u000f\\n€"}');
  });

  it('LE cas qui compte — 3 et 3.0 produisent la MÊME sortie', () => {
    expect(canonicalJson({ x: 3 })).toBe(canonicalJson({ x: 3.0 }));
    expect(canonicalJson({ x: 3 })).toBe('{"x":3}');
  });

  it('timestamp — 3 décimales ≠ sans décimales (POURQUOI §5.3 normalise)', () => {
    // Deux instants identiques, deux octets différents → deux hash différents.
    // C'est le builder O2b qui normalise à .SSSZ pour qu'ils coïncident.
    expect(canonicalJson({ t: '2026-07-20T14:32:00Z' })).not.toBe(
      canonicalJson({ t: '2026-07-20T14:32:00.000Z' })
    );
  });

  it('hash indépendant de l’ordre d’insertion des clés (même objet → même hash)', () => {
    const a = canonicalHash({ ...ALGO, skill_id: 'wtr:212', occurred_at: '2026-07-20T14:32:00.000Z' });
    const b = canonicalHash({ occurred_at: '2026-07-20T14:32:00.000Z', skill_id: 'wtr:212', ...ALGO });
    expect(a.hash).toBe(b.hash);
    expect(a.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(a.canonicalization_algorithm).toBe(CANONICALIZATION_ALGORITHM);
    expect(a.hash_algorithm).toBe(HASH_ALGORITHM);
  });

  it('§5.1.4 — sans les champs d’algo DANS l’objet → rejet', () => {
    expect(() => canonicalHash({ skill_id: 'wtr:212' })).toThrow(/5\.1\.4/);
  });

  it('§5.4.2 — null interdit dans le payload haché', () => {
    expect(() => canonicalHash({ ...ALGO, x: null })).toThrow(/null interdit/);
  });

  it('§5.2.6 — NaN / Infinity rejetés avant canonicalisation', () => {
    expect(() => canonicalJson({ x: NaN })).toThrow(/non finie/);
    expect(() => canonicalJson({ x: Infinity })).toThrow(/non finie/);
  });
});
