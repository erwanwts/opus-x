/**
 * POST /issuers/evidence (Lot O2b) — mapping des rejets §8 et recalcul JS du
 * hash (Opus X ne fait jamais confiance au hash reçu).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
import { createPublicClient } from '@/lib/supabase/public';
import { HMAC_HEADERS } from '@/lib/issuer/hmac';
import { canonicalHash } from '@/lib/wsp/canonical';
import { buildCoveredObject } from '@/lib/wsp/evidenceCovered';
import { POST } from './route';

const mocked = vi.mocked(createPublicClient);
function withRpc(rpc: ReturnType<typeof vi.fn>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mocked.mockReturnValue({ rpc } as any);
}

const PAYLOAD = {
  type: 'evidence',
  schema_version: '1.0',
  canonicalization_algorithm: 'RFC8785',
  hash_algorithm: 'SHA-256',
  issuer: { id: 'issuer:x', evidence_id: 'pu_01', attested_by: { actor_id: 'a-1', role: 'coach' } },
  subject: { opus_id: 'opx_01K7' },
  framework: { id: 'framework:wtr', version: '0.1' },
  demonstrates: { skill_id: 'wtr:212', claimed_level: 'applied' },
  observation: { criteria: ['S03.C08'], criterion_levels: { 'S03.C08': 3 } },
  provenance: { evidence_ref: { kind: 'mission_result', id: 'uuid-1' } },
  occurred_at: '2026-07-20T14:32:00.000Z',
  attested_at: '2026-07-20T14:35:12.480Z',
  is_declaration: false,
  canonical_hash: 'whatever',
};

const goodHeaders = {
  [HMAC_HEADERS.issuer]: 'issuer:x',
  [HMAC_HEADERS.timestamp]: '1780000000',
  [HMAC_HEADERS.signature]: 'a'.repeat(64),
  'content-type': 'application/json',
};

function req(headers: Record<string, string>, body: string) {
  return new NextRequest('https://app.opus-x.test/issuers/evidence', { method: 'POST', headers, body });
}

beforeEach(() => vi.clearAllMocks());

describe('POST /issuers/evidence', () => {
  it('en-têtes HMAC manquants → 401 (auth d’abord)', async () => {
    const rpc = vi.fn();
    withRpc(rpc);
    const res = await POST(req({ 'content-type': 'application/json' }, JSON.stringify(PAYLOAD)));
    expect(res.status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });

  it('succès (accepted) → 201 ; le hash RECALCULÉ (JS) est passé à la base', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: { status: 'accepted', evidence_id: 'ev_1' }, error: null });
    withRpc(rpc);
    const res = await POST(req(goodHeaders, JSON.stringify(PAYLOAD)));
    expect(res.status).toBe(201);

    const args = rpc.mock.calls[0][1];
    expect(args.p_recomputed_hash).toBe(canonicalHash(buildCoveredObject(PAYLOAD)).hash);
    // le corps brut est transmis tel quel (base du HMAC)
    expect(args.p_body).toBe(JSON.stringify(PAYLOAD));
  });

  it('renvoi idempotent (exists) → 200', async () => {
    withRpc(vi.fn().mockResolvedValue({ data: { status: 'exists', evidence_id: 'ev_1' }, error: null }));
    const res = await POST(req(goodHeaders, JSON.stringify(PAYLOAD)));
    expect(res.status).toBe(200);
  });

  it('mappe les rejets §8 vers le bon code/status', async () => {
    const cases: [string, number, string][] = [
      ['unauthorized', 401, 'unauthorized'],
      ['rejected', 403, 'rejected'],
      ['forbidden_field', 422, 'forbidden_field'],
      ['missing_provenance', 422, 'missing_provenance'],
      ['canonical_hash_mismatch', 422, 'canonical_hash_mismatch'],
      ['claimed_level_incoherent', 422, 'claimed_level_incoherent'],
      ['below_emission_threshold', 422, 'below_emission_threshold'],
      ['evidence_integrity_conflict', 409, 'evidence_integrity_conflict'],
    ];
    for (const [token, status, code] of cases) {
      withRpc(vi.fn().mockResolvedValue({ data: null, error: { message: token } }));
      const res = await POST(req(goodHeaders, JSON.stringify(PAYLOAD)));
      expect(res.status).toBe(status);
      expect((await res.json()).error.code).toBe(code);
    }
  });
});
