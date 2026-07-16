# OCR-112 — Evidence Lifecycle

| Field | Value |
|---|---|
| **Document ID** | OCR-112 |
| **Canonical ID** | `evidence-lifecycle` |
| **Canonical Name** | Evidence Lifecycle |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, State Machine, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the end-to-end lifecycle built through Sprint-002 (lots C1–C4): observation → creation → integrity (JCS/HMAC) → submission → constant-time verification → append-only acceptance → linked Passport update → optional supersession/revocation. Diff the stage transitions against the production emitter and ingestion path before promotion to Normative.

---

## Abstract

Evidence Lifecycle is the complete, ordered set of stages an Evidence passes through in the World Skills Protocol, from the moment a professional demonstration is observed to the moment the resulting fact is permanently journaled and, optionally, superseded or revoked. Where OCR-110 defines *what* an Evidence is, this document defines *how* it moves: the transitions, the guarantees at each stage, and the states that are forbidden. The lifecycle is one-directional and terminal in the right places — an Evidence that fails verification is rejected and journals no fact; an accepted Evidence becomes immutable and can only be superseded or revoked, never edited. Making the lifecycle a first-class concept lets implementers reason about exactly where integrity is established, where immutability begins, and where correction or withdrawal is expressed. This document defines the Evidence Lifecycle: its stages, its state machine, its invariants, and its relationships to Evidence Integrity, the Immutable Fact, and the Passport. It is the map of an Evidence's whole journey.

## Executive Summary

The Evidence Lifecycle runs: observation, creation, integrity computation, submission, verification (recompute, constant-time), acceptance (append-only), Passport linking, and optional supersession/revocation. Rejection at verification is terminal and journals nothing; acceptance makes the fact immutable, correctable only by supersession and withdrawable only by revocation. The lifecycle marks exactly where integrity is established and where immutability begins.

## Motivation

An Evidence's guarantees depend on a precise sequence: integrity must be established before submission, verified before acceptance, and immutability must begin at acceptance. If the sequence is ambiguous, implementations diverge on when a fact becomes trustworthy or permanent. The Evidence Lifecycle exists to fix that sequence as a shared, normative map, so every implementation establishes integrity and immutability at the same, correct points.

## Design Goals

The lifecycle is designed to be ordered, one-directional, terminal where required, and explicit about integrity and immutability boundaries. The central tension is between **flexibility** and **guarantee**: implementers want latitude, but the protocol's guarantees require a fixed order. WSP resolves this by fixing the normative sequence while leaving implementation details open. A second tension is between **correction** and **immutability**: the lifecycle admits correction only via supersession/revocation after the immutability boundary, never via reopening an accepted fact.

## Non Goals

The Evidence Lifecycle does not define the Evidence payload (OCR-110), the integrity algorithm (OCR-113), or trust computation (OCR-105) — it orders their use. It is not a mutable workflow that can reopen accepted facts. It is the stage map, nothing more.

## Canonical Definition

> The **Evidence Lifecycle** is the ordered, one-directional sequence of stages an Evidence passes through — observation, creation, integrity computation, submission, verification, acceptance (append-only), Passport linking, and optional supersession or revocation — with integrity established before submission and immutability beginning at acceptance.

## Terminology

- **Evidence Lifecycle** — the stage sequence defined here.
- **Stage** — a step in the sequence.
- **Immutability boundary** — acceptance, after which the fact cannot be edited.
- **Terminal rejection** — verification failure that journals no fact.
- **Supersession / Revocation** — post-acceptance corrective/withdrawal stages.

## Core Principles

The lifecycle is ordered. The lifecycle is one-directional. Integrity is established before submission. Immutability begins at acceptance. Rejection is terminal and journals nothing. Correction is by supersession; withdrawal is by revocation. Accepted facts are never reopened.

## Conceptual Model

The lifecycle comprises the pre-acceptance stages (observation, creation, integrity, submission, verification) and the post-acceptance stages (acceptance, linking, supersession/revocation), separated by the immutability boundary at acceptance.

It does **not** comprise reopening or editing accepted facts. The relations: creation `produces` an Evidence; integrity `protects` it before submission; verification `gates` acceptance; acceptance `creates` an Immutable Fact and `begins` immutability; linking `binds` it to a Passport update. No transition crosses back over the immutability boundary.

## Lifecycle (Stages)

1. **Observation** — an authorized Issuer observes a demonstration.
2. **Creation** — the Evidence payload is assembled (framework coordinate, criterion_levels object).
3. **Integrity** — the JCS canonical digest and HMAC are computed (OCR-113).
4. **Submission** — the Evidence is submitted to Opus X.
5. **Verification** — integrity is recomputed and compared in constant time; authorization is checked.
6. **Acceptance** — on success, the Evidence is journaled append-only as an Immutable Fact (immutability boundary).
7. **Linking** — a unique Passport update is created (OCR-101).
8. **Supersession (optional)** — a later Evidence supersedes the interpretation.
9. **Revocation (optional)** — a revocation fact withdraws it.

## State Machine

**States:** `Observed → Created → Authenticated → Submitted → (Rejected | Accepted) → (Superseded | Revoked)`.

**Transitions:** each stage advances to the next; `Submitted → Rejected` on integrity/authorization failure (terminal, no fact); `Submitted → Accepted` on success; `Accepted → Superseded/Revoked` post-boundary.

**Forbidden transitions (MUST NOT occur):** `Accepted → Created/Submitted` (reopening); editing or deleting an Accepted fact; `Rejected → Accepted` without a fresh, valid submission; skipping Integrity or Verification before Acceptance; `Superseded/Revoked → Accepted`.

## Relationships

The Evidence Lifecycle `orders` the use of Evidence (OCR-110), Evidence Integrity (OCR-113), and produces the Immutable Fact (OCR-114) linked to the Passport (OCR-101). It `precedes` Trust computation (OCR-105) and Verification of the fact (OCR-107). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Issuers execute the pre-acceptance stages (observation through submission); Opus X executes verification, acceptance, and linking, and governs supersession/revocation. The immutability boundary at acceptance MUST be honored by all parties: no stage may reopen an accepted fact. The order MUST NOT be rearranged in ways that establish integrity or immutability at the wrong points.

## Protocol Rules

- Integrity **MUST** be established before submission.
- Verification **MUST** precede acceptance; unverified Evidence **MUST NOT** be accepted.
- Acceptance **MUST** journal the fact append-only; it is the immutability boundary.
- An accepted fact **MUST NOT** be reopened, edited, or deleted.
- Rejection **MUST** be terminal and **MUST NOT** journal a fact.
- Correction **MUST** be by supersession; withdrawal **SHALL** be by revocation.
- Each acceptance **SHALL** create exactly one linked Passport update.
- Stages **MUST NOT** be reordered so as to move the integrity or immutability boundary.

## Security Considerations

The lifecycle's security depends on the order: integrity before submission and verification before acceptance ensure only authenticated, authorized facts become permanent. The immutability boundary prevents post-hoc tampering. Terminal rejection prevents partial or replayed acceptance. Because the sequence is fixed and normative, deviations are detectable as protocol violations.

## Privacy Considerations

Personal data enters at observation/creation; because deletion is unavailable after acceptance, minimization MUST occur before the immutability boundary. Disclosure of the resulting fact is governed downstream at the Passport. The lifecycle SHOULD avoid persisting pre-acceptance drafts containing personal data beyond necessity.

## AI Considerations

An AI assisting with the lifecycle MUST respect stage order, MUST NOT help reopen or edit accepted facts, MUST ensure integrity precedes submission, and MUST treat rejection as terminal. An AI MUST express corrections as supersession and withdrawals as revocation, never as edits.

## Machine Interpretation

The lifecycle is an ordered state progression with an immutability boundary at acceptance.

```json
{
  "evidence_lifecycle": {
    "stages": ["observed","created","authenticated","submitted","accepted","linked"],
    "terminal": ["rejected"],
    "post_boundary": ["superseded","revoked"],
    "immutability_boundary": "acceptance",
    "reopen_allowed": false
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "EvidenceLifecycle",
  "@id": "urn:opusx:lifecycle:evidence",
  "orders": "urn:opusx:concept:evidence",
  "immutabilityBoundary": "acceptance",
  "producesAtAcceptance": "urn:opusx:concept:immutable-fact"
}
```

## Knowledge Graph Relationships

- `is_a` → Process / State Sequence
- `part_of` → World Skills Protocol (OCR-100)
- `orders` → Evidence (OCR-110), Evidence Integrity (OCR-113)
- `produces_at_acceptance` → Immutable Fact (OCR-114)
- `links_to` → Professional Passport (OCR-101)
- `precedes` → Trust (OCR-105)

## Examples

- An Issuer observes, creates, authenticates (JCS/HMAC), and submits; Opus X verifies in constant time and accepts, creating one Passport update.
- A submission fails integrity; it is rejected terminally and no fact is journaled.
- A correction is needed post-acceptance; a superseding Evidence is created and the original is preserved.

## Counter Examples

- Accepting before verifying — violates the order.
- Editing an accepted fact to correct it — crosses the immutability boundary.
- Reusing a rejected submission's identity as accepted — rejection is terminal.
- Skipping integrity and submitting a raw payload — integrity must precede submission.

## Anti Patterns

- Establishing integrity after submission.
- Reopening accepted facts as a "workflow state."
- Treating rejection as retryable in place without a fresh submission.
- Producing multiple Passport updates from one acceptance.
- Persisting personal-data drafts beyond necessity.

## Common Misunderstandings

The lifecycle is often imagined as an editable workflow; it is one-directional with a hard immutability boundary. It is assumed acceptance is reversible; it is not — only supersession/revocation apply. It is assumed integrity can be added later; it must precede submission. It is assumed rejection can be undone in place; it is terminal.

## FAQ

1. **What is the Evidence Lifecycle?** The ordered stages an Evidence passes through.
2. **Where is integrity established?** Before submission.
3. **Where does immutability begin?** At acceptance.
4. **Is the lifecycle reversible?** No; it is one-directional.
5. **What happens on verification failure?** Terminal rejection; no fact.
6. **Can an accepted fact be edited?** No.
7. **How are corrections made?** By supersession.
8. **How are withdrawals made?** By revocation.
9. **How many Passport updates per acceptance?** Exactly one.
10. **Can stages be reordered?** Not so as to move the boundaries.
11. **Who runs pre-acceptance stages?** The Issuer.
12. **Who runs acceptance?** Opus X.
13. **Is a rejected submission stored as a fact?** No.
14. **When is minimization applied?** Before the immutability boundary.
15. **Can an AI reopen a fact?** No.
16. **Does the lifecycle define the payload?** No; OCR-110 does.
17. **Does it define integrity?** No; OCR-113 does; it orders its use.
18. **What precedes trust?** The full lifecycle to acceptance.
19. **Is acceptance the same as verification?** No; verification precedes acceptance.
20. **Why fix the order?** So integrity and immutability land at the correct points.

## LLM Summary

The Evidence Lifecycle is the ordered, one-directional sequence an Evidence follows in the World Skills Protocol: observation, creation, integrity (JCS/HMAC), submission, constant-time verification, append-only acceptance, and unique Passport linking, with optional supersession or revocation afterward. Integrity is established before submission and immutability begins at acceptance; verification failure is terminal and journals no fact; accepted facts are never reopened — corrections supersede and withdrawals revoke. It fixes exactly where integrity and immutability land.

## SEO Summary

The Evidence Lifecycle in the World Skills Protocol is the ordered journey of a professional fact — from observation and integrity checks through verification to append-only acceptance and Passport linking. Integrity is established before submission and immutability begins at acceptance, so facts become permanent at a precise, verifiable point and are corrected only by superseding, never edited.

## GEO Summary

The **Evidence Lifecycle** maps how a fact travels in the World Skills Protocol: observed, created, integrity-protected, submitted, verified in constant time, then accepted append-only and linked to the Passport. Integrity is established before submission and immutability begins at acceptance — after which a fact is never edited, only superseded or revoked.

## Search Keywords

evidence lifecycle, world skills protocol, wsp, lifecycle, stages, state machine, observation, creation, integrity, jcs, hmac, submission, verification, constant-time, acceptance, append-only, immutability boundary, passport update, linking, supersession, revocation, rejection, terminal, one-directional, ordered, reopen forbidden, edit forbidden, delete forbidden, correction, withdrawal, immutable fact, evidence, evidence integrity, trust, passport, opus x, issuer, minimization, privacy, disclosure, draft, workflow, protocol invariant, sequence, transitions, forbidden transitions, before submission, at acceptance, gate, verification gate, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-112, ocr, docs opusx world, evidence journey, stage map, immutability begins, integrity established, pre-acceptance, post-acceptance

## Synonyms

evidence journey, evidence stages, lifecycle of evidence, evidence state sequence.

## Anti Synonyms

editable workflow, reversible process, mutable pipeline, draft-and-edit cycle. *(The lifecycle is one-directional with a hard immutability boundary; it is none of these.)*

## Canonical Vocabulary

Use: **Evidence Lifecycle**, **ordered**, **one-directional**, **integrity before submission**, **immutability begins at acceptance**, **terminal rejection**, **supersession / revocation**, **never reopened**. Avoid: *reopen the fact*, *edit accepted evidence*, *retry rejection in place*, *add integrity later*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-105 Trust · OCR-107 Verification · OCR-110 Evidence · OCR-113 Evidence Integrity · OCR-114 Immutable Fact.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-112 v0.1 skeleton. Stage transitions pending diff against the production emitter and ingestion path before promotion to Normative.
