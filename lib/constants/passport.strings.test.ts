/**
 * =====================================================================
 * Opus X — Test des CHAÎNES VERROUILLÉES
 * =====================================================================
 * Critère d'acceptation du Lot 1 : « Toutes les chaînes institutionnelles EN
 * vivent dans UN SEUL module et correspondent AU MOT PRÈS à la spec. »
 *
 * Ce test est un GARDE-FOU DE VOCABULAIRE, pas une formalité :
 * il fait échouer le build si quiconque reformule une chaîne verrouillée.
 * =====================================================================
 */

import { describe, it, expect } from 'vitest';
import {
  EMISSION_SEQUENCE,
  EMISSION_FINAL_LINE,
  VISION_STATEMENT,
  ESTABLISH_IDENTITY_TITLE,
  STATUS_LABELS,
  TRUST_STATE_LABELS,
  LIFECYCLE_STAGES,
  INITIAL_LIFECYCLE_STAGE,
  OPUS_ID_PATTERN,
  LEGAL_DOCUMENTS,
  buildEstablishmentConsents,
} from './passport.strings';

describe('Chaînes verrouillées — égalité verbatim avec la spec figée', () => {
  it('la séquence d’émission est exacte, dans l’ordre', () => {
    expect([...EMISSION_SEQUENCE]).toEqual([
      'Establishing Professional Identity…',
      'Generating Opus ID…',
      'Issuing Professional Passport…',
      'Identity Successfully Established',
    ]);
  });

  it('la ligne finale (gardée par le signal serveur V3) est exacte', () => {
    expect(EMISSION_FINAL_LINE).toBe('Identity Successfully Established');
  });

  it('la phrase de vision est exacte (Décision 5)', () => {
    expect(VISION_STATEMENT).toBe(
      'From this moment on, every verified achievement you earn can become part of your professional identity.'
    );
  });

  it('le titre de l’écran d’entrée est exact', () => {
    expect(ESTABLISH_IDENTITY_TITLE).toBe('Establish Your Professional Identity');
  });

  it('les libellés de statuts sont exacts', () => {
    expect(STATUS_LABELS).toEqual({
      trust: 'Trust Status',
      skills: 'Skills Status',
      evidence: 'Evidence Status',
    });
  });

  it('le Trust Status neuf est qualitatif — « Establishing », jamais un score', () => {
    expect(TRUST_STATE_LABELS.establishing).toBe('Establishing');
  });
});

describe('Cycle de vie — les 7 étapes canoniques (Décision 3)', () => {
  it('compte exactement 7 étapes, dans l’ordre', () => {
    expect(LIFECYCLE_STAGES).toHaveLength(7);
    expect(LIFECYCLE_STAGES.map((s) => s.key)).toEqual([
      'identity_established',
      'receiving_evidence',
      'skills_emerging',
      'trust_established',
      'passport_verified',
      'trusted_professional',
      'authority',
    ]);
  });

  it('les libellés sont exacts', () => {
    expect(LIFECYCLE_STAGES.map((s) => s.label)).toEqual([
      'Identity Established',
      'Receiving Evidence',
      'Skills Emerging',
      'Trust Established',
      'Professional Passport Verified',
      'Trusted Professional',
      'Authority',
    ]);
  });

  it('l’étape initiale est « Identity Established » — jamais « Identity Created »', () => {
    expect(INITIAL_LIFECYCLE_STAGE).toBe('identity_established');
    expect(LIFECYCLE_STAGES[0].label).toBe('Identity Established');
  });
});

describe('Garde-fou de vocabulaire — le lexique verrouillé', () => {
  const toutesLesChaines = [
    ...EMISSION_SEQUENCE,
    VISION_STATEMENT,
    ESTABLISH_IDENTITY_TITLE,
    ...Object.values(STATUS_LABELS),
    ...Object.values(TRUST_STATE_LABELS),
    ...LIFECYCLE_STAGES.map((s) => s.label),
  ];

  it('AUCUNE chaîne institutionnelle n’emploie le vocabulaire « Create »', () => {
    // Le Passport n'est pas créé : il est ÉMIS. L'identité n'est pas créée :
    // elle est ÉTABLIE. Ce vocabulaire est définitivement abandonné.
    for (const s of toutesLesChaines) {
      expect(s.toLowerCase()).not.toMatch(/\bcreat(e|ed|ing|ion)\b/);
      expect(s.toLowerCase()).not.toMatch(/\bsign\s?up\b/);
      expect(s.toLowerCase()).not.toMatch(/\baccount\b/);
    }
  });

  it('les termes INTERNES (« Trust Index ») ne fuient pas dans l’UI', () => {
    for (const s of toutesLesChaines) {
      expect(s).not.toMatch(/Trust Index/);
      expect(s).not.toMatch(/Skills Index/);
    }
  });

  it('le vocabulaire d’émission est bien présent', () => {
    expect(EMISSION_SEQUENCE[0]).toMatch(/Establishing/);
    expect(EMISSION_SEQUENCE[2]).toMatch(/Issuing/);
    expect(EMISSION_SEQUENCE[3]).toMatch(/Established/);
  });
});

describe('Opus ID — format canonique', () => {
  it('accepte un opx_ + ULID valide', () => {
    expect(OPUS_ID_PATTERN.test('opx_01KX9K4GXRNHAW1NY07D91PBGS')).toBe(true);
  });

  it('rejette les formats non conformes', () => {
    expect(OPUS_ID_PATTERN.test('opx_trop-court')).toBe(false);
    expect(OPUS_ID_PATTERN.test('01KX9K4GXRNHAW1NY07D91PBGS')).toBe(false); // sans préfixe
    expect(OPUS_ID_PATTERN.test('opx_01KX9K4GXRNHAW1NY07D91PBGI')).toBe(false); // I exclu (Crockford)
    expect(OPUS_ID_PATTERN.test('opx_01kx9k4gxrnhaw1ny07d91pbgs')).toBe(false); // minuscules
  });
});

describe('Consentements — version documentaire ET date juridique (V2)', () => {
  it('porte les deux informations, jamais une seule', () => {
    expect(LEGAL_DOCUMENTS.version).toBe('v1.0.0');
    expect(LEGAL_DOCUMENTS.effectiveDate).toBe('2026-07-11');
  });

  it('la version suit le versionnement sémantique préfixé (contrainte en base)', () => {
    expect(LEGAL_DOCUMENTS.version).toMatch(/^v\d+\.\d+\.\d+$/);
  });

  it('construit les consentements de l’établissement avec version + date', () => {
    const consents = buildEstablishmentConsents({ terms: true, privacy: true });

    expect(consents).toHaveLength(2);
    expect(consents.map((c) => c.type)).toEqual(['terms', 'privacy']);

    for (const c of consents) {
      expect(c.granted).toBe(true);
      expect(c.version).toBe('v1.0.0');
      expect(c.effective_date).toBe('2026-07-11');
    }
  });

  it('journalise fidèlement un refus (cases NON pré-cochées)', () => {
    const consents = buildEstablishmentConsents({ terms: true, privacy: false });
    expect(consents.find((c) => c.type === 'privacy')?.granted).toBe(false);
  });
});
