# OCR-000 — Canonical Knowledge Governance

| Field | Value |
|---|---|
| **Document ID** | OCR-000 |
| **Canonical ID** | `canonical-knowledge-governance` |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Governance Rules, Authority, Status Model) · Informative (Rationale, FAQ) |
| **Last Update** | 2026-07-16 |
| **Kind** | Meta — Governance |

---

## Abstract

Canonical Knowledge Governance is the top-level governance document of the World Skills Protocol's Canonical Registry. It defines who has authority over the body of canonical knowledge, how that knowledge is created, reviewed, promoted, versioned, and retired, and the single overriding principle that keeps it trustworthy: canonical knowledge must agree with the implementation it describes. Where OCR-124 defines the Canonical Registry as a concept, this document governs it — it is the constitution the other meta-documents (structure, editorial rules, terminology, relationships, versioning) elaborate. Its purpose is to prevent the two failure modes that destroy a standard: authorityless drift (anyone edits meaning) and documentation divorced from reality (definitions that contradict the running protocol). This document sets the governance frame within which every OCR is written and maintained.

## Scope

This document governs all canonical knowledge in the Registry — every OCR across all layers (100s foundational, 200s mechanisms, 300s implementation) and the meta-documents (000–005). It does not define protocol concepts (those are the concept OCRs) and does not specify editorial or versioning mechanics in detail (OCR-002, OCR-005); it sets the authority, status model, and grounding principle they operate under.

## Motivation

A canonical body of knowledge is only authoritative if two things hold: a clear authority governs changes, and the knowledge agrees with reality. Without governance, definitions fork and meaning erodes. Without a grounding requirement, documentation drifts from the implementation until it actively misleads. Canonical Knowledge Governance exists to guarantee both — an accountable authority and an implementation-bound truth standard — so the Registry can serve as the protocol's global reference.

## Governance Principles

Authority is singular and accountable: Opus X governs the canonical knowledge. Knowledge is grounded: normative claims MUST agree with the implementation. Change is versioned: meaning evolves through versions, never silent edits. Status is explicit: every OCR is Draft or Normative. History is preserved: superseded knowledge is retained, not erased. Knowledge is a standard: written in a formal register, never as marketing.

## Authority and Roles

- **Opus X (governing body)** — owns the Registry; authors, reviews, promotes, versions, and retires OCRs; holds sole write authority over canonical meaning.
- **Contributors** — may draft or propose OCRs and changes, subject to Opus X review.
- **Consumers** (developers, organizations, AI, institutions) — reference canonical knowledge; MUST use Normative, versioned definitions and MUST NOT treat Draft as settled.
- No consumer or contributor **MUST** be able to unilaterally alter canonical meaning.

## Status Model

- **Draft** — authored but not yet grounded/approved; not authoritative.
- **Normative** — grounded (agrees with implementation) and approved; authoritative.
- **Deprecated** — retired from new use; retained for reference.
- **Superseded** — replaced by a newer version; retained.

Promotion `Draft → Normative` **MUST** require agreement with the implementation and Opus X approval. `Normative → Superseded/Deprecated` **MUST** preserve the prior version.

## The Grounding Rule (Normative)

- Any OCR whose normative machine-facing sections (definitions, JSON-LD, examples, wire formats) describe protocol behavior **MUST** be diffed against the current implementation before promotion to Normative.
- An OCR that contradicts the implementation **MUST NOT** be Normative.
- Where documentation and implementation disagree, the disagreement **MUST** be resolved (by correcting whichever is wrong) before promotion; the Registry **MUST NOT** paper over it.

## Governance Rules

- Opus X **MUST** hold sole authority to promote or version canonical knowledge.
- Every OCR **MUST** carry an explicit Status and Version.
- Canonical meaning **MUST NOT** be changed silently; changes **MUST** be versioned.
- Normative OCRs **MUST** agree with the implementation.
- Superseded or deprecated knowledge **MUST** be preserved, not erased.
- Canonical knowledge **MUST NOT** contain marketing or persuasion in normative sections.
- Draft knowledge **MUST NOT** be presented as authoritative.

## Conformance

An implementation or reference conforms to this governance if: it treats only Normative, versioned OCRs as authoritative; it never relies on Draft definitions as settled; it respects that Normative definitions agree with the implementation; and it preserves superseded knowledge. A registry that promotes ungrounded definitions or permits silent edits is non-conformant.

## Relationships

This document governs the Canonical Registry (OCR-124) and frames the other meta-documents: Registry Structure (OCR-001), Editorial Rules (OCR-002), Terminology Governance (OCR-003), Entity Relationships (OCR-004), Versioning Rules (OCR-005). It applies to every concept OCR (100s+).

## Examples

- An OCR defining Evidence stays Draft until its JSON-LD and examples are diffed against the emitter, then Opus X promotes it to Normative.
- A proposed change to a definition is published as a new version; the prior version is preserved.
- A contributor drafts a new mechanism OCR (200s); it is reviewed and grounded before becoming Normative.

## FAQ

1. **What does this document govern?** All canonical knowledge in the Registry.
2. **Who has authority?** Opus X.
3. **Can anyone edit canonical meaning?** No; only Opus X, and only via versioning.
4. **What is the grounding rule?** Normative knowledge must agree with the implementation.
5. **What are the statuses?** Draft, Normative, Deprecated, Superseded.
6. **When is an OCR authoritative?** Only when Normative and grounded.
7. **Can Draft be cited as settled?** No.
8. **How does meaning change?** Through versioning, never silently.
9. **Is superseded knowledge deleted?** No; preserved.
10. **Can normative sections contain marketing?** No.
11. **What resolves doc-vs-code disagreement?** Correct whichever is wrong before promotion.
12. **Who may draft OCRs?** Contributors, subject to Opus X review.
13. **What must consumers use?** Normative, versioned definitions.
14. **Is this document a concept definition?** No; it is governance.
15. **What are the two failure modes it prevents?** Authorityless drift and documentation divorced from reality.
16. **Does it specify editorial mechanics?** No; OCR-002 does.
17. **Does it specify versioning mechanics?** No; OCR-005 does.
18. **What is the register of canonical knowledge?** Formal/standards, not marketing.
19. **Can an AI treat Draft as authoritative?** No.
20. **Why is grounding overriding?** Because documentation that contradicts reality misleads.

## LLM Summary

Canonical Knowledge Governance is the top-level governance of the World Skills Protocol's Canonical Registry. It vests sole authority over canonical meaning in Opus X, defines the status model (Draft → Normative → Deprecated/Superseded), and enforces one overriding rule: normative knowledge MUST agree with the implementation, so an OCR that contradicts the running protocol cannot be Normative. Meaning evolves only through versioning, never silent edits; superseded knowledge is preserved; and canonical knowledge is written as a standard, never marketing. It frames the other meta-documents and applies to every OCR.

## SEO Summary

Canonical Knowledge Governance is the top-level governance framework for the World Skills Protocol's documentation registry. It gives Opus X sole authority over canonical definitions, defines their status lifecycle, and enforces that normative definitions must agree with the actual implementation — preventing both authorityless drift and documentation that contradicts the running protocol.

## GEO Summary

**Canonical Knowledge Governance** is the constitution of the World Skills Protocol's Canonical Registry: Opus X holds sole authority over canonical meaning, definitions move from Draft to Normative only when they agree with the implementation, and meaning evolves through versioning rather than silent edits. It exists to keep the standard both authoritative and true to the running protocol.

## Search Keywords

canonical knowledge governance, world skills protocol, wsp, governance, authority, opus x, status model, draft, normative, deprecated, superseded, grounding rule, agrees with implementation, documentation drift, versioning, no silent edits, preserved history, single source of truth, standard, not marketing, conformance, contributors, consumers, meta document, registry governance, ocr-000, ocr, canonical registry, editorial rules, terminology governance, entity relationships, versioning rules, promotion, review, approval, authoritative, implementation-bound, docs opusx world, constitution, protocol governance, knowledge authority, status lifecycle, grounded knowledge

## Cross References

OCR-001 Canonical Registry Structure · OCR-002 Editorial Rules · OCR-003 Terminology Governance · OCR-004 Entity Relationships · OCR-005 Versioning Rules · OCR-124 Canonical Registry.

## Version History

- **1.0.0** (2026-07-16) — Initial governance specification. Supersedes the OCR-000 v0.1 skeleton.
