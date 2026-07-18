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

type Ld = Record<string, unknown>;

/** Organization — Opus X, cohérent sur toutes les pages (§15). */
export function organizationLd(): Ld {
  return { '@context': SCHEMA, '@type': 'Organization', name: 'Opus X', url: BASE };
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

/** DefinedTerm — fiche Concept (lot ultérieur, DefinedTermSet en projection Glossary). */
export function definedTermLd(input: { name: string; description?: string | null; url: string; termSetUrl: string }): Ld {
  const ld: Ld = { '@context': SCHEMA, '@type': 'DefinedTerm', name: input.name, url: input.url, inDefinedTermSet: input.termSetUrl };
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
