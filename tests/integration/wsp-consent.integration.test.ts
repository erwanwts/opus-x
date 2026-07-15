/**
 * =====================================================================
 * LOT O2a (+ EXT) — Liaison, consentement & CANAL DU JETON (base LIVE).
 * =====================================================================
 * Prouve, contre le staging :
 *   O2a  — consentement append-only (3 axes), état = dernier événement,
 *          révocation sans effacement, par plateforme (P4), RLS sujet.
 *   EXT  — authorize renvoie un CODE (jamais un jeton) ; le jeton s'obtient
 *          UNIQUEMENT par le canal arrière HMAC (wsp_exchange_code) :
 *          code à usage unique, expirable, lié à l'Issuer, échange atomique
 *          (×5 → 1 jeton), refus uniformes, révocation entre octroi et échange.
 *
 * PRÉREQUIS : migrations 20260713000003 ET 20260713000004 appliquées.
 * ⚠️ APPEND-ONLY : les faits de consentement QA sont permanents (par design).
 * =====================================================================
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { admin, anonClient, createUser, signIn, waitForPassport, adminProfile } from './_harness';
import {
  generateExchangeCode,
  generateLinkToken,
  hashLinkToken,
  LINK_CONSENT_VERSION,
  LINK_CODE_TTL_SECONDS,
} from '../../lib/link/issuerAuthToken';
import { signIssuerRequest } from '../../lib/issuer/hmac';
import type { SupabaseClient } from '@supabase/supabase-js';

// Ids NEUFS : wsp_issuers est append-only, redirect_uri se fixe à l'INSERT.
const ISSUER_X = 'issuer:qa-link-x';
const ISSUER_Y = 'issuer:qa-link-y';
const SECRET_X = 'qa-hmac-secret-x-9f3a';
const SECRET_Y = 'qa-hmac-secret-y-1b7c';
const REDIRECT_X = 'https://issuer-x.example/callback';
const REDIRECT_Y = 'https://issuer-y.example/callback';
const REDIRECT: Record<string, string> = { [ISSUER_X]: REDIRECT_X, [ISSUER_Y]: REDIRECT_Y };

async function ensureIssuer(id: string, secret: string, redirectUri: string) {
  await admin
    .from('wsp_issuers')
    .upsert(
      { id, display_name: 'QA Issuer', status: 'active', redirect_uri: redirectUri },
      { onConflict: 'id', ignoreDuplicates: true }
    );
  await admin
    .from('wsp_issuer_secrets')
    .upsert({ issuer_id: id, hmac_secret: secret }, { onConflict: 'issuer_id' });
}

async function makeSubject(tag: string): Promise<{ opus: string; client: SupabaseClient }> {
  const u = await createUser({ tag, confirmed: true });
  await waitForPassport(u.id);
  const opus = (await adminProfile(u.id))!.opus_id as string;
  const client = await signIn(u.email, u.password);
  return { opus, client };
}

/** Octroi : renvoie le CODE clair (généré côté test ; seul son hash part en base). */
async function authorizeCode(client: SupabaseClient, issuerId: string): Promise<string> {
  const code = generateExchangeCode();
  const { error } = await client.rpc('wsp_authorize_issuer', {
    p_issuer_id: issuerId,
    p_consent_text_version: LINK_CONSENT_VERSION,
    p_code_hash: hashLinkToken(code),
    p_redirect_uri: REDIRECT[issuerId],
    p_ttl_seconds: LINK_CODE_TTL_SECONDS,
  });
  if (error) throw new Error(`authorize: ${error.message}`);
  return code;
}

/** Échange canal arrière (anon + HMAC). Renvoie l'erreur éventuelle + le jeton tenté. */
async function exchange(issuerId: string, code: string, secret: string) {
  const ts = Math.floor(Date.now() / 1000).toString();
  const sig = signIssuerRequest(secret, ts, code);
  const token = generateLinkToken();
  const res = await anonClient().rpc('wsp_exchange_code', {
    p_issuer_id: issuerId,
    p_timestamp: ts,
    p_code: code,
    p_signature: sig,
    p_token_hash: hashLinkToken(token),
  });
  return { data: res.data, error: res.error, token };
}

let A: { opus: string; client: SupabaseClient };
let B: { opus: string; client: SupabaseClient };

beforeAll(async () => {
  await ensureIssuer(ISSUER_X, SECRET_X, REDIRECT_X);
  await ensureIssuer(ISSUER_Y, SECRET_Y, REDIRECT_Y);
  A = await makeSubject('cext-a');
  B = await makeSubject('cext-b');
});

describe('O2a-EXT — authorize renvoie un CODE, jamais un jeton', () => {
  it('la RPC d’octroi ne renvoie aucun jeton', async () => {
    const code = generateExchangeCode();
    const { data, error } = await A.client.rpc('wsp_authorize_issuer', {
      p_issuer_id: ISSUER_X,
      p_consent_text_version: LINK_CONSENT_VERSION,
      p_code_hash: hashLinkToken(code),
      p_redirect_uri: REDIRECT_X,
      p_ttl_seconds: LINK_CODE_TTL_SECONDS,
    });
    expect(error).toBeNull();
    expect(data.opus_id).toBe(A.opus);
    expect(data.state).toBe('active');
    expect(JSON.stringify(data)).not.toContain('token'); // aucun jeton, jamais
  });

  it('redirect_uri NON enregistré → refus (aucun grant, aucun code)', async () => {
    const code = generateExchangeCode();
    const { error } = await A.client.rpc('wsp_authorize_issuer', {
      p_issuer_id: ISSUER_X,
      p_consent_text_version: LINK_CONSENT_VERSION,
      p_code_hash: hashLinkToken(code),
      p_redirect_uri: 'https://evil.example/grab', // ≠ enregistré
      p_ttl_seconds: LINK_CODE_TTL_SECONDS,
    });
    expect(error).not.toBeNull();
  });
});

describe('O2a-EXT — l’échange : code → jeton (canal arrière HMAC)', () => {
  it('échange valide → jeton minté, stocké en HASH ; consentement actif', async () => {
    const code = await authorizeCode(A.client, ISSUER_X);
    const { data, error, token } = await exchange(ISSUER_X, code, SECRET_X);
    expect(error).toBeNull();
    expect(data.opus_id).toBe(A.opus);

    const { data: authz } = await admin
      .from('wsp_issuer_authorizations')
      .select('token_hash')
      .eq('subject_id', A.opus)
      .eq('issuer_id', ISSUER_X)
      .maybeSingle();
    expect(authz?.token_hash).toBe(hashLinkToken(token));
    expect(authz?.token_hash).not.toBe(token);
  });

  it('code RÉUTILISÉ → refus (usage unique)', async () => {
    const code = await authorizeCode(A.client, ISSUER_X);
    const first = await exchange(ISSUER_X, code, SECRET_X);
    expect(first.error).toBeNull();
    const second = await exchange(ISSUER_X, code, SECRET_X);
    expect(second.error).not.toBeNull();
  });

  it('code EXPIRÉ → refus', async () => {
    // Un grant réel (consentement actif) + un code déjà expiré inséré en base.
    const seed = await authorizeCode(A.client, ISSUER_X); // crée un grant actif
    void seed;
    const expiredCode = generateExchangeCode();
    await admin.from('wsp_exchange_codes').insert({
      code_hash: hashLinkToken(expiredCode),
      subject_id: A.opus,
      issuer_id: ISSUER_X,
      consent_seq: 999999,
      expires_at: new Date(Date.now() - 1000).toISOString(),
    });
    const { error } = await exchange(ISSUER_X, expiredCode, SECRET_X);
    expect(error).not.toBeNull();
  });

  it('code d’un AUTRE Issuer → refus (le code appartient à X, échange tenté par Y)', async () => {
    const code = await authorizeCode(A.client, ISSUER_X);
    // Y s'authentifie correctement (son secret), mais le code n'est pas le sien.
    const { error } = await exchange(ISSUER_Y, code, SECRET_Y);
    expect(error).not.toBeNull();
  });

  it('HMAC invalide → refus (401 côté route)', async () => {
    const code = await authorizeCode(A.client, ISSUER_X);
    const { error } = await exchange(ISSUER_X, code, 'mauvais-secret');
    expect(error).not.toBeNull();
  });

  it('les refus sont INDIFFÉRENCIÉS (même message)', async () => {
    const reused = await authorizeCode(A.client, ISSUER_X);
    await exchange(ISSUER_X, reused, SECRET_X);
    const r1 = await exchange(ISSUER_X, reused, SECRET_X); // réutilisé
    const r2 = await exchange(ISSUER_X, generateExchangeCode(), SECRET_X); // inconnu
    const r3 = await exchange(ISSUER_X, await authorizeCode(A.client, ISSUER_X), 'x'); // HMAC faux
    expect(r1.error!.message).toBe(r2.error!.message);
    expect(r2.error!.message).toBe(r3.error!.message);
  });

  it('échange concurrent ×5 (même code) → UN SEUL jeton minté', async () => {
    const code = await authorizeCode(A.client, ISSUER_X);
    const results = await Promise.all(Array.from({ length: 5 }, () => exchange(ISSUER_X, code, SECRET_X)));
    const successes = results.filter((r) => !r.error);
    expect(successes).toHaveLength(1);
  });

  it('consentement RÉVOQUÉ entre l’octroi et l’échange → refus', async () => {
    const C = await makeSubject('cext-revoke');
    const code = await authorizeCode(C.client, ISSUER_X);
    await C.client.rpc('wsp_revoke_issuer', {
      p_issuer_id: ISSUER_X,
      p_consent_text_version: LINK_CONSENT_VERSION,
    });
    const { error } = await exchange(ISSUER_X, code, SECRET_X);
    expect(error).not.toBeNull();
  });
});

describe('O2a — consentement : par plateforme, historique, append-only, RLS', () => {
  it('consentement pour X n’autorise pas Y (P4)', async () => {
    await authorizeCode(A.client, ISSUER_X);
    const activeX = await admin.rpc('wsp_consent_active', { p_subject_id: A.opus, p_issuer_id: ISSUER_X });
    const activeY = await admin.rpc('wsp_consent_active', { p_subject_id: A.opus, p_issuer_id: ISSUER_Y });
    expect(activeX.data).toBe(true);
    expect(activeY.data).toBe(false);
  });

  it('grant → revoke → grant : 3 faits vivent, état = actif, rien d’effacé', async () => {
    const D = await makeSubject('cext-seq');
    const v = LINK_CONSENT_VERSION;
    await authorizeCode(D.client, ISSUER_X);
    await D.client.rpc('wsp_revoke_issuer', { p_issuer_id: ISSUER_X, p_consent_text_version: v });
    await authorizeCode(D.client, ISSUER_X);

    const { data: events } = await D.client
      .from('wsp_consent_events')
      .select('action, consent_seq')
      .eq('issuer_id', ISSUER_X)
      .order('consent_seq');
    expect((events ?? []).map((e) => e.action)).toEqual(['grant', 'revoke', 'grant']);

    const active = await admin.rpc('wsp_consent_active', { p_subject_id: D.opus, p_issuer_id: ISSUER_X });
    expect(active.data).toBe(true);
  });

  it('append-only : UPDATE / DELETE sur wsp_consent_events → échec SGBD', async () => {
    const up = await admin
      .from('wsp_consent_events')
      .update({ action: 'revoke' })
      .eq('subject_id', A.opus)
      .eq('issuer_id', ISSUER_X);
    expect(up.error).not.toBeNull();
    const del = await admin.from('wsp_consent_events').delete().eq('subject_id', A.opus).eq('issuer_id', ISSUER_X);
    expect(del.error).not.toBeNull();
  });

  it('RLS : A lit les siens · B ne lit rien de A · anon rien', async () => {
    const own = await A.client.from('wsp_consent_events').select('subject_id').eq('issuer_id', ISSUER_X);
    expect((own.data ?? []).every((e) => e.subject_id === A.opus)).toBe(true);

    const bReadsA = await B.client.from('wsp_consent_events').select('subject_id').eq('subject_id', A.opus);
    expect(bReadsA.data ?? []).toHaveLength(0);

    const anon = await anonClient().from('wsp_consent_events').select('id').eq('subject_id', A.opus);
    expect(anon.data ?? []).toHaveLength(0);
  });

  it('le credential (jeton hashé) reste illisible côté client', async () => {
    const leak = await A.client.from('wsp_issuer_authorizations').select('token_hash');
    expect(leak.data ?? []).toHaveLength(0);
    // Et les secrets HMAC : aucun accès client non plus.
    const secrets = await A.client.from('wsp_issuer_secrets').select('hmac_secret');
    expect(secrets.data ?? []).toHaveLength(0);
  });
});
