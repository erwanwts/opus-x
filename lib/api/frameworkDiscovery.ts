/**
 * =====================================================================
 * Opus X — Sprint 2 — LOT O0 : Contrat de DÉCOUVERTE du Framework
 * =====================================================================
 * Réponse de `GET /frameworks/{id}/skills`. Elle permet à N'IMPORTE QUEL
 * Issuer de découvrir les Skills publiées et leurs IDENTIFIANTS CANONIQUES,
 * sans configuration spécifique (D9).
 *
 * Ce n'est PAS le contrat gelé (Annexe A / SCHEMA-001) — c'est un contrat de
 * découverte, en lecture seule, sur des définitions publiées.
 *
 * Construction par ÉNUMÉRATION EXPLICITE (jamais un spread) — même discipline
 * que la whitelist du Passport public du Sprint 1 : aucune colonne interne ne
 * peut fuir par inadvertance (observation bands, recorded_at, etc. restent
 * du contenu de Framework interne au Skills Engine, hors surface de découverte).
 * =====================================================================
 */

export interface FrameworkRow {
  id: string;
  slug: string;
  name: string;
  publisher: string;
}

export interface FrameworkVersionRow {
  version: string;
  status: string;
  effective_date: string;
}

/**
 * Ligne de `wsp_reidentifications` (prédicat `reidentified_as`, OCR-007) touchant
 * ce Framework. `prior_id` = identifiant ANTÉRIEUR, `canonical_id` = identifiant
 * COURANT. Seules ces deux colonnes sont lues : le statut se DÉRIVE, il ne se lit pas.
 */
export interface ReidentificationRow {
  prior_id: string;
  canonical_id: string;
}

/**
 * Statut d'identité — **DÉRIVÉ, JAMAIS STOCKÉ**. Il n'existe que par l'existence
 * d'une relation de réidentification. Aucune colonne de la base ne le porte.
 */
export type IdentityStatus = 'canonical' | 'reidentified' | 'published';

export interface SkillLevelRow {
  slug: string;
  label: string;
  rank: number;
  observation_min: number;
  observation_max: number;
}

export interface SkillRow {
  id: string;
  code: string;
  name: string;
  framework_version: string;
  levels: SkillLevelRow[];
}

export interface DiscoveredLevel {
  slug: string;
  label: string;
  rank: number;
  // Correspondance PUBLIÉE (§9) — contenu de Framework, pas un champ interne.
  observation_min: number;
  observation_max: number;
}

export interface DiscoveredSkill {
  id: string;
  code: string;
  name: string;
  framework_version: string;
  levels: DiscoveredLevel[];
}

export interface FrameworkDiscovery {
  framework: {
    id: string;
    slug: string;
    name: string;
    version: string;
    effective_date: string; // §9.2 — date d'entrée en vigueur de cette version
    publisher: string;
    /** DÉRIVÉ des relations `reidentified_as` — jamais stocké en base. */
    identity_status: IdentityStatus;
    /** Si `reidentified` : l'identifiant canonique COURANT. Sinon `null`. */
    canonical_identifier: string | null;
    /** Si `canonical` : l'identifiant ANTÉRIEUR. Sinon `null`. */
    previous_identifier: string | null;
  };
  skills: DiscoveredSkill[];
}

/**
 * N'émet QUE les champs whitelistés d'un niveau. Les bandes d'observation sont
 * ICI VOLONTAIREMENT INCLUSES : ce sont la CORRESPONDANCE PUBLIÉE (§9), du
 * contenu de Framework, pas un champ interne. L'Issuer APPLIQUE cette règle ;
 * Opus X la recalcule et rejette toute divergence (§10). Construction explicite.
 */
function buildLevel(l: SkillLevelRow): DiscoveredLevel {
  return {
    slug: l.slug,
    label: l.label,
    rank: l.rank,
    observation_min: l.observation_min,
    observation_max: l.observation_max,
  };
}

/** N'émet QUE les champs whitelistés d'une Skill — construction explicite. */
function buildSkill(s: SkillRow): DiscoveredSkill {
  return {
    id: s.id,
    code: s.code,
    name: s.name,
    framework_version: s.framework_version,
    levels: [...s.levels].sort((a, b) => a.rank - b.rank).map(buildLevel),
  };
}

/**
 * DÉRIVE le statut d'identité depuis les relations de réidentification qui
 * touchent ce Framework. **Le statut n'est jamais stocké** : il n'existe que par
 * l'existence d'une ligne (`reidentified_as`, OCR-007).
 *
 *   • le Framework est le PRÉDÉCESSEUR d'une relation → `reidentified`
 *     (+ `canonical_identifier` = l'identifiant courant qui l'a remplacé) ;
 *   • il en est le SUCCESSEUR                          → `canonical`
 *     (+ `previous_identifier` = l'identifiant antérieur) ;
 *   • aucune relation                                  → `published`.
 *
 * Une même définition ne peut être qu'un des deux côtés (contraintes d'unicité
 * `one_successor` / `one_predecessor`), d'où le `else if` et non un cumul.
 */
export function deriveIdentity(
  frameworkId: string,
  reidentifications: ReidentificationRow[]
): {
  identity_status: IdentityStatus;
  canonical_identifier: string | null;
  previous_identifier: string | null;
} {
  const asPrior = reidentifications.find((r) => r.prior_id === frameworkId);
  if (asPrior) {
    return {
      identity_status: 'reidentified',
      canonical_identifier: asPrior.canonical_id,
      previous_identifier: null,
    };
  }
  const asCanonical = reidentifications.find((r) => r.canonical_id === frameworkId);
  if (asCanonical) {
    return {
      identity_status: 'canonical',
      canonical_identifier: null,
      previous_identifier: asCanonical.prior_id,
    };
  }
  return { identity_status: 'published', canonical_identifier: null, previous_identifier: null };
}

/**
 * Construit la réponse de découverte à partir des seules définitions publiées.
 * `version` est la version publiée sous laquelle les Skills sont exposées.
 * `reidentifications` sert UNIQUEMENT à dériver le statut d'identité (jamais stocké).
 */
export function buildFrameworkDiscovery(
  framework: FrameworkRow,
  version: FrameworkVersionRow,
  skills: SkillRow[],
  reidentifications: ReidentificationRow[] = []
): FrameworkDiscovery {
  const identity = deriveIdentity(framework.id, reidentifications);
  return {
    framework: {
      id: framework.id,
      slug: framework.slug,
      name: framework.name,
      version: version.version,
      effective_date: version.effective_date,
      publisher: framework.publisher,
      identity_status: identity.identity_status,
      canonical_identifier: identity.canonical_identifier,
      previous_identifier: identity.previous_identifier,
    },
    skills: skills.map(buildSkill),
  };
}
