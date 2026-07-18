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
    // La vue public_passport_view sert handle/lifecycle_stage/display_name/
    // headline/issued_at/is_demo + verified & skills_status (DÉRIVÉS par la vue).
    mockedPublicClient.mockReturnValue(
      makeSupabaseMock({
        single: () => ({
          data: {
            handle: 'marie-k3n7',
            lifecycle_stage: 'identity_established',
            display_name: 'Marie Dubois',
            headline: 'Consultante indépendante',
            issued_at: '2026-07-11T09:00:00Z',
            is_demo: false,
            verified: false,
            skills_status: 'empty',
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
    // Dérivés par la vue, relayés tels quels — jamais recalculés ici.
    expect(view!.verified).toBe(false);
    expect(view!.is_demo).toBe(false);
    // Aucune ligne dans les vues liste → listes vides, jamais inventées.
    expect(view!.skills).toEqual([]);
    expect(view!.evidence).toEqual([]);
  });

  it('vitrine de démonstration → is_demo relayé, Skills/Evidence servies par les vues dédiées', async () => {
    mockedPublicClient.mockReturnValue(
      makeSupabaseMock({
        single: () => ({
          data: {
            handle: 'demo-1234',
            lifecycle_stage: 'passport_verified',
            display_name: 'Erwan Signe',
            headline: null,
            issued_at: '2026-07-11T09:00:00Z',
            is_demo: true,
            verified: true, // dérivé par la vue depuis lifecycle_stage
            skills_status: 'emerging',
          },
          error: null,
        }),
        list: (table: string) =>
          table === 'public_passport_skills_view'
            ? { data: [{ name: 'Intention vs Engagement' }], error: null }
            : {
                data: [
                  {
                    type: 'assessment',
                    title: 'World Trader Framework — Level Assessment',
                    verified: true,
                    issued_at: '2026-05-12T10:00:00Z',
                  },
                ],
                error: null,
              },
      })
    );

    const view = await fetchPublicPassport('demo-1234');

    expect(view!.is_demo).toBe(true);
    expect(view!.verified).toBe(true);
    expect(view!.skills_status).toBe('emerging');
    expect(view!.skills).toEqual([{ name: 'Intention vs Engagement' }]);
    expect(view!.evidence).toHaveLength(1);
    // `issuer` : aucune colonne au schéma (trou assumé, Lot 5) → null, jamais inventé.
    expect(view!.evidence[0].issuer).toBeNull();
    expect(Object.keys(view!.evidence[0]).sort()).toEqual([
      'issued_at',
      'issuer',
      'title',
      'type',
      'verified',
    ]);
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
