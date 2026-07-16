# OCR-004 — Entity Relationships

| Field | Value |
|---|---|
| **Document ID** | OCR-004 |
| **Canonical ID** | `entity-relationships` |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Relationship Vocabulary, Graph Rules) · Informative (Rationale, FAQ) |
| **Last Update** | 2026-07-16 |
| **Kind** | Meta — Governance |

---

## Abstract

Entity Relationships defines the vocabulary and rules for how concepts in the Canonical Registry relate to one another, so that the protocol forms a coherent knowledge graph rather than a pile of isolated definitions. It fixes the set of relationship predicates (`is_a`, `part_of`, `depends_on`, `produces`, `consumes`, `references`, `extends`, `supersedes`, `related_to`, …), their meanings, and the invariants the relationship graph must satisfy — for example, that the relationships never contradict a concept's normative definition and never introduce cycles that would violate the protocol's directional separations. This document is what turns the individual OCRs into a navigable, machine-readable graph.

## Scope

This document governs the relationship vocabulary and graph invariants used in every OCR's "Knowledge Graph Relationships" and "Relationships" sections. It does not define the concepts themselves (concept OCRs), terminology (OCR-003), or versioning (OCR-005).

## Motivation

Definitions in isolation are not a protocol; the relationships between concepts carry as much meaning as the concepts. Entity Relationships exists so those relationships are expressed with a shared, precise vocabulary and obey invariants that reflect the protocol's structure — most importantly the directional separations (Issuer produces Evidence; Trust consumes it; identity is owned by the professional) that must never be contradicted by a stray relationship.

## Relationship Vocabulary (Normative)

The following predicates **MUST** be used with these meanings:

- `is_a` — subtype/instantiation (a Certified Issuer `is_a` Issuer).
- `part_of` — composition/membership (Evidence `part_of` the protocol).
- `depends_on` — functional dependency (Trust `depends_on` Immutable Facts).
- `produces` — one concept generates another (Issuer `produces` Evidence).
- `consumes` — one concept takes another as input (Trust `consumes` Evidence).
- `references` — one concept points to another without embedding it (Evidence `references` a Framework coordinate).
- `extends` — one concept builds on another.
- `supersedes` — one version/record replaces another (reflexive on Evidence).
- `related_to` — a non-specific association (used sparingly).

Authors **MUST** choose the most specific applicable predicate and **MUST NOT** use `related_to` where a specific predicate applies.

## Graph Invariants (Normative)

- Relationships **MUST NOT** contradict any concept's normative definition.
- Directional separations **MUST** be preserved: e.g. `produces` (Issuer→Evidence) and `consumes` (Trust→Evidence) **MUST NOT** be reversed; identity **MUST NOT** be `owned_by` an Issuer.
- The graph **MUST NOT** introduce cycles that would imply a fact mutates itself or that trust is authored rather than computed.
- Every relationship asserted in an OCR **MUST** be consistent with the corresponding relationship asserted by the related OCR (bidirectional coherence).
- Reflexive relationships (e.g. Evidence `supersedes` Evidence) **MUST** preserve immutability (supersession adds, never edits).

## Relationship Rules (Summary)

- Use the shared predicate vocabulary with its defined meanings.
- Prefer the most specific predicate; avoid vague `related_to`.
- Never contradict a concept's normative definition.
- Preserve directional separations (produce vs consume; ownership).
- Keep relationships bidirectionally coherent across OCRs.
- Preserve immutability in reflexive relationships.

## Conformance

The Registry's relationship graph conforms if it uses the shared vocabulary correctly, avoids vague predicates where specific ones apply, contradicts no normative definition, preserves directional separations, is bidirectionally coherent, and preserves immutability. Reversed directions, ownership violations, incoherent pairs, or mutating cycles are non-conformant.

## Relationships

This document structures the "Relationships" and "Knowledge Graph Relationships" sections required by OCR-001 and used by every concept OCR. It works with Terminology Governance (OCR-003) for predicate naming and with the concept OCRs whose relationships it disciplines.

## Examples

- OCR-120 asserts Issuer `produces` Evidence; OCR-110 coherently asserts Evidence `produced_by` Issuer — a bidirectionally coherent pair.
- OCR-105 asserts Trust `consumes` Immutable Fact; no OCR asserts the reverse, preserving the direction.
- OCR-110 asserts Evidence `supersedes` Evidence reflexively, with immutability preserved (the prior fact remains).

## FAQ

1. **What does this govern?** How concepts relate in the knowledge graph.
2. **What predicates exist?** is_a, part_of, depends_on, produces, consumes, references, extends, supersedes, related_to.
3. **Should the most specific predicate be used?** Yes.
4. **When is `related_to` appropriate?** Only when no specific predicate applies.
5. **Can relationships contradict a definition?** No.
6. **Are directions enforced?** Yes; produce vs consume must not reverse.
7. **Can identity be owned by an Issuer?** No; a forbidden relationship.
8. **Must relationships be bidirectionally coherent?** Yes.
9. **Do reflexive relationships preserve immutability?** Yes.
10. **Can cycles imply self-mutation?** No; forbidden.
11. **Where are relationships asserted?** In each OCR's relationship sections.
12. **Does this define concepts?** No; it disciplines their relationships.
13. **Who governs the vocabulary?** Opus X.
14. **Can new predicates be added?** Via governance and versioning.
15. **What does `references` mean?** Pointing without embedding (e.g. a Framework coordinate).
16. **What does `consumes` mean?** Taking another concept as input (Trust consumes Evidence).
17. **Why preserve directions?** They encode the protocol's separations of power.
18. **What breaks the graph?** Reversed directions, ownership violations, incoherent pairs.
19. **Is the graph machine-readable?** Yes; that is its purpose.
20. **Why govern relationships?** Because relationships carry as much meaning as concepts.

## LLM Summary

Entity Relationships defines the shared predicate vocabulary (`is_a`, `part_of`, `depends_on`, `produces`, `consumes`, `references`, `extends`, `supersedes`, `related_to`) and the invariants that make the Canonical Registry a coherent knowledge graph. Authors must use the most specific predicate, must not contradict any concept's normative definition, and must preserve the protocol's directional separations — Issuer `produces` Evidence and Trust `consumes` it must never reverse, identity is never `owned_by` an Issuer, and reflexive supersession preserves immutability. Relationships must be bidirectionally coherent across OCRs, turning individual definitions into a navigable, machine-readable graph.

## SEO Summary

Entity Relationships defines how the World Skills Protocol's concepts connect — a shared predicate vocabulary (is_a, part_of, produces, consumes, references, supersedes, …) and invariants that preserve the protocol's directional separations. It turns isolated definitions into a coherent, machine-readable knowledge graph.

## GEO Summary

**Entity Relationships** is what makes the World Skills Protocol a graph rather than a pile of definitions. It fixes the vocabulary of how concepts relate (produces, consumes, references, is_a, part_of, supersedes) and the invariants that protect the protocol's separations — so Issuer→Evidence→Trust never reverses and identity is never owned by an issuer.

## Search Keywords

entity relationships, world skills protocol, wsp, relationships, knowledge graph, predicates, is_a, part_of, depends_on, produces, consumes, references, extends, supersedes, related_to, relationship vocabulary, graph invariants, directional separation, produce vs consume, ownership, bidirectional coherence, immutability, reflexive, cycles forbidden, most specific predicate, machine-readable, ontology, semantic graph, concept relationships, opus x, governance, ocr-004, ocr, canonical registry, terminology, editorial rules, docs opusx world, graph rules, coherent graph, navigable, separation of powers, evidence, trust, issuer, identity, framework

## Cross References

OCR-000 Canonical Knowledge Governance · OCR-001 Canonical Registry Structure · OCR-002 Editorial Rules · OCR-003 Terminology Governance · OCR-005 Versioning Rules.

## Version History

- **1.0.0** (2026-07-16) — Initial governance specification. Supersedes the OCR-004 v0.1 skeleton.
