/**
 * =====================================================================
 * T-B (D-058→D-062) — /verify/{token} : les 2 GARANTIES de l'amendement D-043.
 * =====================================================================
 * Sur STAGING (jamais la prod). Passeport laissé PRIVATE (défaut). On seed 2
 * compétences, on en PUBLIE une seule, on génère un token, puis via
 * resolve_share_token (chemin anon de la page) :
 *   ⭐ token actif sur passeport PRIVATE → RÉVÉLÉ (le token outrepasse le privé) ;
 *   ⭐ la compétence NON publiée est ABSENTE (D-042 jamais contourné —
 *      MUTATION : supprimer le filtre published la ferait apparaître → casse) ;
 *   • token révoqué / inexistant → null uniforme (404 non-énumérant) ;
 *   • passeport sans compétence publiée → null (404) ;
 *   • whitelist : jamais opus_id / passport_id dans la projection.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  admin,
  anonClient,
  createUser,
  signIn,
  waitForPassport,
  adminProfile,
  adminPassport,
  cleanupAllUsers,
} from './_harness';
import type { SupabaseClient } from '@supabase/supabase-js';

afterAll(cleanupAllUsers);

let userId: string;
let session: SupabaseClient;
let passportId: string;
let opus: string;
let token: string;
let skillPub: { id: string; fv: string };
let skillPriv: { id: string; fv: string };

beforeAll(async () => {
  const u = await createUser({ tag: 'tb-verify', confirmed: true });
  userId = u.id;
  await waitForPassport(u.id);
  opus = (await adminProfile(u.id))!.opus_id as string;
  passportId = (await adminPassport(u.id))!.id as string;
  session = await signIn(u.email, u.password);

  // Deux compétences réelles distinctes : une sera PUBLIÉE, l'autre non.
  const { data: skills } = await admin
    .from('wsp_skills')
    .select('id, framework_version')
    .order('id')
    .limit(2);
  const list = (skills ?? []) as { id: string; framework_version: string }[];
  skillPub = { id: list[0].id, fv: list[0].framework_version };
  skillPriv = { id: list[1].id, fv: list[1].framework_version };

  // Seed le Trust par compétence (zone interprétations, service_role).
  await admin.from('wsp_competency_trust').upsert([
    { passport_id: passportId, skill_id: skillPub.id, framework_version: skillPub.fv, state: 'established', basis_level: 'applied' },
    { passport_id: passportId, skill_id: skillPriv.id, framework_version: skillPriv.fv, state: 'emerging', basis_level: 'foundational' },
  ]);

  // Le sujet PUBLIE une seule compétence (l'autre reste privée).
  await session.rpc('wsp_publish_competency', { p_skill_id: skillPub.id, p_framework_version: skillPub.fv });

  token = ((await session.rpc('generate_share_token')).data as { share_token: string }).share_token;
});

describe('T-B — consultation par token (staging)', () => {
  it('⭐ GARANTIE 1 — token actif sur passeport PRIVATE → révélé (outrepasse le privé)', async () => {
    expect((await adminPassport(userId))!.visibility).toBe('private'); // bien privé

    const { data } = await anonClient().rpc('resolve_share_token', { p_token: token });
    expect(data).not.toBeNull();
    expect((data as { handle: string }).handle).toBeTruthy();
  });

  it('⭐ GARANTIE 2 — la compétence NON publiée est ABSENTE (D-042 non contourné)', async () => {
    const { data } = await anonClient().rpc('resolve_share_token', { p_token: token });
    const comps = (data as { competencies: { skill_id: string }[] }).competencies;
    const ids = comps.map((c) => c.skill_id);
    expect(ids).toContain(skillPub.id);       // publiée → présente
    expect(ids).not.toContain(skillPriv.id);  // non publiée → ABSENTE (mutation-prouvé)
    expect(comps).toHaveLength(1);
  });

  it('whitelist — la projection n’expose jamais opus_id ni passport_id', async () => {
    const { data } = await anonClient().rpc('resolve_share_token', { p_token: token });
    const blob = JSON.stringify(data);
    expect(blob).not.toContain(opus);
    expect(blob).not.toContain(passportId);
  });

  it('token INEXISTANT → null (non-énumérant)', async () => {
    const { data } = await anonClient().rpc('resolve_share_token', { p_token: 'wsps_' + 'de'.repeat(32) });
    expect(data).toBeNull();
  });

  it('token RÉVOQUÉ → null, indistinct d’un inexistant', async () => {
    await session.rpc('revoke_share_token');
    const { data } = await anonClient().rpc('resolve_share_token', { p_token: token });
    expect(data).toBeNull();
  });

  it('passeport SANS compétence publiée → null (404, périmètre vide)', async () => {
    // On dé-publie tout, puis un NOUVEAU token : plus rien à révéler.
    await session.rpc('wsp_unpublish_competency', { p_skill_id: skillPub.id, p_framework_version: skillPub.fv });
    const fresh = ((await session.rpc('generate_share_token')).data as { share_token: string }).share_token;
    const { data } = await anonClient().rpc('resolve_share_token', { p_token: fresh });
    expect(data).toBeNull();
  });
});
