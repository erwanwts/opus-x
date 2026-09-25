/**
 * POST /issuers/evidence (Lot O2b + 2b) — pré-contrôle HMAC (D-050), vérif du
 * badge OB 3.0 quand une clé publique est enregistrée, mapping des rejets §8, et
 * recalcul JS du hash (Opus X ne fait jamais confiance au hash reçu).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { generateKeyPair, exportJWK, type JWK } from 'jose';

vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
import { createPublicClient } from '@/lib/supabase/public';
import { HMAC_HEADERS } from '@/lib/issuer/hmac';
import { canonicalHash } from '@/lib/wsp/canonical';
import { buildCoveredObject } from '@/lib/wsp/evidenceCovered';
import { POST } from './route';

const mocked = vi.mocked(createPublicClient);

// Chaîne `.from(...).select().eq().limit().maybeSingle()` résolvant sur `data`.
function chain(data: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = {};
  for (const m of ['select', 'eq', 'limit', 'order']) c[m] = () => c;
  c.maybeSingle = async () => ({ data, error: null });
  return c;
}

/** Client mocké : rpc dispatché par nom ; from() renvoie la clé issuer (ou null). */
function mockClient(opts: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verify?: any; ingest?: any; key?: unknown; skill?: unknown; framework?: unknown;
} = {}) {
  const rpc = vi.fn(async (name: string) => {
    if (name === 'wsp_verify_issuer_request') return opts.verify ?? { data: null, error: null };
    if (name === 'wsp_ingest_evidence') return opts.ingest ?? { data: { status: 'accepted', evidence_id: 'ev_1' }, error: null };
    return { data: null, error: null };
  });
  const from = (table: string) => {
    if (table === 'wsp_issuer_keys') return chain(opts.key ?? null);
    if (table === 'wsp_skills') return chain(opts.skill ?? null);
    if (table === 'wsp_frameworks') return chain(opts.framework ?? null);
    return chain(null);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mocked.mockReturnValue({ rpc, from } as any);
  return { rpc, from };
}

const ingestArgs = (rpc: ReturnType<typeof vi.fn>) =>
  rpc.mock.calls.find((c) => c[0] === 'wsp_ingest_evidence')?.[1];

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
  it('en-têtes HMAC manquants → 401 (auth d’abord), aucun RPC', async () => {
    const { rpc } = mockClient();
    const res = await POST(req({ 'content-type': 'application/json' }, JSON.stringify(PAYLOAD)));
    expect(res.status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });

  it('pré-contrôle HMAC échoue → 401 (avant obVerify, D-050)', async () => {
    mockClient({ verify: { data: null, error: { message: 'unauthorized' } } });
    const res = await POST(req(goodHeaders, JSON.stringify(PAYLOAD)));
    expect(res.status).toBe(401);
  });

  it('succès (accepted, issuer SANS clé → legacy HMAC) → 201 ; hash RECALCULÉ (JS) passé à la base', async () => {
    const { rpc } = mockClient({ key: null });
    const res = await POST(req(goodHeaders, JSON.stringify(PAYLOAD)));
    expect(res.status).toBe(201);
    const args = ingestArgs(rpc);
    expect(args.p_recomputed_hash).toBe(canonicalHash(buildCoveredObject(PAYLOAD)).hash);
    expect(args.p_body).toBe(JSON.stringify(PAYLOAD)); // corps brut tel quel (base du HMAC)
  });

  it('renvoi idempotent (exists) → 200', async () => {
    mockClient({ ingest: { data: { status: 'exists', evidence_id: 'ev_1' }, error: null } });
    const res = await POST(req(goodHeaders, JSON.stringify(PAYLOAD)));
    expect(res.status).toBe(200);
  });

  it('issuer AVEC clé publique + credential invalide → 422 badge_signature_invalid', async () => {
    const { publicKey } = await generateKeyPair('EdDSA', { extractable: true });
    const jwk = (await exportJWK(publicKey)) as JWK;
    const { rpc } = mockClient({ key: { public_key_jwk: jwk }, skill: { id: 'wtr:212', code: 'WTR-212', framework_version: '0.1', framework_id: 'framework:wtr' }, framework: { slug: 'world-trader' } });
    // payload SANS credential valide (le badge doit être vérifié → rejet)
    const res = await POST(req(goodHeaders, JSON.stringify({ ...PAYLOAD, credential: 'not.a.jws' })));
    expect(res.status).toBe(422);
    expect((await res.json()).error.code).toBe('badge_signature_invalid');
    expect(ingestArgs(rpc)).toBeUndefined(); // rien n'atteint l'écriture
  });

  it('mappe les rejets §8 (ingest) vers le bon code/status', async () => {
    const cases: [string, number, string][] = [
      ['rejected', 403, 'rejected'],
      ['forbidden_field', 422, 'forbidden_field'],
      ['missing_provenance', 422, 'missing_provenance'],
      ['canonical_hash_mismatch', 422, 'canonical_hash_mismatch'],
      ['claimed_level_incoherent', 422, 'claimed_level_incoherent'],
      ['below_emission_threshold', 422, 'below_emission_threshold'],
      ['evidence_integrity_conflict', 409, 'evidence_integrity_conflict'],
    ];
    for (const [token, status, code] of cases) {
      mockClient({ key: null, ingest: { data: null, error: { message: token } } });
      const res = await POST(req(goodHeaders, JSON.stringify(PAYLOAD)));
      expect(res.status).toBe(status);
      expect((await res.json()).error.code).toBe(code);
    }
  });
});
