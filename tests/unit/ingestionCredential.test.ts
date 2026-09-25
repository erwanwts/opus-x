/**
 * =====================================================================
 * 2b — VÉRIF BADGE + CROSS-CHECK · tests falsifiables (D-048…D-051)
 * =====================================================================
 * La DEUXIÈME barrière (signature du credential) doit MORDRE, indépendamment
 * du HMAC de transport. Chaque test est réfutable :
 *   1. badge bien signé + claims == enveloppe → ACCEPTÉ ;
 *   2. ⭐ badge ALTÉRÉ après signature → REJETÉ (badge_signature_invalid) ;
 *   3. badge signé par une AUTRE clé (usurpateur) → REJETÉ ;
 *   4. signature valide mais claims ≠ enveloppe (skill/sujet/obs) → REJETÉ
 *      (credential_envelope_mismatch) ;
 *   5. mutation : court-circuiter obVerify ⇒ (2)(3) casseraient.
 * Le NIVEAU n'est jamais cross-checké (D-051 : dérivé, pas imposé).
 * =====================================================================
 */
import { describe, it, expect } from 'vitest';
import { generateKeyPair, exportJWK, CompactSign, base64url, type JWK } from 'jose';
import { verifyBadgeCredential, type EnvelopeClaims } from '@/lib/wsp/ingestionCredential';

const VC = {
  '@context': ['https://www.w3.org/ns/credentials/v2', 'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json'],
  type: ['VerifiableCredential', 'OpenBadgeCredential'],
  issuer: 'issuer:wts-001',
  validFrom: '2026-09-25T00:00:00.000Z',
  credentialSubject: {
    id: 'mailto:eleve@example.com',
    type: ['AchievementSubject'],
    achievement: {
      id: 'urn:uuid:achv-212',
      type: ['Achievement'],
      name: 'Intention vs Engagement',
      alignment: [{ type: ['Alignment'], targetUrl: 'https://opusx.world/wsp/frameworks/world-trader/v0.1/skills/WTR-212' }],
    },
    observation: { criteria: ['S03.C08'], criterion_levels: { 'S03.C08': 3 } },
  },
  framework: { id: 'framework:wtr', version: '0.1' },
} as const;

const ENVELOPE: EnvelopeClaims = {
  issuerId: 'issuer:wts-001',
  subjectOpusId: 'opx_TEST',
  skillId: 'wtr:212',
  framework: { id: 'framework:wtr', version: '0.1' },
  observation: { criteria: ['S03.C08'], criterion_levels: { 'S03.C08': 3 } },
};

// Résolveurs INJECTÉS (DB simulée) — reliage provisoire D-047 + alignment→skill D-049.
const resolveSubject = (id: unknown) => (id === 'mailto:eleve@example.com' ? 'opx_TEST' : null);
const resolveSkillId = (p: { frameworkSlug: string; version: string; skillCode: string }) =>
  p.frameworkSlug === 'world-trader' && p.skillCode === 'WTR-212' ? 'wtr:212' : null;

const enc = (o: unknown) => new TextEncoder().encode(JSON.stringify(o));

async function newKeypair() {
  const { publicKey, privateKey } = await generateKeyPair('EdDSA', { extractable: true });
  return { privateKey, publicJwk: (await exportJWK(publicKey)) as JWK };
}
async function sign(privateKey: CryptoKey, payload: unknown) {
  return new CompactSign(enc(payload)).setProtectedHeader({ alg: 'EdDSA' }).sign(privateKey);
}

describe('2b — vérif badge OB 3.0 + cross-check (D-048…D-051)', () => {
  it('1. bien signé + claims == enveloppe → ACCEPTÉ', async () => {
    const { privateKey, publicJwk } = await newKeypair();
    const credential = await sign(privateKey, VC);
    const r = await verifyBadgeCredential({ credential, publicKeyJwk: publicJwk, envelope: ENVELOPE, resolveSubject, resolveSkillId });
    expect(r.ok).toBe(true);
  });

  it('2. ⭐ badge ALTÉRÉ après signature → badge_signature_invalid', async () => {
    const { privateKey, publicJwk } = await newKeypair();
    const credential = await sign(privateKey, VC);
    const [h, , s] = credential.split('.');
    // On gonfle le niveau/observation dans le payload SANS re-signer (usurpation).
    const forged = JSON.parse(JSON.stringify(VC));
    forged.credentialSubject.observation.criterion_levels['S03.C08'] = 5; // 3→5 (mastery)
    const tampered = `${h}.${base64url.encode(enc(forged))}.${s}`;
    const r = await verifyBadgeCredential({ credential: tampered, publicKeyJwk: publicJwk, envelope: ENVELOPE, resolveSubject, resolveSkillId });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('badge_signature_invalid');
  });

  it('3. signé par une AUTRE clé (usurpateur) → badge_signature_invalid', async () => {
    const issuer = await newKeypair();
    const attacker = await newKeypair();
    const credential = await sign(attacker.privateKey, VC);
    const r = await verifyBadgeCredential({ credential, publicKeyJwk: issuer.publicJwk, envelope: ENVELOPE, resolveSubject, resolveSkillId });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('badge_signature_invalid');
  });

  it('4a. signature valide mais SKILL ≠ enveloppe → credential_envelope_mismatch', async () => {
    const { privateKey, publicJwk } = await newKeypair();
    const credential = await sign(privateKey, VC);
    const r = await verifyBadgeCredential({
      credential, publicKeyJwk: publicJwk,
      envelope: { ...ENVELOPE, skillId: 'wtr:999' }, // l'enveloppe prétend une autre skill
      resolveSubject, resolveSkillId,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('credential_envelope_mismatch');
  });

  it('4b. signature valide mais SUJET ≠ enveloppe → credential_envelope_mismatch', async () => {
    const { privateKey, publicJwk } = await newKeypair();
    const credential = await sign(privateKey, VC);
    const r = await verifyBadgeCredential({
      credential, publicKeyJwk: publicJwk,
      envelope: { ...ENVELOPE, subjectOpusId: 'opx_AUTRE' },
      resolveSubject, resolveSkillId,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('credential_envelope_mismatch');
  });

  it('4c. signature valide mais OBSERVATION ≠ enveloppe → credential_envelope_mismatch', async () => {
    const { privateKey, publicJwk } = await newKeypair();
    const credential = await sign(privateKey, VC);
    const r = await verifyBadgeCredential({
      credential, publicKeyJwk: publicJwk,
      envelope: { ...ENVELOPE, observation: { criteria: ['S03.C08'], criterion_levels: { 'S03.C08': 5 } } },
      resolveSubject, resolveSkillId,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('credential_envelope_mismatch');
  });

  it('5. non-trivialité (mutation) — le MÊME VC est accepté signé par l\'émetteur, rejeté signé par l\'usurpateur', async () => {
    const issuer = await newKeypair();
    const attacker = await newKeypair();
    const good = await verifyBadgeCredential({ credential: await sign(issuer.privateKey, VC), publicKeyJwk: issuer.publicJwk, envelope: ENVELOPE, resolveSubject, resolveSkillId });
    const bad = await verifyBadgeCredential({ credential: await sign(attacker.privateKey, VC), publicKeyJwk: issuer.publicJwk, envelope: ENVELOPE, resolveSubject, resolveSkillId });
    expect(good.ok).toBe(true);
    expect(bad.ok).toBe(false); // si l'on court-circuitait obVerify, ce test casserait
  });
});
