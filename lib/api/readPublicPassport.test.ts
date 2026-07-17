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

  it('ligne publique → vue whitelistée (QUE les clés autorisées, AUCUN champ interne)', async () => {
    mockedPublicClient.mockReturnValue(
      makeSupabaseMock({
        single: () => ({
          data: { handle: 'marie-k3n7', lifecycle_stage: 'identity_established', visibility: 'public' },
          error: null,
        }),
      })
    );

    const view = await fetchPublicPassport('marie-k3n7');
    expect(view).not.toBeNull();

    // N'expose QUE les clés whitelistées.
    expect(Object.keys(view!).sort()).toEqual([...PUBLIC_PASSPORT_WHITELIST].sort());

    // JAMAIS un champ interne (email, opus_id, payload…).
    for (const forbidden of NEVER_PUBLIC) {
      expect(view as unknown as Record<string, unknown>).not.toHaveProperty(forbidden);
    }

    // Seul lifecycle_stage vient de la ligne ; le reste est null/empty (Sprint 1).
    expect(view!.lifecycle_stage).toBe('identity_established');
    expect(view!.display_name).toBeNull();
    expect(view!.headline).toBeNull();
    expect(view!.evidence).toEqual([]);
  });
});
