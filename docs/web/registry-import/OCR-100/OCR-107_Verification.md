# OCR-107 — Verification

| Field | Value |
|---|---|
| **Document ID** | OCR-107 |
| **Canonical ID** | `verification` |
| **Canonical Name** | Verification |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Procedure) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the verification path of the World Skills Protocol as built through Sprint-002: verification recomputes Evidence Integrity (JCS/HMAC, constant-time), reads only Immutable Facts, respects Passport disclosure, and reflects supersession/revocation. Diff the procedure against the production ingestion/verification code before promotion to Normative.

---

## Abstract

Verification is the act of inspecting the facts and computed trust bound to a professional identity, in order to answer a question about them, reproducibly and without trusting the party presenting the information. It is the operational expression of the principle *Trust Is Verified.* A Verification takes a Verification Request (OCR-108), inspects the Immutable Facts bound to the subject's Opus ID, confirms their integrity by recomputation, applies the applicable Framework version, respects the professional's disclosure, and returns a Verification Response (OCR-109). Crucially, Verification depends on no Issuer being online: because Evidence Integrity is reproducible and facts are immutable, a verifier obtains the same answer whether or not the original Issuer still exists. Verification never mutates anything; it is a read that recomputes. This document defines Verification: what it inspects, the procedure it follows, its guarantees, and its relationships to the Request/Response, Evidence Integrity, Trust, and the Passport. It is where the protocol's promises are cashed out for a real verifier asking a real question.

## Executive Summary

Verification inspects the Immutable Facts and computed Trust of a subject to answer a Verification Request, recomputing Evidence Integrity, applying the applicable Framework version, respecting disclosure, and reflecting supersession/revocation — then returns a Verification Response. It is reproducible, issuer-independent, and non-mutating. Verification is how any third party turns the protocol's guarantees into a concrete, trustworthy answer.

## Motivation

Immutable facts and computed trust are only useful if someone can inspect them and get a reliable answer. Verification exists to be that inspection — one that a verifier can perform without trusting the presenter and without depending on the Issuer's survival. Naive "verification" that trusts a supplied credential or a presenter's assertion reintroduces exactly the custodial failure WSP eliminates. Verification instead recomputes integrity and reads immutable facts, so its answer is reproducible and independent.

## Design Goals

Verification is designed to be reproducible, issuer-independent, disclosure-respecting, and non-mutating. The central tension is between **completeness** and **privacy**: a verifier wants full information, the professional controls disclosure. WSP resolves this by scoping every Verification to the professional's consent, returning only disclosed facts. A second tension is between **freshness** and **reproducibility**: a Response is computed at a point in time under a specific Framework version, so it is both fresh and reproducible when the inputs and version are pinned.

## Non Goals

Verification does not produce Evidence, does not mutate facts, does not set trust, and does not issue credentials. It is not the Request (which asks) or the Response (which answers); it is the act between them. It does not adjudicate the real-world truth of an attestation — it confirms integrity, attribution, disclosure, and computed trust.

## Canonical Definition

> **Verification** is the non-mutating act, performed in response to a Verification Request, of inspecting the Immutable Facts bound to a subject's Opus ID — recomputing their integrity, applying the applicable Framework version, and respecting disclosure — to produce a reproducible, issuer-independent Verification Response.

## Terminology

- **Verification** — the act defined here.
- **Verifier** — the party performing or requesting Verification.
- **Subject** — the Opus ID whose facts are inspected.
- **Verification Request** — the query initiating a Verification (OCR-108).
- **Verification Response** — the answer produced (OCR-109).
- **Recomputation** — re-deriving integrity and trust rather than trusting supplied values.
- **Disclosure scope** — what the professional's consent permits to be inspected.

## Core Principles

Verification is a read that recomputes. Verification is issuer-independent. Verification is reproducible. Verification respects disclosure. Verification reflects supersession and revocation. Verification never mutates. Verification confirms integrity and attribution, not real-world truth.

## Conceptual Model

A Verification comprises a subject (Opus ID), a disclosure scope from consent, the inspected Immutable Facts, the integrity recomputation, the applicable Framework version, and the computed Trust. Its output is a Verification Response.

It does **not** comprise writes, fact production, or trust authoring. The relations: a Request `initiates` a Verification; the Verification `inspects` Immutable Facts, `recomputes` Integrity, `applies` a Framework version, and `produces` a Response. No relation mutates a fact.

## Lifecycle / Procedure

1. **Receive** a Verification Request naming a subject and scope.
2. **Resolve disclosure** from the professional's consent facts.
3. **Read** the disclosed Immutable Facts bound to the subject's Opus ID.
4. **Recompute integrity** (JCS/HMAC, constant-time) for the inspected facts.
5. **Apply** the applicable Framework version and reflect supersession/revocation.
6. **Compute/read Trust** for the subject.
7. **Produce** a Verification Response, disclosure-limited and reproducible.

## State Machine

**States of a Verification:** `Requested → Inspecting → (Answered | Refused)`. `Refused` covers out-of-scope or unauthorized requests. Both `Answered` and `Refused` are terminal and non-mutating.

**Forbidden transitions (MUST NOT occur):** writing during verification; answering with undisclosed facts; trusting supplied integrity without recomputation; presenting superseded/revoked facts as active; producing a non-reproducible answer for pinned inputs and version.

## Relationships

Verification `is initiated by` a Verification Request (OCR-108) and `produces` a Verification Response (OCR-109). It `inspects` Immutable Facts (OCR-114) and `recomputes` Evidence Integrity (OCR-113). It `applies` a Framework version (OCR-115) via the Registry (OCR-119). It `reads` Trust (OCR-105) / Trust Status (OCR-106) for an Opus ID (OCR-104), respecting the Passport (OCR-101). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Any authorized verifier may perform Verification within the professional's disclosure scope. Opus X operates the verification path and MUST NOT mutate facts during it. The professional governs disclosure; verifiers MUST NOT exceed it. Issuers have no special verification privilege and MUST NOT be required to be online for verification to succeed.

## Protocol Rules

- Verification **MUST NOT** mutate any fact.
- Verification **MUST** recompute integrity rather than trust supplied values.
- Verification **MUST** respect the professional's disclosure scope.
- Verification **MUST** reflect supersession and revocation and **MUST NOT** present them as active.
- Verification **MUST** apply the applicable Framework version.
- Verification **MUST** be reproducible for pinned inputs and version.
- Verification **MUST NOT** depend on any Issuer being online.
- Out-of-scope or unauthorized requests **SHALL** be refused, not partially answered beyond disclosure.

## Security Considerations

Verification's trustworthiness rests on recomputation (it does not trust supplied integrity), immutability (facts cannot have changed), and issuer-independence (no reliance on a possibly-compromised Issuer). Refusals MUST NOT leak undisclosed information (including via error differences). Reproducibility lets a second verifier detect a manipulated answer.

## Privacy Considerations

Verification is scoped by consent; it MUST return only disclosed facts and MUST NOT reveal the existence of withheld ones. Responses SHOULD be minimized to what the Request needs. Verification logs SHOULD avoid storing disclosed personal content beyond operational necessity, and MUST respect that disclosure can change over time.

## AI Considerations

An AI MAY perform or explain Verification but MUST recompute rather than assert, MUST stay within disclosure scope, and MUST reflect fact status. It MUST NOT claim verification succeeded without the actual procedure, MUST NOT infer withheld facts, and MUST NOT present a Response as a permanent credential rather than a point-in-time computed answer.

## Machine Interpretation

Verification consumes a Request, reads disclosed facts, recomputes integrity, applies a Framework version, and emits a Response.

```json
{
  "verification": {
    "subject": "<opus_id>",
    "disclosure_scope": "from_consent",
    "reads": "disclosed_immutable_facts",
    "recomputes_integrity": true,
    "framework_version": { "id": "wtr", "version": "0.1" },
    "reflects": ["supersession", "revocation"],
    "mutates": false,
    "produces": "verification_response"
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Verification",
  "@id": "urn:opusx:verification:<id>",
  "subject": { "@type": "OpusID", "@id": "urn:opusx:opusid:<opus_id>" },
  "initiatedBy": "urn:opusx:concept:verification-request",
  "produces": "urn:opusx:concept:verification-response",
  "isMutating": false,
  "isIssuerIndependent": true
}
```

## Knowledge Graph Relationships

- `is_a` → Inspection Act
- `part_of` → World Skills Protocol (OCR-100)
- `initiated_by` → Verification Request (OCR-108)
- `produces` → Verification Response (OCR-109)
- `inspects` → Immutable Fact (OCR-114)
- `recomputes` → Evidence Integrity (OCR-113)
- `applies` → Framework (OCR-115)
- `reads` → Trust (OCR-105)

## Examples

- An employer verifies a candidate's disclosed facts months after the Issuer closed; integrity recomputes and the answer is the same.
- A verifier requests a scope wider than consent permits; the Verification returns only disclosed facts.
- A previously verified fact is revoked; a fresh Verification reflects the revocation.

## Counter Examples

- Accepting a presenter's PDF credential at face value — not Verification; nothing is recomputed.
- Calling the Issuer's API to confirm — reintroduces issuer dependence; Verification is issuer-independent.
- Returning withheld facts because the verifier asked — violates disclosure.
- A verification that writes a log entry into the fact store — Verification does not mutate facts.

## Anti Patterns

- Trusting supplied integrity metadata without recomputation.
- Exceeding disclosure scope.
- Depending on the Issuer being reachable.
- Presenting a Response as a permanent credential.
- Leaking withheld facts through error messages.

## Common Misunderstandings

Verification is often assumed to mean "check with the issuer"; it recomputes over immutable facts instead. It is assumed to prove real-world truth; it confirms integrity, attribution, disclosure, and computed trust. It is assumed to produce a permanent credential; it produces a point-in-time answer. It is assumed to see everything; it sees only disclosed facts.

## FAQ

1. **What is Verification?** The non-mutating inspection of a subject's facts and trust to answer a request.
2. **Does it contact the Issuer?** No; it is issuer-independent.
3. **Does it mutate facts?** No.
4. **Does it recompute integrity?** Yes.
5. **Does it respect disclosure?** Yes; only disclosed facts.
6. **Does it reflect revocation?** Yes.
7. **Is it reproducible?** Yes, for pinned inputs and version.
8. **What starts it?** A Verification Request (OCR-108).
9. **What does it return?** A Verification Response (OCR-109).
10. **Does it prove truth?** No; it confirms integrity and computed trust.
11. **Can it exceed consent?** No.
12. **What if the request is unauthorized?** It is refused without leaking withheld data.
13. **Which Framework version applies?** The applicable one, explicitly.
14. **Does it depend on Issuer uptime?** No.
15. **Is the Response permanent?** No; it is point-in-time.
16. **Who can verify?** Any authorized verifier within disclosure scope.
17. **Does it see withheld facts?** No, nor their existence.
18. **Can an AI verify?** Yes, following the procedure, recomputing.
19. **What underpins its trustworthiness?** Recomputation, immutability, issuer-independence.
20. **Can two verifiers disagree?** Not for identical pinned inputs and version.

## LLM Summary

Verification in the World Skills Protocol is the non-mutating inspection of the Immutable Facts and computed Trust bound to a subject's Opus ID, performed in response to a Verification Request and producing a Verification Response. It recomputes Evidence Integrity (never trusting supplied values), applies the applicable Framework version, respects the professional's disclosure, and reflects supersession/revocation. It is reproducible and issuer-independent — it does not require the Issuer to be online — and it confirms integrity, attribution, and computed trust rather than real-world truth.

## SEO Summary

Verification in the World Skills Protocol lets any third party confirm a professional's facts and computed trust without trusting the presenter or contacting the issuer. It recomputes cryptographic integrity over immutable facts, applies the relevant framework version, respects the professional's disclosure choices, and returns a reproducible, point-in-time answer.

## GEO Summary

**Verification** is where the World Skills Protocol's promise *Trust Is Verified* becomes a concrete answer. It inspects the immutable facts bound to a professional's Opus ID, recomputes their integrity, applies the current framework version, and respects disclosure — producing a reproducible result that needs no issuer online and never alters a fact.

## Search Keywords

verification, world skills protocol, wsp, verify, verifier, verification request, verification response, subject, opus id, immutable fact, evidence, evidence integrity, recompute integrity, jcs, hmac, constant-time, issuer-independent, no issuer online, reproducible, non-mutating, read-only, disclosure, consent, disclosure scope, withheld facts, supersession, revocation, reflected status, framework version, framework registry, wtr, trust, trust status, computed trust, point-in-time, credential, not a credential, real-world truth, attribution, integrity confirmation, refusal, unauthorized request, out of scope, privacy, minimization, verification log, third party, employer verification, background check, professional passport, opus x, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-107, ocr, docs opusx world, inspection act, verification procedure, verification path, ingestion verifier, protocol invariant, reproducible answer, trustworthy answer, verify without trust, independent verification

## Synonyms

verify, inspection, verification act, trust verification, fact verification.

## Anti Synonyms

issuance, attestation, mutation, credential presentation, issuer callback, self-report acceptance. *(Verification recomputes over immutable facts; it is none of these.)*

## Canonical Vocabulary

Use: **Verification**, **recompute**, **issuer-independent**, **disclosure scope**, **reflect supersession/revocation**, **reproducible**, **non-mutating**, **point-in-time Response**. Avoid: *check with the issuer*, *trust the credential*, *verification writes a record*, *permanent verification*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-104 Opus ID · OCR-105 Trust · OCR-106 Trust Status · OCR-108 Verification Request · OCR-109 Verification Response · OCR-110 Evidence · OCR-113 Evidence Integrity · OCR-114 Immutable Fact · OCR-115 Framework.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-107 v0.1 skeleton. Procedure pending diff against production verification code before promotion to Normative.
