/**
 * =====================================================================
 * Opus X — Garde anti-forgeage (étape 6, composant 4)
 * =====================================================================
 * Le statut n'est JAMAIS authored sur un Record : il est dérivé d'un fait
 * (OCR-009 §4, D-022 ; voir `resolveStatus`). Un champ `Status: Normative`/`Validated`
 * authored sur un `.md` serait un FORGEAGE — une promotion de facto, sans fait, sans
 * autorité (OCR-009 §2). Ce détecteur le repère ; la garde l'interdit.
 *
 * Posé AVANT la migration des lecteurs (étape 6, palier 2) : la porte est fermée avant
 * qu'on déplace les meubles, pour qu'aucun champ forgé ne puisse exister en silence.
 * =====================================================================
 */

/** Ligne d'en-tête `| **Status** | Normative |` (ou `Validated`) — un statut authored, interdit. */
const AUTHORED_NORMATIVE = /\|\s*\*\*Status\*\*\s*\|\s*(Normative|Validated)\s*\|/i;

/** `true` si le `.md` AUTHORE un statut Normative/Validated dans son champ Status (forgeage). */
export function authorsNormativeStatus(raw: string): boolean {
  return AUTHORED_NORMATIVE.test(raw);
}
