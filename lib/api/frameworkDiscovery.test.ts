/**
 * Découverte du Framework (Lot O0) — le builder n'émet QUE les champs
 * whitelistés, dans un ordre de niveaux stable, sans fuite de contenu interne.
 */
import { describe, it, expect } from 'vitest';
import {
  buildFrameworkDiscovery,
  deriveIdentity,
  type FrameworkRow,
  type FrameworkVersionRow,
  type ReidentificationRow,
  type SkillRow,
} from './frameworkDiscovery';

const framework: FrameworkRow = {
  id: 'framework:wtr',
  slug: 'world-trader',
  name: 'World Trader Framework',
  publisher: 'Opus X',
};
const version: FrameworkVersionRow = {
  version: '0.1',
  status: 'published',
  effective_date: '2026-07-13',
};

const wtr212: SkillRow = {
  id: 'wtr:212',
  code: 'WTR-212',
  name: 'Intention vs Engagement',
  framework_version: '0.1',
  // volontairement désordonnés pour prouver le tri ; bandes publiées (§9)
  levels: [
    { slug: 'mastery', label: 'Mastery', rank: 4, observation_min: 5, observation_max: 5 },
    { slug: 'aware', label: 'Aware', rank: 1, observation_min: 2, observation_max: 2 },
    { slug: 'applied', label: 'Applied', rank: 2, observation_min: 3, observation_max: 3 },
    { slug: 'proficient', label: 'Proficient', rank: 3, observation_min: 4, observation_max: 4 },
  ],
};

describe('buildFrameworkDiscovery', () => {
  it('expose l’identifiant canonique stable + la version de la Skill', () => {
    const d = buildFrameworkDiscovery(framework, version, [wtr212]);
    expect(d.framework.id).toBe('framework:wtr');
    expect(d.framework.version).toBe('0.1');
    expect(d.skills).toHaveLength(1);
    expect(d.skills[0].id).toBe('wtr:212');
    expect(d.skills[0].code).toBe('WTR-212');
    expect(d.skills[0].framework_version).toBe('0.1');
  });

  it('trie les niveaux par rang (vocabulaire claimed_level pour l’Issuer)', () => {
    const d = buildFrameworkDiscovery(framework, version, [wtr212]);
    expect(d.skills[0].levels.map((l) => l.slug)).toEqual([
      'aware',
      'applied',
      'proficient',
      'mastery',
    ]);
  });

  it('PUBLIE les bandes d’observation (§9) + effective_date, mais rien d’autre d’interne', () => {
    // Entrée « fuyante » : recorded_at/description/criteria sont INTERNES et ne
    // doivent pas ressortir ; observation_min/max sont PUBLIÉES et le doivent.
    const leaky = {
      ...wtr212,
      recorded_at: '2026-07-13T00:00:00Z',
      description: 'interne',
      levels: [
        {
          slug: 'applied',
          label: 'Applied',
          rank: 2,
          observation_min: 3,
          observation_max: 3,
          criteria: 'interne', // contenu interne, jamais exposé
          recorded_at: '2026-07-13T00:00:00Z',
        },
      ],
    } as unknown as SkillRow;

    const d = buildFrameworkDiscovery(framework, version, [leaky]);
    const skill = d.skills[0];

    expect(Object.keys(skill).sort()).toEqual(
      ['code', 'framework_version', 'id', 'levels', 'name'].sort()
    );
    // Le niveau expose EXACTEMENT le vocabulaire + la correspondance publiée.
    expect(Object.keys(skill.levels[0]).sort()).toEqual(
      ['label', 'observation_max', 'observation_min', 'rank', 'slug'].sort()
    );
    // Les bandes SONT présentes (contenu de Framework publié, §9).
    expect(skill.levels[0].observation_min).toBe(3);
    expect(skill.levels[0].observation_max).toBe(3);
    // …mais le reste du contenu interne ne fuit jamais.
    const json = JSON.stringify(d);
    expect(json).not.toContain('recorded_at');
    expect(json).not.toContain('criteria');
    expect(json).not.toContain('interne');
  });

  it('expose framework.effective_date (§9.2)', () => {
    const d = buildFrameworkDiscovery(framework, version, [wtr212]);
    expect(d.framework.effective_date).toBe('2026-07-13');
  });

  it('publie les bandes des 4 niveaux, triées, sans couvrir 0–1 (seuil P2 par omission)', () => {
    const d = buildFrameworkDiscovery(framework, version, [wtr212]);
    const levels = d.skills[0].levels;
    expect(levels.map((l) => l.slug)).toEqual(['aware', 'applied', 'proficient', 'mastery']);
    // Aucune bande ne couvre 0 ni 1 : P2 encodé par OMISSION (§9.2.3).
    expect(levels.every((l) => l.observation_min >= 2)).toBe(true);
  });

  it('ne fabrique jamais de Skill : liste vide → skills vides', () => {
    const d = buildFrameworkDiscovery(framework, version, []);
    expect(d.skills).toEqual([]);
    expect(d.framework.name).toBe('World Trader Framework');
  });
});

/**
 * Statut d'identité — DÉRIVÉ des relations `reidentified_as` (OCR-007 PRD-306),
 * JAMAIS stocké. Aucune colonne de la base ne le porte : il n'existe que par
 * l'existence d'une ligne de réidentification.
 */
const REID: ReidentificationRow[] = [
  { prior_id: 'framework:wtf', canonical_id: 'framework:wtr' },
];

describe('deriveIdentity (statut dérivé, jamais stocké)', () => {
  it('PRÉDÉCESSEUR d’une relation → reidentified + identifiant canonique courant', () => {
    const i = deriveIdentity('framework:wtf', REID);
    expect(i.identity_status).toBe('reidentified');
    expect(i.canonical_identifier).toBe('framework:wtr');
    expect(i.previous_identifier).toBeNull();
  });

  it('SUCCESSEUR d’une relation → canonical + identifiant antérieur', () => {
    const i = deriveIdentity('framework:wtr', REID);
    expect(i.identity_status).toBe('canonical');
    expect(i.previous_identifier).toBe('framework:wtf');
    expect(i.canonical_identifier).toBeNull();
  });

  it('aucune relation → published, sans identifiant lié', () => {
    const i = deriveIdentity('framework:autre', REID);
    expect(i.identity_status).toBe('published');
    expect(i.canonical_identifier).toBeNull();
    expect(i.previous_identifier).toBeNull();
  });

  it('aucune relation connue (liste vide) → published', () => {
    expect(deriveIdentity('framework:wtr', []).identity_status).toBe('published');
  });
});

describe('buildFrameworkDiscovery — statut d’identité exposé', () => {
  it('la représentation COURANTE expose canonical + previous_identifier', () => {
    const d = buildFrameworkDiscovery(framework, version, [wtr212], REID);
    expect(d.framework.identity_status).toBe('canonical');
    expect(d.framework.previous_identifier).toBe('framework:wtf');
    expect(d.framework.canonical_identifier).toBeNull();
  });

  it('la représentation ANTÉRIEURE expose reidentified + canonical_identifier', () => {
    const wtf: FrameworkRow = {
      id: 'framework:wtf',
      slug: 'wtf',
      name: 'World Trader Framework',
      publisher: 'Opus X',
    };
    const d = buildFrameworkDiscovery(wtf, version, [], REID);
    expect(d.framework.identity_status).toBe('reidentified');
    expect(d.framework.canonical_identifier).toBe('framework:wtr');
    expect(d.framework.previous_identifier).toBeNull();
    // La représentation antérieure reste PUBLIÉE et consultable à son adresse.
    expect(d.framework.slug).toBe('wtf');
  });

  it('sans relation, le contrat reste inchangé (published, champs à null)', () => {
    const d = buildFrameworkDiscovery(framework, version, [wtr212]);
    expect(d.framework.identity_status).toBe('published');
    expect(d.framework.canonical_identifier).toBeNull();
    expect(d.framework.previous_identifier).toBeNull();
  });
});
