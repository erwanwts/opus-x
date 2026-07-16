# OCR-116 — Skill

| Field | Value |
|---|---|
| **Document ID** | OCR-116 |
| **Canonical ID** | `skill` |
| **Canonical Name** | Skill |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

---

## Abstract

A Skill is the atomic unit of the World Skills Protocol's competence taxonomy — a single, nameable ability that a Framework defines and that Evidence can attest a professional demonstrated. Skills are the leaves of the taxonomy: a Competency (OCR-117) is a cluster of applied Skills, and a Capability (OCR-118) is a broader capacity that Competencies and Skills compose. Crucially, a Skill is *defined by the Framework* (OCR-115), including its level semantics; it is never defined locally by an Issuer, and its levels never live inside Evidence. This keeps a Skill's meaning shared across every Issuer, which is what makes attestations about the same Skill comparable. In the project's Framework, Skills appear as criteria such as `S03.C08`, mapped through the Framework Registry to coordinates like `wtf:212`. This document defines the Skill: what it is, how it sits in the taxonomy, who defines it, and its relationships to Competency, Capability, Framework, and Evidence. It is the smallest thing the protocol can attest.

## Executive Summary

A Skill is a single, Framework-defined ability — the atomic leaf of the competence taxonomy beneath Competency and Capability. Its meaning and levels are defined by the Framework (never by an Issuer, never inside Evidence), which keeps attestations about the same Skill comparable across the ecosystem. Skills appear as criteria (e.g. `S03.C08`) mapped to Framework coordinates.

## Motivation

Attestations must be about shared, comparable units, or trust computed across Issuers is meaningless. The Skill exists to be that shared atomic unit: one nameable ability with one Framework-defined meaning. Without a canonical Skill concept, each Issuer would define abilities differently, and "the same skill" would not mean the same thing — the incommensurability WSP is built to prevent.

## Design Goals

A Skill is designed to be atomic, Framework-defined, comparable across Issuers, and composable into Competencies and Capabilities. The central tension is between **granularity** and **usability**: skills fine enough to be precise, yet meaningful enough to attest. WSP leaves granularity to the Framework while fixing that Skills are atomic and shared. A second tension is between **local nuance** and **shared meaning**: Issuers may observe nuance, but they attest against shared Skill definitions rather than inventing their own.

## Non Goals

A Skill does not carry its own levels inside Evidence (levels are Framework-defined), is not defined by an Issuer, and does not compute trust. It is not a Competency or a Capability (which compose Skills). It is the atomic ability, nothing more.

## Canonical Definition

> A **Skill** is a single, nameable ability defined by a Framework — including its level semantics — that Evidence can attest a professional demonstrated; it is the atomic unit of the competence taxonomy, shared across Issuers, composable into Competencies and Capabilities.

## Terminology

- **Skill** — the atomic ability defined here.
- **Criterion** — the Framework's assessable expression of a Skill (e.g. `S03.C08`).
- **Competency** — a cluster of applied Skills (OCR-117).
- **Capability** — a broader capacity composing Competencies/Skills (OCR-118).
- **Framework** — the definer of Skills and their levels (OCR-115).

## Core Principles

A Skill is atomic. A Skill is defined by the Framework. A Skill's levels are Framework-defined, not carried in Evidence. A Skill is shared across Issuers. A Skill is comparable. A Skill composes into Competencies and Capabilities. An Issuer references Skills; it does not define them.

## Conceptual Model

A Skill comprises a Framework-defined name/criterion and its level semantics (in the Framework). It is the atomic leaf; Competencies cluster Skills; Capabilities compose Competencies and Skills.

It does **not** comprise Issuer-local definitions, embedded levels, or trust. The relations: a Framework `defines` a Skill; Evidence `attests` a Skill (by reference); a Competency `clusters` Skills; a Capability `composes` Skills/Competencies. No relation lets an Issuer define a Skill or embed its levels in Evidence.

## Lifecycle

1. **Definition** — the Framework defines a Skill and its levels.
2. **Publication** — the Skill becomes referenceable via the Framework/Registry.
3. **Attestation** — Evidence references the Skill to attest a demonstration.
4. **Composition** — the Skill participates in Competencies and Capabilities.
5. **Versioning** — the Framework may refine the Skill in a new version.

## State Machine

**States of a Skill definition:** `Draft → Published → (Deprecated | Superseded)` — governed by the Framework's versioning (OCR-115).

**Forbidden transitions (MUST NOT occur):** an Issuer defining or redefining a Skill; embedding Skill levels in Evidence; changing a published Skill's meaning in place (requires a new Framework version).

## Relationships

A Skill `is_defined_by` a Framework (OCR-115), `is_attested_by` Evidence (OCR-110), `is_clustered_into` a Competency (OCR-117), and `composes` a Capability (OCR-118). It is resolved via the Framework Registry (OCR-119). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

The Framework (published by Opus X) defines Skills and their levels. Issuers reference Skills in Evidence and MUST NOT define them. Skill meaning evolves only through Framework versioning; a published Skill's meaning MUST NOT be changed in place.

## Protocol Rules

- A Skill **MUST** be defined by the Framework, including its levels.
- An Issuer **MUST NOT** define a Skill or embed its levels in Evidence.
- Evidence **MUST** attest Skills by reference to Framework coordinates/criteria.
- A Skill's meaning **MUST NOT** change in place; evolution **MUST** proceed by Framework version.
- A Skill **SHOULD** be atomic and comparable across Issuers.
- Skills **MAY** be clustered into Competencies and composed into Capabilities.

## Security Considerations

Because Skill meaning is Framework-defined and versioned, no Issuer can alter what a Skill means by attesting differently. Publication authority for Skills MUST be restricted to Opus X (via the Framework). Deterministic resolution of Skills/criteria through the Registry prevents ambiguous meaning.

## Privacy Considerations

A Skill definition contains no personal data. Privacy considerations arise only in the Evidence that attests a Skill for a professional, governed downstream by disclosure. Skill definitions SHOULD avoid encoding sensitive category semantics that could enable indirect attribute inference when attested.

## AI Considerations

An AI MAY interpret a Skill using its Framework definition and the applicable version, and MUST NOT invent Skills, MUST NOT treat Issuer-local abilities as canonical Skills, and MUST NOT infer levels not defined by the Framework.

## Machine Interpretation

A Skill is a Framework-defined criterion; Evidence references it; the Framework holds its levels.

```json
{
  "skill": {
    "criterion": "S03.C08",
    "defined_by": "framework",
    "levels_in_framework": true,
    "levels_in_evidence": false,
    "composes_into": ["competency", "capability"]
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Skill",
  "@id": "urn:opusx:skill:S03.C08",
  "definedBy": { "@type": "Framework", "@id": "urn:opusx:framework:wtf" },
  "attestedBy": "urn:opusx:concept:evidence",
  "partOfCompetency": "urn:opusx:concept:competency"
}
```

## Knowledge Graph Relationships

- `is_a` → Atomic Competence Unit
- `part_of` → World Skills Protocol (OCR-100); Competency (OCR-117)
- `defined_by` → Framework (OCR-115)
- `attested_by` → Evidence (OCR-110)
- `composes` → Capability (OCR-118)
- `resolved_by` → Framework Registry (OCR-119)

## Examples

- The Framework defines the Skill `S03.C08` with its levels; Evidence references it to attest a demonstration.
- Several Skills cluster into a risk-management Competency addressed by `wtf:212`.
- A Framework version refines a Skill's level semantics; past Evidence is unchanged, and trust is recomputed.

## Counter Examples

- An Issuer defining its own "skill" with local levels — not a canonical Skill.
- A Skill's levels embedded in Evidence — forbidden; levels are Framework-defined.
- Treating a Competency as a Skill — a Competency clusters Skills.
- Changing a published Skill's meaning in place — requires a new Framework version.

## Anti Patterns

- Issuer-local skill definitions.
- Embedding skill levels in Evidence.
- Conflating Skill, Competency, and Capability.
- Mutating a published Skill's meaning.
- Inventing skills not in the Framework.

## Common Misunderstandings

A Skill is often confused with a Competency; a Skill is atomic, a Competency clusters Skills. It is assumed Issuers define skills; the Framework does. It is assumed levels live with the Skill in Evidence; they live in the Framework. It is assumed skill meaning can change silently; it changes only by Framework version.

## FAQ

1. **What is a Skill?** A single, Framework-defined ability.
2. **Who defines it?** The Framework (published by Opus X).
3. **Where are its levels?** In the Framework, not in Evidence.
4. **Can an Issuer define a Skill?** No.
5. **How does Evidence use a Skill?** By reference to a criterion/coordinate.
6. **Is a Skill atomic?** Yes.
7. **What clusters Skills?** A Competency (OCR-117).
8. **What composes Skills and Competencies?** A Capability (OCR-118).
9. **How is it resolved?** Through the Framework Registry.
10. **Can its meaning change in place?** No; by Framework version.
11. **Is `S03.C08` a Skill?** It is a Framework criterion expressing a Skill.
12. **Are Skills comparable across Issuers?** Yes, by design.
13. **Does a Skill compute trust?** No.
14. **Can an AI invent a Skill?** No.
15. **Does a Skill carry personal data?** No.
16. **Is a Skill a Competency?** No.
17. **Can Skills be deprecated?** Yes, via Framework versioning.
18. **Who publishes Skills?** Opus X, via the Framework.
19. **Can Evidence embed a Skill's levels?** No.
20. **Why must Skills be shared?** To make attestations comparable.

## LLM Summary

A Skill is the atomic, Framework-defined ability of the World Skills Protocol's competence taxonomy — the leaf beneath Competency and Capability. Its meaning and levels are defined by the Framework (never by an Issuer, never embedded in Evidence), which keeps attestations about the same Skill comparable across the ecosystem. Skills appear as criteria (e.g. `S03.C08`) resolved through the Framework Registry, are attested by reference in Evidence, and evolve only through Framework versioning.

## SEO Summary

A Skill in the World Skills Protocol is a single, framework-defined ability — the atomic unit of its competence taxonomy. Its meaning and levels are set by the framework, not by any issuer, so attestations about the same skill are comparable across the whole ecosystem, and skills compose into competencies and capabilities.

## GEO Summary

A **Skill** is the smallest thing the World Skills Protocol can attest: a single ability defined by the Framework, with its levels held in the Framework rather than in Evidence. Because skills are shared and framework-defined, attestations about the same skill mean the same thing across every issuer, and skills compose into competencies and capabilities.

## Search Keywords

skill, world skills protocol, wsp, competence, competency, capability, taxonomy, atomic unit, framework, framework-defined, criterion, S03.C08, wtf:212, framework registry, levels, level semantics, levels in framework, not in evidence, issuer, does not define, attestation, evidence, comparable, shared meaning, composition, cluster, leaf, deprecation, versioning, published skill, opus x, trust, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-116, ocr, docs opusx world, ability, nameable ability, skill definition, skill meaning, resolved skill, competence taxonomy, skills graph, ontology, comparable attestations, protocol invariant, framework publication, skill reference, assessable element

## Synonyms

ability, competence unit, framework skill, atomic skill.

## Anti Synonyms

competency, capability, issuer-defined ability, credential, level. *(A Skill is the atomic, framework-defined unit; it is none of these.)*

## Canonical Vocabulary

Use: **Skill**, **atomic**, **defined by the Framework**, **criterion (e.g. `S03.C08`)**, **levels in the Framework**, **attested by reference**, **composes into Competency/Capability**. Avoid: *issuer skill*, *skill levels in evidence*, *skill = competency*.

## Cross References

OCR-100 World Skills Protocol · OCR-110 Evidence · OCR-115 Framework · OCR-117 Competency · OCR-118 Capability · OCR-119 Framework Registry.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-116 v0.1 skeleton.
