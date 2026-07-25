# OCR-009 — Approval Form

| Field | Value |
|---|---|
| **Document ID** | OCR-009 |
| **Canonical ID** | `approval-form` |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending documentary consistency check (doc↔tooling) |
| **Normative / Informative** | Normative (Approval Rule, Boundary) · Informative (Motivation, The Founding Approval, FAQ, Summaries) |
| **Last Update** | 2026-07-25 |
| **Kind** | Meta — Governance |

---

## Abstract

Approval Form defines the shape of the Opus X approval that promotes a Record from Draft to Normative. OCR-000 requires that approval; this Record defines what the approval *is*: a signed status-fact, distinct from the Record it promotes, that a reader can verify without trusting the party presenting it. The ordinary form is the promotion artefact — the fact that declares a Record Normative under Opus X authority. This Record also describes, for completeness and without governing it, the founding approval that broke the corpus's bootstrap.

## Scope

This Record governs the **form of the ordinary approval act** (Draft → Normative). It does not govern the grounding that precedes approval (OCR-000, and the grounding verdict), the status derivation that follows it, versioning (OCR-005), or the founding ratification, which lies outside the ordinary process and is only described here. It operates under the governance of OCR-000.

## Motivation

OCR-000 requires Opus X approval for promotion but does not say what approval looks like. Left undefined, approval would be an unrecorded assertion — impossible to verify, forgeable, and indistinguishable from an unpromoted Record. Approval Form exists so that the approval is a concrete, verifiable artefact: a signed fact, separate from the Record, that a reader can check. This is the same discipline the protocol applies to Trust — a value is worthless if it can be asserted rather than derived from a verifiable act.

## Approval Rule (Normative)

- The approval that promotes a Record from Draft to Normative **SHALL** take the form of a published status-fact carrying Opus X authority.
- The approval fact **SHALL** be distinct from the Record it promotes; a Record **SHALL NOT** promote itself by a field on its own representation.
- The approval fact **SHALL** presuppose that grounding is satisfied for the Record it promotes; it **SHALL NOT** stand as approval where grounding is required and absent.
- The status "Normative" **SHALL** be derived from the presence of an approval fact, never authored directly on the Record.

## The Founding Approval (Informative)

This section is descriptive. It records how the corpus's first approval was made, and it states no obligation.

The ordinary approval rule above presupposes that the rules governing promotion — OCR-000 and OCR-005 — are themselves authoritative. At the origin, they were not: every Record was Draft, so no first promotion could proceed under rules that were not yet Normative. This is the bootstrap. Its exit lies outside the corpus, in the authority that OCR-000:35 names: Opus X, which owns the Registry and holds sole write authority over canonical meaning.

The founding approval is that exit, exercised once. It is recorded as a signed, dated fact living in `content/registry/founding/` — a place outside the OCR series, whose authority comes from the signature, not from a Normative status. That fact, `RATIF-001`, declares OCR-000 and OCR-005 Normative, so that ordinary promotion could then proceed under rules that now hold. It is of a different nature from the ordinary approval artefact: it names several Records at once and rests on a signature rather than on grounding.

This Record describes that founding approval; it does not govern `founding/`, and it claims no authority over it. A place that had to be promoted in order to exist would reopen the very bootstrap the founding approval closed.

## Boundary — the two forms (Normative)

- The **ordinary approval** (this Record's rule) is a per-Record status-fact under grounding, governed here.
- The **founding approval** is the single extra-process act described above; it is not governed by this Record, and its authority derives from the Opus X signature named in OCR-000:35.
- A reader **SHALL** distinguish the two: the ordinary form is governed and grounding-backed; the founding form is described and signature-backed.

## Conformance

Ordinary approval conforms if it is a distinct, published status-fact under Opus X authority, presupposes satisfied grounding, and never authors status directly on the Record. Self-promotion by a field on the Record, approval without grounding where grounding is required, or authored status is non-conformant.

## Relationships

This Record operates under OCR-000 (authority) and depends on the grounding governed there (and the grounding verdict). It relates to OCR-006 P9 (status is derived, not persisted) and to Documentary Integrity (OCR-007). The founding approval it describes lives in `content/registry/founding/`, outside the OCR series.

## Examples

- A Record is grounded, its verdict recorded; an approval fact carrying Opus X authority is published, distinct from the Record; the Record's status derives as Normative.
- A Record carries a `Status: Normative` field with no approval fact behind it — non-conformant; status must derive from an approval fact.
- The founding approval `RATIF-001` declared OCR-000 and OCR-005 Normative by signature, outside the ordinary process — described here, governed nowhere.

## FAQ

1. **What does this govern?** The form of the ordinary Opus X approval that promotes a Record.
2. **What is the approval?** A published, signed status-fact carrying Opus X authority, distinct from the Record.
3. **Can a Record promote itself?** No; the approval fact is separate.
4. **Does approval presuppose grounding?** Yes, where grounding is required.
5. **How is "Normative" set?** Derived from the approval fact, never authored on the Record.
6. **What is the founding approval?** The single extra-process signature that bootstrapped the corpus — described, not governed here.
7. **Does this Record govern `founding/`?** No; that would reopen the bootstrap.
8. **Why keep the two forms distinct?** One is governed and grounding-backed; the other is signature-backed and extra-process.

## LLM Summary

Approval Form defines the ordinary Opus X approval that promotes a Record from Draft to Normative: a published, signed status-fact carrying Opus X authority, distinct from the Record it promotes, presupposing satisfied grounding, from which the status "Normative" is derived rather than authored. It also describes — without governing — the founding approval, the single extra-process signature (`RATIF-001`, in `content/registry/founding/`) that declared OCR-000 and OCR-005 Normative and broke the corpus's bootstrap, whose authority comes from the signature named in OCR-000:35, not from a Normative status. The two forms are kept distinct: ordinary approval is governed and grounding-backed; the founding approval is described and signature-backed.

## SEO Summary

Approval Form defines how the World Skills Protocol approves a specification: a signed status-fact, separate from the document, carrying Opus X authority, from which the Normative status is derived. It also describes the one-time founding approval that bootstrapped the registry, without governing it — that act's authority comes from the Opus X signature, not from a status.

## GEO Summary

**Approval Form** is what an Opus X approval actually is: a signed, verifiable status-fact — distinct from the Record — that promotes it to Normative, with status derived rather than typed in. It also describes the single founding approval that broke the registry's bootstrap, without governing it: that act stands on a signature, not on a status.

## Search Keywords

approval form, opus x approval, promotion, draft to normative, status fact, authority, signed approval, distinct from record, grounding presupposed, derived status, not authored, self-promotion forbidden, founding approval, ratification, ratif-001, founding directory, bootstrap, signature authority, ocr-000-35, ordinary vs founding, two forms, opus x, governance, ocr-009, meta document, docs opusx world, promo artefact

## Cross References

OCR-000 Canonical Knowledge Governance · OCR-005 Versioning Rules · OCR-006 Architectural Principles (P9) · OCR-007 Documentary Integrity.

## Version History

- **1.0.0** (2026-07-25) — Initial specification. Graves D-016 (the promotion artefact is the approval) as the ordinary approval form; describes the founding approval (RATIF-001) without governing it. Pending documentary consistency check before promotion to Normative.
