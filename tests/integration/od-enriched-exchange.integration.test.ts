/**
 * =====================================================================
 * O-D (D-055) — le retour ENRICHI de l'échange (ENG-002 v0.4 §13).
 * =====================================================================
 * Point d'arrêt, sur STAGING (jamais la prod) : un échange RÉUSSI renvoie les
 * quatre champs du contrat partagé avec Commando —
 *   opus_id + passport_id + link_status + issuer_authorization_id
 * et link_status est DÉRIVÉ par Opus X : 'linked' à la première autorisation du
 * couple, 'relinked' quand elle est rafraîchie. Non-énumération inchangée
 * (prouvée par le test unitaire de la route + l'ordre 1→5 non touché).
 * =====================================================================
 */
import { describe, it, expect, beforeAll } from 'vitest';
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
import { afterAll } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { signIssuerRequest } from '../../lib/issuer/hmac';
import { generateExchangeCode, hashLinkToken, LINK_CONSENT_VERSION, LINK_CODE_TTL_SECONDS } from '../../lib/link/issuerAuthToken';

afterAll(cleanupAllUsers);

const ISSUER = 'issuer:qa-exchange-x';
const SECRET = 'qa-exchange-secret-e2e-9b2c';
const REDIRECT = 'https://qa-exchange.example/callback';

let opus: string;
let passportId: string;
let subject: SupabaseClient;

beforeAll(async () => {
  await admin.from('wsp_issuers').upsert(
    { id: ISSUER, display_name: 'QA Exchange Issuer', status: 'active', redirect_uri: REDIRECT },
    { onConflict: 'id', ignoreDuplicates: true },
  );
  await admin.from('wsp_issuer_secrets').upsert({ issuer_id: ISSUER, hmac_secret: SECRET }, { onConflict: 'issuer_id' });

  const u = await createUser({ tag: 'od-exchange', confirmed: true });
  await waitForPassport(u.id);
  opus = (await adminProfile(u.id))!.opus_id as string;
  passportId = (await adminPassport(u.id))!.id as string;
  subject = await signIn(u.email, u.password);
});

/** Le sujet autorise l'Issuer (émet un code) ; l'Issuer échange le code (HMAC). */
async function authorizeThenExchange() {
  const code = generateExchangeCode();
  const auth = await subject.rpc('wsp_authorize_issuer', {
    p_issuer_id: ISSUER,
    p_consent_text_version: LINK_CONSENT_VERSION,
    p_code_hash: hashLinkToken(code),
    p_redirect_uri: REDIRECT,
    p_ttl_seconds: LINK_CODE_TTL_SECONDS,
  });
  expect(auth.error).toBeNull();

  const ts = Math.floor(Date.now() / 1000).toString();
  const sig = signIssuerRequest(SECRET, ts, code);
  const tokenHash = hashLinkToken('wsplnk_probe_' + Math.random().toString(36).slice(2));
  const ex = await anonClient().rpc('wsp_exchange_code', {
    p_issuer_id: ISSUER,
    p_timestamp: ts,
    p_code: code,
    p_signature: sig,
    p_token_hash: tokenHash,
  });
  return ex;
}

describe('O-D — retour enrichi de l’échange (staging)', () => {
  it('⭐ première autorisation → 4 champs, link_status="linked", passport_id = le Passeport du sujet', async () => {
    const ex = await authorizeThenExchange();
    expect(ex.error).toBeNull();
    const d = ex.data as {
      opus_id: string; passport_id: string; link_status: string; issuer_authorization_id: string;
    };
    expect(d.opus_id).toBe(opus);
    expect(d.passport_id).toBe(passportId);          // indice de cache (D-053)
    expect(d.link_status).toBe('linked');            // dérivé : première du couple
    expect(typeof d.issuer_authorization_id).toBe('string');
    expect(d.issuer_authorization_id.startsWith('iaz_')).toBe(true);
  });

  it('⭐ ré-autorisation du même couple → link_status="relinked" (dérivé, jamais asserté)', async () => {
    const ex = await authorizeThenExchange();
    expect(ex.error).toBeNull();
    const d = ex.data as { opus_id: string; link_status: string; issuer_authorization_id: string };
    expect(d.opus_id).toBe(opus);
    expect(d.link_status).toBe('relinked');          // l'autorisation du couple existait déjà
  });
});
