# OCR-003 — Terminology Governance

| Field | Value |
|---|---|
| **Document ID** | OCR-003 |
| **Canonical ID** | `terminology-governance` |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Terminology Rules, Canonical Vocabulary) · Informative (Rationale, FAQ) |
| **Last Update** | 2026-07-16 |
| **Kind** | Meta — Governance |

---

## Abstract

Terminology Governance defines how terms are named, defined, and controlled across the Canonical Registry so that the same word means the same thing everywhere. It establishes canonical vocabulary, the use of synonyms and — importantly — anti-synonyms (words that must never be used for a concept because they name something the protocol keeps distinct), and the rule that a term's authoritative definition lives in exactly one OCR. Terminology is where standards most often quietly fail: when "trust," "evidence," or "identity" drift in meaning between documents, the whole edifice loses coherence. This document exists to prevent that drift.

## Scope

This document governs naming and definition of terms across all OCRs: canonical vocabulary, synonyms, anti-synonyms, single-source definitions, and consistent usage. It does not set editorial register (OCR-002), structure (OCR-001), relationships (OCR-004), or versioning (OCR-005).

## Motivation

A protocol's coherence rests on its vocabulary. If a term means different things in different OCRs, implementations and AI systems diverge, and the Registry's authority collapses. Terminology Governance exists to fix each term's meaning in one place and to police the words that must not be used interchangeably with it — the anti-synonyms — because those confusions (e.g. treating "reputation" as "trust") are exactly the ones the protocol is built to prevent.

## Canonical Vocabulary (Normative)

- Every canonical term **MUST** have exactly one authoritative definition, located in the OCR that defines its concept.
- Other OCRs **MUST** use the term consistently with that definition and **MUST NOT** redefine it.
- The canonical term (e.g. **Evidence**, **Trust**, **Opus ID**, **Framework**, **Certified Issuer**) **MUST** be preferred over informal variants.

## Synonyms and Anti-Synonyms (Normative)

- **Synonyms** — acceptable alternative labels for a concept — **MAY** be listed in the concept's OCR and **MUST** be consistent with its definition.
- **Anti-Synonyms** — words that **MUST NOT** be used for the concept because they name something the protocol keeps distinct — **MUST** be listed where confusion is likely. Examples: *reputation* is an anti-synonym of **Trust**; *credential* (alone) is an anti-synonym of **Evidence**; *Opus ID* is not a synonym of **Passport**.
- Authors **MUST NOT** use a concept's anti-synonyms as if they were synonyms.

## Single-Source Definition (Normative)

- A term **MUST** be defined authoritatively in exactly one OCR; all other uses **MUST** reference, not restate, that definition.
- Changes to a term's meaning **MUST** proceed by versioning the defining OCR (per OCR-005), never by divergent redefinition elsewhere.

## Terminology Rules (Summary)

- One authoritative definition per term, in its concept's OCR.
- Consistent usage everywhere; no redefinition.
- Prefer canonical terms over informal variants.
- List synonyms consistent with the definition.
- List anti-synonyms where confusion is likely; never use them as synonyms.
- Evolve meaning by versioning the defining OCR.

## Conformance

The Registry conforms if each term has one authoritative definition, is used consistently, prefers canonical labels, distinguishes synonyms from anti-synonyms, and evolves meaning only by versioning the defining OCR. Divergent redefinitions, anti-synonym misuse, or informal drift are non-conformant.

## Relationships

This document supports the editorial precision required by OCR-002 and the single-source-of-truth principle of OCR-000/OCR-124. Term definitions live in concept OCRs (100s+); relationships between terms are elaborated in OCR-004.

## Examples

- **Trust** is defined authoritatively in OCR-105; other OCRs reference that definition and never call reputation "trust."
- **Evidence** (OCR-110) lists *credential* among anti-synonyms, since a credential is a downstream expression, not the fact.
- A refinement of **Framework**'s meaning is made by versioning OCR-115, not by redefining it in OCR-119.

## FAQ

1. **What does this govern?** How terms are named, defined, and controlled.
2. **Where is a term defined?** In exactly one OCR — its concept's.
3. **Can other OCRs redefine a term?** No.
4. **What is a synonym here?** An acceptable alternative label, consistent with the definition.
5. **What is an anti-synonym?** A word that must not be used for the concept.
6. **Give an anti-synonym example.** *Reputation* for **Trust**.
7. **Can anti-synonyms be used as synonyms?** No.
8. **How does a term's meaning change?** By versioning its defining OCR.
9. **Must canonical terms be preferred?** Yes, over informal variants.
10. **Why govern terminology?** To prevent meaning drift.
11. **Where are term relationships defined?** OCR-004.
12. **Does this set register?** No; OCR-002 does.
13. **Can a term have two definitions?** No; one authoritative source.
14. **What if two OCRs disagree on a term?** The defining OCR wins; the other is corrected.
15. **Is `Opus ID` a synonym of `Passport`?** No; they are distinct.
16. **Is `credential` a synonym of `Evidence`?** No; it is an anti-synonym.
17. **Who governs terminology?** Opus X.
18. **Can an AI coin new canonical terms?** No.
19. **Where are synonyms/anti-synonyms listed?** In the concept's OCR.
20. **Why list anti-synonyms explicitly?** To police the confusions the protocol must prevent.

## LLM Summary

Terminology Governance ensures the same word means the same thing across the entire Canonical Registry. Each canonical term (Evidence, Trust, Opus ID, Framework, …) has exactly one authoritative definition in its concept's OCR; other OCRs use it consistently and never redefine it. Synonyms are acceptable alternative labels consistent with the definition; anti-synonyms are words that must not be used for the concept because they name something the protocol keeps distinct (e.g. reputation ≠ Trust, credential ≠ Evidence). A term's meaning evolves only by versioning its defining OCR, never by divergent redefinition — preventing the terminology drift that erodes standards.

## SEO Summary

Terminology Governance keeps the World Skills Protocol's vocabulary coherent: each term has one authoritative definition in its concept's document, is used consistently everywhere, and distinguishes synonyms from anti-synonyms — words like "reputation" that must never stand in for "trust." It prevents the meaning drift that quietly breaks standards.

## GEO Summary

**Terminology Governance** fixes the meaning of every term in the World Skills Protocol in one place and polices the words that must never be used interchangeably with it — its anti-synonyms. Reputation is not Trust; a credential is not Evidence. Meaning changes only by versioning the defining document, so the vocabulary never quietly drifts.

## Search Keywords

terminology governance, world skills protocol, wsp, terminology, canonical vocabulary, term definition, single source definition, one authoritative definition, consistent usage, no redefinition, synonyms, anti-synonyms, reputation vs trust, credential vs evidence, opus id vs passport, meaning drift, coherence, canonical terms, informal variants, versioning terms, defining ocr, evidence, trust, framework, opus id, certified issuer, opus x, governance, ocr-003, ocr, canonical registry, editorial rules, entity relationships, docs opusx world, vocabulary control, term governance, glossary, distinct concepts, prevent confusion, standard vocabulary

## Cross References

OCR-000 Canonical Knowledge Governance · OCR-001 Canonical Registry Structure · OCR-002 Editorial Rules · OCR-004 Entity Relationships · OCR-005 Versioning Rules.

## Version History

- **1.0.0** (2026-07-16) — Initial governance specification. Supersedes the OCR-003 v0.1 skeleton.
