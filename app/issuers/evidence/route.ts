/**
 * =====================================================================
 * POST /issuers/evidence   (Sprint 2 · LOT O2b + 2b) — L'INGESTION
 * =====================================================================
 * Jamais un endpoint nommé d'après un Issuer particulier (W7) : /issuers/*,
 * générique. Serveur à serveur : l'Issuer signe (HMAC transport) ET son badge
 * (VC-JWT, D-048).
 *
 * ORDRE STRICT (D-050) — rien d'écrit avant tout vérifié :
 *   (1) HMAC transport + (2) issuer actif  → wsp_verify_issuer_request (DB, temps
 *       constant, AVANT obVerify) ;
 *   (3) signature du BADGE (obVerify + clé publique wsp_issuer_keys) — SI l'issuer
 *       a une clé active (ENG-002 v0.3 §6.5 : MUST une fois enregistré) ;
 *   (4) cross-check credential ↔ enveloppe (D-049) ;
 *   (5) canonicalisation + digest, (6) transform WSP + cohérence §10 (niveau DÉRIVÉ,
 *       D-051), (7) écriture — atomiques dans wsp_ingest_evidence (qui re-vérifie le
 *       HMAC en étape 1 : défense en profondeur).
 * =====================================================================
 */
import type { NextRequest } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';
import { apiJson, apiError } from '@/lib/api/http';
import { HMAC_HEADERS } from '@/lib/issuer/hmac';
import { canonicalHash } from '@/lib/wsp/canonical';
import { buildCoveredObject } from '@/lib/wsp/evidenceCovered';
import { verifyBadgeCredential, type EnvelopeClaims } from '@/lib/wsp/ingestionCredential';
import type { JWK } from 'jose';

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
  // 2b — vérif du badge OB 3.0 (D-048…D-051)
  badge_signature_invalid: { status: 422, code: 'badge_signature_invalid' },
  credential_envelope_mismatch: { status: 422, code: 'credential_envelope_mismatch' },
};

function mapRejection(message: string): { status: number; code: string; fallback: boolean } {
  const tok = Object.keys(REJECT).find((t) => message.includes(t));
  return tok ? { ...REJECT[tok], fallback: false } : { status: 422, code: 'rejected', fallback: true };
}

/**
 * Journalise la SEULE ligne du chemin fallback (422 'rejected') : un message de
 * rejet non tokenisé (violation de contrainte à l'écriture, erreur de cascade…)
 * écrasé par le code opaque 'rejected'. On trace de quoi diagnostiquer — JAMAIS
 * de donnée sensible : ni enveloppe, ni opus_id, ni signature. `error.message`
 * nomme la colonne/contrainte, pas sa valeur (les valeurs vivent dans
 * `error.details`, qui n'est PAS journalisé). Message tronqué à 200 caractères.
 */
function logIngestFallback(err: { code?: string; message?: string }) {
  const message = (err.message ?? '').slice(0, 200);
  const named = /(?:constraint|column) "([^"]+)"/.exec(err.message ?? '');
  console.error('[ingest] fallback', err.code ?? '', named ? named[1] : '', message);
}

export async function POST(request: NextRequest) {
  const issuerId = request.headers.get(HMAC_HEADERS.issuer);
  const timestamp = request.headers.get(HMAC_HEADERS.timestamp);
  const signature = request.headers.get(HMAC_HEADERS.signature);

  // Corps BRUT : base du HMAC. On le lit tel quel (aucune ré-encodage).
  const raw = await request.text();

  if (typeof issuerId !== 'string' || typeof timestamp !== 'string' || typeof signature !== 'string') {
    return apiError('unauthorized', 'Authentification requise.', 401);
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(raw);
  } catch {
    payload = {};
  }

  const supabase = createPublicClient();

  // ── (1)+(2) HMAC transport + issuer actif — AVANT obVerify (D-050). ──────────
  const pre = await supabase.rpc('wsp_verify_issuer_request', {
    p_issuer_id: issuerId,
    p_timestamp: timestamp,
    p_body: raw,
    p_signature: signature,
  });
  if (pre.error) {
    const mapped = mapRejection(pre.error.message);
    if (mapped.fallback) logIngestFallback(pre.error);
    return apiError(mapped.code, 'Ingestion refusée.', mapped.status);
  }

  // ── (3)+(4) Signature du BADGE + cross-check — SI l'issuer a une clé publique
  //    active (ENG-002 v0.3 §6.5 : obligatoire une fois la clé enregistrée). ────
  const { data: keyRow } = await supabase
    .from('wsp_issuer_keys')
    .select('public_key_jwk')
    .eq('issuer_id', issuerId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (keyRow) {
    // Coordonnées de la Skill de l'enveloppe → résolveur SYNC pour le cross-check.
    const envSkillId = String((payload.demonstrates as Record<string, unknown> | undefined)?.skill_id ?? '');
    const { data: skillRow } = await supabase
      .from('wsp_skills')
      .select('id, code, framework_version, framework_id')
      .eq('id', envSkillId)
      .maybeSingle();
    const { data: fwRow } = skillRow
      ? await supabase.from('wsp_frameworks').select('slug').eq('id', (skillRow as { framework_id: string }).framework_id).maybeSingle()
      : { data: null };

    const envelope: EnvelopeClaims = {
      issuerId,
      subjectOpusId: String((payload.subject as Record<string, unknown> | undefined)?.opus_id ?? ''),
      skillId: envSkillId,
      framework: {
        id: String((payload.framework as Record<string, unknown> | undefined)?.id ?? ''),
        version: String((payload.framework as Record<string, unknown> | undefined)?.version ?? ''),
      },
      observation: (payload as Record<string, unknown>).observation,
    };

    const res = await verifyBadgeCredential({
      credential: (payload as Record<string, unknown>).credential,
      publicKeyJwk: (keyRow as { public_key_jwk: JWK }).public_key_jwk,
      envelope,
      // D-047 (provisoire) : le credentialSubject.id EST l'opus_id (le SSO mappera
      // des id externes plus tard). Le cross-check compare à l'enveloppe.
      resolveSubject: (id) => (typeof id === 'string' && id.length > 0 ? id : null),
      // D-049 : la targetUrl doit désigner la MÊME Skill que l'enveloppe.
      resolveSkillId: (parts) =>
        skillRow && fwRow &&
        parts.frameworkSlug === (fwRow as { slug: string }).slug &&
        parts.skillCode === (skillRow as { code: string }).code &&
        parts.version === (skillRow as { framework_version: string }).framework_version
          ? (skillRow as { id: string }).id
          : null,
    });
    if (!res.ok) {
      const mapped = REJECT[res.reason];
      return apiError(mapped.code, 'Ingestion refusée.', mapped.status);
    }
  }

  // ── (5)+(6)+(7) canonicalisation + transform WSP + écriture (atomique). ──────
  let recomputedHash = '';
  try {
    recomputedHash = canonicalHash(buildCoveredObject(payload)).hash;
  } catch {
    recomputedHash = '';
  }

  const { data, error } = await supabase.rpc('wsp_ingest_evidence', {
    p_issuer_id: issuerId,
    p_timestamp: timestamp,
    p_body: raw,
    p_signature: signature,
    p_payload: payload,
    p_recomputed_hash: recomputedHash,
  });

  if (error) {
    const mapped = mapRejection(error.message);
    if (mapped.fallback) logIngestFallback(error);
    return apiError(mapped.code, 'Ingestion refusée.', mapped.status);
  }

  const result = data as { status: string; evidence_id: string };
  return apiJson(result, result.status === 'accepted' ? 201 : 200);
}
