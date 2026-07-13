/**
 * =====================================================================
 * Opus X — Test de la whitelist publique (§5.3)
 * =====================================================================
 * Garde-fou de fuite : prouve que la vue publique n'expose QUE les champs
 * whitelistés, et JAMAIS email / payload brut / champ non whitelisté — même
 * si l'objet interne les porte.
 * =====================================================================
 */
import { describe, it, expect } from 'vitest';
import {
  buildPublicPassport,
  buildPublicEvidence,
  PUBLIC_PASSPORT_WHITELIST,
  PUBLIC_EVIDENCE_WHITELIST,
  NEVER_PUBLIC,
  type PublicPassportInput,
} from './publicPassport';

describe('Whitelist du Passport public (§5.3)', () => {
  // Un input « pollué » : il porte des champs internes interdits qui NE DOIVENT
  // JAMAIS ressortir. (Cast pour simuler une donnée brute trop riche.)
  const dirtyInput = {
    display_name: 'Marie Dubois',
    headline: 'Consultante indépendante',
    lifecycle_stage: 'identity_established',
    verified: false,
    trust_status: 'Establishing',
    skills_status: 'empty',
    evidence: [
      {
        type: 'certification',
        title: 'Certification X',
        verified: true,
        issued_at: '2026-07-01T00:00:00Z',
        issuer: 'Partenaire Y',
        // Champs internes interdits :
        payload: { secret: 'données brutes' },
        description: 'note interne',
      },
    ],
    // Champs internes interdits au niveau racine :
    email: 'marie@example.com',
    opus_id: 'opx_01KX9K4GXRNHAW1NY07D91PBGS',
    profile_id: 'uuid',
    ip: '1.2.3.4',
    avatar_url: 'https://…',
    locale: 'fr',
  } as unknown as PublicPassportInput;

  it('n’expose QUE les clés whitelistées à la racine', () => {
    const out = buildPublicPassport(dirtyInput);
    expect(Object.keys(out).sort()).toEqual([...PUBLIC_PASSPORT_WHITELIST].sort());
  });

  it('n’expose JAMAIS un champ interdit à la racine (email, opus_id, ip…)', () => {
    const out = buildPublicPassport(dirtyInput) as unknown as Record<string, unknown>;
    for (const forbidden of NEVER_PUBLIC) {
      expect(out).not.toHaveProperty(forbidden);
    }
  });

  it('n’expose que les clés whitelistées d’une Evidence', () => {
    const out = buildPublicEvidence(dirtyInput.evidence[0]);
    expect(Object.keys(out).sort()).toEqual([...PUBLIC_EVIDENCE_WHITELIST].sort());
  });

  it('n’expose JAMAIS le payload brut ni la description d’une Evidence', () => {
    const out = buildPublicEvidence(dirtyInput.evidence[0]) as unknown as Record<string, unknown>;
    expect(out).not.toHaveProperty('payload');
    expect(out).not.toHaveProperty('description');
  });

  it('la sérialisation JSON complète ne contient aucune trace des interdits', () => {
    const json = JSON.stringify(buildPublicPassport(dirtyInput));
    expect(json).not.toMatch(/marie@example\.com/);
    expect(json).not.toMatch(/données brutes/);
    expect(json).not.toMatch(/opx_/);
    expect(json).not.toMatch(/note interne/);
  });
});
