/**
 * GET /frameworks/{id}/skills (Lot O0) — découverte.
 * Contrat : Framework résolu (id OU slug) + version publiée → 200 avec les
 * identifiants canoniques ; Framework ou version absents → 404 neutre.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
import { createPublicClient } from '@/lib/supabase/public';
import { GET } from './route';

const mocked = vi.mocked(createPublicClient);

/** Client Supabase minimal, chaînable, piloté par table. */
function makeClient(results: Record<string, { single?: unknown; list?: unknown }>) {
  return {
    from(table: string) {
      const res = results[table] ?? {};
      const builder: Record<string, unknown> = {};
      const passthrough = () => builder;
      for (const m of ['select', 'or', 'eq', 'order', 'limit']) builder[m] = passthrough;
      builder.maybeSingle = () => Promise.resolve({ data: res.single ?? null });
      // Le builder est thenable : `await ...order('code')` résout la liste.
      builder.then = (resolve: (v: unknown) => unknown) =>
        Promise.resolve({ data: res.list ?? null }).then(resolve);
      return builder;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

function req() {
  return new NextRequest('https://app.opus-x.test/frameworks/wtf/skills');
}
function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

const FRAMEWORK = { id: 'framework:wtf', slug: 'wtf', name: 'World Trader Framework', publisher: 'Opus X' };
const VERSION = { version: '0.1', status: 'published', effective_date: '2026-07-13' };
const SKILLS = [
  {
    id: 'wtf:212',
    code: 'WTF-212',
    name: 'Intention vs Engagement',
    framework_version: '0.1',
    levels: [
      { slug: 'applied', label: 'Applied', rank: 2, observation_min: 3, observation_max: 3 },
      { slug: 'aware', label: 'Aware', rank: 1, observation_min: 2, observation_max: 2 },
    ],
  },
];

beforeEach(() => vi.clearAllMocks());

describe('GET /frameworks/{id}/skills', () => {
  it('Framework + version publiée → 200, expose WTF-212 canonique + version', async () => {
    mocked.mockReturnValue(
      makeClient({
        wsp_frameworks: { single: FRAMEWORK },
        wsp_framework_versions: { single: VERSION },
        wsp_skills: { list: SKILLS },
      })
    );
    const res = await GET(req(), params('wtf'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.framework.id).toBe('framework:wtf');
    expect(body.framework.version).toBe('0.1');
    expect(body.framework.effective_date).toBe('2026-07-13'); // §9.2
    expect(body.skills[0].id).toBe('wtf:212');
    expect(body.skills[0].levels.map((l: { slug: string }) => l.slug)).toEqual(['aware', 'applied']);
    // La correspondance PUBLIÉE sort par niveau (§9).
    const applied = body.skills[0].levels.find((l: { slug: string }) => l.slug === 'applied');
    expect(applied.observation_min).toBe(3);
    expect(applied.observation_max).toBe(3);
  });

  it('résout aussi par identifiant canonique (framework:wtf)', async () => {
    mocked.mockReturnValue(
      makeClient({
        wsp_frameworks: { single: FRAMEWORK },
        wsp_framework_versions: { single: VERSION },
        wsp_skills: { list: SKILLS },
      })
    );
    const res = await GET(req(), params('framework:wtf'));
    expect(res.status).toBe(200);
  });

  it('Framework inexistant → 404 neutre', async () => {
    mocked.mockReturnValue(makeClient({ wsp_frameworks: { single: null } }));
    const res = await GET(req(), params('does-not-exist'));
    expect(res.status).toBe(404);
  });

  it('Framework sans version publiée → 404', async () => {
    mocked.mockReturnValue(
      makeClient({
        wsp_frameworks: { single: FRAMEWORK },
        wsp_framework_versions: { single: null },
      })
    );
    const res = await GET(req(), params('wtf'));
    expect(res.status).toBe(404);
  });
});
