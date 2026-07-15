/**
 * =====================================================================
 * Opus X — Sprint 2 — LOT O2a : le JETON d'autorisation d'Issuer
 * =====================================================================
 * Discipline « clé d'API » : le jeton est généré aléatoirement, remis UNE
 * SEULE FOIS à l'Issuer, et stocké en HASH uniquement (SHA-256). Le clair
 * n'est jamais persisté ni relu.
 *
 * Le jeton IDENTIFIE le couple (subject, issuer) ; il n'AUTORISE pas à lui
 * seul — l'autorité est le consentement (wsp_consent_events). Révoquer le
 * consentement rend le jeton inerte, sans liste de révocation.
 * =====================================================================
 */
import { randomBytes, createHash } from 'node:crypto';

/** Préfixes NEUTRES (World Skills Protocol) — jamais un nom d'Issuer (W7). */
export const LINK_TOKEN_PREFIX = 'wsplnk_'; // le JETON (canal arrière, minté à l'échange)
export const EXCHANGE_CODE_PREFIX = 'wspxc_'; // le CODE d'échange (front-channel, sans pouvoir)

/** Version du texte de consentement d'ÉMISSION présenté à l'écran (P4). */
export const LINK_CONSENT_VERSION = 'v1.0.0';

/** Durée de vie du code d'échange (≤ 60 s — front-channel, fenêtre minimale). */
export const LINK_CODE_TTL_SECONDS = 60;

/** Génère un jeton d'autorisation opaque (256 bits d'aléa, base64url). */
export function generateLinkToken(): string {
  return LINK_TOKEN_PREFIX + randomBytes(32).toString('base64url');
}

/** Génère un code d'échange opaque, à usage unique (256 bits d'aléa). */
export function generateExchangeCode(): string {
  return EXCHANGE_CODE_PREFIX + randomBytes(32).toString('base64url');
}

/** Empreinte SHA-256 (hex minuscule) d'un secret — la seule forme stockée. */
export function hashLinkToken(secret: string): string {
  return createHash('sha256').update(secret, 'utf8').digest('hex');
}
