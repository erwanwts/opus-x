/**
 * =====================================================================
 * POST /issuers/evidence   (Sprint 2 · LOT O2b) — L'INGESTION
 * =====================================================================
 * Jamais un endpoint nommé d'après un Issuer particulier (W7) : /issuers/*,
 * générique. Serveur à serveur : l'Issuer signe (HMAC).
 *
 * Opus X RECALCULE le canonical_hash (JS / RFC 8785, lib/wsp/canonical) — il ne
 * fait JAMAIS confiance au hash reçu (§8.1). Le recalcul se fait ici ; tout le
 * reste de l'ordre §8 (HMAC, consentement, schéma, W1, W4, existence,
 * comparaison du hash, cohérence §10, idempotence §7, écriture) est exécuté
 * atomiquement et DANS L'ORDRE par wsp_ingest_evidence.
 *
 * HMAC vérifié en base (pgcrypto, temps constant) → aucun service_role ici.
 * =====================================================================
 */
import type { NextRequest } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';
import { apiJson, apiError } from '@/lib/api/http';
import { HMAC_HEADERS } from '@/lib/issuer/hmac';
import { canonicalHash } from '@/lib/wsp/canonical';
import { buildCoveredObject } from '@/lib/wsp/evidenceCovered';

// Token de rejet (message d'exception de la RPC) → (status HTTP, code exposé).
const REJECT: Record<string, { status: number; code: string }> = {
  unauthorized: { status: 401, code: 'unauthorized' },
  rejected: { status: 403, code: 'rejected' }, // consentement/existence — non-énumérant
  schema_invalid: { status: 422, code: 'schema_invalid' },
  forbidden_field: { status: 422, code: 'forbidden_field' }, // W1
  missing_provenance: { status: 422, code: 'missing_provenance' }, // W4
  canonical_hash_mismatch: { status: 422, code: 'canonical_hash_mismatch' },
  observation_invalid: { status: 422, code: 'observation_invalid' },
  below_emission_threshold: { status: 422, code: 'below_emission_threshold' },
  claimed_level_incoherent: { status: 422, code: 'claimed_level_incoherent' },
  evidence_integrity_conflict: { status: 409, code: 'evidence_integrity_conflict' },
};

export async function POST(request: NextRequest) {
  const issuerId = request.headers.get(HMAC_HEADERS.issuer);
  const timestamp = request.headers.get(HMAC_HEADERS.timestamp);
  const signature = request.headers.get(HMAC_HEADERS.signature);

  // Corps BRUT : base du HMAC. On le lit tel quel (aucune ré-encodage).
  const raw = await request.text();

  if (
    typeof issuerId !== 'string' ||
    typeof timestamp !== 'string' ||
    typeof signature !== 'string'
  ) {
    // Auth d'abord (§8 étape 1) : sans en-têtes, 401 — jamais un indice de plus.
    return apiError('unauthorized', 'Authentification requise.', 401);
  }

  // Parse défensif : un corps non-JSON ne court-circuite pas le HMAC (étape 1
  // reste première). On recalcule le hash défensivement — un échec ⇒ hash vide,
  // la base rejette alors dans le bon ordre (schéma/hash).
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(raw);
  } catch {
    payload = {};
  }
  let recomputedHash = '';
  try {
    recomputedHash = canonicalHash(buildCoveredObject(payload)).hash;
  } catch {
    recomputedHash = '';
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc('wsp_ingest_evidence', {
    p_issuer_id: issuerId,
    p_timestamp: timestamp,
    p_body: raw,
    p_signature: signature,
    p_payload: payload,
    p_recomputed_hash: recomputedHash,
  });

  if (error) {
    const known = Object.keys(REJECT).find((tok) => error.message.includes(tok));
    const mapped = known ? REJECT[known] : { status: 422, code: 'rejected' };
    return apiError(mapped.code, 'Ingestion refusée.', mapped.status);
  }

  const result = data as { status: string; evidence_id: string };
  // 201 quand un fait neuf est journalisé ; 200 pour un renvoi idempotent.
  return apiJson(result, result.status === 'accepted' ? 201 : 200);
}
