/**
 * =====================================================================
 * LOT 3 — Preuve RUNTIME : divulgation du nom public + Point B fermé (STAGING)
 * =====================================================================
 * PRÉREQUIS : la migration 20260717000001_public_passport_view.sql DOIT être
 * appliquée sur staging (vue + revoke/grant). Sinon ce harnais échoue (attendu).
 *
 * Prouve, contre staging :
 *   • /p/{handle} rend maintenant display_name = le nom (plus null) + headline ;
 *   • GET /rest/v1/passports?select=*  (anon) → ERREUR (révoqué) : Point B fermé ;
 *   • GET /rest/v1/public_passport_view?select=* → UNIQUEMENT les 4 colonnes
 *     publiques (jamais profile_id) ;
 *   • 404 non-énumérant intact ; Trust "Not yet computed" inchangé ;
 *   • rollback empreinte nulle (démo privé PUIS supprimé).
 *
 * Sécurité : garde anti-prod + assertion projectRef === staging AVANT écriture.
 * Aucune clé en clair.
 * =====================================================================
 */
import { describe, it, expect, afterAll } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import {
  admin,
  anonClient,
  createUser,
  waitForPassport,
  cleanupAllUsers,
  adminPassport,
  projectRef,
  TEST_URL,
  type TestUser,
} from './_harness';
import { PassportView } from '@/app/(application)/(public-passport)/p/[handle]/PassportView';
import { NEVER_PUBLIC, type PublicPassport } from '@/lib/api/publicPassport';
import { PUBLIC_PASSPORT_STRINGS as S } from '@/lib/constants/passport.strings';

// Le JSX de la config d'intégration est compilé en runtime CLASSIQUE → React global.
(globalThis as unknown as { React: unknown }).React = React;

const STAGING_REF = 'bnzahwzuwoxjrxpqsjhp';
const OUT_DIR = 'build/lot3-staging';
const DEMO_NAME = 'Erwan (demo staging Lot 3)';

// ── Protocole #1 : STAGING confirmé AVANT toute écriture ──────────────
const ref = projectRef(TEST_URL);
if (ref !== STAGING_REF) {
  throw new Error(`[LOT3 STOP] Cible NON-staging (ref=${ref} ≠ ${STAGING_REF}). Aucune écriture.`);
}
function parseEnv(p: string): Record<string, string> {
  const o: Record<string, string> = {};
  for (const l of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !l.trimStart().startsWith('#')) o[m[1]] = m[2];
  }
  return o;
}
const env = parseEnv('.env.test.local');
process.env.NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

import { fetchPublicPassport } from '@/lib/api/readPublicPassport';

let demo: TestUser | null = null;
let demoHandle: string | null = null;
const proof: Record<string, unknown> = {
  lot: 'LOT 3 — divulgation nom public + Point B ferme (staging)',
  staging_ref_confirmed: ref,
};

afterAll(async () => {
  const rollback: Record<string, unknown> = {};
  if (demoHandle) {
    const { error } = await admin.from('passports').update({ visibility: 'private' }).eq('handle', demoHandle);
    rollback.set_private = error ? `err:${error.message}` : 'ok';
  }
  await cleanupAllUsers();
  rollback.demo_account_deleted = true;
  if (demo) rollback.admin_passport_after = (await adminPassport(demo.id)) === null ? 'null (supprimé)' : 'PRÉSENT (anomalie)';
  if (demoHandle) rollback.public_view_after = (await fetchPublicPassport(demoHandle)) === null ? 'null (404)' : 'VISIBLE (anomalie)';
  proof.rollback = rollback;

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(`${OUT_DIR}/PROOF.json`, JSON.stringify(proof, null, 2) + '\n', 'utf8');
}, 30_000);

describe('LOT 3 — nom public rendu réel + Point B fermé (staging)', () => {
  it('émission → ouverture → nom rendu → Point B fermé → vue 4 colonnes → 404', async () => {
    // 1. Émission réelle (trigger), compte démo à mon nom.
    demo = await createUser({ tag: 'lot3-demo', confirmed: true, fullName: DEMO_NAME, locale: 'en' });
    const passport = await waitForPassport(demo.id);
    expect(passport).not.toBeNull();
    demoHandle = passport!.handle;
    proof.demo_handle = demoHandle;

    // 2. Avant ouverture : 404 indistinguables.
    expect(await fetchPublicPassport(demoHandle!)).toBeNull();
    expect(await fetchPublicPassport('inexistant-zzzz-404')).toBeNull();

    // 3. Ouverture ciblée.
    const up = await admin.from('passports').update({ visibility: 'public' }).eq('handle', demoHandle!);
    expect(up.error).toBeNull();

    // 4. Rendu RÉEL : display_name = le nom (plus null !).
    const view = (await fetchPublicPassport(demoHandle!)) as PublicPassport;
    expect(view).not.toBeNull();
    expect(view.display_name).toBe(DEMO_NAME);
    expect(view.issued_at).toBeTruthy(); // date d'émission désormais publique (Lot 4)
    const leaked = NEVER_PUBLIC.filter((k) => k in (view as unknown as Record<string, unknown>));
    expect(leaked).toEqual([]);

    const html = renderToStaticMarkup(createElement(PassportView, { passport: view }));
    expect(html).toContain(DEMO_NAME); // le nom apparaît dans la page
    expect(html).toContain(S.trustNotComputed); // Trust inchangé
    expect(html).not.toMatch(/establishing/i);

    // 5. Point B : endpoint brut passports → ERREUR (révoqué).
    const anon = anonClient();
    const rawPass = await anon.from('passports').select('*').eq('handle', demoHandle!);
    const rawProfiles = await anon.from('profiles').select('*');
    // Vue : uniquement 4 colonnes publiques.
    const viewRes = await anon.from('public_passport_view').select('*').eq('handle', demoHandle!);
    const viewRow = (viewRes.data ?? [])[0] ?? null;

    proof.name_disclosure = { display_name: view.display_name, headline: view.headline, name_in_html: html.includes(DEMO_NAME) };
    proof.point_B_closed = {
      raw_passports_error: rawPass.error ? 'permission-denied (révoqué)' : 'LISIBLE (anomalie)',
      raw_profiles_error: rawProfiles.error ? 'permission-denied (révoqué)' : 'LISIBLE (anomalie)',
      view_columns: viewRow ? Object.keys(viewRow).sort() : [],
      view_has_profile_id: viewRow ? 'profile_id' in viewRow : 'n/a',
    };

    expect(rawPass.error).not.toBeNull(); // passports brut inaccessible.
    expect(rawProfiles.error).not.toBeNull(); // profiles brut inaccessible.
    expect(viewRow).toBeTruthy();
    expect(Object.keys(viewRow).sort()).toEqual(['display_name', 'handle', 'headline', 'issued_at', 'lifecycle_stage']);
    expect(viewRow).not.toHaveProperty('profile_id');

    // 6. 404 non-énumérant intact après ouverture.
    expect(await fetchPublicPassport('inexistant-zzzz-404')).toBeNull();
  }, 30_000);
});
