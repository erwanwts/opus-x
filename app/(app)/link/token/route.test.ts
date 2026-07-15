/**
 * POST /link/token (Lot O2a-EXT) — canal arrière : en-têtes HMAC requis,
 * échec uniforme (401), succès renvoie le jeton dont le HASH part en base.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
import { createPublicClient } from '@/lib/supabase/public';
import { HMAC_HEADERS } from '@/lib/issuer/hmac';
import { hashLinkToken } from '@/lib/link/issuerAuthToken';
import { POST } from './route';

const mocked = vi.mocked(createPublicClient);

function withRpc(rpc: ReturnType<typeof vi.fn>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mocked.mockReturnValue({ rpc } as any);
}

function req(headers: Record<string, string>, body: unknown) {
  return new NextRequest('https://app.opus-x.test/link/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

const goodHeaders = {
  [HMAC_HEADERS.issuer]: 'issuer:x',
  [HMAC_HEADERS.timestamp]: '1780000000',
  [HMAC_HEADERS.signature]: 'a'.repeat(64),
};

beforeEach(() => vi.clearAllMocks());

describe('POST /link/token', () => {
  it('succès → { opus_id, token } ; le HASH stocké = hash du jeton renvoyé', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: { opus_id: 'opx_ABC' }, error: null });
    withRpc(rpc);

    const res = await POST(req(goodHeaders, { code: 'wspxc_abc' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.opus_id).toBe('opx_ABC');
    expect(typeof body.token).toBe('string');

    const args = rpc.mock.calls[0];
    expect(args[0]).toBe('wsp_exchange_code');
    expect(args[1].p_token_hash).toBe(hashLinkToken(body.token));
    expect(args[1].p_token_hash).not.toBe(body.token);
  });

  it('en-têtes HMAC manquants → 401, sans appeler la base', async () => {
    const rpc = vi.fn();
    withRpc(rpc);
    const res = await POST(req({}, { code: 'wspxc_abc' }));
    expect(res.status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });

  it('échec base (code inconnu/expiré/mauvais Issuer/HMAC invalide) → 401 uniforme', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: 'exchange_failed' } });
    withRpc(rpc);
    const res = await POST(req(goodHeaders, { code: 'wspxc_zzz' }));
    expect(res.status).toBe(401);
    expect((await res.json()).error.code).toBe('exchange_refused');
  });
});
