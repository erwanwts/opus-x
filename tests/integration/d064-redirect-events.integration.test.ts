/**
 * =====================================================================
 * D-064 — redirect_uri = fait versionné append-only (résout D-057).
 * =====================================================================
 * Sur STAGING (jamais la prod). wsp_authorize_issuer résout le redirect_uri
 * COURANT depuis wsp_issuer_redirect_events (dernier événement), sinon repli
 * sur wsp_issuers.redirect_uri. Preuves falsifiables :
 *   a) SANS événement → repli : l'octroi réussit avec le redirect_uri de la colonne ;
 *   b) AVEC événement → l'octroi réussit avec la NOUVELLE URL et ÉCHOUE avec l'ancienne ;
 *   c) UPDATE/DELETE sur la table → 23001 (append-only) ;
 *   e) INSERT en anon/authenticated → refusé (RLS/deny) ;
 *   f) contrôle de forme : http non-localhost ou espace → CHECK violation.
 * (d) « nb de versions de wsp_authorize_issuer inchangé » = requête pg_proc
 *     manuelle (PostgREST ne fait pas de SELECT pg_proc) — fournie au rapport.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  admin,
  anonClient,
  createUser,
  signIn,
  waitForPassport,
  cleanupAllUsers,
} from './_harness';
import { generateExchangeCode, hashLinkToken, LINK_CONSENT_VERSION, LINK_CODE_TTL_SECONDS } from '../../lib/link/issuerAuthToken';
import type { SupabaseClient } from '@supabase/supabase-js';

afterAll(cleanupAllUsers);

const ISSUER = `issuer:qa-redir-${Date.now().toString(36)}`;
const OLD = 'https://qa-redir-old.example/cb';   // repli (colonne wsp_issuers)
const NEW = 'https://qa-redir-new.example/cb';   // événement versionné
let session: SupabaseClient;

/** Octroi : le sujet autorise ISSUER pour un redirect_uri donné. */
async function authorize(redirectUri: string) {
  const code = generateExchangeCode();
  return session.rpc('wsp_authorize_issuer', {
    p_issuer_id: ISSUER,
    p_consent_text_version: LINK_CONSENT_VERSION,
    p_code_hash: hashLinkToken(code),
    p_redirect_uri: redirectUri,
    p_ttl_seconds: LINK_CODE_TTL_SECONDS,
  });
}

beforeAll(async () => {
  // Émetteur créé par INSERT (append-only autorise l'INSERT) avec un redirect_uri
  // de repli dans la colonne wsp_issuers.
  await admin.from('wsp_issuers').upsert(
    { id: ISSUER, display_name: 'QA Redirect Issuer', status: 'active', redirect_uri: OLD },
    { onConflict: 'id', ignoreDuplicates: true },
  );
  const u = await createUser({ tag: 'd064', confirmed: true });
  await waitForPassport(u.id);
  session = await signIn(u.email, u.password);
});

describe('D-064 — redirect_uri versionné (staging)', () => {
  it('a) SANS événement → repli sur wsp_issuers.redirect_uri (octroi réussit)', async () => {
    const r = await authorize(OLD);
    expect(r.error).toBeNull();
    expect((r.data as { state: string }).state).toBe('active');
  });

  it('b) AVEC événement → octroi réussit avec la NOUVELLE URL, ÉCHOUE avec l’ancienne', async () => {
    const ins = await admin
      .from('wsp_issuer_redirect_events')
      .insert({ issuer_id: ISSUER, redirect_uri: NEW, seq: 1 });
    expect(ins.error).toBeNull();

    const ok = await authorize(NEW);
    expect(ok.error).toBeNull();
    expect((ok.data as { state: string }).state).toBe('active');

    const ko = await authorize(OLD); // l'ancien redirect n'est plus le courant
    expect(ko.error).not.toBeNull();
  });

  it('c) UPDATE / DELETE sur la table → append-only (23001)', async () => {
    const upd = await admin
      .from('wsp_issuer_redirect_events')
      .update({ redirect_uri: 'https://qa-redir-hack.example/cb' })
      .eq('issuer_id', ISSUER);
    expect(upd.error).not.toBeNull();
    expect(upd.error!.code === '23001' || /append.?only|WSP_APPEND_ONLY/i.test(upd.error!.message)).toBe(true);

    const del = await admin.from('wsp_issuer_redirect_events').delete().eq('issuer_id', ISSUER);
    expect(del.error).not.toBeNull();
    expect(del.error!.code === '23001' || /append.?only|WSP_APPEND_ONLY/i.test(del.error!.message)).toBe(true);
  });

  it('e) INSERT en anon ET en authenticated → refusé (RLS deny, aucune policy)', async () => {
    const anon = await anonClient()
      .from('wsp_issuer_redirect_events')
      .insert({ issuer_id: ISSUER, redirect_uri: 'https://qa-anon.example/cb', seq: 98 });
    expect(anon.error).not.toBeNull();

    const auth = await session
      .from('wsp_issuer_redirect_events')
      .insert({ issuer_id: ISSUER, redirect_uri: 'https://qa-auth.example/cb', seq: 99 });
    expect(auth.error).not.toBeNull();
  });

  it('f) contrôle de forme : http non-localhost / espace → CHECK violation', async () => {
    const bad1 = await admin
      .from('wsp_issuer_redirect_events')
      .insert({ issuer_id: ISSUER, redirect_uri: 'http://evil.example/cb', seq: 2 });
    expect(bad1.error).not.toBeNull(); // pas https, pas localhost

    const bad2 = await admin
      .from('wsp_issuer_redirect_events')
      .insert({ issuer_id: ISSUER, redirect_uri: 'https://x.example/c b', seq: 3 });
    expect(bad2.error).not.toBeNull(); // espace interdit

    // localhost usurpé : http://localhost.evil.com/x n'est PAS localhost.
    const bad3 = await admin
      .from('wsp_issuer_redirect_events')
      .insert({ issuer_id: ISSUER, redirect_uri: 'http://localhost.evil.com/x', seq: 4 });
    expect(bad3.error).not.toBeNull(); // ni https, ni localhost réel
  });
});
