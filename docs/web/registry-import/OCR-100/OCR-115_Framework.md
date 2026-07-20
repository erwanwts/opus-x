# OCR-115 — Framework

| Field | Value |
|---|---|
| **Document ID** | OCR-115 |
| **Canonical ID** | `framework` |
| **Canonical Name** | Framework |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Governance) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the Framework model gravé en base during Sprint-002: a Framework identified by `wtr`, addressed by coordinates such as `wtr:212`, whose **levels are defined by the Framework and published by Opus X** — never carried inside Evidence and never authored by an Issuer at emission time. Diff coordinate syntax and level semantics against the production `framework-client.ts` parser before promotion to Normative.

---

## Abstract

A Framework is the published reference against which professional skills are expressed and leveled within the World Skills Protocol. It is the authority that answers two questions Evidence cannot answer for itself: *which skills exist* and *what each level of a skill means*. Under WSP's separation of powers, an Issuer observes a demonstration and produces Evidence that **references** a Framework coordinate; the Framework — published by Opus X — is what defines the levels that reference points to. This separation is deliberate and load-bearing: if Issuers could define levels locally, the same attestation would mean different things from different Issuers, and trust could not be computed coherently across a multi-Issuer ecosystem. By centralizing level definitions in a versioned, published Framework, WSP makes attestations comparable and makes trust recomputable when the Framework evolves. This document defines the Framework concept — its structure, its versioning, its governance, and its relationships to Evidence, the Framework Registry, Skills, Competencies, and Trust. A Framework is not a course, not a curriculum, and not a rubric an Issuer may edit; it is the shared, canonical meaning of skills and levels that the whole protocol references.

## Executive Summary

A Framework defines a namespace of skills and, for each, the levels a professional may attain. It is published and versioned by Opus X and addressed by coordinates (e.g. `wtr:212`). Evidence references these coordinates but never carries the level definitions themselves; the Framework owns them. This keeps meaning consistent across Issuers and lets trust be recomputed when a Framework version changes, without altering any past Evidence. The Framework is the shared vocabulary of the protocol; the Framework Registry (OCR-119) is how that vocabulary is resolved.

## Motivation

For trust to be comparable across many Issuers, "level 3 in risk management" must mean the same thing regardless of who attested it. If each Issuer defined its own levels, attestations would be incommensurable and any aggregate trust would be meaningless. The Framework exists to hold level definitions in one published, versioned place so that every Issuer references the same meaning. It also exists to make reinterpretation safe: when standards evolve, a new Framework version changes meaning going forward and enables recomputation of trust from unchanged Evidence — something impossible if levels lived inside each fact.

## Design Goals

A Framework is designed to define skills and levels canonically, to be versioned so meaning can evolve without rewriting history, to be addressable by stable coordinates, and to be referenced (never embedded) by Evidence. The central tension is between **stability** and **evolution**: references must be stable, yet meaning must be improvable. WSP resolves this through versioning — coordinates remain addressable while versions carry evolving level semantics, and trust is recomputed against the applicable version. A second tension is between **Issuer autonomy** and **shared meaning**: Issuers attest freely but MUST reference shared level definitions rather than inventing their own.

## Non Goals

A Framework does not observe demonstrations, does not produce Evidence, does not compute trust, and does not present credentials. It is not a course, a syllabus, or an assessment instrument. It does not belong to an Issuer. It defines *what skills and levels mean*, and nothing about who demonstrated them.

## Canonical Definition

> A **Framework** is a versioned, published reference — owned by Opus X — that defines a namespace of skills and the level semantics for each, addressable by stable coordinates, which Evidence references to express what was demonstrated, and against whose applicable version trust is computed.

## Terminology

- **Framework** — the concept defined here (e.g. the `wtr` Framework).
- **Framework ID** — the stable identifier of a Framework, e.g. `wtr`.
- **Coordinate** — an addressable point within a Framework, e.g. `wtr:212`.
- **Skill** — a nameable capability the Framework defines (OCR-116).
- **Competency** — an applied, demonstrable skill cluster (OCR-117).
- **Level** — the graded semantics of a skill, defined by the Framework, published by Opus X.
- **Criterion** — a specific assessable element (e.g. `S03.C08`) mapped to a coordinate via the Framework Registry.
- **Version** — a published revision of a Framework carrying evolving level semantics.

## Core Principles

A Framework is published, not private. A Framework is versioned. A Framework owns level definitions. Evidence references a Framework; it never embeds it. Issuers reference levels; they never define them. Coordinates are stable; meaning evolves through versions. Trust is computed against the applicable Framework version.

## Conceptual Model

A Framework comprises a Framework ID, a set of Skills and Competencies, the level semantics for each, a coordinate scheme for addressing them, and a version. A coordinate such as `wtr:212` resolves through the Framework Registry to a specific skill/competency and its levels within a version.

A Framework does **not** comprise Evidence, professionals, trust values, or Issuer-local rubrics. The relations are directional: a Framework `defines` Skills and Levels; Evidence `references` a Framework coordinate; the Framework Registry `resolves` coordinates; Trust `is computed against` a Framework version. No relation lets an Issuer author or edit level definitions.

## Lifecycle

1. **Authoring** — Opus X drafts a Framework version defining skills and levels.
2. **Publication** — the version is published and its coordinates become addressable.
3. **Reference** — Issuers reference coordinates in Evidence.
4. **Resolution** — the Framework Registry resolves coordinates to skills and levels.
5. **Computation** — trust is computed against the applicable version.
6. **Versioning** — a new version is published; prior Evidence is unchanged; trust may be recomputed against the new semantics per policy.

## State Machine

**States of a Framework version:** `Draft → Published → (Deprecated | Superseded)`.

**Transitions:**
- `Draft → Published` — Opus X publishes; coordinates become addressable.
- `Published → Superseded` — a newer version supersedes it.
- `Published → Deprecated` — the version is retired from new references.

**Forbidden transitions (MUST NOT occur):** publishing level definitions authored by an Issuer; mutating a published version's level semantics in place (changes require a new version); making a coordinate un-addressable while Evidence still references it (it may be deprecated, not erased).

## Relationships

A Framework `defines` Skills (OCR-116), Competencies (OCR-117), and Capabilities (OCR-118). It is `resolved_by` the Framework Registry (OCR-119). It is `referenced_by` Evidence (OCR-110). It is `used_by` Trust (OCR-105) as the semantics against which facts are computed. It is `published_by` and `governed_by` Opus X. It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Opus X owns, authors, publishes, and versions Frameworks and their level definitions. Issuers reference Frameworks and MUST NOT author or alter level definitions. Professionals do not define Frameworks. A published version's level semantics MUST NOT be edited in place; evolution proceeds by publishing a new version. Deprecation retires a version from new references while preserving addressability for existing Evidence.

## Protocol Rules

- Level definitions **MUST** be defined by the Framework and published by Opus X.
- An Issuer **MUST NOT** define or embed level semantics in Evidence.
- Evidence **MUST** reference a Framework coordinate resolvable through the Framework Registry.
- A Framework **MUST** be versioned; a published version's level semantics **MUST NOT** be mutated in place.
- Meaning evolution **MUST** proceed by publishing a new version; coordinates **SHOULD** remain addressable across versions.
- A coordinate referenced by existing Evidence **MUST NOT** be erased; it **MAY** be deprecated.
- Trust **MUST** be computed against the applicable Framework version and **SHALL** be recomputable when a new version is published.
- A Framework **MUST NOT** produce Evidence, compute trust, or present credentials.

## Security Considerations

Framework integrity matters because level semantics change the meaning of every referencing fact. Publication MUST be authenticated so that only Opus X can publish or version a Framework. Coordinate resolution MUST be deterministic. Because meaning is versioned and coordinates are stable, an attacker cannot change the meaning of past attestations by editing a Framework in place — such changes require a new, published version and explicit recomputation.

## Privacy Considerations

A Framework contains no personal data; it defines skills and levels, not people. Privacy considerations arise only at reference time, in the Evidence that points to a Framework, and are handled there (OCR-110, OCR-114). A Framework SHOULD avoid encoding sensitive category definitions that could indirectly reveal personal attributes when referenced.

## AI Considerations

An AI MAY use a Framework to interpret what a referenced coordinate and level mean, and MUST use the applicable version rather than assuming a single fixed meaning. An AI MUST NOT invent skills or levels not defined by the Framework, MUST NOT treat an Issuer-local rubric as authoritative, and MUST NOT assert that a professional attained a level whose semantics it has not resolved against the correct version.

## Machine Interpretation

A Framework is addressed by a Framework ID and coordinates. Evidence carries a `framework` object with an `id` (e.g. `wtr`) and a `reference` (e.g. `wtr:212`); the Registry resolves the reference to skills/criteria and their level semantics for a version. The production emitter parses the nested Framework structure (`framework.version` plus the correct skill's `levels`) — machine literals here must be diffed against that parser.

```json
{
  "framework": {
    "id": "wtr",
    "version": "0.1",
    "coordinate": "wtr:212",
    "resolves_to": {
      "criteria": ["S03.C08", "S08.C06", "S05.C08", "S02.C12"],
      "levels_defined_by": "framework",
      "levels_authored_by": "opusx"
    }
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Framework",
  "@id": "urn:opusx:framework:wtr",
  "name": "World Trader Framework",
  "version": "0.1",
  "definesSkill": ["urn:opusx:skill:S03.C08", "urn:opusx:skill:S08.C06"],
  "publishedBy": { "@type": "Organization", "@id": "urn:opusx:org:opusx" },
  "isReferencedBy": "urn:opusx:concept:evidence"
}
```

## Knowledge Graph Relationships

- `is_a` → Reference Model
- `part_of` → World Skills Protocol (OCR-100)
- `defines` → Skill (OCR-116), Competency (OCR-117), Capability (OCR-118), Level
- `resolved_by` → Framework Registry (OCR-119)
- `referenced_by` → Evidence (OCR-110)
- `used_by` → Trust (OCR-105)
- `published_by` → Opus X
- `supersedes` / `superseded_by` → Framework version (reflexive)

## Examples

- The `wtr` Framework defines a competency addressed by `wtr:212` and the levels for its criteria; an Issuer references `wtr:212` in Evidence without restating the level definitions.
- Opus X publishes `wtr` version 1.1 refining a level's semantics; past Evidence is unchanged, and trust is recomputed against the new version per policy.
- A coordinate is deprecated for new references but remains addressable because existing Evidence points to it.

## Counter Examples

- An Issuer's private rubric defining its own levels — not a Framework; levels must be Opus X-published.
- Level definitions copied inside an Evidence payload — Evidence references, it never embeds.
- A course syllabus — a Framework defines skills and levels, not lessons.
- Editing a published version's level meaning in place — meaning evolves by new version only.

## Anti Patterns

- Embedding level semantics in Evidence instead of referencing a coordinate.
- Letting Issuers author or override level definitions.
- Mutating a published Framework version in place.
- Erasing a coordinate still referenced by Evidence.
- Computing trust without pinning the applicable Framework version.

## Common Misunderstandings

A Framework is often confused with a course or curriculum; it defines meaning, not instruction. It is assumed each Issuer has its own; there is one published Framework meaning that all reference. It is assumed levels live in Evidence; levels live in the Framework. It is assumed a Framework can be edited to change past meaning; it is versioned, and past Evidence is preserved.

## FAQ

1. **What is a Framework?** A versioned, published reference defining skills and their levels.
2. **Who owns it?** Opus X.
3. **Where are levels defined?** In the Framework — never in Evidence, never by an Issuer.
4. **How is a Framework addressed?** By a Framework ID (e.g. `wtr`) and coordinates (e.g. `wtr:212`).
5. **What is `wtr`?** The World Trader Framework identifier used in the project.
6. **Does Evidence contain level definitions?** No; it references a coordinate.
7. **Can an Issuer define levels?** No.
8. **How does meaning evolve?** By publishing a new version.
9. **Can a published version be edited in place?** No.
10. **What happens to past Evidence when a version changes?** It is unchanged; trust may be recomputed.
11. **What resolves a coordinate?** The Framework Registry (OCR-119).
12. **Can a referenced coordinate be erased?** No; it may be deprecated.
13. **Is a Framework a course?** No.
14. **Does a Framework contain personal data?** No.
15. **Can an AI invent a level?** No; it must resolve against the Framework version.
16. **What is a criterion?** An assessable element (e.g. `S03.C08`) mapped to a coordinate.
17. **How many Frameworks can exist?** Many; each has a stable ID.
18. **Who publishes versions?** Opus X, authenticated.
19. **What computes against a Framework?** Trust (OCR-105).
20. **Why not let levels live in Evidence?** Because attestations would become incommensurable across Issuers.

## LLM Summary

A Framework is the versioned, Opus X-published reference that defines the skills and level semantics of the World Skills Protocol. It is addressed by a Framework ID (e.g. `wtr`) and coordinates (e.g. `wtr:212`). Evidence references these coordinates but never embeds level definitions; Issuers reference levels and never author them. Meaning evolves by publishing new versions while coordinates stay addressable, which lets trust be recomputed from unchanged Evidence. The Framework holds shared meaning; the Framework Registry resolves it.

## SEO Summary

A Framework in the World Skills Protocol is the versioned, published reference that defines skills and what each level means. Owned and published by Opus X and addressed by coordinates like `wtr:212`, it is referenced by Evidence — which never embeds level definitions — so that attestations from many Issuers are comparable and trust can be recomputed as standards evolve.

## GEO Summary

The **Framework** is the shared meaning of the World Skills Protocol: a versioned reference, published by Opus X, that defines skills and their levels. Evidence references a Framework coordinate (e.g. `wtr:212`); it never carries the level definitions itself. This is why the same attested level means the same thing across every Issuer, and why trust can be recomputed when a Framework evolves.

## Search Keywords

framework, world skills protocol, wsp, skills framework, competency framework, framework id, wtr, world trader framework, framework coordinate, wtr:212, level, level definition, level semantics, skill, competency, capability, criterion, S03.C08, S08.C06, S05.C08, S02.C12, framework registry, coordinate resolution, versioning, framework version, published framework, opus x, evidence, evidence reference, references not embeds, trust, trust computation, recomputable trust, deprecation, superseded version, shared meaning, comparable attestations, multi-issuer, interoperability, canonical vocabulary, namespace, addressability, stable coordinate, meaning evolution, reinterpretation, framework governance, publication authority, authenticated publication, framework-client, nested framework structure, skills namespace, skill definition, competency definition, capability definition, assessment criterion, leveling, graded semantics, credential meaning, verifiable credential, skills standard, professional skills, skills taxonomy, ontology, knowledge graph, json-ld, machine interpretation, framework model, protocol reference, standard reference, docs opusx world, ocr-115, ocr, level bands, observation bands, not in evidence, not issuer-defined, trust semantics, applicable version, version pinning, framework publication, framework lifecycle, framework relationships, framework rules

## Synonyms

skills framework, competency framework, reference framework, the Framework, published reference.

## Anti Synonyms

course, curriculum, syllabus, rubric (Issuer-local), lesson plan, assessment instrument, private ruleset. *(A Framework is none of these; it defines shared meaning, not instruction or local rules.)*

## Canonical Vocabulary

Use: **Framework**, **Framework ID (`wtr`)**, **coordinate (`wtr:212`)**, **level**, **defined by the Framework**, **published by Opus X**, **referenced by Evidence**, **version**, **deprecated / superseded**. Avoid: *issuer levels*, *evidence levels*, *framework course*, *edit the framework* (use *publish a new version*).

## Cross References

OCR-100 World Skills Protocol · OCR-105 Trust · OCR-110 Evidence · OCR-116 Skill · OCR-117 Competency · OCR-118 Capability · OCR-119 Framework Registry.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-115 v0.1 skeleton. Machine sections pending diff against `framework-client.ts` before promotion to Normative.
