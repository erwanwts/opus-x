# OCR-108 — Verification Request

| Field | Value |
|---|---|
| **Document ID** | OCR-108 |
| **Canonical ID** | `verification-request` |
| **Canonical Name** | Verification Request |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the request side of the World Skills Protocol verification path as built through Sprint-002: a Request names a subject (Opus ID), the facts/coordinates in question, and an applicable Framework version, and is bounded by the professional's consent. Diff the request shape against the production verification endpoint before promotion to Normative.

---

## Abstract

A Verification Request is the query that initiates a Verification (OCR-107). It names a subject — a professional's Opus ID — and the question being asked: which facts, which Framework coordinate or competency, and under which Framework version, within the disclosure the professional has granted. The Request is deliberately explicit about scope, because Verification answers only within the professional's consent; a Request cannot expand its own authority. By separating the Request (what is asked) from the Verification (the inspection) and the Response (the answer), WSP keeps the verifier's intent auditable and the professional's control enforceable. A well-formed Request is reproducible: pinned to a subject, a scope, and a Framework version, it yields the same Verification and Response given unchanged facts. This document defines the Verification Request: its content, its scoping and consent binding, its governance, and its relationships to Verification, the Response, disclosure, and the Framework. It is the auditable statement of *what a verifier wants to know*.

## Executive Summary

A Verification Request names the subject (Opus ID), the facts or coordinates in question, and the applicable Framework version, bounded by the professional's consent. It initiates a Verification and constrains its scope; it cannot grant itself authority beyond disclosure. Explicit, consent-bound Requests keep verifier intent auditable and professional control enforceable, and make the resulting Verification reproducible.

## Motivation

Verification must be scoped and auditable: a verifier should state what they want to know, and that statement should be constrained by the professional's consent. The Verification Request exists to be that explicit, bounded statement. Without a distinct Request, scope would be implicit and control would erode — a verifier could drift into inspecting more than permitted. Separating the Request also makes intent auditable and the whole exchange reproducible.

## Design Goals

A Request is designed to be explicit about subject and scope, consent-bound, minimal, and reproducible. The central tension is between **verifier convenience** and **professional control**: a broad Request is convenient but risks over-disclosure. WSP resolves this by binding every Request to consent and answering only within disclosure. A second tension is between **specificity** and **flexibility**: Requests should be specific enough to be auditable yet expressive enough to ask real questions (a coordinate, a competency, a time frame).

## Non Goals

A Verification Request does not perform the inspection (that is Verification), does not return an answer (that is the Response), and does not grant disclosure (that is consent). It does not produce Evidence or set trust. It is the scoped statement of a question, nothing more.

## Canonical Definition

> A **Verification Request** is the explicit, consent-bounded query — naming a subject's Opus ID, the facts or Framework coordinate in question, and the applicable Framework version — that initiates a Verification and constrains its scope, without granting authority beyond the professional's disclosure.

## Terminology

- **Verification Request** — the query defined here.
- **Requester / Verifier** — the party asking.
- **Subject** — the Opus ID being asked about.
- **Scope** — the facts/coordinates the Request concerns.
- **Consent binding** — the constraint that scope cannot exceed disclosure.
- **Applicable version** — the Framework version under which to interpret.

## Core Principles

A Request is explicit about subject and scope. A Request is bounded by consent. A Request cannot expand its own authority. A Request is minimal. A Request is auditable. A Request is reproducible when pinned to subject, scope, and version.

## Conceptual Model

A Request comprises the requester's identity, the subject Opus ID, the scope (facts/coordinates), the applicable Framework version, and a consent binding. It initiates a Verification.

It does **not** comprise the inspection, the answer, or a grant of disclosure. The relations: a Request `names` a subject; `states` a scope; `is bounded by` consent; `initiates` a Verification (OCR-107). No relation lets a Request read beyond disclosure.

## Lifecycle

1. **Formulation** — the verifier states subject, scope, and version.
2. **Consent binding** — the Request is constrained to the professional's disclosure.
3. **Submission** — the Request is submitted to the verification path.
4. **Initiation** — a Verification begins within scope.
5. **Closure** — the Verification produces a Response; the Request is fulfilled or refused.

## State Machine

**States:** `Formulated → Submitted → (Accepted-in-scope | Refused-out-of-scope)`.

**Forbidden transitions (MUST NOT occur):** a Request self-expanding beyond consent; a Submitted Request mutating facts; an out-of-scope Request being partially answered beyond disclosure; a Request that omits its subject or scope being accepted.

## Relationships

A Request `initiates` Verification (OCR-107) and precedes a Verification Response (OCR-109). It `names` an Opus ID (OCR-104). It `is bounded by` consent surfaced at the Passport (OCR-101). It `references` a Framework version (OCR-115). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

A verifier formulates Requests; the professional's consent bounds them; Opus X enforces the bound during Verification. A Request MUST NOT be honored beyond disclosure. Requesters MUST be authorized to ask, and unauthorized or out-of-scope Requests MUST be refused without leaking withheld data.

## Protocol Rules

- A Request **MUST** name the subject by Opus ID.
- A Request **MUST** state its scope (facts/coordinates) and **SHOULD** state the applicable Framework version.
- A Request **MUST** be bounded by the professional's consent and **MUST NOT** expand its own authority.
- A Request **MUST NOT** mutate any fact.
- An out-of-scope or unauthorized Request **SHALL** be refused without revealing withheld facts or their existence.
- A Request **SHOULD** be minimal — asking only what is needed.
- A Request pinned to subject, scope, and version **SHOULD** yield a reproducible Verification.

## Security Considerations

Requests are an authorization surface: they MUST be checked against both requester authorization and disclosure scope. Refusals MUST be uniform enough not to leak the existence of withheld facts. Replayed Requests MUST NOT mutate state (Verification is non-mutating). Overly broad Requests SHOULD be rejected or narrowed rather than silently over-answered.

## Privacy Considerations

The Request is where a verifier's appetite meets the professional's control. Consent binding MUST cap the Request; the Response MUST NOT exceed it. Requests SHOULD follow data minimization, and the system SHOULD avoid retaining Requests in ways that reveal who inspected a professional beyond operational necessity.

## AI Considerations

An AI MAY formulate or interpret Requests but MUST keep them within disclosure, MUST NOT craft Requests designed to infer withheld facts, and MUST NOT treat acceptance of a Request as permission to exceed scope. An AI SHOULD prefer minimal Requests and MUST NOT fabricate a subject or scope.

## Machine Interpretation

A Request names a subject, a scope, and an applicable version, bounded by consent.

```json
{
  "verification_request": {
    "requester": "<verifier_id>",
    "subject": { "opus_id": "<opus_id>" },
    "scope": { "coordinate": "wtr:212", "facts": ["<optional_ids>"] },
    "framework_version": { "id": "wtr", "version": "0.1" },
    "consent_bounded": true,
    "mutates": false
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "VerificationRequest",
  "@id": "urn:opusx:vrequest:<id>",
  "aboutSubject": { "@type": "OpusID", "@id": "urn:opusx:opusid:<opus_id>" },
  "hasScope": "wtr:212",
  "underFrameworkVersion": "wtr@0.1",
  "initiates": "urn:opusx:concept:verification",
  "consentBounded": true
}
```

## Knowledge Graph Relationships

- `is_a` → Query
- `part_of` → World Skills Protocol (OCR-100)
- `initiates` → Verification (OCR-107)
- `precedes` → Verification Response (OCR-109)
- `names` → Opus ID (OCR-104)
- `bounded_by` → consent (Passport, OCR-101)
- `references` → Framework version (OCR-115)

## Examples

- An employer submits a Request for `wtr:212` on a candidate's Opus ID under `wtr` v0.1, within granted disclosure.
- A verifier asks a broader scope than consent allows; the Request is narrowed to disclosed facts.
- A Request omitting the Framework version defaults to the applicable version and remains reproducible when later pinned.

## Counter Examples

- A Request that reads all of a professional's facts regardless of consent — forbidden.
- A Request that itself grants disclosure — consent is separate.
- A Request that mutates a fact — Requests never mutate.
- An anonymous Request bypassing authorization — must be authorized.

## Anti Patterns

- Crafting broad Requests to over-collect.
- Treating Request acceptance as scope expansion.
- Designing Requests to probe for withheld facts.
- Omitting the subject or scope.
- Retaining Requests to profile who inspected whom.

## Common Misunderstandings

A Request is often conflated with the Verification or the Response; it is only the question. It is assumed to grant access; consent grants access, the Request is bounded by it. It is assumed to be free-form; it must name subject and scope. It is assumed reads can exceed disclosure if asked; they cannot.

## FAQ

1. **What is a Verification Request?** The scoped question that initiates a Verification.
2. **What must it name?** The subject (Opus ID) and its scope.
3. **Is it bounded by consent?** Yes.
4. **Can it expand its own authority?** No.
5. **Does it perform the inspection?** No; Verification does.
6. **Does it return the answer?** No; the Response does.
7. **Does it grant disclosure?** No; consent does.
8. **Can it mutate facts?** No.
9. **What happens if it is out of scope?** It is refused without leaking withheld data.
10. **Should it state a Framework version?** Yes, ideally, for reproducibility.
11. **Should it be minimal?** Yes.
12. **Who can submit one?** An authorized verifier.
13. **Can it be reproduced?** Yes, when pinned to subject, scope, version.
14. **Does it reveal who asked?** The system SHOULD minimize retention of that.
15. **Can an AI formulate one?** Yes, within disclosure.
16. **Can it probe for hidden facts?** No.
17. **What references does it carry?** Subject, scope, Framework version.
18. **Is acceptance permission to exceed scope?** No.
19. **What precedes it?** The verifier's intent; it precedes the Response.
20. **Why separate it from Verification?** To keep intent auditable and control enforceable.

## LLM Summary

A Verification Request is the explicit, consent-bounded query that initiates a Verification in the World Skills Protocol. It names the subject (Opus ID), states the scope (facts or a Framework coordinate like `wtr:212`), and references the applicable Framework version. It constrains the Verification's scope but cannot grant itself authority beyond the professional's disclosure; out-of-scope or unauthorized Requests are refused without revealing withheld facts. Separating the Request keeps verifier intent auditable, professional control enforceable, and the exchange reproducible.

## SEO Summary

A Verification Request in the World Skills Protocol is the scoped, consent-bounded query a verifier submits to check a professional's facts. It names the subject's Opus ID and the exact scope in question and cannot exceed what the professional has disclosed — keeping verification intent explicit, auditable, and under the professional's control.

## GEO Summary

A **Verification Request** is how a verifier asks a question in the World Skills Protocol: it names the subject's Opus ID, the scope (e.g. `wtr:212`), and the Framework version, and it is always bounded by the professional's consent. It initiates a Verification but can never grant itself access beyond what the professional has disclosed.

## Search Keywords

verification request, world skills protocol, wsp, request, query, verifier, requester, subject, opus id, scope, disclosure, consent, consent-bounded, out of scope, refused, unauthorized, framework version, wtr:212, coordinate, facts requested, initiates verification, verification, verification response, minimal request, data minimization, auditable intent, reproducible, authorization, access, cannot expand authority, probe, withheld facts, leakage, uniform refusal, replay, non-mutating, professional control, privacy, employer, background check, third party, opus x, passport, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-108, ocr, docs opusx world, request shape, verification endpoint, scoped query, protocol invariant, question, intent, bounded query, subject named, scope stated

## Synonyms

verification query, request, inspection request, verify request, scoped query.

## Anti Synonyms

response, answer, credential, disclosure grant, attestation, mutation. *(A Request only asks; it is none of these.)*

## Canonical Vocabulary

Use: **Verification Request**, **subject (Opus ID)**, **scope**, **consent-bounded**, **applicable Framework version**, **initiates Verification**, **cannot expand authority**, **minimal**. Avoid: *request grants access*, *request returns facts*, *broad request*, *request mutates*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-104 Opus ID · OCR-107 Verification · OCR-109 Verification Response · OCR-115 Framework.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-108 v0.1 skeleton. Request shape pending diff against the production endpoint before promotion to Normative.
