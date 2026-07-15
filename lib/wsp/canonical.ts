/**
 * =====================================================================
 * Opus X — Sprint 2 : LA FORME CANONIQUE (RFC 8785 / JCS)
 * =====================================================================
 * LE SEUL module qui importe `canonicalize`. Aucun autre fichier ne le fait :
 * cette bibliothèque est sur le CHEMIN CRITIQUE DE LA CONFIANCE — elle calcule
 * la préimage de chaque canonical_hash gravé append-only, À PERPÉTUITÉ. Le jour
 * où elle doit être remplacée, on remplace CE fichier, pas une dispersion.
 *
 * Profil de canonicalisation : ENG-002 §5.
 *   • §5.1.1/§5.1.2  RFC 8785 (JCS) + SHA-256, hex minuscule.
 *   • §5.1.4         l'algo est DANS l'objet haché — on VÉRIFIE sa présence.
 *   • §5.2.2         canonicalisation par une VRAIE impl RFC 8785 (jamais un
 *                    JSON.stringify maison).
 *   • §5.2.6         NaN / ±Infinity rejetés AVANT canonicalisation.
 *   • §5.4.2         null interdit dans le payload (un champ absent est OMIS).
 * =====================================================================
 */
import canonicalize from 'canonicalize';
import { createHash } from 'node:crypto';

/** Identifiants d'algorithme — journalisés DANS l'objet haché (§5.1.4). */
export const CANONICALIZATION_ALGORITHM = 'RFC8785';
export const HASH_ALGORITHM = 'SHA-256';

/** §5.2.6 — rejette toute valeur incompatible I-JSON (NaN, ±Infinity). */
function assertJcsSafe(value: unknown, path = '$'): void {
  if (typeof value === 'number' && !Number.isFinite(value)) {
    throw new Error(`WSP_CANONICAL: valeur non finie interdite en ${path} (ENG-002 §5.2.6)`);
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => assertJcsSafe(v, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) assertJcsSafe(v, `${path}.${k}`);
  }
}

/** §5.4.2 — null interdit : l'absence d'un champ s'exprime par son OMISSION. */
function assertNoNull(value: unknown, path = '$'): void {
  if (value === null) {
    throw new Error(`WSP_CANONICAL: null interdit en ${path} — un champ absent est OMIS (ENG-002 §5.4.2)`);
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => assertNoNull(v, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) assertNoNull(v, `${path}.${k}`);
  }
}

/** Forme canonique RFC 8785 (JCS) — la préimage EXACTE du hash. */
export function canonicalJson(obj: unknown): string {
  assertJcsSafe(obj);
  const out = canonicalize(obj);
  if (typeof out !== 'string') {
    throw new Error('WSP_CANONICAL: canonicalize n’a pas produit de chaîne (entrée invalide).');
  }
  return out;
}

export interface CanonicalHash {
  /** SHA-256 hex minuscule de UTF8(JCS(objet)). */
  hash: string;
  canonicalization_algorithm: typeof CANONICALIZATION_ALGORITHM;
  hash_algorithm: typeof HASH_ALGORITHM;
}

/**
 * canonical_hash de l'objet haché (ENG-002 §5.1). Vérifie que les champs
 * d'algorithme sont DANS l'objet (§5.1.4 : un algo non couvert est un algo
 * qu'un attaquant peut changer). L'appelant construit l'objet §6.1 ; ici on
 * le canonicalise et on le hache — rien d'autre.
 */
export function canonicalHash(obj: Record<string, unknown>): CanonicalHash {
  if (
    obj.canonicalization_algorithm !== CANONICALIZATION_ALGORITHM ||
    obj.hash_algorithm !== HASH_ALGORITHM
  ) {
    throw new Error(
      'WSP_CANONICAL: canonicalization_algorithm/hash_algorithm doivent être DANS l’objet haché (ENG-002 §5.1.4).'
    );
  }
  assertNoNull(obj);
  const preimage = canonicalJson(obj);
  const hash = createHash('sha256').update(preimage, 'utf8').digest('hex');
  return { hash, canonicalization_algorithm: CANONICALIZATION_ALGORITHM, hash_algorithm: HASH_ALGORITHM };
}
