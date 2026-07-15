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
 * Construit la réponse de découverte à partir des seules définitions publiées.
 * `version` est la version publiée sous laquelle les Skills sont exposées.
 */
export function buildFrameworkDiscovery(
  framework: FrameworkRow,
  version: FrameworkVersionRow,
  skills: SkillRow[]
): FrameworkDiscovery {
  return {
    framework: {
      id: framework.id,
      slug: framework.slug,
      name: framework.name,
      version: version.version,
      effective_date: version.effective_date,
      publisher: framework.publisher,
    },
    skills: skills.map(buildSkill),
  };
}
