/**
 * =====================================================================
 * Archétype éditorial — Cross-cutting Questions (/questions)
 * =====================================================================
 * Prose VERBATIM livrée par l'architecte (doc « Cross-cutting Questions — World
 * Skills Protocol – Phase A – Page 4/12 »). Aucun mot reformulé ni ajouté.
 *
 * ANTI-DUPLICATION — contrôle exécuté contre `docs/geo/FAQ-anti-duplication-phase-a.md`
 * (145 questions déjà couvertes par les 7 piliers) : 41 questions ici, **0 doublon
 * exact**, 0 recouvrement thématique. Le FAQPage JSON-LD de cette page ne couvre donc
 * que des questions inédites, conformément à la règle de l'inventaire. Toute question
 * AJOUTÉE ici devra être revérifiée contre cet inventaire AVANT publication.
 *
 * DESTINATIONS CITÉES : `/knowledge-graph` et `/developers` existent et résolvent.
 * `/records` N'EXISTE PAS : destination conservée, CTA INERTES, absence tracée.
 * Aucune substitution. (`/graph` → `/knowledge-graph` : correction mécanique du slug
 * canonique, décidée par l'architecte.)
 *
 * PROMESSE EN PROSE — le §12 d'origine renvoyait le lecteur vers un Dictionary
 * retiré du périmètre. Une promesse textuelle n'est pas une référence : le résolveur
 * canonique (RD-001) ne la voit pas et ne peut rien contre elle. Seule une réécriture
 * éditoriale la lève — texte de remplacement livré par l'architecte, transcrit verbatim.
 * =====================================================================
 */
import {
  type ArchetypeContent,
  resolveCta,
  logGaps,
  p,
  ul,
} from './archetype';

const SLUG = 'questions';

export const Q_SEO_TITLE = 'Frequently Asked Questions | World Skills Protocol';
export const Q_SEO_DESCRIPTION =
  'Find answers to the most common questions about the World Skills Protocol, including concepts, Records, identity, versioning, Knowledge Graph, canonical identifiers and interoperability.';

export function buildQuestions(locale: string): ArchetypeContent {
  const gaps: string[] = [];

  const content: ArchetypeContent = {
    slug: SLUG,
    seoTitle: Q_SEO_TITLE,
    seoDescription: Q_SEO_DESCRIPTION,

    hero: {
      h1: 'Frequently Asked Questions',
      subtitle: 'Understanding the protocol starts with understanding its principles.',
      blocks: [
        p('The World Skills Protocol introduces concepts that are often unfamiliar at first: canonical identifiers, logical definitions, representations, Knowledge Graphs, identity resolution, reidentification and more.'),
        p('This page answers the questions most frequently asked by readers, developers, implementers and organisations discovering the protocol.'),
        p('Each answer reflects the published protocol.'),
        p('Where additional detail exists, links point to the corresponding Records or technical resources.'),
      ],
      ctas: [resolveCta('Browse the Protocol Records', '/records', locale, gaps)],
    },

    sections: [],

    qaSections: [
      {
        title: 'Section 1 — About the Protocol',
        qa: [
          {
            q: 'What is the World Skills Protocol?',
            a: [
              p('The World Skills Protocol is an open protocol for publishing, identifying, connecting and verifying professional skills information.'),
              p('It defines shared concepts, identifiers and relationships so that independent systems can exchange professional information without losing meaning or traceability.'),
              p('It is not a software product.'),
              p('It is a specification.'),
            ],
          },
          {
            q: 'Who is the protocol for?',
            a: [
              p('The protocol is intended for:'),
              ul(
                'developers;',
                'software vendors;',
                'certification bodies;',
                'educational organisations;',
                'employers;',
                'AI systems;',
                'public institutions;',
                'and any organisation that needs interoperable professional skills data.',
              ),
            ],
          },
          {
            q: 'Does the protocol replace existing platforms?',
            a: [
              p('No.'),
              p('The protocol is designed to connect independent systems.'),
              p('Existing applications remain responsible for their own users, interfaces and operational data.'),
              p('The protocol provides a common language between them.'),
            ],
          },
          {
            q: 'Is the protocol open?',
            a: [
              p('Yes.'),
              p('Its published concepts, Records and governance are intended to be openly documented.'),
              p('Individual implementations remain free to choose their own licensing and business models.'),
            ],
          },
        ],
      },
      {
        title: 'Section 2 — About Records',
        qa: [
          {
            q: 'What is a Record?',
            a: [
              p('A Record is a published document that establishes one or more normative elements of the protocol.'),
              p('Records define concepts, relationships, rules or governance decisions.'),
              p('They constitute the authoritative source of protocol meaning.'),
            ],
          },
          {
            q: 'Are Records specifications?',
            a: [
              p('Yes.'),
              p('A Record is the normative specification for the concepts it establishes.'),
              p('Everything else derives from those Records.'),
            ],
          },
          {
            q: 'Which document has authority?',
            a: [
              p('The Records.'),
              p('Supporting material may explain the protocol.'),
              p('Only the published Records establish it.'),
            ],
          },
          {
            q: 'Can software disagree with a Record?',
            a: [
              p('Software can behave differently.'),
              p('The protocol cannot.'),
              p('When an implementation conflicts with a published Record, the Record remains authoritative.'),
            ],
          },
        ],
      },
      {
        title: 'Section 3 — Identity',
        qa: [
          {
            q: "Why doesn't the protocol use URLs as identifiers?",
            a: [
              p('Because locations change.'),
              p('Identity must remain stable even when storage, hosting or publication mechanisms evolve.'),
              p('Canonical identifiers identify the published object.'),
              p('Discovery mechanisms locate its current representation.'),
            ],
          },
          {
            q: 'What is a canonical identifier?',
            a: [
              p('A canonical identifier is the stable identity assigned to a published protocol object.'),
              p('It remains independent of:'),
              ul(
                'file names;',
                'URLs;',
                'databases;',
                'publication formats;',
                'and storage technologies.',
              ),
            ],
          },
          {
            q: 'What is identity resolution?',
            a: [
              p('Identity resolution is the process of locating the current representation associated with a canonical identifier.'),
              p("It belongs to the protocol's reading layer."),
              p('It does not change the identity itself.'),
            ],
          },
          {
            q: 'Can an identifier change?',
            a: [
              p('The protocol distinguishes between identity and representation.'),
              p('If identity itself must be corrected, the protocol publishes a reidentification rather than silently changing historical publications.'),
            ],
          },
        ],
      },
      {
        title: 'Section 4 — Versioning',
        qa: [
          {
            q: 'Why are there several kinds of version?',
            a: [
              p('Because different things evolve independently.'),
              p('The protocol distinguishes:'),
              ul('documentary versioning;', 'normative versioning;', 'representation versioning.'),
              p('Each answers a different question.'),
            ],
          },
          {
            q: 'Does every new document version change the protocol?',
            a: [
              p('No.'),
              p('Many documentary revisions improve wording, structure or presentation without changing normative meaning.'),
            ],
          },
          {
            q: 'What is a representation version?',
            a: [
              p('It identifies a particular published expression of a logical definition.'),
              p('Changing a representation does not necessarily change the meaning.'),
            ],
          },
          {
            q: 'Can two representations describe the same definition?',
            a: [
              p('Yes.'),
              p('Different canonical representations may preserve the same logical definition.'),
            ],
          },
        ],
      },
      {
        title: 'Section 5 — Knowledge Graph',
        qa: [
          {
            q: 'What is the Knowledge Graph?',
            a: [
              p('The Knowledge Graph is the canonical projection of the published concepts and relationships established by the protocol.'),
              p('It helps readers and software navigate the architecture of the protocol.'),
            ],
          },
          {
            q: 'Is the Knowledge Graph authoritative?',
            a: [
              p('No.'),
              p('The graph is generated from the Records.'),
              p('The Records remain the authoritative source.'),
            ],
          },
          {
            q: 'Does the graph contain database data?',
            a: [
              p('No.'),
              p('The graph projects concepts.'),
              p('It does not project operational instances.'),
            ],
          },
          {
            q: 'Can the graph infer relationships?',
            a: [
              p('No.'),
              p('Every relationship displayed by the graph must first have been published by the protocol.'),
              p('The graph never invents semantics.'),
            ],
          },
          {
            q: "Why isn't a relationship visible?",
            a: [
              p('Because it has not yet been established by a published Record.'),
              p('The graph cannot project unpublished knowledge.'),
            ],
          },
        ],
      },
      {
        title: 'Section 6 — Concepts and instances',
        qa: [
          {
            q: 'What is the difference between a concept and an instance?',
            a: [
              p('A concept belongs to the protocol.'),
              p('An instance belongs to an implementation.'),
              p('The protocol publishes definitions.'),
              p('Applications store occurrences of those definitions.'),
            ],
          },
          {
            q: "Why doesn't the graph show every operational fact?",
            a: [
              p('Because operational facts belong to implementations.'),
              p('The graph intentionally represents only published protocol knowledge.'),
            ],
          },
          {
            q: 'Can implementations extend the protocol?',
            a: [
              p('Yes.'),
              p('They may introduce local concepts and behaviours.'),
              p('Those extensions remain implementation-specific until the protocol formally publishes them.'),
            ],
          },
        ],
      },
      {
        title: 'Section 7 — Reidentification',
        qa: [
          {
            q: 'What is reidentification?',
            a: [
              p('Reidentification preserves the continuity of a published definition when its identity or canonical representation must be corrected.'),
              p('The meaning remains unchanged.'),
            ],
          },
          {
            q: 'Is reidentification the same as succession?',
            a: [
              p('No.'),
              p('Succession introduces a distinct normative object.'),
              p('Reidentification preserves the same logical definition across a corrected identity or representation.'),
            ],
          },
          {
            q: 'Why are both relationships necessary?',
            a: [
              p('Because they answer different questions.'),
              p('Succession explains semantic evolution.'),
              p('Reidentification explains continuity.'),
            ],
          },
        ],
      },
      {
        title: 'Section 8 — Implementations',
        qa: [
          {
            q: 'Must every implementation use the same database?',
            a: [
              p('No.'),
              p('The protocol specifies meaning.'),
              p('Implementations remain free to choose their own technology.'),
            ],
          },
          {
            q: 'Must implementations expose every protocol concept?',
            a: [
              p('No.'),
              p('They may implement only the concepts relevant to their purpose.'),
            ],
          },
          {
            q: 'Can an implementation add local fields?',
            a: [
              p('Yes.'),
              p('Provided those fields are not represented as though they were protocol concepts.'),
            ],
          },
          {
            q: 'Is protocol conformance about software architecture?',
            a: [
              p('No.'),
              p('Conformance concerns preservation of published meaning rather than internal implementation.'),
            ],
          },
        ],
      },
      {
        title: 'Section 9 — AI',
        qa: [
          {
            q: 'Can AI systems use the protocol?',
            a: [
              p('Yes.'),
              p("The protocol's explicit concepts and relationships make it suitable for structured retrieval and reasoning."),
            ],
          },
          {
            q: 'Does the protocol guarantee AI answers are correct?',
            a: [
              p('No.'),
              p('The protocol guarantees the origin and structure of published information.'),
              p('Correct interpretation remains the responsibility of the consuming system.'),
            ],
          },
          {
            q: 'Can AI invent protocol relationships?',
            a: [
              p('No.'),
              p('Generated interpretations must remain distinguishable from published protocol facts.'),
            ],
          },
        ],
      },
      {
        title: 'Section 10 — Governance',
        qa: [
          {
            q: 'How does the protocol evolve?',
            a: [
              p('Through published governance processes and new Records.'),
              p('Changes become part of the protocol only once they have been formally established.'),
            ],
          },
          {
            q: 'Can published facts be rewritten?',
            a: [
              p('No.'),
              p('Historical publications remain part of the documentary history.'),
              p('Evolution occurs through new publications rather than silent modification.'),
            ],
          },
          {
            q: 'Why preserve historical states?',
            a: [
              p("Because reproducibility, traceability and auditability require the protocol's publication history to remain observable."),
            ],
          },
        ],
      },
      {
        title: 'Section 11 — Interoperability',
        qa: [
          {
            q: 'What makes two implementations interoperable?',
            a: [
              p('They preserve the same published meaning.'),
              p('They do not need identical software architectures.'),
            ],
          },
          {
            q: 'Does interoperability require identical APIs?',
            a: [p('No.'), p('It requires compatible interpretation of protocol concepts.')],
          },
          {
            q: 'Does interoperability require identical databases?',
            a: [p('No.'), p('The protocol standardises semantics rather than storage.')],
          },
          {
            q: 'What happens if implementations disagree?',
            a: [
              p('The published protocol provides the common reference used to resolve semantic differences.'),
            ],
          },
        ],
      },
    ],

    conclusion: [
      p('If you are discovering the protocol, begin with the published Records.'),
      p('If you are implementing it, continue with the Developers documentation.'),
      p('If you want to understand how concepts connect, explore the Knowledge Graph.'),
      // AMENDEMENT (2026-07-21) — la phrase d'origine, « If you need precise
      // terminology, consult the Dictionary. », promettait une page RETIRÉE du
      // périmètre de la Phase A. Ce n'était pas un lien mort — donc invisible au
      // résolveur — mais une PROMESSE morte, qu'aucun mécanisme ne pouvait
      // désamorcer. Texte de remplacement livré par l'architecte, transcrit
      // verbatim : il ne promet aucune page inexistante et décrit l'état réel.
      p("The concepts introduced in this guide are defined by the published Records of the World Skills Protocol. Additional terminology resources will become available as the protocol's terminology governance progresses."),
      p('Together, these resources explain the protocol from complementary perspectives while remaining grounded in the same canonical corpus.'),
    ],

    finalCta: {
      title: 'Continue exploring the protocol',
      text: 'Choose the resource that best matches your objective.',
      ctas: [
        resolveCta('Read the Protocol Records', '/records', locale, gaps),
        resolveCta('Explore the Knowledge Graph', '/knowledge-graph', locale, gaps),
        resolveCta('Develop with the Protocol', '/developers', locale, gaps),
      ],
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

/** Les paires Q/R à plat — alimente le FAQPage JSON-LD (questions inédites seulement). */
export function questionsFaqPairs(content: ArchetypeContent): { q: string; a: string }[] {
  return content.qaSections.flatMap((s) =>
    s.qa.map((item) => ({
      q: item.q,
      a: item.a
        .map((b) => (b.kind === 'ul' ? b.items.join(' ') : b.kind === 'p' ? b.text : ''))
        .filter(Boolean)
        .join(' '),
    }))
  );
}
