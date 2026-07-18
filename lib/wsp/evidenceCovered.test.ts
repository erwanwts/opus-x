/**
 * Objet couvert §6.1 — whitelist, tri des critères (§5.5.3), normalisation des
 * horodatages (§5.3), exclusion de canonical_hash (§6.2).
 */
import { describe, it, expect } from 'vitest';
import { buildCoveredObject, normalizeTimestamp } from './evidenceCovered';
import { canonicalHash } from './canonical';

const RAW = {
  protocol_version: '1.0',
  type: 'evidence',
  schema_version: '1.0',
  canonicalization_algorithm: 'RFC8785',
  hash_algorithm: 'SHA-256',
  issuer: { id: 'issuer:x', evidence_id: 'pu_01', attested_by: { actor_id: 'a-1', role: 'coach' } },
  subject: { opus_id: 'opx_01K7' },
  framework: { id: 'framework:wtr', version: '0.1' },
  demonstrates: { skill_id: 'wtr:212', claimed_level: 'applied' },
  observation: { criteria: ['S08.C06', 'S03.C08'], criterion_levels: { 'S03.C08': 3 } },
  provenance: { evidence_ref: { kind: 'mission_result', id: 'uuid-1' } },
  occurred_at: '2026-07-20T14:32:00Z',
  attested_at: '2026-07-20T14:35:12.480Z',
  is_declaration: false,
  canonical_hash: 'ignored-here',
};

describe('normalizeTimestamp', () => {
  it('rend .SSSZ exactement (§5.3)', () => {
    expect(normalizeTimestamp('2026-07-20T14:32:00Z')).toBe('2026-07-20T14:32:00.000Z');
    expect(normalizeTimestamp('2026-07-20T14:35:12.480Z')).toBe('2026-07-20T14:35:12.480Z');
  });
  it('lève sur horodatage invalide', () => {
    expect(() => normalizeTimestamp('pas-une-date')).toThrow();
  });
});

describe('buildCoveredObject', () => {
  it('trie observation.criteria (§5.5.3)', () => {
    const o = buildCoveredObject(RAW);
    expect((o.observation as { criteria: string[] }).criteria).toEqual(['S03.C08', 'S08.C06']);
  });

  it('n’inclut PAS canonical_hash (§6.2) et porte les champs §6.1', () => {
    const o = buildCoveredObject(RAW);
    expect(o.canonical_hash).toBeUndefined();
    expect(Object.keys(o).sort()).toEqual(
      [
        'attested_at',
        'canonicalization_algorithm',
        'demonstrates',
        'framework',
        'hash_algorithm',
        'is_declaration',
        'issuer',
        'observation',
        'occurred_at',
        'provenance',
        'schema_version',
        'subject',
      ].sort()
    );
  });

  it('normalise les horodatages dans l’objet couvert', () => {
    const o = buildCoveredObject(RAW);
    expect(o.occurred_at).toBe('2026-07-20T14:32:00.000Z');
  });

  it('hash STABLE quel que soit l’ordre initial des critères', () => {
    const a = canonicalHash(buildCoveredObject(RAW));
    const b = canonicalHash(
      buildCoveredObject({ ...RAW, observation: { criteria: ['S03.C08', 'S08.C06'], criterion_levels: { 'S03.C08': 3 } } })
    );
    expect(a.hash).toBe(b.hash);
    expect(a.hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('un occurred_at à Z ou à .000Z produit le MÊME hash (normalisation §5.3)', () => {
    const a = canonicalHash(buildCoveredObject({ ...RAW, occurred_at: '2026-07-20T14:32:00Z' }));
    const b = canonicalHash(buildCoveredObject({ ...RAW, occurred_at: '2026-07-20T14:32:00.000Z' }));
    expect(a.hash).toBe(b.hash);
  });
});
