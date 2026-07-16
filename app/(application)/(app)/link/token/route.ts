/**
 * =====================================================================
 * POST /link/token   (Sprint 2 · LOT O2a-EXT) — LE CANAL ARRIÈRE
 * =====================================================================
 * Serveur à serveur, JAMAIS le navigateur. L'Issuer présente le CODE d'échange
 * + sa propre authentification HMAC (en-têtes). Opus X échange le code contre
 * le JETON, minté une seule fois.
 *
 * Toute la vérification (Issuer authentifié, horodatage frais, HMAC valide,
 * code non expiré/non consommé/appartenant à cet Issuer, consentement actif)
 * se fait EN BASE (wsp_exchange_code, pgcrypto + temps constant). Aucun secret
 * d'Issuer ne transite par ce code ; aucun service_role n'est requis.
 *
 * NON-ÉNUMÉRATION : tout échec renvoie une réponse IDENTIQUE (401). Code
 * inconnu, expiré, déjà consommé, mauvais Issuer, HMAC absent/invalide,
 * consentement révoqué → indistinguables.
 * =====================================================================
 */
import type { NextRequest } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';
import { apiJson, apiError } from '@/lib/api/http';
import { HMAC_HEADERS } from '@/lib/issuer/hmac';
import { generateLinkToken, hashLinkToken } from '@/lib/link/issuerAuthToken';

/** Réponse d'échec UNIQUE et indifférenciée (anti-énumération). */
const refused = () => apiError('exchange_refused', 'Échange refusé.', 401);

export async function POST(request: NextRequest) {
  const issuerId = request.headers.get(HMAC_HEADERS.issuer);
  const timestamp = request.headers.get(HMAC_HEADERS.timestamp);
  const signature = request.headers.get(HMAC_HEADERS.signature);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return refused();
  }
  const code = body.code;

  // En-têtes ou code manquants → même refus (aucune information).
  if (
    typeof issuerId !== 'string' ||
    typeof timestamp !== 'string' ||
    typeof signature !== 'string' ||
    typeof code !== 'string'
  ) {
    return refused();
  }

  // Le jeton est minté ICI (aléatoire) ; seul son hash part en base.
  const token = generateLinkToken();
  const tokenHash = hashLinkToken(token);

  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc('wsp_exchange_code', {
    p_issuer_id: issuerId,
    p_timestamp: timestamp,
    p_code: code,
    p_signature: signature,
    p_token_hash: tokenHash,
  });

  if (error) return refused();

  // Succès : le SEUL endroit où un jeton est renvoyé — à l'Issuer authentifié.
  return apiJson({ opus_id: (data as { opus_id: string }).opus_id, token });
}
