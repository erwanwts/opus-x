# OCR-117 — Competency

| Field | Value |
|---|---|
| **Document ID** | OCR-117 |
| **Canonical ID** | `competency` |
| **Canonical Name** | Competency |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

---

## Abstract

A Competency is an applied cluster of Skills — the middle tier of the World Skills Protocol's competence taxonomy, sitting above the atomic Skill (OCR-116) and below the broad Capability (OCR-118). Where a Skill is a single ability, a Competency is a coherent grouping of Skills demonstrated together in an applied context, addressable by a Framework coordinate such as `wtr:212`. Like Skills, a Competency and its level semantics are defined by the Framework (OCR-115), published by Opus X, and referenced — never redefined — by Issuers; its levels never live inside Evidence. Competencies are how the protocol expresses "demonstrated the applied ability to do X," aggregating the atomic Skills that X requires. This document defines the Competency: its place in the taxonomy, how it clusters Skills, who defines it, and its relationships to Skill, Capability, Framework, and Evidence. It is the applied, addressable unit most attestations naturally target.

## Executive Summary

A Competency is a Framework-defined cluster of applied Skills, addressable by a coordinate (e.g. `wtr:212`), sitting between atomic Skills and broad Capabilities. Its meaning and levels are Framework-defined (never Issuer-defined, never in Evidence), keeping applied attestations comparable. Competencies express demonstrated applied ability by aggregating the Skills it requires.

## Motivation

Real demonstrations are usually applied and multi-skill: "managed risk on a live book" exercises several Skills at once. The Competency exists to name that applied grouping as a shared, comparable unit, so attestations can target the applied ability rather than only isolated Skills. Without it, the taxonomy would jump from atomic Skills to broad Capabilities with nothing to express coherent applied groupings.

## Design Goals

A Competency is designed to be an applied cluster, Framework-defined, addressable, and comparable. The central tension is between **cohesion** and **granularity**: a Competency must group Skills that genuinely go together without becoming so broad it loses meaning. WSP leaves the grouping to the Framework while fixing that Competencies are Framework-defined and addressable. A second tension is between **applied nuance** and **shared meaning**: Issuers attest applied nuance against shared Competency definitions.

## Non Goals

A Competency does not carry its own levels in Evidence, is not Issuer-defined, and does not compute trust. It is not an atomic Skill (which it clusters) nor a broad Capability (which composes Competencies). It is the applied, addressable cluster, nothing more.

## Canonical Definition

> A **Competency** is a Framework-defined, addressable cluster of applied Skills — including its level semantics — that Evidence can attest a professional demonstrated; it is the middle tier of the competence taxonomy between the atomic Skill and the broad Capability.

## Terminology

- **Competency** — the applied cluster defined here.
- **Skill** — the atomic unit it clusters (OCR-116).
- **Capability** — the broad capacity it composes (OCR-118).
- **Coordinate** — the Framework address of a Competency (e.g. `wtr:212`).
- **Framework** — its definer (OCR-115).

## Core Principles

A Competency clusters applied Skills. A Competency is Framework-defined. A Competency is addressable by coordinate. Its levels are Framework-defined, not in Evidence. A Competency is comparable across Issuers. It composes into Capabilities. Issuers reference it; they do not define it.

## Conceptual Model

A Competency comprises a Framework-defined grouping of Skills, an addressable coordinate, and Framework-defined level semantics. It sits above Skills and below Capabilities.

It does **not** comprise Issuer-local definitions, embedded levels, or trust. The relations: a Framework `defines` a Competency; it `clusters` Skills (OCR-116); Evidence `attests` it by reference; a Capability `composes` it. No relation lets an Issuer define a Competency or embed its levels in Evidence.

## Lifecycle

1. **Definition** — the Framework defines a Competency, its Skills, and levels.
2. **Publication** — it becomes addressable (e.g. `wtr:212`) via the Registry.
3. **Attestation** — Evidence references the Competency to attest applied demonstration.
4. **Composition** — it participates in Capabilities.
5. **Versioning** — the Framework may refine it in a new version.

## State Machine

**States:** `Draft → Published → (Deprecated | Superseded)` — governed by Framework versioning (OCR-115).

**Forbidden transitions (MUST NOT occur):** an Issuer defining/redefining a Competency; embedding its levels in Evidence; changing a published Competency's meaning in place.

## Relationships

A Competency `is_defined_by` a Framework (OCR-115), `clusters` Skills (OCR-116), `is_attested_by` Evidence (OCR-110), and `composes` a Capability (OCR-118). It is resolved via the Framework Registry (OCR-119). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

The Framework (published by Opus X) defines Competencies, their Skills, and levels. Issuers reference Competencies in Evidence and MUST NOT define them. A published Competency's meaning MUST NOT change in place; evolution proceeds by Framework version.

## Protocol Rules

- A Competency **MUST** be defined by the Framework, including its levels.
- An Issuer **MUST NOT** define a Competency or embed its levels in Evidence.
- Evidence **MUST** attest a Competency by reference to its Framework coordinate.
- A Competency's meaning **MUST NOT** change in place; evolution **MUST** proceed by Framework version.
- A Competency **SHOULD** cluster Skills that cohere in an applied context.
- A Competency **MAY** compose into Capabilities.

## Security Considerations

Competency meaning is Framework-defined and versioned, so no Issuer can alter it by attesting differently. Publication authority is restricted to Opus X. Deterministic resolution of Competency coordinates through the Registry prevents ambiguous meaning.

## Privacy Considerations

A Competency definition contains no personal data. Privacy considerations arise in the attesting Evidence, governed downstream by disclosure. Competency definitions SHOULD avoid semantics enabling indirect attribute inference when attested.

## AI Considerations

An AI MAY interpret a Competency via its Framework definition and applicable version, and MUST NOT invent Competencies, MUST NOT treat Issuer-local groupings as canonical, and MUST NOT infer levels the Framework does not define.

## Machine Interpretation

A Competency is a Framework-defined coordinate clustering Skills; Evidence references it; the Framework holds its levels.

```json
{
  "competency": {
    "coordinate": "wtr:212",
    "clusters_skills": ["S03.C08", "S08.C06", "S05.C08", "S02.C12"],
    "defined_by": "framework",
    "levels_in_framework": true,
    "levels_in_evidence": false
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Competency",
  "@id": "urn:opusx:competency:wtr:212",
  "definedBy": { "@type": "Framework", "@id": "urn:opusx:framework:wtr" },
  "clustersSkill": ["urn:opusx:skill:S03.C08", "urn:opusx:skill:S08.C06"],
  "attestedBy": "urn:opusx:concept:evidence"
}
```

## Knowledge Graph Relationships

- `is_a` → Applied Competence Cluster
- `part_of` → World Skills Protocol (OCR-100); Capability (OCR-118)
- `defined_by` → Framework (OCR-115)
- `clusters` → Skill (OCR-116)
- `attested_by` → Evidence (OCR-110)
- `resolved_by` → Framework Registry (OCR-119)

## Examples

- The Competency `wtr:212` clusters the Skills `S03.C08`, `S08.C06`, `S05.C08`, `S02.C12`; Evidence attests it as an applied demonstration.
- Several Competencies compose a broader trading Capability.
- A Framework version refines a Competency's Skills or levels; past Evidence is unchanged; trust recomputes.

## Counter Examples

- An Issuer-defined "competency" with local levels — not canonical.
- A Competency's levels embedded in Evidence — forbidden.
- Treating a single Skill as a Competency — a Competency clusters Skills.
- Changing a published Competency's meaning in place — requires a new version.

## Anti Patterns

- Issuer-local competency definitions.
- Embedding competency levels in Evidence.
- Conflating Competency with Skill or Capability.
- Mutating a published Competency's meaning.
- Grouping incoherent Skills into a Competency.

## Common Misunderstandings

A Competency is often confused with a Skill (atomic) or a Capability (broad); it is the applied middle tier. It is assumed Issuers define competencies; the Framework does. It is assumed its levels live in Evidence; they live in the Framework. It is assumed meaning can drift; it changes only by Framework version.

## FAQ

1. **What is a Competency?** A Framework-defined cluster of applied Skills.
2. **Where does it sit in the taxonomy?** Between Skill and Capability.
3. **Who defines it?** The Framework (Opus X).
4. **Where are its levels?** In the Framework, not Evidence.
5. **How is it addressed?** By a coordinate (e.g. `wtr:212`).
6. **What does it cluster?** Skills.
7. **What composes it?** Capabilities.
8. **Can an Issuer define one?** No.
9. **How does Evidence use it?** By reference to its coordinate.
10. **Can its meaning change in place?** No; by Framework version.
11. **Is `wtr:212` a Competency?** It is a Framework coordinate addressing one.
12. **Are Competencies comparable?** Yes, by design.
13. **Does it compute trust?** No.
14. **Can an AI invent one?** No.
15. **Does it carry personal data?** No.
16. **Is it a Skill?** No; it clusters Skills.
17. **Can it be deprecated?** Yes, via versioning.
18. **Who publishes it?** Opus X, via the Framework.
19. **Can Evidence embed its levels?** No.
20. **Why express applied groupings?** To attest applied ability comparably.

## LLM Summary

A Competency is a Framework-defined, addressable cluster of applied Skills — the middle tier of the World Skills Protocol's competence taxonomy between the atomic Skill and the broad Capability. Addressed by a coordinate (e.g. `wtr:212`) that clusters Skills like `S03.C08`, its meaning and levels are Framework-defined (never Issuer-defined, never in Evidence), keeping applied attestations comparable. It is attested by reference in Evidence, composes into Capabilities, and evolves only through Framework versioning.

## SEO Summary

A Competency in the World Skills Protocol is a framework-defined cluster of applied skills — the middle tier between atomic skills and broad capabilities. Addressed by a coordinate like `wtr:212`, its meaning and levels are set by the framework, not by issuers, so applied attestations remain comparable across the ecosystem.

## GEO Summary

A **Competency** is how the World Skills Protocol expresses applied ability: a framework-defined cluster of skills addressed by a coordinate such as `wtr:212`. It sits between atomic skills and broad capabilities, and — like skills — its meaning and levels live in the framework rather than in evidence, so the same competency means the same thing everywhere.

## Search Keywords

competency, world skills protocol, wsp, competence, skill, capability, taxonomy, applied cluster, middle tier, framework, framework-defined, coordinate, wtr:212, clusters skills, S03.C08, S08.C06, S05.C08, S02.C12, framework registry, levels, level semantics, levels in framework, not in evidence, issuer, does not define, attestation, evidence, comparable, shared meaning, composition, capability composition, deprecation, versioning, published competency, opus x, trust, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-117, ocr, docs opusx world, applied ability, demonstrated ability, competency definition, addressable competency, resolved competency, competence taxonomy, ontology, comparable attestations, protocol invariant, framework publication, competency reference

## Synonyms

applied competence, skill cluster, framework competency, competence area.

## Anti Synonyms

skill (atomic), capability (broad), issuer-defined competency, credential, level. *(A Competency is the applied middle tier, framework-defined; it is none of these.)*

## Canonical Vocabulary

Use: **Competency**, **applied cluster of Skills**, **defined by the Framework**, **coordinate (e.g. `wtr:212`)**, **levels in the Framework**, **attested by reference**, **composes into Capability**. Avoid: *issuer competency*, *competency levels in evidence*, *competency = skill*.

## Cross References

OCR-100 World Skills Protocol · OCR-110 Evidence · OCR-115 Framework · OCR-116 Skill · OCR-118 Capability · OCR-119 Framework Registry.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-117 v0.1 skeleton.
