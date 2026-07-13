/**
 * Tests du handler /auth/callback — échange du code magic link.
 * Contrat : code + échange OK → redirige vers next (/emission) ;
 * code manquant ou échange en erreur → /verify-email ; next non interne
 * (open redirect) → coercé vers /emission.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
import { createClient } from '@/lib/supabase/server';
import { GET } from './route';

const mockedCreateClient = vi.mocked(createClient);

function mockExchange(result: { error: unknown }) {
  const exchangeCodeForSession = vi.fn().mockResolvedValue(result);
  mockedCreateClient.mockResolvedValue({
    auth: { exchangeCodeForSession },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  return exchangeCodeForSession;
}

function callbackReq(query: string) {
  return new NextRequest(`https://app.opus-x.test/auth/callback${query}`);
}

function location(res: Response) {
  return new URL(res.headers.get('location')!);
}

beforeEach(() => vi.clearAllMocks());

describe('GET /auth/callback', () => {
  it('code valide + échange OK → session posée → redirige vers /emission', async () => {
    const exchange = mockExchange({ error: null });
    const res = await GET(callbackReq('?code=valid-code&next=/emission'));

    expect(exchange).toHaveBeenCalledWith('valid-code');
    expect(res.status).toBe(307);
    expect(location(res).pathname).toBe('/emission');
  });

  it('échange en erreur (lien consommé/expiré) → /verify-email, jamais /emission', async () => {
    mockExchange({ error: { message: 'invalid flow state' } });
    const res = await GET(callbackReq('?code=stale&next=/emission'));

    expect(location(res).pathname).toBe('/verify-email');
    expect(location(res).pathname).not.toBe('/emission');
  });

  it('code absent → /verify-email, sans tenter d’échange', async () => {
    const exchange = mockExchange({ error: null });
    const res = await GET(callbackReq('?next=/emission'));

    expect(exchange).not.toHaveBeenCalled();
    expect(location(res).pathname).toBe('/verify-email');
  });

  it('next non interne (open redirect) → coercé vers /emission, même hôte', async () => {
    mockExchange({ error: null });
    const res = await GET(callbackReq('?code=ok&next=//evil.example.com/phish'));

    const loc = location(res);
    expect(loc.host).toBe('app.opus-x.test'); // jamais un hôte externe
    expect(loc.pathname).toBe('/emission');
  });

  it('next interne explicite est respecté', async () => {
    mockExchange({ error: null });
    const res = await GET(callbackReq('?code=ok&next=/dashboard'));
    expect(location(res).pathname).toBe('/dashboard');
  });
});
