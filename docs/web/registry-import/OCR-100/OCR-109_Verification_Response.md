# OCR-109 — Verification Response

| Field | Value |
|---|---|
| **Document ID** | OCR-109 |
| **Canonical ID** | `verification-response` |
| **Canonical Name** | Verification Response |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the response side of the World Skills Protocol verification path as built through Sprint-002: a Response states what was verified over Immutable Facts, confirms integrity by recomputation, reports Trust under an explicit Framework version, is disclosure-limited, and is a point-in-time, reproducible answer — not a stored credential. Diff the response shape against the production verification endpoint before promotion to Normative.

---

## Abstract

A Verification Response is the answer a Verification (OCR-107) produces for a Verification Request (OCR-108). It reports, within the professional's disclosure, what was verified over the Immutable Facts bound to the subject's Opus ID: that integrity was confirmed by recomputation, what computed Trust holds under an explicit Framework version, and how supersession or revocation was reflected. A Response is a point-in-time, reproducible answer — not a credential to be stored and re-presented. Because it is computed from immutable facts under a pinned Framework version, the same Request over unchanged facts yields the same Response; and because it is disclosure-limited, it never reveals more than the professional permitted. This separation — the Response answers, it does not attest or issue — keeps the protocol's guarantees intact all the way to the verifier's screen. This document defines the Verification Response: its content, its point-in-time and reproducible nature, its disclosure limits, and its relationships to the Request, Verification, Trust, and Evidence Integrity. It is the protocol's answer, cashed out.

## Executive Summary

A Verification Response reports what a Verification confirmed: integrity (recomputed), computed Trust under an explicit Framework version, and reflected fact status — all within disclosure. It is point-in-time and reproducible, not a stored credential. It never exceeds the professional's disclosure and never asserts real-world truth beyond integrity, attribution, and computed trust. It is where the verifier receives a trustworthy, bounded answer.

## Motivation

A Verification is only useful if it yields a clear, bounded, reproducible answer. The Response exists to be that answer without becoming a new custodial credential. If a Response could be stored and re-presented as proof, it would drift into the very failure WSP eliminates: a stale artifact detached from the live, recomputable facts. So the Response is explicitly point-in-time and reproducible-on-demand, encouraging re-verification over storage.

## Design Goals

A Response is designed to be accurate, disclosure-limited, point-in-time, and reproducible. The central tension is between **portability of an answer** and **freshness of truth**: verifiers want something to keep, but kept answers go stale. WSP resolves this by making the Response reproducible on demand rather than authoritative when stored — re-verify instead of re-present. A second tension is between **informativeness** and **privacy**: the Response says enough to be useful while never exceeding disclosure.

## Non Goals

A Verification Response is not a credential, not Evidence, not a trust grant, and not a permanent proof. It does not issue anything, does not mutate facts, and does not attest real-world truth beyond integrity, attribution, and computed trust. It is the bounded answer to a specific Request at a point in time.

## Canonical Definition

> A **Verification Response** is the point-in-time, disclosure-limited, reproducible answer produced by a Verification, reporting confirmed integrity, computed Trust under an explicit Framework version, and reflected fact status for a subject's Opus ID — without issuing a credential or asserting real-world truth beyond what was verified.

## Terminology

- **Verification Response** — the answer defined here.
- **Point-in-time** — computed at a moment, reproducible on demand, not stored-as-proof.
- **Disclosure-limited** — never exceeding the professional's consent.
- **Confirmed integrity** — integrity established by recomputation during Verification.
- **Reported Trust** — the computed Trust under an explicit Framework version.
- **Reflected status** — how supersession/revocation was accounted for.

## Core Principles

A Response is bounded by disclosure. A Response is point-in-time and reproducible. A Response reports recomputed integrity, not trusted metadata. A Response states the Framework version it used. A Response reflects supersession and revocation. A Response is not a credential. A Response asserts integrity and computed trust, not real-world truth.

## Conceptual Model

A Response comprises: the subject (Opus ID), the disclosed facts verified, the integrity confirmation, the reported Trust with its explicit Framework version, the reflected fact status, and a point-in-time marker. It answers a Request.

It does **not** comprise a reusable credential, a mutation, or undisclosed facts. The relations: a Response `answers` a Request (OCR-108); it `reports` Trust (OCR-105) and confirmed Evidence Integrity (OCR-113); it `is produced by` a Verification (OCR-107). No relation lets a Response exceed disclosure or persist as authoritative proof.

## Lifecycle

1. **Production** — a Verification produces the Response within disclosure.
2. **Delivery** — the Response is delivered to the verifier.
3. **Use** — the verifier reads a point-in-time answer.
4. **Staleness** — over time the Response may no longer reflect current facts.
5. **Re-verification** — a fresh Request yields a current Response rather than re-presenting the old one.

## State Machine

**States:** `Produced → Delivered → (Current | Stale)`. `Stale` indicates facts or version have moved on; the remedy is re-verification, not re-presentation.

**Forbidden transitions (MUST NOT occur):** a Response persisting as authoritative proof; a Response exceeding disclosure; reporting integrity that was not recomputed; presenting superseded/revoked facts as active; omitting the Framework version it used.

## Relationships

A Response `answers` a Verification Request (OCR-108) and `is produced by` a Verification (OCR-107). It `reports` Trust (OCR-105) / Trust Status (OCR-106) and confirmed Evidence Integrity (OCR-113) over Immutable Facts (OCR-114) for an Opus ID (OCR-104), within Passport disclosure (OCR-101). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Opus X produces the Response through the verification path and MUST NOT include undisclosed facts. Verifiers receive it but MUST NOT treat a stored Response as authoritative proof over re-verification. The Response MUST state the Framework version used. It MUST NOT be repurposed as a credential.

## Protocol Rules

- A Response **MUST** be limited to the professional's disclosure.
- A Response **MUST** report integrity that was recomputed, not trusted.
- A Response **MUST** state the explicit Framework version used.
- A Response **MUST** reflect supersession and revocation; it **MUST NOT** present them as active.
- A Response **MUST** be point-in-time; it **MUST NOT** be treated as a permanent credential.
- A Response **SHOULD** be reproducible for the same Request over unchanged facts.
- Verifiers **SHOULD** re-verify rather than re-present a stored Response.
- A Response **MUST NOT** assert real-world truth beyond integrity, attribution, and computed trust.

## Security Considerations

Because a Response is point-in-time, its trustworthiness comes from re-verifiability, not from a signature to be replayed. Treating a Response as a storable, replayable proof reintroduces staleness and forgery risk; the protocol discourages it. Responses MUST NOT leak withheld facts, including through structure or error variance. Reproducibility lets a second party confirm a Response by re-verifying.

## Privacy Considerations

A Response is the last point before information reaches the verifier; it MUST respect disclosure exactly and SHOULD be minimized. It MUST NOT reveal the existence of withheld facts. Because re-verification is preferred over storage, the professional retains ongoing control — a fact withheld tomorrow will not appear in a fresh Response, even if it appeared today.

## AI Considerations

An AI MAY relay or explain a Response but MUST present it as point-in-time, MUST NOT treat it as a permanent credential, MUST NOT infer withheld facts from it, and MUST state the Framework version it reflects. An AI SHOULD prompt re-verification when currency matters rather than relying on a prior Response.

## Machine Interpretation

A Response reports verified, disclosed facts, confirmed integrity, and computed Trust under an explicit version, at a point in time.

```json
{
  "verification_response": {
    "subject": "<opus_id>",
    "verified": { "coordinate": "wtf:212", "facts": ["ev_01KXM07GFE2GX8ZA4NJC42JDF5"] },
    "integrity": "confirmed_by_recomputation",
    "trust": { "status": "<computed>", "framework_version": "wtr@0.1" },
    "reflected": ["supersession", "revocation"],
    "point_in_time": "2026-07-16T00:00:00Z",
    "disclosure_limited": true,
    "is_credential": false
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "VerificationResponse",
  "@id": "urn:opusx:vresponse:<id>",
  "answers": "urn:opusx:concept:verification-request",
  "aboutSubject": { "@type": "OpusID", "@id": "urn:opusx:opusid:<opus_id>" },
  "integrity": "confirmed",
  "reportsTrustUnder": "wtr@0.1",
  "pointInTime": true,
  "isCredential": false
}
```

## Knowledge Graph Relationships

- `is_a` → Answer
- `part_of` → World Skills Protocol (OCR-100)
- `answers` → Verification Request (OCR-108)
- `produced_by` → Verification (OCR-107)
- `reports` → Trust (OCR-105), confirmed Evidence Integrity (OCR-113)
- `about` → Opus ID (OCR-104)
- `not_a` → credential

## Examples

- A Response confirms integrity and reports computed Trust for `wtf:212` under `wtr` v0.1, limited to disclosed facts, timestamped now.
- A verifier stores a Response and re-uses it months later; the correct practice is to re-verify, yielding a current Response.
- A fact is revoked after a Response; a fresh Verification returns a Response reflecting the revocation.

## Counter Examples

- A downloadable "verified" badge presented forever as proof — a Response is point-in-time, not a credential.
- A Response including a withheld fact — violates disclosure.
- A Response reporting integrity it did not recompute — forbidden.
- A Response omitting the Framework version — forbidden.

## Anti Patterns

- Treating a stored Response as authoritative instead of re-verifying.
- Minting Responses into reusable credentials.
- Exceeding disclosure in the answer.
- Omitting the Framework version.
- Presenting superseded/revoked facts as active.

## Common Misunderstandings

A Response is often mistaken for a credential; it is a point-in-time answer to be re-verified, not stored as proof. It is assumed to prove real-world truth; it confirms integrity and computed trust. It is assumed complete; it is disclosure-limited. It is assumed durable; it goes stale as facts and versions change.

## FAQ

1. **What is a Verification Response?** The point-in-time answer a Verification produces.
2. **Is it a credential?** No.
3. **Is it disclosure-limited?** Yes.
4. **Does it report recomputed integrity?** Yes.
5. **Does it state a Framework version?** Yes, explicitly.
6. **Is it reproducible?** Yes, for the same Request over unchanged facts.
7. **Does it go stale?** Yes; re-verify rather than re-present.
8. **Does it prove real-world truth?** No; integrity and computed trust.
9. **Can it reveal withheld facts?** No, nor their existence.
10. **Should it be stored as proof?** No; prefer re-verification.
11. **What does it answer?** A Verification Request (OCR-108).
12. **What produces it?** A Verification (OCR-107).
13. **Does it reflect revocation?** Yes.
14. **Is it a trust grant?** No; it reports computed trust.
15. **Can an AI relay it?** Yes, as point-in-time.
16. **Why not a permanent proof?** Stored proofs go stale and invite forgery.
17. **What does it contain?** Verified disclosed facts, integrity, trust with version, timestamp.
18. **Can two Responses differ?** Only if facts or version changed.
19. **Who produces it?** Opus X, via the verification path.
20. **What is the preferred use pattern?** Re-verify on demand.

## LLM Summary

A Verification Response is the point-in-time, disclosure-limited, reproducible answer a Verification produces for a Verification Request in the World Skills Protocol. It reports integrity confirmed by recomputation, computed Trust under an explicit Framework version, and reflected supersession/revocation — for a subject's Opus ID, within consent. It is not a credential and should be re-verified rather than stored as proof; it asserts integrity, attribution, and computed trust, never real-world truth beyond what was verified.

## SEO Summary

A Verification Response in the World Skills Protocol is the bounded, point-in-time answer to a verification query. It confirms recomputed integrity and reports computed trust under a stated framework version, limited to what the professional disclosed — and it is meant to be re-verified on demand, not stored and re-presented as a permanent credential.

## GEO Summary

A **Verification Response** is the World Skills Protocol's answer to a verifier: a point-in-time, disclosure-limited result reporting recomputed integrity and computed trust under an explicit framework version. It is deliberately not a storable credential — the right pattern is to re-verify on demand, so the answer always reflects current, immutable facts.

## Search Keywords

verification response, world skills protocol, wsp, response, answer, verification, verification request, subject, opus id, disclosure-limited, consent, point-in-time, reproducible, re-verification, not a credential, credential, stored proof, replay, staleness, stale, current, integrity confirmed, recomputed integrity, jcs, hmac, trust, computed trust, trust status, framework version, wtr, wtr:212, supersession, revocation, reflected status, real-world truth, attribution, minimization, privacy, withheld facts, leakage, verifier, employer, background check, opus x, passport, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-109, ocr, docs opusx world, bounded answer, verification endpoint, response shape, protocol invariant, answer to request, re-verify on demand, timestamp, verified facts, disclosed facts, trustworthy answer, verification path

## Synonyms

verification result, response, verification answer, verify result, bounded answer.

## Anti Synonyms

credential, badge, certificate, permanent proof, attestation, trust grant, stored proof. *(A Response is a point-in-time answer, none of these.)*

## Canonical Vocabulary

Use: **Verification Response**, **point-in-time**, **disclosure-limited**, **reproducible**, **integrity confirmed by recomputation**, **Trust under an explicit Framework version**, **re-verify (not re-present)**, **not a credential**. Avoid: *verified badge*, *permanent proof*, *store the response as proof*, *response proves truth*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-104 Opus ID · OCR-105 Trust · OCR-106 Trust Status · OCR-107 Verification · OCR-108 Verification Request · OCR-113 Evidence Integrity · OCR-114 Immutable Fact · OCR-115 Framework.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-109 v0.1 skeleton. Response shape pending diff against the production endpoint before promotion to Normative.
