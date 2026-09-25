/**
 * =====================================================================
 * SOUS-PALIER 2a — TESTS CRYPTO DÉCISIFS (falsifiables) — D-046
 * =====================================================================
 * La vérification de signature OB 3.0 est le POINT DE SÉCURITÉ du chantier :
 * elle DOIT mordre. Ces tests le prouvent, chacun réfutable :
 *   1. badge correctement signé (clé privée de test) → VALIDE ;
 *   2. badge ALTÉRÉ après signature (contenu modifié)  → REJETÉ ;
 *   3. badge signé par une AUTRE clé (usurpateur)      → REJETÉ ;
 *   4. contournement (alg:none / sans signature)        → REJETÉ.
 *
 * « Un test qui ne peut pas échouer ne prouve rien » : le test 1 (chemin
 * heureux) garantit que les rejets 2–4 ne sont pas de faux négatifs triviaux.
 * =====================================================================
 */
import { describe, it, expect } from 'vitest';
import { generateKeyPair, exportJWK, CompactSign, base64url, type JWK } from 'jose';
import { verifyOpenBadgeCredential } from '@/lib/wsp/obVerify';

// Un credential OB 3.0 minimal et réaliste (alignement vers une skill du Framework).
const CREDENTIAL = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json',
  ],
  type: ['VerifiableCredential', 'OpenBadgeCredential'],
  issuer: 'issuer:test-001',
  validFrom: '2026-09-25T00:00:00.000Z',
  credentialSubject: {
    id: 'mailto:eleve@example.com',
    type: ['AchievementSubject'],
    achievement: {
      id: 'urn:uuid:achv-212',
      type: ['Achievement'],
      name: 'Intention vs Engagement',
      alignment: [
        {
          type: ['Alignment'],
          targetUrl: 'https://opusx.world/wsp/frameworks/wtf/v0.1/skills/WTF-212',
        },
      ],
    },
  },
} as const;

const enc = (obj: unknown) => new TextEncoder().encode(JSON.stringify(obj));

async function newIssuerKeypair() {
  // EdDSA → Ed25519 (format OB 3.0). extractable pour exporter la JWK publique.
  const { publicKey, privateKey } = await generateKeyPair('EdDSA', { extractable: true });
  const publicJwk = (await exportJWK(publicKey)) as JWK;
  return { publicKey, privateKey, publicJwk };
}

async function signCredential(privateKey: CryptoKey, payload: unknown): Promise<string> {
  return new CompactSign(enc(payload)).setProtectedHeader({ alg: 'EdDSA' }).sign(privateKey);
}

describe('SOUS-PALIER 2a — vérification de signature Open Badges 3.0 (asymétrique)', () => {
  it('1. badge correctement signé par la clé privée de test → VALIDE', async () => {
    const { privateKey, publicJwk } = await newIssuerKeypair();
    const jws = await signCredential(privateKey, CREDENTIAL);

    const res = await verifyOpenBadgeCredential(jws, publicJwk);

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.payload.issuer).toBe('issuer:test-001');
      const subject = res.payload.credentialSubject as { achievement: { alignment: { targetUrl: string }[] } };
      expect(subject.achievement.alignment[0].targetUrl).toContain('/skills/WTF-212');
    }
  });

  it('2. badge ALTÉRÉ après signature (contenu modifié) → REJETÉ', async () => {
    const { privateKey, publicJwk } = await newIssuerKeypair();
    const jws = await signCredential(privateKey, CREDENTIAL);

    // On garde header + signature, mais on remplace le payload par un contenu forgé
    // (usurpation du sujet). La signature ne couvre plus le payload → doit casser.
    const [header, , signature] = jws.split('.');
    const forged = { ...CREDENTIAL, credentialSubject: { ...CREDENTIAL.credentialSubject, id: 'mailto:attaquant@example.com' } };
    const tampered = `${header}.${base64url.encode(enc(forged))}.${signature}`;

    const res = await verifyOpenBadgeCredential(tampered, publicJwk);

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe('bad_signature');
  });

  it('3. badge signé par une AUTRE clé (usurpateur) → REJETÉ', async () => {
    const issuer = await newIssuerKeypair();
    const attacker = await newIssuerKeypair();
    // Signé par l'attaquant, vérifié contre la clé publique de l'émetteur légitime.
    const jws = await signCredential(attacker.privateKey, CREDENTIAL);

    const res = await verifyOpenBadgeCredential(jws, issuer.publicJwk);

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe('bad_signature');
  });

  it('4a. contournement alg:none (jeton sans vraie signature) → REJETÉ', async () => {
    const { publicJwk } = await newIssuerKeypair();
    // Jeton forgé « à la main » : header alg:none, aucune signature.
    const forged =
      `${base64url.encode(enc({ alg: 'none' }))}.${base64url.encode(enc(CREDENTIAL))}.`;

    const res = await verifyOpenBadgeCredential(forged, publicJwk);

    expect(res.ok).toBe(false); // ne DOIT jamais accepter un jeton non signé
  });

  it('4b. mutation — retirer la vérif reviendrait à accepter (3) : la vérif MORD', async () => {
    // Sanity de non-trivialité : le MÊME credential validé au test 1 est REJETÉ
    // dès qu\'il est signé par une autre clé (test 3). Donc la signature est bien
    // la condition d\'acceptation — pas un simple décodage. Si l\'on court-circuitait
    // verifyOpenBadgeCredential (return {ok:true}), les tests 2/3/4 casseraient.
    const issuer = await newIssuerKeypair();
    const attacker = await newIssuerKeypair();
    const good = await signCredential(issuer.privateKey, CREDENTIAL);
    const bad = await signCredential(attacker.privateKey, CREDENTIAL);

    const rGood = await verifyOpenBadgeCredential(good, issuer.publicJwk);
    const rBad = await verifyOpenBadgeCredential(bad, issuer.publicJwk);

    expect(rGood.ok).toBe(true);
    expect(rBad.ok).toBe(false);
  });

  it('refuse une JWK contenant une composante privée (Opus X ne détient jamais de clé privée)', async () => {
    const { privateKey, publicJwk } = await newIssuerKeypair();
    const jws = await signCredential(privateKey, CREDENTIAL);
    const privateJwk = (await exportJWK(privateKey)) as JWK; // contient `d`

    const res = await verifyOpenBadgeCredential(jws, privateJwk);

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe('bad_key');
  });
});
