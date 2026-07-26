/**
 * =====================================================================
 * Opus X — Résolveur de statut (étape 6, composant 2)
 * =====================================================================
 * `resolveStatus` dérive le statut d'un Record de l'EXISTENCE d'un fait d'approbation,
 * JAMAIS d'un champ. Fonction PURE : elle lit les faits qu'on lui passe, n'écrit rien,
 * et ne lit aucun champ `Status`.
 *
 * Fondement (SPEC-ETAPE6-resolveur.md · OCR-009 §4 · D-022 · D-016 · D-013) :
 *   le statut n'est pas authored sur le Record — il est la PROJECTION de faits.
 *   RATIF (fondateur) et PROMO (ordinaire) déclarent Normative ; les faits de
 *   RÉVOCATION (D-013) retranchent. effective = promoted \ revoked.
 * =====================================================================
 */

export type RecordStatus = 'Draft' | 'Normative';

/** Un fait d'approbation (RATIF/PROMO) ou de révocation (D-013). */
export interface ApprovalFact {
  id: string;
  kind: 'founding-ratification' | 'promotion' | 'revocation';
  /** Faits d'approbation : Records déclarés Normative. */
  declares_normative?: string[];
  /** Faits de révocation : Records dont la Normative est retirée (jamais suppression). */
  revokes_normative?: string[];
}

export function isRevocation(f: ApprovalFact): boolean {
  return f.kind === 'revocation';
}

/**
 * Statut dérivé d'un Record, du seul jeu de faits. `Normative` ssi un fait d'approbation
 * le déclare ET aucun fait de révocation ne le retranche. Sinon `Draft`.
 * Ensembliste : l'ordre des faits n'importe pas. Aucun champ n'est lu, rien n'est écrit.
 */
export function resolveStatus(recordId: string, facts: readonly ApprovalFact[]): RecordStatus {
  const promoted = new Set<string>();
  const revoked = new Set<string>();
  for (const f of facts) {
    if (isRevocation(f)) {
      for (const id of f.revokes_normative ?? []) revoked.add(id);
    } else {
      for (const id of f.declares_normative ?? []) promoted.add(id);
    }
  }
  return promoted.has(recordId) && !revoked.has(recordId) ? 'Normative' : 'Draft';
}
