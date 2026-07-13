/**
 * Tests du handler GET/POST /me/consents (LOT 8 · §4.5).
 * Contrat : 401 sans JWT ; POST valide type/version(vX.Y.Z)/granted, 400 sinon,
 * 201 si valide ; GET renvoie { consents: [...] }.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeSupabaseMock, jsonRequest } from '@/lib/testing/supabaseMock';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
import { createClient } from '@/lib/supabase/server';
import { GET, POST } from './route';

const mockedCreateClient = vi.mocked(createClient);

beforeEach(() => vi.clearAllMocks());

describe('POST /me/consents', () => {
  it('401 sans JWT', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: null }));
    const res = await POST(jsonRequest({ type: 'terms', version: 'v1.0.0', granted: true }));
    expect(res.status).toBe(401);
  });

  it('400 sur type inconnu', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: { id: 'u1' } }));
    const res = await POST(jsonRequest({ type: 'marketing', version: 'v1.0.0', granted: true }));
    expect(res.status).toBe(400);
  });

  it('400 sur version au mauvais format (« 2026-07 »)', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: { id: 'u1' } }));
    const res = await POST(jsonRequest({ type: 'terms', version: '2026-07', granted: true }));
    expect(res.status).toBe(400);
  });

  it('400 si granted n’est pas un booléen', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: { id: 'u1' } }));
    const res = await POST(jsonRequest({ type: 'terms', version: 'v1.0.0', granted: 'oui' }));
    expect(res.status).toBe(400);
  });

  it('201 sur consentement valide (idempotent en base)', async () => {
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({ user: { id: 'u1' }, upsertResult: { data: null, error: null } })
    );
    const res = await POST(jsonRequest({ type: 'terms', version: 'v1.0.0', granted: true }));
    expect(res.status).toBe(201);
  });
});

describe('GET /me/consents', () => {
  it('401 sans JWT', async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock({ user: null }));
    expect((await GET()).status).toBe(401);
  });

  it('200 avec { consents: [...] }', async () => {
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({
        user: { id: 'u1' },
        list: () => ({
          data: [
            {
              type: 'terms',
              granted: true,
              version: 'v1.0.0',
              effective_date: '2026-07-11',
              granted_at: '2026-07-11T00:00:00Z',
              revoked_at: null,
            },
          ],
          error: null,
        }),
      })
    );
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.consents)).toBe(true);
    expect(body.consents[0].type).toBe('terms');
  });
});
