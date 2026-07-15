/**
 * =====================================================================
 * Opus X — Sprint 2 : authentification HMAC d'un Issuer (canal arrière).
 * =====================================================================
 * L'Issuer signe ses requêtes serveur-à-serveur avec son secret partagé.
 * Base signée : `${timestamp}.${payload}`. La VÉRIFICATION est faite EN BASE
 * (pgcrypto + comparaison temps constant, wsp_exchange_code) — ce module ne
 * fournit que la SIGNATURE (référence pour l'Issuer et les tests). Aucun
 * secret d'Issuer ne transite donc par le code applicatif d'Opus X.
 *
 * Réutilisé par O2b (ingestion signée). Préfixe d'en-têtes NEUTRE (W7).
 * =====================================================================
 */
import { createHmac } from 'node:crypto';

export const HMAC_HEADERS = {
  issuer: 'x-wsp-issuer',
  timestamp: 'x-wsp-timestamp',
  signature: 'x-wsp-signature',
} as const;

/** Signature HMAC-SHA256 (hex) de `${timestamp}.${payload}` avec le secret. */
export function signIssuerRequest(secret: string, timestamp: string, payload: string): string {
  return createHmac('sha256', secret).update(`${timestamp}.${payload}`, 'utf8').digest('hex');
}

/** Horodatage courant en secondes epoch (sous forme de chaîne). */
export function issuerTimestamp(nowMs: number): string {
  return Math.floor(nowMs / 1000).toString();
}
