/**
 * =====================================================================
 * LOT 2 — Preuve RUNTIME : ouverture réelle du Passport public (STAGING)
 * =====================================================================
 * NON COMMITTÉ par défaut (preuve runtime). Cible STAGING uniquement.
 *
 * Protocole de sécurité :
 *   • Import du harnais → assertSafeStagingTarget() (garde anti-prod).
 *   • Assertion EXPLICITE projectRef === bnzahwzuwoxjrxpqsjhp AVANT toute
 *     écriture ; sinon throw → aucune écriture.
 *   • Rollback en afterAll (démo privé PUIS supprimé) — empreinte nulle même
 *     si une assertion échoue en cours.
 *   • Aucune clé en clair (la clé anon est chargée dans process.env, jamais imprimée).
 * =====================================================================
 */
import { describe, it, expect, afterAll } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// La config d'intégration compile le JSX en runtime CLASSIQUE (React.createElement).
// PassportView (runtime automatique) n'importe pas React → on l'expose en global
// pour ce run de preuve (test-only, aucun impact production).
(globalThis as unknown as { React: unknown }).React = React;
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
import { PUBLIC_PASSPORT_WHITELIST, NEVER_PUBLIC, type PublicPassport } from '@/lib/api/publicPassport';
import { PUBLIC_PASSPORT_STRINGS as S } from '@/lib/constants/passport.strings';

const STAGING_REF = 'bnzahwzuwoxjrxpqsjhp';
const OUT_DIR = 'build/lot2-staging';

// ── Protocole #1 : STAGING confirmé AVANT toute écriture ──────────────
const ref = projectRef(TEST_URL);
if (ref !== STAGING_REF) {
  throw new Error(`[LOT2 STOP] Cible NON-staging (ref=${ref} ≠ ${STAGING_REF}). Aucune écriture.`);
}

// Router le VRAI lecteur public (fetchPublicPassport → createPublicClient, qui
// lit process.env) vers staging. La clé anon est chargée, JAMAIS imprimée.
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

// Import APRÈS avoir réglé process.env (createPublicClient lit l'env à l'appel,
// mais on reste défensif sur l'ordre).
import { fetchPublicPassport } from '@/lib/api/readPublicPassport';

// État partagé (pour le rollback en afterAll).
let demo: TestUser | null = null;
let demoHandle: string | null = null;
const proof: Record<string, unknown> = {
  lot: 'LOT 2 — ouverture réelle Passport public (staging)',
  staging_ref_confirmed: ref,
  staging_match: ref === STAGING_REF,
};

afterAll(async () => {
  // ── ROLLBACK obligatoire : privé PUIS suppression (empreinte nulle) ──
  const rollback: Record<string, unknown> = {};
  if (demoHandle) {
    const { error } = await admin
      .from('passports')
      .update({ visibility: 'private' })
      .eq('handle', demoHandle);
    rollback.set_private = error ? `err:${error.message}` : 'ok';
  }
  await cleanupAllUsers(); // supprime le compte démo → cascade profile→passport.
  rollback.demo_account_deleted = true;

  // Vérif empreinte nulle : la ligne n'existe plus, le public ne voit rien.
  if (demo) rollback.admin_passport_after = (await adminPassport(demo.id)) === null ? 'null (supprimé)' : 'PRÉSENT (anomalie)';
  if (demoHandle) rollback.public_view_after = (await fetchPublicPassport(demoHandle)) === null ? 'null (404)' : 'VISIBLE (anomalie)';
  proof.rollback = rollback;

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(`${OUT_DIR}/PROOF.json`, JSON.stringify(proof, null, 2) + '\n', 'utf8');
}, 30_000);

describe('LOT 2 — Passport public rendu réel contre staging', () => {
  it('émission réelle → 404 privé/inexistant → ouverture → rendu → périmètre', async () => {
    // ── 1. Émission par le VRAI chemin (trigger), compte démo fictif ──
    demo = await createUser({
      tag: 'lot2-demo',
      confirmed: true,
      fullName: 'Demo Passport (staging, a supprimer)',
      locale: 'en',
    });
    const passport = await waitForPassport(demo.id);
    expect(passport).not.toBeNull();
    demoHandle = passport!.handle;
    proof.demo_handle = demoHandle;
    proof.demo_email_is_fake = /@example\.com$/.test(demo.email);

    // ── 2. AVANT ouverture (privé) : 404 indistinguables ──
    const beforePrivate = await fetchPublicPassport(demoHandle!);
    const beforeInexistant = await fetchPublicPassport('inexistant-zzzz-404');
    expect(beforePrivate).toBeNull();
    expect(beforeInexistant).toBeNull();
    proof.before_open = {
      private_handle: beforePrivate === null ? 'null (404)' : 'FUITE',
      inexistant: beforeInexistant === null ? 'null (404)' : 'FUITE',
      indistinguishable: beforePrivate === beforeInexistant,
    };

    // ── 3. Ouverture : UN SEUL UPDATE ciblé sur le handle démo ──
    const { error: upErr } = await admin
      .from('passports')
      .update({ visibility: 'public' })
      .eq('handle', demoHandle!);
    expect(upErr).toBeNull();

    // ── 4. Rendu RÉEL via fetchPublicPassport + PassportView (HTML) ──
    const view = (await fetchPublicPassport(demoHandle!)) as PublicPassport;
    expect(view).not.toBeNull();

    // 4a. Whitelist stricte + aucun champ interne.
    expect(Object.keys(view).sort()).toEqual([...PUBLIC_PASSPORT_WHITELIST].sort());
    const leaked = NEVER_PUBLIC.filter((k) => k in (view as unknown as Record<string, unknown>));
    expect(leaked).toEqual([]);

    // 4b. Valeurs honnêtes (Point A) : nom null par conception (profiles illisible anon).
    expect(view.display_name).toBeNull();
    expect(view.headline).toBeNull();
    expect(typeof view.lifecycle_stage).toBe('string');

    // 4c. Rendu HTML réel de la page → Trust "Not yet computed", stub jamais rendu.
    const html = renderToStaticMarkup(createElement(PassportView, { passport: view }));
    expect(html).toContain(S.object); // "Professional Passport"
    expect(html).toContain(S.trustNotComputed); // "Not yet computed"
    expect(html).not.toMatch(/establishing/i); // le stub interne n'apparaît jamais
    // Aucune valeur interdite dans le HTML (email démo / opus id).
    expect(html).not.toContain(demo.email);

    proof.public_render = {
      whitelist_keys: Object.keys(view).sort(),
      never_public_leaked: leaked,
      display_name: view.display_name,
      headline: view.headline,
      lifecycle_stage: view.lifecycle_stage,
      trust_rendered: S.trustNotComputed,
      stub_establishing_in_html: /establishing/i.test(html),
      note_A: 'display_name/headline null PAR CONCEPTION (whitelist+RLS ; nom vit sur profiles, illisible anon). "Nom public" = decision de divulgation dediee, hors Lot 2.',
    };

    // ── 5. Point B : inventaire COLONNES de l'endpoint REST brut anon ──
    // (constat, PAS une correction — la RLS n'est pas touchee dans ce lot.)
    const anon = anonClient();
    const rawPass = await anon.from('passports').select('*').eq('handle', demoHandle!);
    const rawRow = (rawPass.data ?? [])[0] ?? null;
    const rawProfiles = await anon.from('profiles').select('*');
    proof.point_B_raw_rest_perimeter = {
      endpoint: 'GET /rest/v1/passports?visibility=eq.public&select=*  (role anon)',
      row_returned: rawRow !== null,
      columns_exposed_raw: rawRow ? Object.keys(rawRow).sort() : [],
      columns_beyond_whitelist: rawRow
        ? Object.keys(rawRow).filter((c) => !(PUBLIC_PASSPORT_WHITELIST as readonly string[]).includes(c)).sort()
        : [],
      profiles_readable_by_anon: (rawProfiles.data ?? []).length, // attendu 0
      constat: 'grant select colonne-large + policy row-level ; l API/page restent sures (whitelist), mais l endpoint DB brut est plus large. A traiter dans un lot securite dedie (vue security-definer / grant colonne). NON corrige ici (mandat: pas de modif RLS).',
    };

    // Confirme que la page/API ne fuient pas malgré l'endpoint brut plus large.
    expect((rawProfiles.data ?? []).length).toBe(0); // email/opus_id illisibles par anon.

    // ── 6. Après ouverture : inexistant reste 404 ──
    expect(await fetchPublicPassport('inexistant-zzzz-404')).toBeNull();
  }, 30_000);
});
