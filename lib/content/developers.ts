/**
 * =====================================================================
 * Archétype éditorial — Developers (/developers)
 * =====================================================================
 * Prose VERBATIM livrée par l'architecte (doc « Developers — World Skills Protocol
 * – Phase A – Page 3/12 »). Aucun mot reformulé, raccourci ni ajouté.
 *
 * DESTINATIONS CITÉES : `/registry` et `/knowledge-graph` existent et résolvent.
 * `/records` N'EXISTE PAS : la destination est conservée telle quelle, ses deux CTA
 * restent des libellés INERTES et l'absence est tracée dans `_gaps`. Aucune
 * substitution — l'architecte préfère éditorialement la suppression, mais la
 * conserver inerte ne touche pas à son texte, alors que la supprimer le modifierait.
 * (`/graph` → `/knowledge-graph` : correction mécanique du slug canonique, décidée
 * par l'architecte.)
 * =====================================================================
 */
import {
  type ArchetypeContent,
  resolveCta,
  logGaps,
  p,
  ul,
  h3,
} from './archetype';

const SLUG = 'developers';

export const DEV_SEO_TITLE = 'Developers | Build with the World Skills Protocol';
export const DEV_SEO_DESCRIPTION =
  'Learn how to build software with the World Skills Protocol using canonical identifiers, published Records, identity resolution, versioned representations and traceable protocol data.';

export function buildDevelopers(locale: string): ArchetypeContent {
  const gaps: string[] = [];

  const content: ArchetypeContent = {
    slug: SLUG,
    seoTitle: DEV_SEO_TITLE,
    seoDescription: DEV_SEO_DESCRIPTION,

    hero: {
      h1: 'Build on published meaning',
      subtitle:
        'A protocol designed for systems that must exchange skills data without losing identity, context or traceability.',
      blocks: [
        p('The World Skills Protocol provides a common architecture for publishing, identifying, resolving and connecting professional skills information.'),
        p('Developers can use it to build applications that understand the same concepts, follow the same relationships and preserve the origin of every published definition.'),
        p('The protocol does not prescribe a programming language, database, framework or infrastructure provider.'),
        p('It defines the meaning that implementations must preserve.'),
      ],
      ctas: [
        resolveCta('Explore the Technical Resources', '/registry', locale, gaps),
        resolveCta('Read the Protocol Records', '/records', locale, gaps),
      ],
    },

    sections: [
      {
        title: 'Section 1 — What developers can build',
        blocks: [
          p('The World Skills Protocol is intended for systems that need to exchange or interpret professional skills information across organisational and technical boundaries.'),
          p('It can support applications such as:'),
          ul(
            'professional passports;',
            'skills registries;',
            'certification systems;',
            'learning and assessment platforms;',
            'recruitment tools;',
            'workforce systems;',
            'trusted evidence services;',
            'interoperability layers;',
            'AI agents that consume structured professional information.',
          ),
          p('These systems do not need to share the same internal architecture.'),
          p('They need to preserve the same published meaning.'),
          p('The protocol provides the common concepts, identifiers and relationships required to make that possible.'),
        ],
      },
      {
        title: 'Section 2 — Start with the canonical corpus',
        blocks: [
          p('The protocol begins with its Records.'),
          p('Records define the concepts, rules and relationships that constitute the World Skills Protocol.'),
          p('They are the normative source against which implementations are interpreted.'),
          p('A developer should therefore never derive protocol meaning solely from:'),
          ul(
            'a user interface;',
            'an example payload;',
            'a database schema;',
            'an SDK;',
            'a graph projection;',
            'or the behaviour of another implementation.',
          ),
          p('Those resources may make the protocol easier to use, but they do not replace the Records that establish its meaning.'),
          p('When an implementation and a Record appear to disagree, the Record remains authoritative.'),
        ],
      },
      {
        title: 'Section 3 — Use canonical identifiers',
        blocks: [
          p('Names are useful for people.'),
          p('Identifiers are necessary for systems.'),
          p('The World Skills Protocol distinguishes the meaning of a published object from the address used to discover one of its representations.'),
          p('A human-readable title may change.'),
          p('A storage location may change.'),
          p('A domain name may change.'),
          p('A representation may be replaced.'),
          p('The identity of the published definition must remain stable.'),
          p('Developers should therefore use the canonical identifiers established by the protocol when storing, referencing or exchanging protocol objects.'),
          p('Display labels may assist human readers, but they must not become substitutes for canonical identity.'),
        ],
      },
      {
        title: 'Section 4 — Resolve identity through the reading layer',
        blocks: [
          p('Canonical identifiers do not require implementations to know where an object is currently stored.'),
          p('Identity resolution belongs to the reading layer.'),
          p("When a system receives a canonical identifier, it should use the protocol's published resolution and discovery mechanisms to locate the current representation associated with that identity."),
          p('This separation protects implementations from changes in:'),
          ul(
            'infrastructure;',
            'publication location;',
            'file organisation;',
            'hosting;',
            'or canonical representation.',
          ),
          p('Applications can therefore continue to reference the same published identity even when the way it is read evolves.'),
          p('The identifier remains stable.'),
          p('The reading mechanism resolves the current representation.'),
        ],
      },
      {
        title: 'Section 5 — Distinguish identity from representation',
        blocks: [
          p('A canonical representation is the protocol-approved expression of a published definition at a particular documentary state.'),
          p("It is not the definition's identity."),
          p('Several representations may exist across time while preserving the same logical definition.'),
          p('Developers must therefore avoid treating a file path, document URL, database row or serialized payload as though it were the identity of the object itself.'),
          p('This distinction allows the protocol to evolve without breaking every implementation that references it.'),
          p('The logical definition answers:'),
          p('What is this published object?'),
          p('The canonical representation answers:'),
          p('How is that object expressed in this publication state?'),
          p('The discovery address answers:'),
          p('Where can the current representation be read?'),
          p('These three questions must remain separate.'),
        ],
      },
      {
        title: 'Section 6 — Treat published facts as immutable',
        blocks: [
          p('A published fact is not silently rewritten.'),
          p('When the protocol needs to express a new relationship, status or representation, it proceeds by addition.'),
          p('This means implementations should preserve the historical facts they have consumed rather than replacing them as though the previous publication had never existed.'),
          p('New information may:'),
          ul(
            'supersede an earlier representation;',
            'identify a successor;',
            'establish a reidentification;',
            'publish a new version;',
            'or change the derived reading of an object.',
          ),
          p('It must not erase the fact that the earlier publication occurred.'),
          p('This enables auditability and historical reconstruction across the protocol.'),
        ],
      },
      {
        title: 'Section 7 — Understand succession and reidentification',
        blocks: [
          p('The protocol distinguishes two forms of continuity.'),
          h3('Succession'),
          p('Succession applies when the semantics have changed sufficiently for the new definition to constitute a distinct normative object.'),
          p('The newer object follows the earlier one, but it does not claim to be the same definition.'),
          h3('Reidentification'),
          p('Reidentification applies when the semantics remain unchanged but the published identity or canonical representation must be corrected or replaced.'),
          p('The new publication preserves the normative properties of the definition being reidentified.'),
          p('These relationships must not be treated as interchangeable.'),
          p('Succession expresses semantic evolution.'),
          p('Reidentification expresses continuity of meaning across a corrected identity or representation.'),
          p('Applications that expose history should preserve this distinction.'),
        ],
      },
      {
        title: 'Section 8 — Separate concepts from instances',
        blocks: [
          p('The protocol publishes concepts.'),
          p('Implementations store occurrences of those concepts.'),
          p('For example, the protocol may publish that a Framework can be reidentified.'),
          p('An implementation may store the particular fact that one Framework was reidentified as another.'),
          p('The first is a protocol rule.'),
          p('The second is an operational occurrence.'),
          p('Developers should not insert implementation-specific occurrences into the normative corpus or its conceptual projection.'),
          p('Conversely, they should not treat the Knowledge Graph as though it were an operational database.'),
          p('This separation keeps the protocol universal while allowing implementations to store the facts relevant to their own users and systems.'),
        ],
      },
      {
        title: 'Section 9 — Use the canonical registry',
        blocks: [
          p('The canonical registry exposes the predicates, identifiers and controlled relationships recognised by the protocol.'),
          p('Developers should use the canonical predicate identifiers exactly as published.'),
          p('A locally convenient synonym is not an equivalent protocol identifier.'),
          p('Changing:'),
          p('reidentified_as'),
          p('into a different spelling, casing or verbal form may create a relationship that appears understandable to a person but is not recognisable to conforming software.'),
          p('Canonical identifiers must therefore be reused without translation inside machine-readable protocol data.'),
          p('Human-facing interfaces may provide explanatory labels alongside them.'),
        ],
        cta: resolveCta('Open the Canonical Registry', '/registry', locale, gaps),
      },
      {
        title: 'Section 10 — Read the Knowledge Graph correctly',
        blocks: [
          p('The Knowledge Graph is a generated projection of the concepts and relationships published by the corpus.'),
          p('It can help developers:'),
          ul(
            'discover related concepts;',
            'understand dependencies;',
            'navigate Records;',
            'inspect published relationships;',
            'and provide structured context to software agents.',
          ),
          p('It must not be used as an independent normative source.'),
          p('The graph does not contain database instances.'),
          p('It does not infer relationships from implementation data.'),
          p('It does not publish facts absent from the Records.'),
          p('Every graph projection corresponds to a particular documentary state of the corpus.'),
          p('Developers should therefore retain the identity or fingerprint of the projection they rely upon when reproducibility matters.'),
        ],
        cta: resolveCta('Explore the Knowledge Graph', '/knowledge-graph', locale, gaps),
      },
      {
        title: 'Section 11 — Respect the three versioning layers',
        blocks: [
          p('The protocol distinguishes three independent forms of versioning.'),
          h3('Documentary versioning'),
          p('Documentary versioning tracks changes to a Record as a published document.'),
          p('It identifies the state of that Record within the corpus.'),
          h3('Normative versioning'),
          p('Normative versioning tracks changes to the meaning, obligations or logical definition established by the protocol.'),
          p('A documentary revision does not necessarily change normative meaning.'),
          h3('Representation versioning'),
          p('Representation versioning tracks changes to the form through which a published object is expressed or delivered.'),
          p('A new serialization, file structure or publication format does not necessarily create a new normative object.'),
          p('Developers should not collapse these layers into a single version number.'),
          p('Doing so makes it impossible to distinguish a textual correction, a semantic amendment and a representation change.'),
        ],
      },
      {
        title: 'Section 12 — Derive status; do not persist it as truth',
        blocks: [
          p('Protocol status is derived from published facts.'),
          p('It should not be treated as an isolated mutable field whose value can be changed without preserving the facts that justify it.'),
          p('An implementation may cache a derived status for performance or presentation.'),
          p('That cached value must remain reproducible from the underlying published facts.'),
          p('The derivation should be deterministic.'),
          p('The facts should remain traceable.'),
          p('A stored label that cannot be justified from the publication history must not be treated as protocol truth.'),
        ],
      },
      {
        title: 'Section 13 — Preserve provenance',
        blocks: [
          p('Every protocol object consumed by an implementation should remain traceable to its published origin.'),
          p('Depending on the use case, this may include:'),
          ul(
            'the canonical identifier;',
            'the establishing Record;',
            'the documentary version;',
            'the representation fingerprint;',
            'the graph projection;',
            'the date or state of resolution;',
            'and the relationships used in interpretation.',
          ),
          p('Provenance is what allows a system to explain why it interpreted an object in a particular way.'),
          p('Without provenance, two systems may display the same label while relying on different documentary states.'),
          p('With provenance, the interpretation can be reconstructed and audited.'),
        ],
      },
      {
        title: 'Section 14 — Design for deterministic behaviour',
        blocks: [
          p('Where the protocol provides a canonical rule, conforming systems should produce the same result from the same published facts.'),
          p('Resolution must not depend on undocumented assumptions.'),
          p('Status derivation must not depend on hidden manual choices.'),
          p('Canonical identifiers must not depend on display labels.'),
          p('Graph relationships must not depend on private database content.'),
          p('Deterministic behaviour allows independent implementations to reach compatible conclusions without sharing the same codebase.'),
          p('This is one of the core conditions of interoperability.'),
        ],
      },
      {
        title: 'Section 15 — Do not invent missing semantics',
        blocks: [
          p('A developer may encounter a relationship that appears obvious but is not published.'),
          p('The implementation must not silently promote that interpretation into protocol meaning.'),
          p('The correct response is to distinguish between:'),
          ul(
            'what the protocol establishes;',
            'what an implementation observes;',
            'and what the developer infers.',
          ),
          p('Implementation-specific logic may exist where needed.'),
          p('It must remain identifiable as implementation logic.'),
          p("It must not be represented as though it were part of the World Skills Protocol until the appropriate rule has been published through the protocol's governance process."),
          p('Absence from the protocol is not permission to fabricate a normative answer.'),
        ],
      },
      {
        title: 'Section 16 — Conformance is about preserved meaning',
        blocks: [
          p('The World Skills Protocol does not require every implementation to use the same technology.'),
          p('One system may use relational storage.'),
          p('Another may use a document store.'),
          p('Another may consume static published artefacts.'),
          p('Another may operate as an AI agent.'),
          p('Their internal designs may differ substantially.'),
          p('They remain interoperable when they preserve:'),
          ul(
            'canonical identity;',
            'published definitions;',
            'normative relationships;',
            'version distinctions;',
            'provenance;',
            'resolution behaviour;',
            'and the separation between protocol concepts and implementation instances.',
          ),
          p('Conformance therefore concerns observable meaning, not internal resemblance.'),
        ],
      },
      {
        title: 'Section 17 — A practical implementation path',
        blocks: [
          p('A developer beginning an integration should proceed in the following order.'),
          h3('1. Identify the concepts in scope'),
          p('Determine which protocol concepts the application needs to consume, publish or reference.'),
          h3('2. Read the establishing Records'),
          p('Locate the Records that define those concepts and their normative relationships.'),
          h3('3. Retrieve canonical identifiers'),
          p('Use the identifiers and predicate names published by the canonical registry.'),
          h3('4. Implement resolution'),
          p('Resolve identifiers through the reading and discovery mechanisms rather than hard-coding current storage locations.'),
          h3('5. Preserve provenance'),
          p('Record the documentary state and representation used by the application.'),
          h3('6. Separate protocol facts from local facts'),
          p('Keep normative definitions distinct from implementation-specific instances and operational data.'),
          h3('7. Test deterministic behaviour'),
          p('Verify that the same published facts produce the same resolution, derived status and relationship interpretation.'),
          h3('8. Monitor publication changes'),
          p('When the corpus evolves, evaluate the relevant documentary, normative and representation changes independently.'),
          p("This path enables an implementation to begin small while remaining compatible with the protocol's broader architecture."),
        ],
      },
      {
        title: 'Section 18 — What the protocol does not prescribe',
        blocks: [
          p('The World Skills Protocol does not prescribe:'),
          ul(
            'a user interface;',
            'a database engine;',
            'a hosting provider;',
            'an authentication system;',
            'a programming language;',
            'a software framework;',
            'a commercial model;',
            'or a single application architecture.',
          ),
          p('It also does not require implementations to expose every concept in the protocol.'),
          p('An implementation may support only the concepts relevant to its purpose.'),
          p('What it must not do is alter the meaning of the concepts it claims to support.'),
          p('Technical freedom is permitted.'),
          p('Semantic divergence is not.'),
        ],
      },
      {
        title: 'Section 19 — For AI agents',
        blocks: [
          p('AI systems can use the protocol to access professional information with explicit structure and traceable origin.'),
          p('They may use:'),
          ul(
            'Records to retrieve normative meaning;',
            'the Knowledge Graph to navigate concepts;',
            'the canonical registry to recognise predicates;',
            'and discovery mechanisms to resolve current representations and operational facts.',
          ),
          p('An AI agent must still distinguish retrieved facts from generated interpretations.'),
          p('The presence of a concept in the graph does not prove that a particular person or organisation possesses it.'),
          p('The existence of a relationship in the protocol does not prove that a corresponding operational occurrence exists.'),
          p('Structured access improves reliability.'),
          p('It does not eliminate the need for provenance and evidence.'),
        ],
      },
      {
        title: 'Section 20 — When the protocol changes',
        blocks: [
          p('The protocol evolves through its published governance mechanisms.'),
          p('Developers should not assume that every documentary update creates a breaking change.'),
          p('They should determine which layer changed.'),
          p('A publication may involve:'),
          ul(
            'an editorial correction;',
            'a new documentary version;',
            'a normative amendment;',
            'a new canonical representation;',
            'a reidentification;',
            'a succession;',
            'or a new graph projection.',
          ),
          p('Each has different consequences.'),
          p('Applications should respond to the nature of the change rather than to the mere presence of a new version.'),
        ],
      },
    ],

    qaSections: [],

    conclusion: [
      p('The World Skills Protocol gives developers a stable way to build with professional skills information without forcing every system into the same technical design.'),
      p('Its central requirement is not technological uniformity.'),
      p('It is fidelity to published meaning.'),
      p('Use canonical identifiers.'),
      p('Resolve identity through the reading layer.'),
      p('Distinguish definitions from representations.'),
      p('Separate concepts from instances.'),
      p('Preserve provenance.'),
      p('Derive status from facts.'),
      p('And never introduce protocol semantics that the corpus has not published.'),
      p('When these principles are respected, independent applications can exchange, interpret and verify professional information without surrendering traceability or control.'),
    ],

    finalCta: {
      title: 'Start building with the protocol',
      text: 'Explore the canonical resources that establish the concepts, identifiers and relationships your implementation can use.',
      ctas: [
        resolveCta('Explore the Technical Resources', '/registry', locale, gaps),
        resolveCta('Read the Protocol Records', '/records', locale, gaps),
        resolveCta('Explore the Knowledge Graph', '/knowledge-graph', locale, gaps),
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
