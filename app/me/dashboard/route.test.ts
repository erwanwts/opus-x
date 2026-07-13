/**
 * Tests du handler GET /me/dashboard (LOT 8 · §4.4).
 * Contrat : 401 sans JWT ; 404 si émission incomplète ; 200 avec la forme
 * §4.4 EXACTE (passport à 5 champs, aucun Frameworks, aucun wrapper `profile`).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeSupabaseMock } from '@/lib/testing/supabaseMock';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('@/lib/dashboard/DashboardService', () => ({ DashboardService: vi.fn() }));
import { createClient } from '@/lib/supabase/server';
import { DashboardService } from '@/lib/dashboard/DashboardService';
import { GET } from './route';

const mockedCreateClient = vi.mocked(createClient);
const MockedService = vi.mocked(DashboardService);

const DATA = {
  profile: { opus_id: 'opx_01KX9K4GXRNHAW1NY07D91PBGS', full_name: 'Marie Dubois' },
  passport: {
    opus_id: 'opx_01KX9K4GXRNHAW1NY07D91PBGS',
    handle: 'marie-dubois-k3n7',
    visibility: 'private',
    lifecycle_stage: 'identity_established',
    issued_at: '2026-07-11T00:00:00Z',
  },
  trust_status: { state: 'establishing', score: null },
  skills_status: { state: 'empty', count: 0, verified_count: 0 },
  evidence_status: { state: 'empty', count: 0 },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withDashboard(result: unknown) {
  MockedService.mockImplementation(() => ({ getDashboard: async () => result }) as any);
}

beforeEach(() => vi.clearAllMocks());

describe('GET /me/dashboard', () => {
  it('401 sans JWT', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: null }));
    withDashboard(DATA);
    expect((await GET()).status).toBe(401);
  });

  it('404 si l’émission est incomplète (agrégat null)', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: { id: 'u1' } }));
    withDashboard(null);
    expect((await GET()).status).toBe(404);
  });

  it('200 avec la forme §4.4 exacte, sans Frameworks ni wrapper profile', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: { id: 'u1' } }));
    withDashboard(DATA);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(Object.keys(body).sort()).toEqual(
      ['passport', 'trust_status', 'skills_status', 'evidence_status'].sort()
    );
    // Le passport porte EXACTEMENT 5 champs (ni id, ni status).
    expect(Object.keys(body.passport).sort()).toEqual(
      ['opus_id', 'handle', 'visibility', 'lifecycle_stage', 'issued_at'].sort()
    );
    expect(body.trust_status).toEqual({ state: 'establishing', score: null });
    expect(body.skills_status).toEqual({ state: 'empty', count: 0, verified_count: 0 });
    expect(body.evidence_status).toEqual({ state: 'empty', count: 0 });
    // Jamais de Frameworks, jamais de fuite profil.
    expect(body).not.toHaveProperty('frameworks');
    expect(body).not.toHaveProperty('profile');
  });
});
