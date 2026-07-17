/**
 * =====================================================================
 * Lecteur public unique — fetchPublicPassport() (§4.3, §5.3)
 * =====================================================================
 * Prouve : (1) aucune ligne publique → null (inexistant / privé / unlisted
 * indistinguables) ; (2) une ligne publique → vue STRICTEMENT whitelistée,
 * jamais un champ interne. Déterministe, sans base live (mock createPublicClient).
 * =====================================================================
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeSupabaseMock } from '@/lib/testing/supabaseMock';

vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
import { createPublicClient } from '@/lib/supabase/public';
import { fetchPublicPassport } from './readPublicPassport';
import { PUBLIC_PASSPORT_WHITELIST, NEVER_PUBLIC } from './publicPassport';

const mockedPublicClient = vi.mocked(createPublicClient);

beforeEach(() => vi.clearAllMocks());

describe('fetchPublicPassport — source publique unique', () => {
  it('null quand aucune ligne publique (inexistant / privé / unlisted → identique)', async () => {
    mockedPublicClient.mockReturnValue(
      makeSupabaseMock({ single: () => ({ data: null, error: null }) })
    );
    expect(await fetchPublicPassport('inexistant-xyz')).toBeNull();
    expect(await fetchPublicPassport('marie-dubois-k3n7')).toBeNull();
  });

  it('ligne publique (vue) → whitelist stricte + nom servi PAR LA VUE, aucun champ interne', async () => {
    // La vue public_passport_view sert handle/lifecycle_stage/display_name/headline.
    mockedPublicClient.mockReturnValue(
      makeSupabaseMock({
        single: () => ({
          data: {
            handle: 'marie-k3n7',
            lifecycle_stage: 'identity_established',
            display_name: 'Marie Dubois',
            headline: 'Consultante indépendante',
            issued_at: '2026-07-11T09:00:00Z',
          },
          error: null,
        }),
      })
    );

    const view = await fetchPublicPassport('marie-k3n7');
    expect(view).not.toBeNull();

    // N'expose QUE les clés whitelistées.
    expect(Object.keys(view!).sort()).toEqual([...PUBLIC_PASSPORT_WHITELIST].sort());

    // JAMAIS un champ interne (email, opus_id, profile_id, payload…).
    for (const forbidden of NEVER_PUBLIC) {
      expect(view as unknown as Record<string, unknown>).not.toHaveProperty(forbidden);
    }

    // Le nom (display_name/headline) et la date d'émission sont SERVIS (via la vue).
    expect(view!.display_name).toBe('Marie Dubois');
    expect(view!.headline).toBe('Consultante indépendante');
    expect(view!.issued_at).toBe('2026-07-11T09:00:00Z');
    expect(view!.lifecycle_stage).toBe('identity_established');
    // Non portés par la vue en Sprint 1 → défauts sûrs.
    expect(view!.verified).toBe(false);
    expect(view!.evidence).toEqual([]);
  });

  it('ligne publique sans headline → headline null (gracieux, jamais inventé)', async () => {
    mockedPublicClient.mockReturnValue(
      makeSupabaseMock({
        single: () => ({
          data: {
            handle: 'sans-headline',
            lifecycle_stage: 'identity_established',
            display_name: 'Nom Seul',
            headline: null,
          },
          error: null,
        }),
      })
    );

    const view = await fetchPublicPassport('sans-headline');
    expect(view!.display_name).toBe('Nom Seul');
    expect(view!.headline).toBeNull();
  });
});
