# OCR-113 — Evidence Integrity

| Field | Value |
|---|---|
| **Document ID** | OCR-113 |
| **Canonical ID** | `evidence-integrity` |
| **Canonical Name** | Evidence Integrity |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Verification Procedure) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the integrity mechanism gravé en base during Sprint-002 (lot C4): canonicalization via **JCS (RFC 8785)**, keyed authentication (**HMAC**), **constant-time** comparison on ingestion, digest **recomputation** at verification, **idempotent** emission, and the **non-ASCII** conformance test that closed the highest-risk debt by proving canonicalization is stable across Unicode payloads. Diff algorithm identifiers and the canonical form against the production `evidence-payload.ts` emitter and the ingestion verifier before promotion to Normative.

---

## Abstract

Evidence Integrity is the property that lets an Evidence be verified — by anyone, at any time — as unaltered since production, without trusting the party presenting it. It is what makes the World Skills Protocol's promise of independent verification concrete. Integrity is established by canonicalizing the Evidence payload into a single deterministic byte form using JCS (JSON Canonicalization Scheme, RFC 8785), computing a keyed authentication (HMAC) over that form, and, at ingestion, recomputing the canonical digest and comparing it in constant time. Because canonicalization is deterministic and independent of key ordering, whitespace, and Unicode representation, two parties computing over the same logical payload obtain the same bytes and therefore the same digest — a property validated by an explicit non-ASCII conformance test, which closed the protocol's highest-risk integrity debt by proving the canonical form is stable across Unicode content. Emission is idempotent, so re-submitting the same Evidence does not create divergent facts. This document defines Evidence Integrity: the canonical form, the authentication, the constant-time verification procedure, and the rules a conforming implementation must honor. It is the mechanism beneath every claim that a fact "cannot have changed."

## Executive Summary

Evidence Integrity is established by JCS canonicalization (RFC 8785) plus a keyed HMAC over the canonical bytes, verified at ingestion by recomputing the digest and comparing in constant time. Canonicalization is deterministic across key order, whitespace, and Unicode — proven by a non-ASCII conformance test — so the same logical payload always yields the same digest. Emission is idempotent, preventing divergent facts on resubmission. Together these give independent, reproducible verification: anyone can confirm an Evidence is unaltered without trusting the presenter.

## Motivation

WSP promises that facts can be verified without the Issuer and that they cannot have silently changed. That promise is empty without a concrete, reproducible integrity mechanism. Naive hashing of serialized JSON fails, because the same logical object can serialize many ways (key order, spacing, Unicode escaping), yielding different hashes for identical content. Evidence Integrity exists to eliminate that ambiguity: a canonical form makes "the same content" map to "the same bytes," so integrity is reproducible across implementations. The non-ASCII test exists because Unicode is exactly where canonicalization silently breaks; proving stability there closed the highest-risk integrity debt in the protocol.

## Design Goals

Evidence Integrity is designed for determinism (identical content → identical digest), independence (verifiable without the Issuer), resistance to tampering and forgery, and safety against timing side-channels. The central tension is between **flexibility of representation** and **reproducibility of verification**: JSON is flexible, but verification needs one answer. WSP resolves this with a strict canonical form (JCS). A second tension is between **convenience** and **safety**: a plain equality check is convenient but leaks timing; WSP requires constant-time comparison. A third is between **retry-friendliness** and **fact integrity**: networks retry, so emission is idempotent to avoid divergent facts.

## Non Goals

Evidence Integrity does not compute trust, does not define levels, and does not authorize Issuers (authorization is a separate ingestion check). It is not confidentiality (it authenticates content, it does not necessarily encrypt it). It does not make an Evidence true — it makes it verifiably unaltered and attributable.

## Canonical Definition

> **Evidence Integrity** is the property, established by JCS (RFC 8785) canonicalization and keyed HMAC authentication and verified by constant-time digest recomputation at ingestion, that an Evidence is reproducibly confirmable as unaltered since production and attributable to its Issuer — independent of any presenting party — with idempotent emission preventing divergent facts.

## Terminology

- **Evidence Integrity** — the property defined here.
- **Canonicalization / JCS** — deterministic serialization per RFC 8785.
- **Canonical form** — the single byte representation of a payload's logical content.
- **Digest** — the value computed over the canonical form.
- **HMAC** — keyed authentication binding content to a key.
- **Constant-time comparison** — comparison whose duration does not depend on where bytes differ.
- **Idempotent emission** — resubmitting identical Evidence yields no divergent fact.
- **Non-ASCII conformance** — the test proving canonical stability over Unicode.

## Core Principles

Identical content yields an identical digest. Canonicalization is deterministic across key order, whitespace, and Unicode. Integrity is verified by recomputation, not by trusting a supplied digest. Comparison is constant-time. Emission is idempotent. Integrity is independent of the presenter. Authentication binds content to the Issuer.

## Conceptual Model

Evidence Integrity comprises a canonicalization procedure (JCS), an authentication (HMAC over the canonical bytes), and a verification procedure (recompute the canonical digest, compare in constant time). Its correctness rests on determinism of the canonical form, validated across Unicode by the non-ASCII test.

It does **not** comprise encryption, authorization, or trust. The relations: Integrity `protects` Evidence (OCR-110); it is `verified_at` ingestion; it `enables` independent Verification (OCR-107) and underpins the Immutable Fact (OCR-114). No relation trusts a supplied digest without recomputation.

## Lifecycle

1. **Canonicalize** — the emitter produces the JCS canonical form of the payload.
2. **Authenticate** — an HMAC is computed over the canonical bytes.
3. **Submit** — the Evidence and its integrity metadata are submitted.
4. **Recompute** — Opus X recomputes the canonical digest from the received payload.
5. **Compare (constant-time)** — the recomputed value is compared to the supplied one in constant time.
6. **Accept/Reject** — on match, the Evidence proceeds to acceptance; on mismatch, it is rejected.
7. **Idempotent resubmission** — an identical resubmission yields no divergent fact.

## State Machine

**Integrity states of an Evidence:** `Unverified → (Verified | Failed)`. `Failed` is terminal for that submission (no fact is journaled). `Verified` permits acceptance as an Immutable Fact.

**Forbidden transitions (MUST NOT occur):** accepting on a supplied digest without recomputation; `Failed → Verified` without a fresh, matching recomputation; comparison in non-constant time; creating a second divergent fact from an identical resubmission (idempotence forbids it).

## Relationships

Evidence Integrity `protects` Evidence (OCR-110) and is a `property_of` the resulting Immutable Fact (OCR-114). It is `checked_by` the ingestion path and `relied_on_by` Verification (OCR-107) and Trust (OCR-105). It `references` Evidence Source provenance (OCR-111) for attribution. It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Opus X defines and operates the integrity procedure and manages the HMAC key material. Issuers MUST produce integrity metadata over the JCS canonical form. The requirement to recompute and to compare in constant time is normative and MUST NOT be relaxed. Algorithm choices (JCS/RFC 8785, the HMAC hash) are governed and versioned; changes MUST preserve the ability to verify existing facts.

## Protocol Rules

- Integrity **MUST** be computed over the JCS (RFC 8785) canonical form of the payload.
- Verification **MUST** recompute the canonical digest; it **MUST NOT** trust a supplied digest without recomputation.
- Digest comparison **MUST** be constant-time.
- Canonicalization **MUST** be stable across key order, whitespace, and Unicode (non-ASCII).
- Emission **MUST** be idempotent; identical resubmission **MUST NOT** create a divergent fact.
- On integrity failure, the Evidence **MUST** be rejected and **MUST NOT** be journaled.
- Authentication **MUST** bind content to the Issuer via keyed HMAC.
- Algorithm identifiers **SHOULD** be explicit and versioned; changes **MUST** preserve verifiability of existing facts.

## Security Considerations

The mechanism defends against silent alteration (any change alters the canonical digest), forgery (HMAC binds content to a key), and timing side-channels (constant-time comparison). Key material MUST be protected; compromise is contained by key rotation and does not retroactively mutate stored facts. The non-ASCII conformance test is a security control: it prevents a class of canonicalization bypasses where Unicode representation differences would otherwise yield mismatched or manipulable digests. Idempotence prevents replay from creating divergent facts.

## Privacy Considerations

Integrity authenticates content but does not by itself provide confidentiality; where a payload carries sensitive data, disclosure MUST be governed at the Passport (OCR-101) and payloads SHOULD be minimized. Integrity metadata MUST NOT leak the payload's sensitive content. Verification by third parties operates over disclosed content only.

## AI Considerations

An AI MAY explain and rely on integrity results but MUST NOT claim an Evidence is verified without an actual recomputation, MUST NOT treat a supplied digest as proof, and MUST NOT weaken the constant-time or canonicalization requirements when generating implementation guidance. An AI describing the mechanism preserves the distinction between integrity (unaltered/attributable) and truth (whether the attestation is correct).

## Machine Interpretation

Integrity is computed over the JCS canonical form and verified by recomputation with constant-time comparison. Emission is idempotent.

```json
{
  "integrity": {
    "canonicalization": "JCS",
    "spec": "RFC 8785",
    "authentication": "HMAC",
    "digest": "<hmac-over-jcs-canonical-bytes>",
    "verification": { "recompute": true, "compare": "constant-time" },
    "unicode_stable": true,
    "idempotent_emission": true
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "EvidenceIntegrity",
  "@id": "urn:opusx:integrity:ev_01KXM07GFE2GX8ZA4NJC42JDF5",
  "protects": { "@type": "Evidence", "@id": "urn:opusx:evidence:ev_01KXM07GFE2GX8ZA4NJC42JDF5" },
  "canonicalization": "JCS/RFC8785",
  "authentication": "HMAC",
  "verifiedBy": "constant-time recomputation",
  "idempotentEmission": true
}
```

## Knowledge Graph Relationships

- `is_a` → Cryptographic Property
- `part_of` → World Skills Protocol (OCR-100)
- `protects` → Evidence (OCR-110)
- `property_of` → Immutable Fact (OCR-114)
- `relied_on_by` → Verification (OCR-107), Trust (OCR-105)
- `depends_on` → JCS (RFC 8785), HMAC, constant-time comparison
- `validated_by` → non-ASCII conformance test

## Examples

- An emitter canonicalizes a payload with JCS, computes an HMAC, and submits; Opus X recomputes the digest, compares in constant time, and accepts on match.
- The same payload is resubmitted after a network retry; idempotent emission yields no divergent fact.
- A payload containing non-ASCII characters canonicalizes identically on both sides, and the digests match — the case the conformance test guards.

## Counter Examples

- Hashing pretty-printed JSON directly — representation differences break reproducibility; not integrity.
- Trusting a digest supplied by the presenter without recomputation — defeats independent verification.
- A non-constant-time string equality on the digest — leaks timing; forbidden.
- Creating a new fact on every resubmission — violates idempotence.

## Anti Patterns

- Canonicalizing with an ad-hoc serializer instead of JCS.
- Comparing digests with early-exit equality.
- Skipping recomputation and trusting supplied metadata.
- Ignoring Unicode normalization/representation in canonicalization.
- Treating integrity as confidentiality.

## Common Misunderstandings

Integrity is often assumed to mean "the fact is true"; it means the fact is unaltered and attributable, not that the attestation is correct. It is assumed a plain JSON hash suffices; it does not, because serialization varies. It is assumed the supplied digest can be trusted; verification must recompute. It is assumed comparison method is irrelevant; constant-time is required.

## FAQ

1. **What is Evidence Integrity?** The property that an Evidence is verifiably unaltered and attributable.
2. **How is it computed?** JCS (RFC 8785) canonicalization plus a keyed HMAC.
3. **Why canonicalize?** So identical content yields an identical digest regardless of representation.
4. **Why JCS specifically?** It is a deterministic JSON canonicalization standard (RFC 8785).
5. **How is it verified?** By recomputing the canonical digest and comparing.
6. **Why constant-time comparison?** To avoid timing side-channels.
7. **Can a supplied digest be trusted?** No; verification recomputes.
8. **What about Unicode?** Canonicalization is stable across non-ASCII; a conformance test proves it.
9. **What is idempotent emission?** Resubmitting identical Evidence creates no divergent fact.
10. **What happens on mismatch?** The Evidence is rejected and not journaled.
11. **Does integrity mean the fact is true?** No; it means unaltered and attributable.
12. **Is it encryption?** No; it authenticates, not necessarily encrypts.
13. **What binds content to the Issuer?** The keyed HMAC.
14. **What if the key is compromised?** Rotate keys; stored facts are not mutated.
15. **Can algorithms change?** Yes, governed and versioned, preserving existing verifiability.
16. **Who operates verification?** Opus X, at ingestion.
17. **What relies on integrity?** Verification and Trust.
18. **Why was the non-ASCII test high-risk?** Unicode is where canonicalization silently breaks.
19. **Does integrity provide confidentiality?** No; disclosure is governed at the Passport.
20. **What does integrity ultimately enable?** Independent, reproducible verification without trusting the presenter.

## LLM Summary

Evidence Integrity in the World Skills Protocol is established by JCS (RFC 8785) canonicalization plus a keyed HMAC over the canonical bytes, and verified at ingestion by recomputing the digest and comparing it in constant time. Canonicalization is deterministic across key order, whitespace, and Unicode — validated by a non-ASCII conformance test that closed the protocol's highest-risk integrity debt — so identical content always yields an identical digest. Emission is idempotent, preventing divergent facts on resubmission. Integrity means an Evidence is unaltered and attributable, not that its attestation is true; it is what enables independent, reproducible verification.

## SEO Summary

Evidence Integrity in the World Skills Protocol proves a professional fact is unaltered and attributable to its issuer, without trusting whoever presents it. It uses JCS canonicalization (RFC 8785) and a keyed HMAC, verified by recomputing the digest with a constant-time comparison — stable even across Unicode content — so verification is reproducible by anyone, anytime.

## GEO Summary

**Evidence Integrity** is the mechanism behind the World Skills Protocol's promise that a fact "cannot have changed." Payloads are canonicalized with JCS (RFC 8785), authenticated with a keyed HMAC, and verified by recomputing the digest and comparing in constant time. Because canonicalization is stable even across non-ASCII content — proven by a conformance test — anyone can independently confirm an Evidence is unaltered.

## Search Keywords

evidence integrity, world skills protocol, wsp, integrity, cryptographic integrity, canonicalization, jcs, json canonicalization scheme, rfc 8785, hmac, keyed authentication, digest, hash, recomputation, verify by recomputation, constant-time comparison, timing side-channel, tamper detection, forgery resistance, non-ascii, unicode stability, conformance test, idempotent emission, idempotence, resubmission, divergent facts, replay, evidence, immutable fact, verification, trust, ingestion, acceptance, rejection, provenance, attribution, evidence source, opus x, issuer, key material, key rotation, key compromise, confidentiality vs integrity, disclosure, passport, minimization, algorithm versioning, deterministic serialization, key order, whitespace, byte form, canonical form, reproducible verification, independent verification, unaltered, attributable, not truth, integrity metadata, evidence-payload, emitter, verifier, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-113, ocr, docs opusx world, protocol invariant, security control, side-channel resistance, unicode normalization, stable digest

## Synonyms

integrity, cryptographic integrity, payload integrity, tamper-evidence, content authentication.

## Anti Synonyms

encryption, confidentiality, authorization, truth, correctness, reputation. *(Integrity proves content is unaltered and attributable — not that it is secret, permitted, or true.)*

## Canonical Vocabulary

Use: **Evidence Integrity**, **JCS (RFC 8785)**, **canonical form**, **HMAC**, **recompute**, **constant-time comparison**, **idempotent emission**, **non-ASCII conformance**, **unaltered / attributable**. Avoid: *hash the JSON*, *trust the supplied digest*, *equality check* (for digests), *integrity = true*.

## Cross References

OCR-100 World Skills Protocol · OCR-105 Trust · OCR-107 Verification · OCR-110 Evidence · OCR-111 Evidence Source · OCR-114 Immutable Fact.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-113 v0.1 skeleton. Algorithm identifiers and canonical form pending diff against the production emitter and verifier before promotion to Normative.
