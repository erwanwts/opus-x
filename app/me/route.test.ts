/**
 * Tests du handler GET/PATCH /me (LOT 8 · §4.2).
 * Contrat : 401 sans JWT ; 200 forme §4.2 (jamais l'email) ; PATCH n'accepte
 * que les champs autorisés, 400 sinon.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeSupabaseMock, jsonRequest } from '@/lib/testing/supabaseMock';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
import { createClient } from '@/lib/supabase/server';
import { GET, PATCH } from './route';

const mockedCreateClient = vi.mocked(createClient);

const PROFILE_ROW = {
  id: 'u1',
  opus_id: 'opx_01KX9K4GXRNHAW1NY07D91PBGS',
  full_name: 'Marie Dubois',
  headline: null,
  avatar_url: null,
  locale: 'fr',
  created_at: '2026-07-11T00:00:00Z',
};

beforeEach(() => vi.clearAllMocks());

describe('GET /me', () => {
  it('401 sans JWT', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: null }));
    expect((await GET()).status).toBe(401);
  });

  it('200 avec la forme §4.2, jamais l’email', async () => {
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({ user: { id: 'u1' }, single: () => ({ data: PROFILE_ROW, error: null }) })
    );
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Object.keys(body).sort()).toEqual(
      ['id', 'opus_id', 'full_name', 'headline', 'avatar_url', 'locale', 'created_at'].sort()
    );
    expect(body).not.toHaveProperty('email');
  });

  it('404 si le profil est absent', async () => {
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({ user: { id: 'u1' }, single: () => ({ data: null, error: null }) })
    );
    expect((await GET()).status).toBe(404);
  });
});

describe('PATCH /me', () => {
  it('401 sans JWT', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: null }));
    expect((await PATCH(jsonRequest({ headline: 'X' }))).status).toBe(401);
  });

  it('400 si aucun champ modifiable fourni', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: { id: 'u1' } }));
    const res = await PATCH(jsonRequest({ opus_id: 'hack', id: 'other' }));
    expect(res.status).toBe(400);
  });

  it('400 si un champ autorisé a le mauvais type', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: { id: 'u1' } }));
    expect((await PATCH(jsonRequest({ headline: 123 }))).status).toBe(400);
  });

  it('200 et forme §4.2 après une mise à jour valide', async () => {
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({
        user: { id: 'u1' },
        updateSingle: () => ({ data: { ...PROFILE_ROW, headline: 'Consultante' }, error: null }),
      })
    );
    const res = await PATCH(jsonRequest({ headline: 'Consultante' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.headline).toBe('Consultante');
    expect(body).not.toHaveProperty('email');
  });
});
