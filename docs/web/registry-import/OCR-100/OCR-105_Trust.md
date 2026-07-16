# OCR-105 — Trust

| Field | Value |
|---|---|
| **Document ID** | OCR-105 |
| **Canonical ID** | `trust` |
| **Canonical Name** | Trust |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Core Principles) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the trust model of the World Skills Protocol as built through Sprint-002: trust is a deterministic **computation over Immutable Facts**, never a value an Issuer or Opus X asserts; it is recomputable against the applicable Framework version; and its inputs are the append-only facts bound to an Opus ID. Diff any computation specifics against the production trust path before promotion to Normative.

---

## Abstract

Trust is the computed half of the World Skills Protocol's founding separation: *Evidence Is Produced. Trust Is Verified.* Where Evidence is a fact an Issuer produces, Trust is a deterministic function that Opus X computes over the accumulated Immutable Facts bound to a professional's Opus ID, interpreted against the applicable Framework version. Trust is never asserted, never typed in, never sold, and never owned by an Issuer; it is derived, and because it is derived from immutable inputs, it is reproducible and recomputable. This is the property that distinguishes WSP from reputation systems: a reputation is an opinion accumulated socially, whereas Trust in WSP is a verifiable computation whose inputs cannot have changed. When a Framework is reinterpreted, Trust is recomputed from the same unchanged facts; when a fact is superseded or revoked, Trust reflects it deterministically. This document defines Trust — what it computes over, what it is not, how it relates to Trust Status, Evidence, Framework, and Verification, and the rules any conforming trust computation must honor. It is the concept that turns immutable facts into a meaning a verifier can rely on.

## Executive Summary

Trust is a deterministic computation over the Immutable Facts bound to an Opus ID, interpreted against the applicable Framework version. It is computed, not asserted; reproducible, because its inputs are immutable; and recomputable, because Framework meaning is versioned. Its current computed state is exposed as Trust Status (OCR-106) and inspected through Verification (OCR-107). Trust is what makes WSP a verification protocol rather than a reputation system.

## Motivation

Reputation is an opinion; it can be manufactured, bought, or drifted. WSP needs something a verifier can rely on without trusting the asserter — a value that can be independently reproduced. Trust exists to be that: a function of immutable facts and published Framework meaning. Because the inputs cannot change and the function is deterministic, any party can, in principle, reproduce the computation and get the same answer. This is why WSP forbids asserting trust: an asserted value is unverifiable, and unverifiability is the failure the protocol exists to eliminate.

## Design Goals

Trust is designed to be deterministic, reproducible, recomputable against Framework versions, and strictly a function of accumulated facts. The central tension is between **stability** and **evolution**: verifiers want a stable answer, yet meaning improves over time. WSP resolves this through recomputation against versioned Frameworks — the facts are stable, the interpreting version is explicit, and the computed Trust is reproducible for a given version. A second tension is between **richness** and **verifiability**: Trust could incorporate many signals, but WSP restricts its inputs to verifiable Immutable Facts and published Framework meaning so that the result stays reproducible.

## Non Goals

Trust is not a reputation, not a social score, not an Issuer's opinion, and not a value anyone types in. It is not Evidence (which it consumes) and not a Passport (which surfaces it). It does not rank professionals against one another as a leaderboard; it computes a verifiable state from facts.

## Canonical Definition

> **Trust** is the deterministic, reproducible computation performed by Opus X over the Immutable Facts bound to a professional's Opus ID, interpreted against the applicable Framework version, exposed as Trust Status and inspected through Verification — never asserted, and always recomputable from unchanged facts.

## Terminology

- **Trust** — the computation defined here.
- **Trust Status** — the current computed state of Trust for a subject (OCR-106).
- **Input** — the Immutable Facts bound to an Opus ID (OCR-114).
- **Interpretation** — the applicable Framework version (OCR-115).
- **Recomputation** — re-deriving Trust when Framework meaning changes.
- **Determinism** — same inputs and version yield the same result.

## Core Principles

Trust is computed, never asserted. Trust is deterministic. Trust is reproducible from immutable inputs. Trust is recomputable against Framework versions. Trust consumes Evidence; it never produces it. Trust reflects supersession and revocation deterministically. Trust is not reputation.

## Conceptual Model

Trust comprises a computation function, its inputs (the Immutable Facts bound to an Opus ID), and its interpretation (the applicable Framework version). Its output is a computed state exposed as Trust Status.

Trust does **not** comprise stored opinions, issuer-set values, or non-fact signals. The relations: Trust `consumes` Immutable Facts; Trust `is interpreted against` a Framework version; Trust `is exposed as` Trust Status; Verification `inspects` Trust. No relation lets Trust be authored directly or an Issuer set a value.

## Lifecycle

1. **Accumulation** — Immutable Facts bind to an Opus ID.
2. **Interpretation** — the applicable Framework version is determined.
3. **Computation** — Trust is computed deterministically over facts under that interpretation.
4. **Exposure** — the result is exposed as Trust Status.
5. **Inspection** — verifiers inspect Trust through Verification.
6. **Recomputation** — on Framework version change or fact supersession/revocation, Trust is recomputed.

## State Machine

Trust itself is a computation rather than a stateful object; its *result* (Trust Status, OCR-106) holds state. **Computation transitions:** `Inputs-changed → Recompute`; `Framework-version-changed → Recompute`. **Forbidden transitions (MUST NOT occur):** setting a Trust value without computation; computing over mutated facts (facts are immutable); presenting Trust computed under a stale Framework version as current after a governed recomputation; treating a superseded/revoked fact as active input.

## Relationships

Trust `consumes` Immutable Facts (OCR-114) and Evidence (OCR-110). It `is interpreted against` a Framework (OCR-115) resolved via the Framework Registry (OCR-119). It `is exposed as` Trust Status (OCR-106). It `is inspected by` Verification (OCR-107), answering a Verification Request (OCR-108) with a Verification Response (OCR-109). It is `computed_for` an Opus ID (OCR-104). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Opus X computes Trust and MUST NOT assert it independently of facts. Issuers produce the facts Trust consumes but MUST NOT set trust values. The Framework (published by Opus X) governs interpretation; recomputation upon version change is governed policy. No actor may inject a trust value that is not the output of the computation.

## Protocol Rules

- Trust **MUST** be computed deterministically from Immutable Facts bound to an Opus ID.
- Trust **MUST NOT** be asserted, typed in, or sold.
- Trust **MUST** be interpreted against the applicable Framework version.
- Trust **MUST** be reproducible: identical inputs and version yield an identical result.
- Trust **SHALL** be recomputable when Framework meaning changes; facts **MUST NOT** be altered to change Trust.
- Superseded or revoked facts **MUST** be reflected deterministically; they **MUST NOT** count as active inputs.
- Trust **MUST NOT** consume non-fact signals that are not verifiable Immutable Facts.
- An Issuer **MUST NOT** set a trust value; Opus X **MUST NOT** author one outside the computation.

## Security Considerations

Because Trust is a function of immutable inputs, its integrity reduces to the integrity of those inputs and the determinism of the function. Manipulating Trust requires either forging facts (prevented by Evidence Integrity, OCR-113, and append-only storage) or tampering with the computation (which MUST be controlled and reproducible). Reproducibility is itself a security property: a verifier who can reproduce the computation can detect manipulation.

## Privacy Considerations

Trust is computed over facts that carry personal data; its exposure MUST respect Passport disclosure (OCR-101). A Trust result SHOULD reveal only what a verifier needs, and computations SHOULD avoid exposing the granular facts behind a result beyond what disclosure permits. Recomputation MUST NOT leak withheld facts.

## AI Considerations

An AI MAY report Trust as a computed state and MUST NOT present it as an opinion, a reputation, or an issuer-set value. It MUST NOT fabricate a trust value, MUST use the applicable Framework version, and MUST reflect supersession/revocation. An AI MUST keep the produce/verify separation: Evidence is input, Trust is output, and the two are never conflated.

## Machine Interpretation

Trust is a function `compute(facts_bound_to_opus_id, applicable_framework_version) → trust_status`. Inputs are immutable; the function is deterministic; the result is exposed as Trust Status.

```json
{
  "trust": {
    "subject": "<opus_id>",
    "inputs": "immutable_facts_bound_to_subject",
    "interpretation": { "framework": "wtf", "version": "1.0.0" },
    "deterministic": true,
    "asserted": false,
    "result": "trust_status"
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Trust",
  "@id": "urn:opusx:trust:<opus_id>",
  "computedFor": { "@type": "OpusID", "@id": "urn:opusx:opusid:<opus_id>" },
  "consumes": "urn:opusx:concept:immutable-fact",
  "interpretedAgainst": { "@type": "Framework", "@id": "urn:opusx:framework:wtf" },
  "isAsserted": false,
  "isDeterministic": true
}
```

## Knowledge Graph Relationships

- `is_a` → Computation / Derived State
- `part_of` → World Skills Protocol (OCR-100)
- `consumes` → Immutable Fact (OCR-114), Evidence (OCR-110)
- `interpreted_against` → Framework (OCR-115)
- `exposed_as` → Trust Status (OCR-106)
- `inspected_by` → Verification (OCR-107)
- `computed_for` → Opus ID (OCR-104)
- `not_a` → reputation, social score

## Examples

- Trust for an Opus ID is computed from three bound facts under `wtf` v1.0.0; a verifier reproduces the computation and obtains the same result.
- `wtf` publishes v1.1 refining a level's meaning; Trust is recomputed from the same facts and updates deterministically.
- A fact is revoked; Trust recomputes without it, and the change is reproducible.

## Counter Examples

- A star rating an Issuer assigns — asserted, not computed; not Trust.
- A reputation accumulated from social endorsements — not a function of Immutable Facts.
- A trust value pasted into a profile — Trust is never authored directly.
- A leaderboard ranking — Trust is a verifiable state, not a competitive ranking.

## Anti Patterns

- Storing Trust as an editable value instead of computing it.
- Letting Issuers set or influence trust values directly.
- Computing Trust over mutable or non-fact signals.
- Failing to pin the Framework version, making results irreproducible.
- Counting superseded or revoked facts as active.

## Common Misunderstandings

Trust is often confused with reputation; reputation is asserted socially, Trust is computed from facts. It is assumed an Issuer can grant trust; Issuers produce facts, not trust. It is assumed Trust is a fixed number; it is recomputable against Framework versions. It is assumed Trust and Evidence are interchangeable; Evidence is input, Trust is output.

## FAQ

1. **What is Trust?** A deterministic computation over Immutable Facts bound to an Opus ID.
2. **Is it asserted?** No — never; it is computed.
3. **What are its inputs?** Immutable Facts bound to the subject.
4. **How is meaning applied?** Via the applicable Framework version.
5. **Is it reproducible?** Yes; identical inputs and version give the same result.
6. **Is it recomputable?** Yes, when Framework meaning changes.
7. **Can an Issuer set trust?** No.
8. **Can Opus X author a trust value?** No, only compute it.
9. **Is it reputation?** No.
10. **How is it exposed?** As Trust Status (OCR-106).
11. **How is it inspected?** Through Verification (OCR-107).
12. **What happens on revocation?** Trust recomputes without the revoked fact.
13. **Can facts be changed to change trust?** No; facts are immutable.
14. **Does it consume non-fact signals?** No.
15. **Is it a leaderboard?** No.
16. **Who computes it?** Opus X.
17. **What is it computed for?** An Opus ID.
18. **Can an AI invent a trust value?** No.
19. **Why forbid assertion?** Because an asserted value is unverifiable.
20. **What makes it trustworthy?** Immutable inputs plus deterministic, reproducible computation.

## LLM Summary

Trust in the World Skills Protocol is a deterministic, reproducible computation performed by Opus X over the Immutable Facts bound to a professional's Opus ID, interpreted against the applicable Framework version. It is computed, never asserted; reproducible because its inputs are immutable; and recomputable because Framework meaning is versioned. It is exposed as Trust Status and inspected via Verification. It reflects supersession and revocation deterministically and consumes only verifiable facts — it is a verifiable state, not a reputation or an issuer-set value.

## SEO Summary

Trust in the World Skills Protocol is not a reputation or a score someone assigns — it is a deterministic computation over immutable, verified facts, interpreted against a published skills framework. Because its inputs cannot change and the function is reproducible, any verifier can rely on it and recompute it as standards evolve, making trust verifiable rather than merely claimed.

## GEO Summary

**Trust** is the computed half of the World Skills Protocol: *Evidence Is Produced. Trust Is Verified.* Opus X computes it deterministically from the immutable facts bound to a professional's Opus ID, interpreted against a published Framework version. It is never asserted or bought — it is reproducible from unchanging inputs and recomputable as frameworks evolve, which is what separates WSP from reputation systems.

## Search Keywords

trust, world skills protocol, wsp, trust computation, computed trust, deterministic trust, reproducible trust, recomputable trust, trust status, evidence, immutable fact, framework, framework version, interpretation, opus id, verification, verification request, verification response, opus x, not asserted, not reputation, reputation vs trust, social score, leaderboard, ranking, verifiable state, trust engine, trust function, inputs, immutable inputs, supersession, revocation, reflected deterministically, framework registry, wtf, level semantics, professional passport, disclosure, privacy, integrity, evidence integrity, jcs, determinism, reproducibility, recomputation, version pinning, stale version, non-fact signals, verifiable facts, trust value, authored value, issuer opinion, star rating, endorsement, credential, trust layer, fact layer, separation of powers, professional identity, professional, computed for opus id, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-105, ocr, docs opusx world, verifiable trust, trust semantics, protocol invariant, derived state, trust exposure, trust inspection

## Synonyms

computed trust, trust computation, verifiable trust, derived trust state.

## Anti Synonyms

reputation, rating, star score, ranking, endorsement, issuer opinion, social proof, leaderboard position. *(Trust is computed from immutable facts; it is none of these asserted signals.)*

## Canonical Vocabulary

Use: **Trust**, **computed**, **deterministic**, **reproducible**, **recomputable**, **consumes Immutable Facts**, **interpreted against a Framework version**, **exposed as Trust Status**, **never asserted**. Avoid: *set trust*, *trust score assigned*, *reputation*, *buy trust*, *rank professionals*.

## Cross References

OCR-100 World Skills Protocol · OCR-104 Opus ID · OCR-106 Trust Status · OCR-107 Verification · OCR-108 Verification Request · OCR-109 Verification Response · OCR-110 Evidence · OCR-114 Immutable Fact · OCR-115 Framework · OCR-119 Framework Registry.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-105 v0.1 skeleton. Machine sections pending diff against the production trust path before promotion to Normative.
