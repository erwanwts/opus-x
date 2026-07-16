# OCR-118 — Capability

| Field | Value |
|---|---|
| **Document ID** | OCR-118 |
| **Canonical ID** | `capability` |
| **Canonical Name** | Capability |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

---

## Abstract

A Capability is the broadest tier of the World Skills Protocol's competence taxonomy — a high-level professional capacity that composes Competencies (OCR-117) and, through them, atomic Skills (OCR-116). Where a Skill is a single ability and a Competency is an applied cluster, a Capability describes what a professional can do at the level of a role or domain: the broad capacity that a coherent set of Competencies together constitute. Like the tiers beneath it, a Capability is defined by the Framework (OCR-115), published by Opus X, and referenced — never redefined — by Issuers. A Capability is typically not attested directly by a single Evidence; it is *constituted* by the Competencies and Skills that Evidence attests, and its standing is therefore computed from those underlying facts rather than asserted. This document defines the Capability: its place at the top of the taxonomy, how it composes lower tiers, who defines it, and its relationships to Competency, Skill, Framework, and Trust. It is the broad capacity that emerges from verified, finer-grained facts.

## Executive Summary

A Capability is the top tier of the competence taxonomy — a broad professional capacity composing Competencies and Skills. Framework-defined (never Issuer-defined), it is typically constituted by underlying attested Competencies/Skills rather than attested directly, so its standing is computed from finer-grained facts. It describes role- or domain-level capacity.

## Motivation

Verifiers and professionals often reason at the level of roles and domains ("can operate as a risk manager"), not individual Skills. The Capability exists to name that broad capacity as a Framework-defined unit, constituted by the Competencies and Skills beneath it — so high-level capacity can be discussed while remaining grounded in verifiable, finer-grained facts rather than asserted wholesale.

## Design Goals

A Capability is designed to be broad, Framework-defined, compositional (built from Competencies/Skills), and grounded (its standing computed from underlying facts). The central tension is between **breadth** and **groundedness**: a Capability must be broad enough to be useful yet grounded in attested facts rather than asserted. WSP resolves this by constituting a Capability from underlying Competencies/Skills and computing its standing from those facts. A second tension is between **role-level meaning** and **shared definition**: Capabilities carry role/domain meaning while remaining Framework-defined and comparable.

## Non Goals

A Capability does not carry its own levels in Evidence, is not Issuer-defined, and is not typically attested wholesale by a single Evidence. It is not a Competency (which it composes) or a Skill (atomic). It does not itself compute trust, though its standing derives from underlying facts. It is the broad capacity, nothing more.

## Canonical Definition

> A **Capability** is a Framework-defined, broad professional capacity that composes Competencies and Skills; it is the top tier of the competence taxonomy, typically constituted by underlying attested Competencies/Skills rather than attested wholesale, with its standing computed from those facts.

## Terminology

- **Capability** — the broad capacity defined here.
- **Competency** — the applied cluster it composes (OCR-117).
- **Skill** — the atomic unit beneath (OCR-116).
- **Constitution** — the composition of a Capability from underlying tiers.
- **Framework** — its definer (OCR-115).

## Core Principles

A Capability composes Competencies and Skills. A Capability is Framework-defined. A Capability is typically constituted, not attested wholesale. Its standing is computed from underlying facts. Its levels are Framework-defined, not in Evidence. It is comparable across Issuers. Issuers reference it; they do not define it.

## Conceptual Model

A Capability comprises a Framework-defined composition of Competencies (and, transitively, Skills) and Framework-defined level semantics. It is the top tier; its standing follows from the attested Competencies/Skills that constitute it.

It does **not** comprise Issuer-local definitions, embedded levels, or wholesale self-attestation. The relations: a Framework `defines` a Capability; it `composes` Competencies (OCR-117) and Skills (OCR-116); its standing `is_computed_from` underlying Immutable Facts via Trust (OCR-105). No relation lets an Issuer define a Capability or embed its levels in Evidence.

## Lifecycle

1. **Definition** — the Framework defines a Capability and its composition.
2. **Publication** — it becomes referenceable via the Registry.
3. **Constitution** — underlying Competencies/Skills are attested by Evidence.
4. **Standing** — the Capability's standing is computed from those facts (Trust).
5. **Versioning** — the Framework may refine it in a new version.

## State Machine

**States:** `Draft → Published → (Deprecated | Superseded)` — governed by Framework versioning (OCR-115). Its *standing* is a computed view, recomputed as underlying facts change.

**Forbidden transitions (MUST NOT occur):** an Issuer defining/redefining a Capability; embedding its levels in Evidence; asserting a Capability's standing independently of underlying facts; changing a published Capability's meaning in place.

## Relationships

A Capability `is_defined_by` a Framework (OCR-115), `composes` Competencies (OCR-117) and Skills (OCR-116), and its standing `is_computed_from` Immutable Facts via Trust (OCR-105). It is resolved via the Framework Registry (OCR-119). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

The Framework (published by Opus X) defines Capabilities and their composition. Issuers reference Capabilities and MUST NOT define them or assert their standing. A Capability's standing MUST be computed from underlying attested facts. A published Capability's meaning MUST NOT change in place; evolution proceeds by Framework version.

## Protocol Rules

- A Capability **MUST** be defined by the Framework, including its composition and levels.
- An Issuer **MUST NOT** define a Capability or embed its levels in Evidence.
- A Capability's standing **MUST** be computed from underlying attested facts; it **MUST NOT** be asserted wholesale.
- A Capability **SHOULD** compose Competencies/Skills that coherently constitute a role/domain capacity.
- A Capability's meaning **MUST NOT** change in place; evolution **MUST** proceed by Framework version.
- Evidence **MAY** attest Competencies/Skills that constitute a Capability rather than the Capability directly.

## Security Considerations

Because a Capability's standing is computed from underlying immutable facts, it inherits their integrity and cannot be asserted into existence. Framework definition authority for Capabilities is restricted to Opus X. Deterministic resolution and composition through the Registry prevent ambiguous meaning or unfounded standing.

## Privacy Considerations

A Capability definition contains no personal data. Its computed standing for a professional derives from underlying facts and MUST respect disclosure at the Passport. A Capability's standing SHOULD be surfaced at a granularity that avoids unnecessary inference about specific underlying facts beyond disclosure.

## AI Considerations

An AI MAY reason about a Capability's standing as computed from underlying facts and MUST NOT assert a Capability wholesale, MUST NOT invent Capabilities, MUST NOT treat Issuer-local capacities as canonical, and MUST respect disclosure when surfacing standing.

## Machine Interpretation

A Capability composes Competencies/Skills; its standing is computed, not attested wholesale.

```json
{
  "capability": {
    "id": "<capability_id>",
    "composes_competencies": ["wtf:212"],
    "defined_by": "framework",
    "standing": "computed_from_underlying_facts",
    "attested_wholesale": false,
    "levels_in_evidence": false
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Capability",
  "@id": "urn:opusx:capability:<id>",
  "definedBy": { "@type": "Framework", "@id": "urn:opusx:framework:wtf" },
  "composesCompetency": ["urn:opusx:competency:wtf:212"],
  "standingComputedFrom": "urn:opusx:concept:immutable-fact"
}
```

## Knowledge Graph Relationships

- `is_a` → Broad Competence Capacity
- `part_of` → World Skills Protocol (OCR-100)
- `defined_by` → Framework (OCR-115)
- `composes` → Competency (OCR-117), Skill (OCR-116)
- `standing_computed_from` → Immutable Fact (OCR-114) via Trust (OCR-105)
- `resolved_by` → Framework Registry (OCR-119)

## Examples

- A trading Capability composes several Competencies (including `wtf:212`); its standing for a professional is computed from the attested underlying facts.
- Evidence attests the constituent Competencies/Skills; the Capability's standing follows without wholesale attestation.
- A Framework version refines a Capability's composition; past Evidence is unchanged; standing recomputes.

## Counter Examples

- An Issuer asserting a Capability wholesale — forbidden; standing is computed.
- An Issuer-defined "capability" with local levels — not canonical.
- Embedding Capability levels in Evidence — forbidden.
- Treating a Competency as a Capability — a Capability composes Competencies.

## Anti Patterns

- Asserting a Capability instead of computing its standing.
- Issuer-local capability definitions.
- Embedding capability levels in Evidence.
- Conflating Capability with Competency or Skill.
- Mutating a published Capability's meaning.

## Common Misunderstandings

A Capability is often assumed to be attested directly like a badge; it is typically constituted by underlying facts, with standing computed. It is assumed Issuers define capabilities; the Framework does. It is assumed its levels live in Evidence; they live in the Framework. It is confused with a Competency; a Capability is broader and composes Competencies.

## FAQ

1. **What is a Capability?** A broad, Framework-defined professional capacity.
2. **Where does it sit?** At the top of the taxonomy, above Competency.
3. **Who defines it?** The Framework (Opus X).
4. **Is it attested directly?** Typically no; it is constituted by underlying facts.
5. **How is its standing determined?** Computed from underlying attested facts.
6. **Where are its levels?** In the Framework, not Evidence.
7. **What does it compose?** Competencies and Skills.
8. **Can an Issuer define one?** No.
9. **Can an Issuer assert its standing?** No; standing is computed.
10. **Can its meaning change in place?** No; by Framework version.
11. **Is it a Competency?** No; it composes Competencies.
12. **Are Capabilities comparable?** Yes, by design.
13. **Does it compute trust itself?** No; its standing derives via Trust.
14. **Can an AI invent one?** No.
15. **Does it carry personal data?** The definition does not.
16. **How is its standing surfaced?** Per Passport disclosure.
17. **Can it be deprecated?** Yes, via versioning.
18. **Who publishes it?** Opus X, via the Framework.
19. **Can Evidence attest it wholesale?** No; attest constituents.
20. **Why compose from lower tiers?** To keep broad capacity grounded in verifiable facts.

## LLM Summary

A Capability is the top tier of the World Skills Protocol's competence taxonomy — a broad, Framework-defined professional capacity that composes Competencies and, through them, Skills. It is typically not attested wholesale by a single Evidence; instead it is constituted by underlying attested Competencies/Skills, and its standing for a professional is computed from those Immutable Facts via Trust. Framework-defined (never Issuer-defined, never with levels in Evidence), it describes role- or domain-level capacity while staying grounded in verifiable finer-grained facts, and evolves only through Framework versioning.

## SEO Summary

A Capability in the World Skills Protocol is the broadest tier of its competence taxonomy — a role- or domain-level capacity composed of competencies and skills. Framework-defined rather than issuer-defined, a capability is constituted by underlying attested facts, so its standing is computed from verifiable evidence rather than asserted wholesale.

## GEO Summary

A **Capability** is the broadest unit of the World Skills Protocol's taxonomy: a role- or domain-level capacity that composes competencies and skills. Rather than being attested wholesale, a capability is constituted by the finer-grained facts beneath it, and its standing is computed from that verified evidence — keeping broad claims grounded in provable facts.

## Search Keywords

capability, world skills protocol, wsp, competence, competency, skill, taxonomy, top tier, broad capacity, role capacity, domain capacity, framework, framework-defined, composes competencies, composes skills, wtf:212, framework registry, levels, level semantics, levels in framework, not in evidence, issuer, does not define, not attested wholesale, constituted, standing, computed standing, computed from facts, trust, immutable fact, comparable, shared meaning, deprecation, versioning, published capability, opus x, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-118, ocr, docs opusx world, capacity, professional capacity, capability definition, resolved capability, competence taxonomy, ontology, grounded capability, protocol invariant, framework publication, capability standing, composition

## Synonyms

capacity, broad competence, role capability, domain capability.

## Anti Synonyms

skill (atomic), competency (applied cluster), issuer-defined capability, asserted capability, credential. *(A Capability is the broad, framework-defined, computed-standing tier; it is none of these.)*

## Canonical Vocabulary

Use: **Capability**, **broad capacity**, **defined by the Framework**, **composes Competencies/Skills**, **constituted (not attested wholesale)**, **standing computed from facts**, **levels in the Framework**. Avoid: *issuer capability*, *assert capability*, *capability levels in evidence*, *capability = competency*.

## Cross References

OCR-100 World Skills Protocol · OCR-105 Trust · OCR-110 Evidence · OCR-114 Immutable Fact · OCR-115 Framework · OCR-116 Skill · OCR-117 Competency · OCR-119 Framework Registry.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-118 v0.1 skeleton.
