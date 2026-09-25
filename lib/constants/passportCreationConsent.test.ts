/**
 * O-B (D-054) — le consentement de CRÉATION est un objet DISTINCT (falsifiable).
 *
 * Prouve que l'acte fondateur voyage à part : ni un ConsentRecord terms/privacy
 * (produit), ni un événement d'autorisation d'Issuer. Sa forme est stable et
 * versionnée, et il n'emprunte JAMAIS le champ `type` de public.consents.
 */
import { describe, it, expect } from 'vitest';
import {
  buildPassportCreationConsent,
  buildEstablishmentConsents,
  LEGAL_DOCUMENTS,
} from './passport.strings';

describe('O-B — buildPassportCreationConsent', () => {
  it('produit un consentement de création explicite, versionné, decision=create par défaut', () => {
    const c = buildPassportCreationConsent();
    expect(c).toEqual({
      decision: 'create',
      granted: true,
      version: LEGAL_DOCUMENTS.version,
      effective_date: LEGAL_DOCUMENTS.effectiveDate,
    });
  });

  it('accepte decision=link (réservé O-E, créer OU lier)', () => {
    expect(buildPassportCreationConsent('link').decision).toBe('link');
  });

  it('est DISTINCT des consentements produit : jamais un `type` terms/privacy', () => {
    const creation = buildPassportCreationConsent() as unknown as Record<string, unknown>;
    // Le consentement de création n'a pas de champ `type` (ce n'est pas un ConsentRecord).
    expect('type' in creation).toBe(false);
    // Et aucun consentement produit n'a de champ `decision`.
    for (const p of buildEstablishmentConsents({ terms: true, privacy: true })) {
      expect('decision' in p).toBe(false);
    }
  });
});
