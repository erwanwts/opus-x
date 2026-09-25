/**
 * =====================================================================
 * Opus X — Sprint 2 — SOUS-PALIER 2a : VÉRIFICATION DE SIGNATURE OB 3.0
 * (asymétrique, standard strict — D-046)
 * =====================================================================
 * Open Badges 3.0 = un Verifiable Credential SIGNÉ. On vérifie la signature
 * ASYMÉTRIQUE du credential avec une lib ÉPROUVÉE (`jose`) — jamais de schéma
 * crypto maison. Algorithme accepté : EdDSA (Ed25519), le format OB 3.0 VC-JWT.
 *
 * 🔴 SÉPARÉ du HMAC symétrique (lib/issuer/hmac.ts, wsp_issuer_secrets) : le HMAC
 *    authentifie la REQUÊTE (porteur du secret partagé) ; ICI on authentifie le
 *    CREDENTIAL lui-même via la CLÉ PUBLIQUE de l'émetteur. Opus X ne détient
 *    JAMAIS de clé privée d'émetteur (défense : une JWK contenant `d` est refusée).
 *
 * 🔴 Durcissement anti-contournement : `algorithms: ['EdDSA']` fige l'algorithme —
 *    `alg: none` et la confusion d'algorithme sont rejetés par la lib. Aucune
 *    branche ne renvoie « valide » sans une signature réellement vérifiée.
 *
 * Ce module est PUR (aucune I/O, aucune DB) → il se valide isolément (tests 2a).
 * =====================================================================
 */
import { compactVerify, importJWK, type JWK } from 'jose';

/** Algorithmes de signature acceptés (OB 3.0 VC-JWT, asymétrique). Ed25519 = EdDSA. */
export const OB_ALLOWED_ALGS = ['EdDSA'] as const;

export type ObVerifyResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; reason: 'malformed' | 'bad_signature' | 'unsupported_alg' | 'bad_key' };

/**
 * Vérifie un credential Open Badges 3.0 (JWS compact) contre la CLÉ PUBLIQUE de
 * l'émetteur. Renvoie le payload décodé UNIQUEMENT si la signature est valide.
 *
 * @param jws           credential OB 3.0 au format JWS compact (`header.payload.signature`)
 * @param publicKeyJwk  clé PUBLIQUE de l'émetteur (JWK OKP/Ed25519). Jamais de clé privée.
 */
export async function verifyOpenBadgeCredential(
  jws: unknown,
  publicKeyJwk: JWK
): Promise<ObVerifyResult> {
  // Forme minimale d'un JWS compact : 3 segments non vides.
  if (typeof jws !== 'string' || jws.split('.').length !== 3) {
    return { ok: false, reason: 'malformed' };
  }

  // Opus X ne détient JAMAIS de clé privée : une JWK avec composante privée `d`
  // (ou symétrique `k`) est refusée d'emblée — on ne vérifie qu'avec du public.
  if (!publicKeyJwk || typeof publicKeyJwk !== 'object' || 'd' in publicKeyJwk || 'k' in publicKeyJwk) {
    return { ok: false, reason: 'bad_key' };
  }

  let key: Awaited<ReturnType<typeof importJWK>>;
  try {
    key = await importJWK(publicKeyJwk, 'EdDSA');
  } catch {
    return { ok: false, reason: 'bad_key' };
  }

  try {
    // `algorithms` fige EdDSA : `alg: none` / confusion d'algo sont rejetés par jose.
    const { payload, protectedHeader } = await compactVerify(jws, key, {
      algorithms: [...OB_ALLOWED_ALGS],
    });
    if (!OB_ALLOWED_ALGS.includes(protectedHeader.alg as (typeof OB_ALLOWED_ALGS)[number])) {
      return { ok: false, reason: 'unsupported_alg' };
    }
    const json = JSON.parse(new TextDecoder().decode(payload)) as Record<string, unknown>;
    return { ok: true, payload: json };
  } catch {
    // Signature invalide, altérée, mauvaise clé, alg non autorisé, payload non-JSON.
    return { ok: false, reason: 'bad_signature' };
  }
}
