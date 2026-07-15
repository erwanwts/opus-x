/**
 * =====================================================================
 * Opus X — Sprint 2 — LOT O2b : l'OBJET COUVERT par le hash (ENG-002 §6.1)
 * =====================================================================
 * Construit, par ÉNUMÉRATION EXPLICITE (jamais un spread — Annexe B, W1), la
 * préimage §6.1 (moins §6.2) à partir d'une Evidence reçue. Deux normalisations
 * — et SEULEMENT celles-ci (§8 étape 7 : « §5.3 SEULEMENT ») :
 *   • timestamps → RFC 3339 UTC, exactement 3 décimales (§5.3).
 *   • observation.criteria TRIÉ (§5.5.3) — JCS trie les clés d'objets, pas les
 *     tableaux ; c'est donc à nous de le faire, avant canonicalisation.
 *
 * canonical_hash et tout champ ajouté par Opus X sont EXCLUS (§6.2).
 * =====================================================================
 */

/** RFC 3339 UTC, .SSSZ exactement (§5.3.2). Lève si l'horodatage est invalide. */
export function normalizeTimestamp(ts: unknown): string {
  if (typeof ts !== 'string') throw new Error('WSP_COVERED: horodatage manquant');
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) throw new Error(`WSP_COVERED: horodatage invalide (${ts})`);
  return d.toISOString(); // toISOString rend toujours .SSSZ
}

// Vue minimale et défensive de l'Evidence reçue (Annexe A).
interface RawEvidence {
  schema_version?: unknown;
  canonicalization_algorithm?: unknown;
  hash_algorithm?: unknown;
  issuer?: { id?: unknown; evidence_id?: unknown; attested_by?: { actor_id?: unknown; role?: unknown } };
  subject?: { opus_id?: unknown };
  framework?: { id?: unknown; version?: unknown };
  demonstrates?: { skill_id?: unknown; claimed_level?: unknown };
  observation?: { criteria?: unknown; criterion_levels?: unknown };
  provenance?: { evidence_ref?: { kind?: unknown; id?: unknown } };
  occurred_at?: unknown;
  attested_at?: unknown;
  is_declaration?: unknown;
}

/**
 * Construit l'objet couvert (§6.1). Whitelist stricte : seuls ces champs, dans
 * ces formes. JCS ordonnera les clés — l'ordre ici n'importe pas. Toute forme
 * inattendue lève : l'appelant recalcule alors un hash vide et la vérification
 * de schéma/hash côté base rejette dans le bon ordre.
 */
export function buildCoveredObject(raw: RawEvidence): Record<string, unknown> {
  const criteria = raw.observation?.criteria;
  if (!Array.isArray(criteria)) throw new Error('WSP_COVERED: observation.criteria absent');

  return {
    schema_version: raw.schema_version,
    canonicalization_algorithm: raw.canonicalization_algorithm,
    hash_algorithm: raw.hash_algorithm,
    issuer: {
      id: raw.issuer?.id,
      evidence_id: raw.issuer?.evidence_id,
      attested_by: {
        actor_id: raw.issuer?.attested_by?.actor_id,
        role: raw.issuer?.attested_by?.role,
      },
    },
    subject: { opus_id: raw.subject?.opus_id },
    framework: { id: raw.framework?.id, version: raw.framework?.version },
    demonstrates: {
      skill_id: raw.demonstrates?.skill_id,
      claimed_level: raw.demonstrates?.claimed_level,
    },
    observation: {
      // §5.5.3 — tri ascendant (les critères sont ASCII ; l'ordre d'unités de
      // code UTF-16 coïncide avec l'ordre de points de code).
      criteria: [...criteria].sort(),
      criterion_levels: raw.observation?.criterion_levels,
    },
    provenance: {
      evidence_ref: {
        kind: raw.provenance?.evidence_ref?.kind,
        id: raw.provenance?.evidence_ref?.id,
      },
    },
    occurred_at: normalizeTimestamp(raw.occurred_at),
    attested_at: normalizeTimestamp(raw.attested_at),
    is_declaration: raw.is_declaration,
  };
}
