/**
 * Tests du handler public GET /passports/{handle} (LOT 8 · §4.3, §5.3).
 * Contrat Sprint 1 : 404 systématique ; NON-ÉNUMÉRATION (handle inexistant et
 * handle privé renvoient le MÊME 404, corps identique).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeSupabaseMock } from '@/lib/testing/supabaseMock';

vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
import { createPublicClient } from '@/lib/supabase/public';
import { GET } from './route';

const mockedPublicClient = vi.mocked(createPublicClient);

function paramsFor(handle: string) {
  return { params: Promise.resolve({ handle }) };
}

beforeEach(() => vi.clearAllMocks());

describe('GET /passports/{handle}', () => {
  it('404 pour un handle inexistant', async () => {
    // L'anon + filtre visibility='public' ne remonte aucune ligne.
    mockedPublicClient.mockReturnValue(makeSupabaseMock({ single: () => ({ data: null, error: null }) }));
    const res = await GET({} as never, paramsFor('inexistant-xyz'));
    expect(res.status).toBe(404);
    expect((await res.json()).error.code).toBe('not_found');
  });

  it('non-énumération : inexistant et privé renvoient un 404 IDENTIQUE', async () => {
    mockedPublicClient.mockReturnValue(makeSupabaseMock({ single: () => ({ data: null, error: null }) }));

    const resA = await GET({} as never, paramsFor('inexistant-xyz'));
    const resB = await GET({} as never, paramsFor('marie-dubois-k3n7'));

    expect(resA.status).toBe(404);
    expect(resB.status).toBe(404);
    expect(await resA.json()).toEqual(await resB.json());
  });
});
