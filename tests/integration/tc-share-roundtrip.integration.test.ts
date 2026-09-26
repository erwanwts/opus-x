/**
 * =====================================================================
 * T-C (D-058→D-062) — round-trip : le lien généré par le sujet MÈNE au passeport.
 * =====================================================================
 * Sur STAGING (jamais la prod). Prouve la continuité T-A → T-B côté produit :
 *   ⭐ le sujet GÉNÈRE un lien (generate_share_token) → le token résout
 *      (resolve_share_token, chemin anon de /verify/{token}) et REND son
 *      passeport (compétence publiée présente) ;
 *   ⭐ le sujet RÉVOQUE → le même lien ne donne plus rien (null, 404).
 * Falsifiable : si la révocation ne coupait pas la résolution, le 2e cas casse.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  admin,
  anonClient,
  createUser,
  signIn,
  waitForPassport,
  adminPassport,
  cleanupAllUsers,
} from './_harness';
import type { SupabaseClient } from '@supabase/supabase-js';

afterAll(cleanupAllUsers);

let session: SupabaseClient;
let passportId: string;
let skill: { id: string; fv: string };

beforeAll(async () => {
  const u = await createUser({ tag: 'tc-roundtrip', confirmed: true });
  await waitForPassport(u.id);
  passportId = (await adminPassport(u.id))!.id as string;
  session = await signIn(u.email, u.password);

  const { data: skills } = await admin.from('wsp_skills').select('id, framework_version').order('id').limit(1);
  const s = (skills ?? [])[0] as { id: string; framework_version: string };
  skill = { id: s.id, fv: s.framework_version };
  await admin.from('wsp_competency_trust').upsert([
    { passport_id: passportId, skill_id: skill.id, framework_version: skill.fv, state: 'established', basis_level: 'applied' },
  ]);
  await session.rpc('wsp_publish_competency', { p_skill_id: skill.id, p_framework_version: skill.fv });
});

describe('T-C — round-trip génération → consultation (staging)', () => {
  it('⭐ le sujet génère un lien → le token rend son passeport ; révoquer coupe l’accès', async () => {
    // Génération (comme le bouton « Créer un lien » du front).
    const token = ((await session.rpc('generate_share_token')).data as { share_token: string }).share_token;
    expect(token.startsWith('wsps_')).toBe(true);

    // Le lien /verify/{token} : côté page, resolve_share_token (anon) rend le passeport.
    const view = (await anonClient().rpc('resolve_share_token', { p_token: token })).data as {
      handle: string; competencies: { skill_id: string }[] } | null;
    expect(view).not.toBeNull();
    expect(view!.handle).toBeTruthy();
    expect(view!.competencies.map((c) => c.skill_id)).toContain(skill.id);

    // Révocation (bouton « Révoquer ») → le MÊME lien ne donne plus rien.
    await session.rpc('revoke_share_token');
    const after = (await anonClient().rpc('resolve_share_token', { p_token: token })).data;
    expect(after).toBeNull();
  });
});
