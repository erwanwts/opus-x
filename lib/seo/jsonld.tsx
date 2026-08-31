/**
 * =====================================================================
 * Opus X — JSON-LD Schema.org du site public (cartographie architecte)
 * =====================================================================
 * ⚠️ SCHEMA.ORG UNIQUEMENT (site public). À NE PAS confondre avec le JSON-LD
 *    custom des Records (@context: docs.opusx.world/context/v1) = l'API (Lot 3).
 *
 * Cartographie : toutes pages → Organization + BreadcrumbList ; piliers → WebPage ;
 * fiches Concepts → DefinedTerm (dans un DefinedTermSet) ; FAQ → FAQPage.
 *
 * Les blocs sont VISIBLES dans le DOM (jamais de cloaking, WEB-001B §13/§14).
 * =====================================================================
 */
const BASE = 'https://opusx.world';
const SCHEMA = 'https://schema.org';

/** @id CANONIQUE de l'entité Opus X — référencé à l'identique par toutes les pages
 * (une SEULE entité) et par le DefinedTermSet (publisher/creator). C'est lui qui
 * désambiguïse « Opus X » (World Skills Protocol) des homonymes. */
export const ORG_ID = `${BASE}/#organization`;
/** @id du glossaire canonique WSP (DefinedTermSet, Lot GEO 3). */
export const WSP_TERMSET_ID = `${BASE}/#wsp-glossary`;

type Ld = Record<string, unknown>;

/** Organization — Opus X, cohérent sur toutes les pages (§15). Entité canonique
 * « Opus X — World Skills Protocol » : @id stable, alternateName, sameAs (présences
 * externes réelles), knowsAbout, description — le socle de désambiguïsation. */
export function organizationLd(): Ld {
  return {
    '@context': SCHEMA,
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Opus X',
    alternateName: ['World Skills Protocol', 'WSP'],
    url: BASE,
    logo: `${BASE}/icon-512.png`,
    description:
      'Opus X is the infrastructure for verified professional identity. Through the World Skills Protocol, professional achievements are linked to trusted evidence, verified through a common protocol, and turned into a Professional Passport that others can independently verify.',
    knowsAbout: [
      'Verified professional identity',
      'Professional Passport',
      'World Skills Protocol',
      'Verifiable credentials',
      'Skill verification',
      'Knowledge graph',
      'Trust infrastructure',
    ],
    sameAs: [
      'https://www.linkedin.com/company/opus-x-world-skills-protocol',
      'https://www.crunchbase.com/organization/opus-x',
      'https://github.com/opus-x-protocol',
      'https://x.com/opusxprotocol',
    ],
  };
}

/** WebSite — le site dans son ensemble (émis sur la Homepage). */
export function webSiteLd(): Ld {
  return { '@context': SCHEMA, '@type': 'WebSite', name: 'Opus X', url: BASE, inLanguage: 'en' };
}

/** BreadcrumbList — fil d'ariane, sur toutes les pages (§12). */
export function breadcrumbLd(trail: { name: string; url: string }[]): Ld {
  return {
    '@context': SCHEMA,
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** WebPage — les pages piliers (§15). */
export function webPageLd(input: { name: string; description: string; url: string; datePublished?: string; version?: string }): Ld {
  const ld: Ld = { '@context': SCHEMA, '@type': 'WebPage', name: input.name, description: input.description, url: input.url, inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Opus X', url: BASE } };
  if (input.datePublished) ld.datePublished = input.datePublished;
  if (input.version) ld.version = input.version;
  return ld;
}

/** FAQPage — la section FAQ (§15). */
export function faqPageLd(qa: { q: string; a: string }[]): Ld {
  return {
    '@context': SCHEMA,
    '@type': 'FAQPage',
    mainEntity: qa.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** DefinedTermSet — le glossaire canonique « World Skills Protocol » (Lot GEO 3).
 * publisher/creator = l'entité Opus X par son @id (une seule entité, pas un doublon). */
export function definedTermSetLd(): Ld {
  return {
    '@context': SCHEMA,
    '@type': 'DefinedTermSet',
    '@id': WSP_TERMSET_ID,
    name: 'World Skills Protocol',
    url: BASE,
    publisher: { '@id': ORG_ID },
    creator: { '@id': ORG_ID },
  };
}

/** DefinedTerm — fiche Concept canonique (Lot GEO 3), rattachée au glossaire WSP par
 * son @id. La `description` est CONSOMMÉE du corpus (GEO Summary du Record), jamais
 * réécrite. N'émettre que pour un concept dont le Record source est Normative. */
export function definedTermLd(input: { name: string; description?: string | null; url: string }): Ld {
  const ld: Ld = {
    '@context': SCHEMA,
    '@type': 'DefinedTerm',
    name: input.name,
    url: input.url,
    inDefinedTermSet: { '@id': WSP_TERMSET_ID },
  };
  if (input.description) ld.description = input.description;
  return ld;
}

/**
 * Sérialise un bloc pour insertion dans un <script type="application/ld+json">.
 * Échappe `< > &` en \uXXXX : un parseur JSON-LD les décode à l'identique (contenu
 * PRÉSERVÉ), mais aucun texte issu d'un Record ne peut fermer le <script> (`</script>`)
 * ni injecter du HTML. Le contexte est du DATA JSON (non exécuté) : `<`/`>` suffisent —
 * défense en profondeur même si le contenu est « le nôtre ».
 */
function serializeLd(b: Ld): string {
  return JSON.stringify(b)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/** Rend un ou plusieurs blocs JSON-LD dans le DOM (script visible). */
export function JsonLd({ blocks }: { blocks: Ld[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Sérialisation durcie : jamais de sortie de <script> depuis un Record.
          dangerouslySetInnerHTML={{ __html: serializeLd(b) }}
        />
      ))}
    </>
  );
}
