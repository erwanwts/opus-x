/**
 * =====================================================================
 * Opus X — Sprint 2 — 2b : résolution d'alignement OB 3.0 → wsp_skill (D-049)
 * =====================================================================
 * Un credential OB 3.0 aligne sa compétence via `achievement.alignment[].targetUrl`.
 * Cette targetUrl est l'URI PUBLIQUE stable de la Skill (projection D-045). Le
 * cross-check (D-049) exige de la RÉSOUDRE vers un `wsp_skills.id` et de vérifier
 * qu'elle désigne bien la même Skill que l'enveloppe.
 *
 * Forme d'URI (D-045 / OCR-115) :
 *   https://opusx.world/wsp/frameworks/{slug}/v{version}/skills/{code}
 *
 * Ce module est PUR (parsing seul). La correspondance {slug,code}→id se fait via
 * un lookup injecté (DB côté route ; fixture en test) — jamais de DB ici.
 * =====================================================================
 */

export type TargetUrlParts = { frameworkSlug: string; version: string; skillCode: string };

/** Parse une targetUrl d'alignement OB 3.0 vers ses coordonnées, ou null si non conforme. */
export function parseTargetUrl(url: unknown): TargetUrlParts | null {
  if (typeof url !== 'string') return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  // Chemin canonique : /wsp/frameworks/{slug}/v{version}/skills/{code}
  const m = u.pathname.match(/^\/wsp\/frameworks\/([^/]+)\/v([^/]+)\/skills\/([^/]+)\/?$/);
  if (!m) return null;
  return { frameworkSlug: decodeURIComponent(m[1]), version: decodeURIComponent(m[2]), skillCode: decodeURIComponent(m[3]) };
}
