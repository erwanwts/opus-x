/**
 * POST /api/link/authorize (Lot O2a-EXT) — répond par une REDIRECTION 302 vers
 * le redirect_uri enregistré, JAMAIS un JSON contenant le code.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
import { createClient } from '@/lib/supabase/server';
import { hashLinkToken } from '@/lib/link/issuerAuthToken';
import { POST } from './route';

const mocked = vi.mocked(createClient);

function client(user: unknown, rpc: ReturnType<typeof vi.fn>) {
  mocked.mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    rpc,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}

function post(fields: Record<string, string>) {
  return new NextRequest('https://app.opus-x.test/api/link/authorize', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields),
  });
}

const REDIRECT = 'https://issuer.example/callback';

beforeEach(() => vi.clearAllMocks());

describe('POST /api/link/authorize', () => {
  it('sans session → 302 vers /establish', async () => {
    client(null, vi.fn());
    const res = await POST(post({ issuer_id: 'issuer:x', redirect_uri: REDIRECT }));
    expect(res.status).toBe(302);
    expect(new URL(res.headers.get('location')!).pathname).toBe('/establish');
  });

  it('succès → 302 vers {redirect_uri}?code=…&state=… ; JAMAIS de JSON avec code', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: { opus_id: 'opx_ABC', state: 'active' }, error: null });
    client({ id: 'u1' }, rpc);

    const res = await POST(post({ issuer_id: 'issuer:x', redirect_uri: REDIRECT, state: 'xyz-123' }));
    expect(res.status).toBe(302);

    const loc = new URL(res.headers.get('location')!);
    expect(loc.origin + loc.pathname).toBe(REDIRECT);
    const code = loc.searchParams.get('code');
    expect(code).toBeTruthy();
    expect(loc.searchParams.get('state')).toBe('xyz-123'); // state restitué à l'identique

    // Le corps ne contient PAS le code (c'est une redirection, pas un JSON).
    const text = await res.text();
    expect(text).not.toContain(code!);

    // Le code de la redirection hashe bien vers ce qui part en base.
    const args = rpc.mock.calls[0];
    expect(args[0]).toBe('wsp_authorize_issuer');
    expect(args[1].p_code_hash).toBe(hashLinkToken(code!));
    expect(args[1].p_redirect_uri).toBe(REDIRECT);
  });

  it('redirect_uri non enregistré (RPC refuse) → 302 vers /link?error, sans code, pas vers l’URL fournie', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: 'Autorisation impossible.' } });
    client({ id: 'u1' }, rpc);

    const res = await POST(post({ issuer_id: 'issuer:x', redirect_uri: 'https://evil.example/grab' }));
    expect(res.status).toBe(302);
    const loc = new URL(res.headers.get('location')!);
    expect(loc.host).toBe('app.opus-x.test'); // interne, jamais l'URL fournie
    expect(loc.pathname).toBe('/link');
    expect(loc.searchParams.get('code')).toBeNull();
  });
});
