/**
 * =====================================================================
 * Opus X — Sprint 2 — 2b : vérif du credential OB 3.0 + cross-check (D-048…D-051)
 * =====================================================================
 * Deux barrières indépendantes protègent l'ingestion :
 *   • HMAC de transport (la REQUÊTE vient de WTS) — vérifié en base ;
 *   • signature du CREDENTIAL (le badge lui-même est authentique et non altéré) —
 *     ICI, via obVerify + la CLÉ PUBLIQUE de l'émetteur (wsp_issuer_keys).
 *
 * Une signature valide ne SUFFIT pas (D-049) : les claims SIGNÉS du VC doivent
 * ÉGALER l'enveloppe (émetteur, sujet, skill via alignment.targetUrl, framework,
 * observation). Sinon `credential_envelope_mismatch` — un émetteur ne signe pas X
 * et ne déclare pas Y. Le NIVEAU n'est PAS cross-checké : il est DÉRIVÉ par le WSP
 * de l'observation (D-051, §9/§10) — l'émetteur ne peut pas l'imposer.
 *
 * PUR : aucune I/O. Les résolutions dépendantes de la base (sujet D-047,
 * targetUrl→skill) sont INJECTÉES → testable en isolation, sans DB.
 * =====================================================================
 */
import type { JWK } from 'jose';
import { verifyOpenBadgeCredential } from '@/lib/wsp/obVerify';
import { parseTargetUrl } from '@/lib/wsp/alignment';

/** Les claims d'enveloppe WSP contre lesquels le credential est confronté (D-049). */
export type EnvelopeClaims = {
  issuerId: string;
  subjectOpusId: string;
  skillId: string;
  framework: { id: string; version: string };
  observation: unknown; // { criteria:[], criterion_levels:{} }
};

export type BadgeVerifyResult =
  | { ok: true; vc: Record<string, unknown> }
  | { ok: false; reason: 'badge_signature_invalid' | 'credential_envelope_mismatch' };

/** Normalise une observation pour comparaison stable (criteria triés). PUR. */
function normObservation(o: unknown): string {
  if (!o || typeof o !== 'object') return 'null';
  const obj = o as Record<string, unknown>;
  const criteria = Array.isArray(obj.criteria) ? [...(obj.criteria as unknown[])].map(String).sort() : [];
  const levels = obj.criterion_levels && typeof obj.criterion_levels === 'object'
    ? Object.fromEntries(Object.entries(obj.criterion_levels as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
    : {};
  return JSON.stringify({ criteria, criterion_levels: levels });
}

function get(obj: unknown, ...path: string[]): unknown {
  let cur: unknown = obj;
  for (const k of path) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[k];
  }
  return cur;
}

/**
 * Vérifie la signature du credential OB 3.0 PUIS le cross-check D-049.
 * @param resolveSubject  credentialSubject.id → opus_id interne (D-047 provisoire) ; null si inconnu.
 * @param resolveSkillId  {frameworkSlug,version,skillCode} → wsp_skills.id ; null si introuvable.
 */
export async function verifyBadgeCredential(opts: {
  credential: unknown;
  publicKeyJwk: JWK;
  envelope: EnvelopeClaims;
  resolveSubject: (credentialSubjectId: unknown) => string | null;
  resolveSkillId: (parts: { frameworkSlug: string; version: string; skillCode: string }) => string | null;
}): Promise<BadgeVerifyResult> {
  // (3) Signature du badge — obVerify (EdDSA, clé publique). Invalide/altéré/usurpé → rejet.
  const sig = await verifyOpenBadgeCredential(opts.credential, opts.publicKeyJwk);
  if (!sig.ok) return { ok: false, reason: 'badge_signature_invalid' };
  const vc = sig.payload;

  // (4) Cross-check : les claims SIGNÉS doivent égaler l'enveloppe (D-049).
  const e = opts.envelope;

  // Émetteur.
  if (get(vc, 'issuer') !== e.issuerId) return { ok: false, reason: 'credential_envelope_mismatch' };

  // Sujet (via reliage provisoire D-047).
  if (opts.resolveSubject(get(vc, 'credentialSubject', 'id')) !== e.subjectOpusId) {
    return { ok: false, reason: 'credential_envelope_mismatch' };
  }

  // Skill via alignment.targetUrl → wsp_skills.id (D-049).
  const targetUrl = get(vc, 'credentialSubject', 'achievement', 'alignment', '0', 'targetUrl');
  const parts = parseTargetUrl(targetUrl);
  if (!parts || opts.resolveSkillId(parts) !== e.skillId) {
    return { ok: false, reason: 'credential_envelope_mismatch' };
  }

  // Framework.
  if (get(vc, 'framework', 'id') !== e.framework.id || get(vc, 'framework', 'version') !== e.framework.version) {
    return { ok: false, reason: 'credential_envelope_mismatch' };
  }

  // Observation (D-051 : c'est l'OBSERVATION qui est portée, pas un niveau imposé).
  if (normObservation(get(vc, 'credentialSubject', 'observation')) !== normObservation(e.observation)) {
    return { ok: false, reason: 'credential_envelope_mismatch' };
  }

  return { ok: true, vc };
}
