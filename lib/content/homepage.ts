/**
 * =====================================================================
 * Opus X — Contenu de la Homepage (archétype institutionnel, PAS une fiche concept)
 * =====================================================================
 * Prose VERBATIM livrée par l'architecte (doc « Homepage — Opus X »). Aucun mot
 * n'est reformulé, raccourci ni ajouté. La Homepage n'a pas de Record : son texte
 * éditorial vit ici (source unique), la présentation dans <HomePage>.
 *
 * Les liens (Reading Paths, Explore the Resources) sont résolus par pillarHrefBySlug
 * — même mécanisme que les pastilles d'entités : une page devient un lien DÈS son
 * entrée dans PILLARS, sans retouche éditoriale. Une page absente (ex. API &
 * Developers) reste du TEXTE BRUT (jamais de lien mort) et est tracée dans _gaps.
 * =====================================================================
 */
import { loadRecord } from '@/lib/registry/source';
import { PILLARS, pillarHrefBySlug, ctaHref } from '@/lib/seo/pillars';

export interface ReadingPathLink {
  name: string;
  href: string | null; // null → texte brut (page non publiée dans PILLARS)
}
export interface ReadingPath {
  audience: string;
  text: string;
  links: ReadingPathLink[]; // dans l'ordre d'apparition dans `text`
}
export interface ResourceLink {
  title: string;
  href: string | null;
}
export interface HomepageContent {
  hero: {
    h1: string;
    valueProp: string;
    /** `href` RÉSOLU : null = la page n'existe pas → libellé inerte (RD-001). */
    ctaPrimary: { label: string; href: string | null };
    ctaSecondary: { label: string; href: string | null };
  };
  whyExists: string[];
  foundationsIntro: string;
  foundations: { name: string; body: string[] }[];
  ecosystem: string[];
  readingPaths: ReadingPath[];
  resourcesIntro: string;
  resources: ResourceLink[];
  finalCta: { label: string; href: string | null };
  signature: { contentVersion: string; editorialStatus: string; publisher: string; language: string };
  _gaps: string[];
}

// ─── Prose VERBATIM (doc architecte) ────────────────────────────────────────
const HERO_H1 = 'Professional identity, built on verified evidence.';
const HERO_VALUE =
  'Opus X is the infrastructure for issuing trusted professional identities from verifiable achievements. Instead of relying on claims, résumés, or self-declared skills, every achievement can be linked to evidence, verified through a common protocol, and become part of a professional identity that others can trust.';

const WHY_EXISTS = [
  'For decades, professional identity has been built on documents that are difficult to verify. Diplomas, résumés, certificates and portfolios describe what a person claims to know, but they rarely explain how those claims were demonstrated, who verified them, or whether they remain trustworthy over time.',
  'At the same time, the number of digital learning platforms, professional communities, certification programs and AI-assisted workflows continues to grow. Skills are developed everywhere, yet proof remains fragmented. Each organization stores evidence differently, each platform defines its own standards, and every verification process starts from scratch.',
  'Opus X exists to solve this fragmentation.',
  'Rather than becoming another certification platform, Opus X provides a common trust infrastructure capable of connecting verified evidence from multiple sources into a single professional identity. Every verified achievement can contribute to a Professional Passport, while preserving its provenance and allowing independent verification.',
  'The objective is simple: make professional achievements understandable, verifiable and reusable across organizations, platforms and technologies.',
  'Professional trust should not depend on where someone learned, but on what can be verified.',
];

const FOUNDATIONS_INTRO =
  'Professional trust is built by combining four complementary components. Each has a distinct responsibility within the ecosystem.';

const FOUNDATIONS = [
  {
    name: 'Professional Passport',
    body: [
      "The Professional Passport is the public representation of a person's verified professional identity.",
      'Rather than listing claims, it presents verified achievements connected to their supporting evidence, allowing organizations and individuals to understand what has actually been demonstrated.',
    ],
  },
  {
    name: 'Evidence',
    body: [
      'Evidence is the foundation of trust.',
      'Every verified achievement originates from evidence produced by a learning platform, an organization, an assessment process or another trusted source. Opus X preserves this provenance so that achievements remain traceable and independently verifiable.',
    ],
  },
  {
    name: 'Trust',
    body: [
      'Trust is not declared—it is computed.',
      'Opus X evaluates the reliability of professional information by combining verification status, provenance, governance rules and evidence integrity into a transparent trust model that can evolve over time.',
    ],
  },
  {
    name: 'World Skills Protocol',
    body: [
      'The World Skills Protocol defines the common language that allows organizations to exchange verified professional information.',
      'It specifies how identities, evidence, achievements and verification can be represented consistently, enabling interoperability without requiring every organization to adopt the same internal systems.',
    ],
  },
];

const ECOSYSTEM = [
  'Every professional achievement begins with an event.',
  'A learner completes a programme, a candidate passes an assessment, an employee demonstrates a competency, or an organization validates a professional milestone. These events generate evidence that can be preserved together with its origin and verification history.',
  'The World Skills Protocol provides the common structure for representing this information. Rather than replacing existing platforms, it allows them to describe verified achievements using a shared language.',
  'Opus X then aggregates this verified information into a Professional Passport. The passport does not duplicate evidence; it references it, preserving provenance while presenting a coherent professional identity.',
  'Verification services can independently validate the authenticity of the information, while organizations and applications consume the resulting trust information through common interfaces.',
  'The result is an ecosystem where professional identity is no longer built from isolated documents, but from verifiable evidence connected through a shared protocol and presented as a trustworthy, portable professional passport.',
];

// Reading Paths : texte verbatim + pages nommées EN GRAS (ordre du doc). Le mapping
// nom → slug vient de l'architecte ; on ne déduit rien, on lie les pages nommées.
const NAME_TO_SLUG: Record<string, string> = {
  'Professional Passport': 'professional-passport',
  Evidence: 'evidence',
  Trust: 'trust',
  'World Skills Protocol': 'world-skills-protocol',
  Verification: 'verification',
  Registry: 'registry',
  'API & Developers': 'developers', // route gravée /en/developers ; non résolu tant qu'absent de PILLARS
};

const READING_PATHS: { audience: string; text: string; pages: string[] }[] = [
  {
    audience: 'For Professionals',
    text: 'If you want to understand how verified achievements become part of your professional identity, begin with the Professional Passport, then explore Evidence and Trust.',
    pages: ['Professional Passport', 'Evidence', 'Trust'],
  },
  {
    audience: 'For Developers',
    text: 'If you want to integrate your platform with Opus X or consume verified professional information, start with API & Developers, then continue with the World Skills Protocol.',
    pages: ['API & Developers', 'World Skills Protocol'],
  },
  {
    audience: 'For Organizations',
    text: 'If your organization issues, validates or consumes professional achievements, begin with the World Skills Protocol, then explore Verification and Registry.',
    pages: ['World Skills Protocol', 'Verification', 'Registry'],
  },
  {
    audience: 'For Verifiers',
    text: 'If you need to understand how professional information is verified and trusted, start with Verification, then continue with Trust and Evidence.',
    pages: ['Verification', 'Trust', 'Evidence'],
  },
];

const RESOURCES_INTRO = 'Explore the core components that together form the Opus X ecosystem.';

/** Titre canonique d'un pilier (= Canonical Name du Record), pour les libellés de navigation. */
function pillarTitle(recordId: string | null): string {
  if (!recordId) return '';
  const doc = loadRecord(recordId);
  return doc?.metadata['Canonical Name'] || recordId;
}

/**
 * Résout la Homepage pour une locale : liens des Reading Paths et des Resources via
 * pillarHrefBySlug, libellés Resources = titres canoniques. Trace dans _gaps toute
 * page nommée mais non résolue (absente de PILLARS) — jamais un lien mort.
 */
export function buildHomepage(locale: string): HomepageContent {
  const gaps: string[] = [];

  /** Résout une destination de CTA et trace l'absence — jamais de substitution. */
  const cta = (destination: string): string | null => {
    const href = ctaHref(destination, locale);
    if (!href) gaps.push(`cta:${destination}`);
    return href;
  };

  const readingPaths: ReadingPath[] = READING_PATHS.map((p) => ({
    audience: p.audience,
    text: p.text,
    links: p.pages.map((name) => {
      const slug = NAME_TO_SLUG[name];
      const href = slug ? pillarHrefBySlug(slug, locale) : null;
      if (!href) gaps.push(`reading-path:${name}`);
      return { name, href };
    }),
  }));

  // « Explore the Resources » liste les COMPOSANTS de l'écosystème — des fiches
  // concept, dont le libellé EST le Canonical Name de leur Record. Les archétypes
  // éditoriaux (Knowledge Graph, Developers, Questions) n'ont pas de Record : les
  // inclure produirait des libellés vides. Ils restent joignables par les Reading
  // Paths, qui les nomment explicitement.
  const resources: ResourceLink[] = PILLARS.filter((p) => p.recordId).map((p) => ({
    title: pillarTitle(p.recordId),
    href: pillarHrefBySlug(p.slug, locale),
  }));

  // eslint-disable-next-line no-console
  console.log(`[geo:gaps] homepage: ${gaps.length ? gaps.join(', ') : 'none'}`);

  return {
    hero: {
      h1: HERO_H1,
      valueProp: HERO_VALUE,
      // RD-001 — l'adresse n'est plus FABRIQUÉE par concaténation : elle est résolue
      // par le registre. Une page absente de PILLARS (ou non traduite dans la locale)
      // rend le CTA inerte au lieu de produire un lien mort silencieux.
      ctaPrimary: { label: 'Start with the Professional Passport', href: cta('/professional-passport') },
      ctaSecondary: { label: 'Explore the Foundations', href: cta('#platform') },
    },
    whyExists: WHY_EXISTS,
    foundationsIntro: FOUNDATIONS_INTRO,
    foundations: FOUNDATIONS,
    ecosystem: ECOSYSTEM,
    readingPaths,
    resourcesIntro: RESOURCES_INTRO,
    resources,
    finalCta: { label: 'Explore the World Skills Protocol', href: cta('/world-skills-protocol') },
    signature: { contentVersion: '1.0.0', editorialStatus: 'Draft', publisher: 'Opus X', language: 'English' },
    _gaps: gaps,
  };
}
