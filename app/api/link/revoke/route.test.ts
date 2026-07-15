/**
 * POST /api/link/revoke (Lot O2a) — auth requise ; révoquer = insérer un fait.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
import { createClient } from '@/lib/supabase/server';
import { POST } from './route';

const mocked = vi.mocked(createClient);

function client(user: unknown, rpc: ReturnType<typeof vi.fn>) {
  mocked.mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    rpc,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}

function post(body: unknown) {
  return new NextRequest('https://app.opus-x.test/api/link/revoke', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => vi.clearAllMocks());

describe('POST /api/link/revoke', () => {
  it('sans session → 401', async () => {
    const rpc = vi.fn();
    client(null, rpc);
    const res = await POST(post({ issuer_id: 'issuer:x' }));
    expect(res.status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });

  it('succès → { state: "revoked" } via wsp_revoke_issuer', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: { state: 'revoked' }, error: null });
    client({ id: 'u1' }, rpc);
    const res = await POST(post({ issuer_id: 'issuer:x' }));
    expect(res.status).toBe(200);
    expect((await res.json()).state).toBe('revoked');
    expect(rpc.mock.calls[0][0]).toBe('wsp_revoke_issuer');
  });
});
