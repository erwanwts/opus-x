/**
 * Tests du handler GET/PATCH /me/passport (LOT 8 · §4.3).
 * Contrat : 401 sans JWT ; 200 avec la forme §4.3 (opus_id inclus) ; 404 si
 * absent ; PATCH → 403 feature_disabled une fois authentifié.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeSupabaseMock } from '@/lib/testing/supabaseMock';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
import { createClient } from '@/lib/supabase/server';
import { GET, PATCH } from './route';

const mockedCreateClient = vi.mocked(createClient);

beforeEach(() => vi.clearAllMocks());

describe('GET /me/passport', () => {
  it('401 sans JWT', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: null }));
    const res = await GET();
    expect(res.status).toBe(401);
    expect((await res.json()).error.code).toBe('unauthorized');
  });

  it('200 avec la forme §4.3 exacte (opus_id depuis le profil)', async () => {
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({
        user: { id: 'u1' },
        single: (table) =>
          table === 'passports'
            ? {
                data: {
                  id: 'p1',
                  handle: 'marie-dubois-k3n7',
                  visibility: 'private',
                  lifecycle_stage: 'identity_established',
                  issued_at: '2026-07-11T00:00:00Z',
                  status: 'active',
                },
                error: null,
              }
            : { data: { opus_id: 'opx_01KX9K4GXRNHAW1NY07D91PBGS' }, error: null },
      })
    );
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Object.keys(body).sort()).toEqual(
      ['id', 'opus_id', 'handle', 'visibility', 'lifecycle_stage', 'issued_at', 'status'].sort()
    );
    expect(body.opus_id).toBe('opx_01KX9K4GXRNHAW1NY07D91PBGS');
    expect(body.lifecycle_stage).toBe('identity_established');
    // Jamais de champ interne qui fuite (email, profile_id…).
    expect(body).not.toHaveProperty('email');
    expect(body).not.toHaveProperty('profile_id');
  });

  it('404 si le Passport est absent', async () => {
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({ user: { id: 'u1' }, single: () => ({ data: null, error: null }) })
    );
    const res = await GET();
    expect(res.status).toBe(404);
    expect((await res.json()).error.code).toBe('not_found');
  });
});

describe('PATCH /me/passport', () => {
  it('401 sans JWT', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: null }));
    const res = await PATCH();
    expect(res.status).toBe(401);
  });

  it('403 feature_disabled une fois authentifié (édition désactivée Sprint 1)', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: { id: 'u1' } }));
    const res = await PATCH();
    expect(res.status).toBe(403);
    expect((await res.json()).error.code).toBe('feature_disabled');
  });
});
