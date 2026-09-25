/**
 * =====================================================================
 * 2b — E2E : credential OB 3.0 signé → /issuers/evidence (base LIVE staging).
 * =====================================================================
 * Une VRAIE requête à travers le handler de route `POST` (même code que l'HTTP :
 * `request.text()` lit le raw, le client anon tape staging). Les DEUX barrières :
 *   • HMAC transport (D-050 étape 1) ;
 *   • signature du BADGE (obVerify + clé publique) + cross-check (D-048/D-049) ;
 * puis la chaîne (evidence → passport_update → Trust), niveau DÉRIVÉ (D-051).
 * =====================================================================
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { generateKeyPair, exportJWK, CompactSign, base64url, type JWK } from 'jose';
import { admin, createUser, signIn, waitForPassport, adminProfile } from './_harness';

// La route lit process.env.NEXT_PUBLIC_SUPABASE_* (createPublicClient) ; le harnais,
// lui, lit .env.test.local. On aligne : on injecte les creds STAGING dans process.env
// pour que le handler de route tape bien la base de test (jamais la prod).
{
  const raw = readFileSync(path.resolve(__dirname, '../../.env.test.local'), 'utf8');
  const env: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trimStart().startsWith('#')) env[m[1]] = m[2];
  }
  process.env.NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
import { signIssuerRequest } from '../../lib/issuer/hmac';
import { canonicalHash } from '../../lib/wsp/canonical';
import { buildCoveredObject } from '../../lib/wsp/evidenceCovered';
import { generateExchangeCode, hashLinkToken, LINK_CONSENT_VERSION, LINK_CODE_TTL_SECONDS } from '../../lib/link/issuerAuthToken';
import { POST } from '../../app/issuers/evidence/route';
import type { SupabaseClient } from '@supabase/supabase-js';

const ISSUER = 'issuer:qa-badge-x';
const SECRET = 'qa-badge-secret-e2e-3f7a';
const ACTOR = '8f2b1c44-0e91-4a7d-9c33-1b6f0d5a77e2';
const enc = (o: unknown) => new TextEncoder().encode(JSON.stringify(o));
const uniq = (p: string) => `${p}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;

let priv: CryptoKey;
let pubJwk: JWK;
let opus: string;
let subjectClient: SupabaseClient;
let skillCode: string, fwSlug: string, fwVersion: string;

beforeAll(async () => {
  // Émetteur de test + secret HMAC + CLÉ PUBLIQUE (la privée reste ici pour signer).
  const kp = await generateKeyPair('EdDSA', { extractable: true });
  priv = kp.privateKey;
  pubJwk = (await exportJWK(kp.publicKey)) as JWK;
  await admin.from('wsp_issuers').upsert(
    { id: ISSUER, display_name: 'QA Badge Issuer', status: 'active', redirect_uri: 'https://qa-badge.example/callback' },
    { onConflict: 'id', ignoreDuplicates: true },
  );
  await admin.from('wsp_issuer_secrets').upsert({ issuer_id: ISSUER, hmac_secret: SECRET }, { onConflict: 'issuer_id' });
  await admin.from('wsp_issuer_keys').upsert(
    { id: `${ISSUER}#key-1`, issuer_id: ISSUER, algorithm: 'EdDSA', public_key_jwk: pubJwk, key_id: 'key-1', status: 'active' },
    { onConflict: 'id' },
  );

  // Coordonnées réelles de la Skill (pour une targetUrl qui RÉSOUT) : wtr:212.
  const { data: sk } = await admin.from('wsp_skills').select('code, framework_version, framework_id').eq('id', 'wtr:212').maybeSingle();
  skillCode = (sk as { code: string }).code;
  fwVersion = (sk as { framework_version: string }).framework_version;
  const { data: fw } = await admin.from('wsp_frameworks').select('slug').eq('id', (sk as { framework_id: string }).framework_id).maybeSingle();
  fwSlug = (fw as { slug: string }).slug;

  // Sujet de test dédié + consentement pour l'émetteur.
  const u = await createUser({ tag: 'badge-e2e', confirmed: true });
  await waitForPassport(u.id);
  opus = (await adminProfile(u.id))!.opus_id as string;
  subjectClient = await signIn(u.email, u.password);
  const code = generateExchangeCode();
  await subjectClient.rpc('wsp_authorize_issuer', {
    p_issuer_id: ISSUER, p_consent_text_version: LINK_CONSENT_VERSION,
    p_code_hash: hashLinkToken(code), p_redirect_uri: 'https://qa-badge.example/callback', p_ttl_seconds: LINK_CODE_TTL_SECONDS,
  });
});

/** Le VC OB 3.0 (claims), aligné sur la Skill réelle, portant une OBSERVATION (D-051). */
function vcClaims(o: { opusId?: string; obs?: number; targetUrl?: string } = {}) {
  return {
    '@context': ['https://www.w3.org/ns/credentials/v2', 'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json'],
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    issuer: ISSUER,
    credentialSubject: {
      id: o.opusId ?? opus,
      achievement: { alignment: [{ targetUrl: o.targetUrl ?? `https://opusx.world/wsp/frameworks/${fwSlug}/v${fwVersion}/skills/${skillCode}` }] },
      observation: { criteria: ['S03.C08'], criterion_levels: { 'S03.C08': o.obs ?? 3 } },
    },
    framework: { id: 'framework:wtr', version: fwVersion },
  };
}
const signVc = (claims: unknown) => new CompactSign(enc(claims)).setProtectedHeader({ alg: 'EdDSA' }).sign(priv);

/** Enveloppe WSP-native (Annexe A) + canonical_hash + champ `credential` (D-048). */
function envelope(credential: string, o: { obs?: number; claimed?: string; evidenceId?: string } = {}) {
  const critKey = 'S03.C08';
  const base: Record<string, unknown> = {
    protocol_version: '1.0', type: 'evidence', schema_version: '1.0',
    canonicalization_algorithm: 'RFC8785', hash_algorithm: 'SHA-256',
    issuer: { id: ISSUER, evidence_id: o.evidenceId ?? uniq('pu'), attested_by: { actor_id: ACTOR, role: 'coach' } },
    subject: { opus_id: opus },
    framework: { id: 'framework:wtr', version: fwVersion },
    demonstrates: { skill_id: 'wtr:212', claimed_level: o.claimed ?? 'applied' },
    observation: { criteria: [critKey], criterion_levels: { [critKey]: o.obs ?? 3 } },
    provenance: { evidence_ref: { kind: 'mission_result', id: 'uuid-e2e' } },
    occurred_at: '2026-07-20T14:32:00.000Z', attested_at: '2026-07-20T14:35:12.480Z', is_declaration: false,
  };
  base.canonical_hash = canonicalHash(buildCoveredObject(base)).hash;
  base.credential = credential; // exclu du hash (§6.2), verifié par obVerify
  return base;
}

async function post(env: Record<string, unknown>, opts: { badSig?: boolean } = {}) {
  const raw = JSON.stringify(env);
  const ts = Math.floor(Date.now() / 1000).toString();
  const sig = signIssuerRequest(opts.badSig ? 'mauvais-secret' : SECRET, ts, raw);
  const req = new NextRequest('https://staging.opus-x.test/issuers/evidence', {
    method: 'POST',
    headers: { 'x-wsp-issuer': ISSUER, 'x-wsp-timestamp': ts, 'x-wsp-signature': sig, 'content-type': 'application/json' },
    body: raw,
  });
  const res = await POST(req);
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

describe('2b E2E — /issuers/evidence avec credential OB 3.0 signé (staging)', () => {
  it('⭐ CHEMIN HEUREUX — badge signé + HMAC valide + claims == enveloppe → ACCEPTÉ, chaîne complète', async () => {
    const evId = uniq('pu');
    const credential = await signVc(vcClaims());
    const { status, body } = await post(envelope(credential, { evidenceId: evId }));
    expect(status).toBe(201);
    expect(body.status).toBe('accepted');

    // evidence + demonstrates_skill
    const { data: fact } = await admin.from('wsp_evidence').select('subject_id, id').eq('id', body.evidence_id).maybeSingle();
    expect(fact?.subject_id).toBe(opus);
    // passport_update evidence
    const { data: pa } = await admin.from('passports').select('id').eq('profile_id', (await admin.from('profiles').select('id').eq('opus_id', opus).maybeSingle()).data!.id).maybeSingle();
    const { count: puCount } = await admin.from('wsp_passport_updates').select('id', { count: 'exact', head: true }).eq('passport_id', pa!.id).eq('update_type', 'evidence');
    expect((puCount ?? 0)).toBeGreaterThanOrEqual(1);
    // Trust par compétence calculé (niveau DÉRIVÉ de l'observation 3 → applied → emerging)
    const { data: ct } = await admin.from('wsp_competency_trust').select('state, basis_level').eq('passport_id', pa!.id).eq('skill_id', 'wtr:212').maybeSingle();
    expect(ct?.basis_level).toBe('applied'); // DÉRIVÉ par le WSP, pas imposé
    expect(ct?.state).toBe('emerging');
  });

  it('D-051 — niveau DÉCLARÉ gonflé (obs 3, claimed mastery) → claimed_level_incoherent (l\'émetteur ne peut pas imposer)', async () => {
    const credential = await signVc(vcClaims({ obs: 3 }));
    const { status, body } = await post(envelope(credential, { obs: 3, claimed: 'mastery' }));
    expect(status).toBe(422);
    expect(body.error.code).toBe('claimed_level_incoherent');
  });

  it('⭐ badge ALTÉRÉ après signature + HMAC valide → badge_signature_invalid', async () => {
    const credential = await signVc(vcClaims());
    const [h, , s] = credential.split('.');
    const forged = vcClaims();
    forged.credentialSubject.observation.criterion_levels['S03.C08'] = 5; // gonflé sans re-signer
    const tampered = `${h}.${base64url.encode(enc(forged))}.${s}`;
    const { status, body } = await post(envelope(tampered));
    expect(status).toBe(422);
    expect(body.error.code).toBe('badge_signature_invalid');
  });

  it('claims du credential ≠ enveloppe (skill divergente) → credential_envelope_mismatch', async () => {
    // VC aligné sur une AUTRE skill (targetUrl code bidon) mais enveloppe = wtr:212.
    const credential = await signVc(vcClaims({ targetUrl: `https://opusx.world/wsp/frameworks/${fwSlug}/v${fwVersion}/skills/WTR-999` }));
    const { status, body } = await post(envelope(credential));
    expect(status).toBe(422);
    expect(body.error.code).toBe('credential_envelope_mismatch');
  });

  it('HMAC de transport invalide → unauthorized (barrière transport, avant obVerify)', async () => {
    const credential = await signVc(vcClaims());
    const { status, body } = await post(envelope(credential), { badSig: true });
    expect(status).toBe(401);
    expect(body.error.code).toBe('unauthorized');
  });
});
