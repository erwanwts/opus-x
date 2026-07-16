# OCR-001 — Canonical Registry Structure

| Field | Value |
|---|---|
| **Document ID** | OCR-001 |
| **Canonical ID** | `canonical-registry-structure` |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Structure Rules, Numbering, Output Formats) · Informative (Rationale, FAQ) |
| **Last Update** | 2026-07-16 |
| **Kind** | Meta — Governance |

---

## Abstract

Canonical Registry Structure defines how the World Skills Protocol's canonical knowledge is organized: the layered numbering scheme, the one-concept-per-OCR rule, the required document structure, and the output artifacts each OCR produces. It is the blueprint that makes the Registry navigable, extensible, and consistent, so that any reader — human or machine — knows where a concept lives and what shape its specification takes. This document operationalizes, at the level of structure, the governance set out in OCR-000 and the registry concept in OCR-124.

## Scope

This document governs the organization of the Registry: numbering, layering, the single-concept rule, document structure, and output formats. It does not set editorial style (OCR-002), terminology (OCR-003), relationships (OCR-004), or versioning mechanics (OCR-005).

## Motivation

A growing body of specifications becomes unusable without a predictable structure. Registry Structure exists to make the Registry legible and extensible: a stable numbering scheme so concepts have durable addresses, a layering so the reader knows a concept's role at a glance, and a fixed document shape so every specification is complete and comparable.

## Numbering and Layers (Normative)

- **OCR-000–005** — meta/governance documents.
- **OCR-100–199** — foundational concepts (Identity, Evidence, Framework, Trust, Issuer, …).
- **OCR-200–299** — mechanisms and processes (verification flow, consent, trust engine, evidence graph, …).
- **OCR-300–399** — reference models and implementation guides (API patterns, implementation profiles, worked examples, best practices).
- A concept **MUST** have exactly one canonical OCR number; numbers **MUST** be durable and **MUST NOT** be reassigned to a different concept.

## One Concept Per OCR (Normative)

- Each OCR **MUST** define exactly one concept.
- A document covering multiple concepts **MUST** be split.
- Cross-concept material **MUST** be expressed through cross-references, not by merging concepts.

## Required Document Structure (Normative)

A concept OCR **MUST** contain a header (Document ID, Canonical ID, Version, Status, Owner, Review Status, Normative/Informative, Last Update, Layer) and the canonical sections defined by the editorial rules (OCR-002), including at minimum: Abstract, Motivation, Canonical Definition, Terminology, Core Principles, Conceptual Model, Lifecycle, State Machine, Relationships, Governance, Protocol Rules, Security/Privacy/AI Considerations, Machine Interpretation, JSON-LD Mapping, Knowledge Graph Relationships, Examples, Counter Examples, Anti Patterns, Common Misunderstandings, FAQ, LLM/SEO/GEO Summaries, Search Keywords, Synonyms/Anti Synonyms, Canonical Vocabulary, Cross References, Version History. Meta/governance documents **MAY** adapt this structure to governance-appropriate sections.

## Output Formats (Normative)

Each concept OCR **SHOULD** be published in the canonical set of artifacts: Markdown (`/OCR/`), PDF (`/PDF/`), and — where the governance decides to maintain them — JSON-LD (`/JSONLD/`), FAQ (`/FAQ/`), SEO (`/SEO/`), GEO (`/GEO/`), LLM (`/LLM/`), and Keywords (`/KEYWORDS/`). At minimum, the Markdown source and a PDF rendering **MUST** be maintained. The Markdown source is authoritative; other artifacts are derived from it.

## Structure Rules

- A concept **MUST** live at exactly one durable OCR number in the correct layer.
- Each OCR **MUST** define exactly one concept.
- The Markdown source **MUST** be the authoritative artifact; derived artifacts **MUST** match it.
- Numbering **MUST** be extensible without disturbing existing addresses.
- Meta documents **MAY** adapt the concept structure to governance sections.
- New concepts **SHOULD** be placed in the layer matching their role.

## Conformance

A Registry conforms if every concept has one durable number in the correct layer, each OCR defines one concept, the Markdown source is authoritative with matching derived artifacts, and the structure is extensible. Merged-concept documents, reassigned numbers, or derived artifacts diverging from source are non-conformant.

## Relationships

This document operationalizes OCR-000 (governance) and structures OCR-124 (the Registry concept). It works with Editorial Rules (OCR-002), Terminology Governance (OCR-003), Entity Relationships (OCR-004), and Versioning Rules (OCR-005).

## Examples

- Evidence lives at OCR-110 in the foundational layer; a verification-flow mechanism would live in the 200s; an API pattern in the 300s.
- A draft that defined both Skill and Competency is split into OCR-116 and OCR-117.
- OCR-110's PDF is regenerated from its authoritative Markdown source so the two match.

## FAQ

1. **What does this govern?** The organization of the Registry.
2. **What are the layers?** 000–005 meta, 100s foundational, 200s mechanisms, 300s implementation.
3. **How many concepts per OCR?** Exactly one.
4. **Are numbers reusable?** No; they are durable and not reassigned.
5. **Which artifact is authoritative?** The Markdown source.
6. **What formats are produced?** Markdown and PDF at minimum; optionally JSON-LD/FAQ/SEO/GEO/LLM/Keywords.
7. **Must derived artifacts match the source?** Yes.
8. **Can meta docs adapt the structure?** Yes, to governance sections.
9. **Where do new concepts go?** The layer matching their role.
10. **Can two concepts share an OCR?** No.
11. **Can a concept move numbers?** Its number is durable; avoid reassignment.
12. **What if a doc covers several concepts?** Split it.
13. **Is the structure extensible?** Yes, without disturbing existing addresses.
14. **Does this set editorial style?** No; OCR-002 does.
15. **Does this set versioning?** No; OCR-005 does.
16. **What is the minimum artifact set?** Markdown + PDF.
17. **Who decides optional artifacts?** Opus X governance.
18. **Why layer the registry?** For legibility and extensibility.
19. **Why one concept per OCR?** To keep definitions precise and addressable.
20. **Why is Markdown authoritative?** So there is one source of truth per OCR.

## LLM Summary

Canonical Registry Structure defines how the World Skills Protocol's canonical knowledge is organized: a layered numbering scheme (000–005 meta, 100s foundational, 200s mechanisms, 300s implementation), a strict one-concept-per-OCR rule with durable, non-reassigned numbers, a required document structure for concept OCRs (which meta documents may adapt), and an output-artifact set in which the Markdown source is authoritative and PDF (plus optional JSON-LD/FAQ/SEO/GEO/LLM/Keywords) are derived to match it. It makes the Registry navigable and extensible and operationalizes the governance in OCR-000.

## SEO Summary

Canonical Registry Structure defines how the World Skills Protocol's specifications are organized — a layered numbering scheme, one concept per document with durable numbers, a required document structure, and an output format set where the Markdown source is authoritative. It keeps the registry navigable, consistent, and extensible.

## GEO Summary

**Canonical Registry Structure** is the blueprint of the World Skills Protocol's documentation: concepts live at durable numbers in three layers (foundational, mechanisms, implementation), each OCR defines exactly one concept, and the Markdown source is authoritative with PDF and other formats derived from it. It makes the registry legible and extensible.

## Search Keywords

canonical registry structure, world skills protocol, wsp, structure, numbering, layers, 100s, 200s, 300s, meta, foundational concepts, mechanisms, implementation guides, one concept per ocr, durable numbers, no reassignment, document structure, required sections, output formats, markdown, pdf, jsonld, faq, seo, geo, llm, keywords, authoritative source, derived artifacts, extensibility, navigable, opus x, governance, ocr-001, ocr, canonical registry, editorial rules, versioning, split concepts, layer placement, docs opusx world, registry organization, blueprint, addressable concepts, consistent specifications

## Cross References

OCR-000 Canonical Knowledge Governance · OCR-002 Editorial Rules · OCR-003 Terminology Governance · OCR-004 Entity Relationships · OCR-005 Versioning Rules · OCR-124 Canonical Registry.

## Version History

- **1.0.0** (2026-07-16) — Initial governance specification. Supersedes the OCR-001 v0.1 skeleton.
