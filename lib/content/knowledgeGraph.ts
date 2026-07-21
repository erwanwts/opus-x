/**
 * =====================================================================
 * Archétype éditorial — Knowledge Graph (/knowledge-graph)
 * =====================================================================
 * Prose VERBATIM livrée par l'architecte (doc « Knowledge Graph — World Skills
 * Protocol – Phase A – Page 2/12 »). Aucun mot reformulé, raccourci ni ajouté.
 *
 * DESTINATIONS CITÉES : le document livré écrivait `/graph`. L'architecte a corrigé
 * vers `/knowledge-graph`, SLUG CANONIQUE arrêté — « tous les appels à l'action
 * doivent utiliser exactement le slug canonique arrêté [...], sans exception. Il ne
 * faut pas corriger au mieux ni créer de redirection implicite. » Correction
 * MÉCANIQUE du slug, décidée par l'architecte : ce n'est pas une substitution de
 * confort. Les deux CTA résolvent donc désormais vers cette page même.
 * =====================================================================
 */
import {
  type ArchetypeContent,
  resolveCta,
  logGaps,
  p,
} from './archetype';

const SLUG = 'knowledge-graph';

export const KG_SEO_TITLE =
  'Knowledge Graph | How the World Skills Protocol Connects Skills, Records and Trust';
export const KG_SEO_DESCRIPTION =
  'Discover how the World Skills Protocol Knowledge Graph connects concepts, Records and published definitions. Learn what it guarantees, what it deliberately excludes, and why it never infers information beyond the canonical corpus.';

export function buildKnowledgeGraph(locale: string): ArchetypeContent {
  const gaps: string[] = [];

  const content: ArchetypeContent = {
    slug: SLUG,
    seoTitle: KG_SEO_TITLE,
    seoDescription: KG_SEO_DESCRIPTION,

    hero: {
      h1: 'The Knowledge Graph',
      subtitle: "A navigable projection of the protocol's published knowledge.",
      blocks: [
        p('The World Skills Protocol is more than a collection of documents.'),
        p('Every published definition, concept and relationship forms part of a coherent body of knowledge.'),
        p('The Knowledge Graph projects this body of knowledge into an explorable network, allowing humans, software systems and AI agents to navigate the protocol exactly as it has been published—without interpretation, inference or hidden assumptions.'),
        p('It exists to make the protocol understandable without changing its meaning.'),
      ],
      ctas: [resolveCta('Explore the Knowledge Graph', '/knowledge-graph', locale, gaps)],
    },

    sections: [
      {
        title: 'Section 1 — What is the Knowledge Graph?',
        blocks: [
          p('The Knowledge Graph is the canonical projection of the World Skills Protocol.'),
          p("It transforms the protocol's published concepts and relationships into an interconnected graph while preserving exactly the semantics established by the protocol itself."),
          p('Every node represents a concept formally published by the protocol.'),
          p('Every edge represents a relationship explicitly declared by the protocol.'),
          p('The graph is therefore not an independent source of knowledge.'),
          p('It is a structured reading of the canonical corpus.'),
          p('Nothing appears in the graph unless it has first been published by the protocol.'),
          p('Likewise, nothing published by the protocol is intentionally omitted from the graph.'),
          p('The graph exists to expose structure—not to create it.'),
        ],
      },
      {
        title: 'Section 2 — Why does it exist?',
        blocks: [
          p('As the protocol grows, understanding how concepts relate to one another becomes increasingly important.'),
          p('Reading Records sequentially explains individual concepts.'),
          p('The Knowledge Graph explains how those concepts fit together.'),
          p('Instead of navigating documents one by one, readers can explore the protocol through its architecture.'),
          p('Developers can discover dependencies.'),
          p('AI systems can traverse published relationships.'),
          p('Researchers can understand how definitions connect.'),
          p('The graph therefore provides a navigable representation of the protocol while preserving the authority of the Records themselves.'),
          p('The protocol remains the source.'),
          p('The graph remains its projection.'),
        ],
      },
      {
        title: 'Section 3 — How is it built?',
        blocks: [
          p('The Knowledge Graph is generated directly from the published corpus.'),
          p("The projection process reads the protocol's Records and extracts only the concepts and relationships that those Records explicitly publish."),
          p('The graph generator never invents concepts.'),
          p('It never creates relationships.'),
          p('It never derives semantics from implementation data.'),
          p('Each projection is generated from a specific version of the published corpus and therefore represents a precise documentary state of the protocol.'),
          p('When the corpus evolves, a new projection is generated.'),
          p('Previous projections remain historical artefacts and are never rewritten.'),
          p('The graph therefore reflects the evolution of the protocol while preserving the integrity of every published state.'),
        ],
      },
      {
        title: 'Section 4 — What does the graph guarantee?',
        blocks: [
          p('The Knowledge Graph guarantees that every published relationship originates from the protocol itself.'),
          p('Every node corresponds to a published concept.'),
          p('Every edge corresponds to a published relationship.'),
          p('Every projection is reproducible from the published corpus.'),
          p('Because the graph is generated rather than manually maintained, its structure can always be traced back to the Records that define it.'),
          p('This provides complete documentary traceability.'),
          p('Every relationship can be justified.'),
          p('Every concept can be located.'),
          p('Every projection can be regenerated from the same documentary state.'),
          p('The graph is therefore deterministic, reproducible and auditable.'),
        ],
      },
      {
        title: 'Section 5 — What the graph deliberately does not guarantee',
        blocks: [
          p('The Knowledge Graph is intentionally limited.'),
          p('These limitations are architectural guarantees rather than missing features.'),
          p('The graph does not contain operational data.'),
          p('It does not represent database instances.'),
          p('It does not expose unpublished relationships.'),
          p('It does not infer semantics.'),
          p('It does not interpret the protocol.'),
          p('If an implementation stores additional information that has never been published by the protocol, that information does not appear in the graph.'),
          p('Likewise, if a relationship exists only in an implementation and has never been established by a Record, the graph intentionally ignores it.'),
          p('The graph projects concepts.'),
          p('It does not project individual occurrences of those concepts.'),
          p('The graph therefore represents what the protocol publishes—not everything an implementation knows.'),
        ],
      },
      {
        title: 'Section 6 — Concepts and instances',
        blocks: [
          p('The World Skills Protocol distinguishes concepts from their individual occurrences.'),
          p('A concept belongs to the protocol.'),
          p('An occurrence belongs to an implementation.'),
          p('For example, the protocol may establish that a Framework can be reidentified.'),
          p('This relationship belongs to the graph because it is part of the published architecture.'),
          p('A particular Framework being reidentified by another Framework is an implementation event.'),
          p("Such occurrences remain outside the graph and are instead exposed through the protocol's discovery mechanisms."),
          p('This separation ensures that the graph remains stable while implementations continue to evolve.'),
        ],
      },
      {
        title: 'Section 7 — Relationship with the canonical corpus',
        blocks: [
          p('The Knowledge Graph never replaces the protocol.'),
          p('Records remain the only normative source.'),
          p('The graph exists solely to improve navigation, exploration and understanding.'),
          p('Whenever a concept or relationship appears in the graph, its authority comes entirely from the Record that established it.'),
          p('If a relationship has never been published by the protocol, the graph cannot display it.'),
          p('Conversely, once a relationship is established by the corpus, it becomes eligible for projection without requiring manual modelling.'),
          p('The graph therefore follows the protocol.'),
          p('The protocol never follows the graph.'),
        ],
      },
      {
        title: 'Section 8 — Relationship with AI systems',
        blocks: [
          p('Large Language Models and intelligent software benefit from structured knowledge.'),
          p('Instead of relying solely on natural-language search, they can navigate explicit concepts and published relationships.'),
          p('This reduces ambiguity.'),
          p('It improves discoverability.'),
          p('It allows software agents to understand how published concepts relate without requiring additional interpretation.'),
          p('Because the graph contains only protocol-approved knowledge, AI systems receive information whose origin remains fully traceable.'),
          p('Every answer can ultimately be traced back to the Record that established the underlying concept or relationship.'),
        ],
      },
      {
        title: 'Section 9 — Versioning',
        blocks: [
          p('Each Knowledge Graph projection corresponds to a specific documentary state of the protocol.'),
          p('Whenever the corpus changes, a new projection is generated.'),
          p('Earlier projections remain preserved as historical representations.'),
          p('They are never modified retrospectively.'),
          p('This ensures that references made against a previous projection remain reproducible and auditable even after the protocol evolves.'),
          p('The graph therefore evolves by publication rather than by mutation.'),
        ],
      },
    ],

    qaSections: [],

    conclusion: [
      p('The Knowledge Graph exists to make the World Skills Protocol easier to explore without changing what it says.'),
      p('It does not replace the Records.'),
      p('It does not interpret them.'),
      p('It does not infer what has not been published.'),
      p('Its purpose is simple:'),
      p('to expose the architecture that already exists within the protocol and make that architecture navigable for both humans and machines.'),
    ],

    finalCta: {
      title: 'Explore the Protocol',
      text: 'Understand how concepts, Records and published relationships connect across the World Skills Protocol.',
      ctas: [resolveCta('Explore the Knowledge Graph', '/knowledge-graph', locale, gaps)],
    },

    signature: {
      documentVersion: '1.0.0',
      editorialStatus: 'Draft',
      publisher: 'Opus X',
      language: 'English',
    },

    _gaps: [...new Set(gaps)],
  };

  logGaps(SLUG, gaps);
  return content;
}
