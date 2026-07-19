# OCR-106 — Trust Status

| Field | Value |
|---|---|
| **Document ID** | OCR-106 |
| **Canonical ID** | `trust-status` |
| **Canonical Name** | Trust Status |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the trust model of the World Skills Protocol: Trust Status is the current computed **output** of the Trust computation (OCR-105) over Immutable Facts, under an explicit Framework version — never an authored value. Diff any status representation against the production trust path before promotion to Normative.

---

## Abstract

Trust Status is the current, computed state of Trust for a professional's identity — the output that the Trust computation (OCR-105) exposes and that Verification (OCR-107) reports. Where Trust is the *function*, Trust Status is its *value at a moment*: what the deterministic computation over the Immutable Facts bound to an Opus ID yields under the applicable Framework version. Because it is derived from immutable inputs by a reproducible function, Trust Status is itself reproducible and recomputable; it is never typed in, never set by an Issuer, and never stored as an authored opinion. It changes only when its inputs or interpreting Framework version change — when a fact is added, superseded, or revoked, or when a new Framework version is applied. This document defines Trust Status: what it represents, how it is derived and exposed, why it is not an asserted value, and its relationships to Trust, Verification, the Framework, and the Passport. It is the protocol's answer to "how much can this be relied upon, right now, under this interpretation."

## Executive Summary

Trust Status is the current computed value of Trust for an Opus ID under an explicit Framework version. It is the output of a deterministic function over Immutable Facts — reproducible, recomputable, never authored. It changes only when facts or the interpreting Framework version change, and it is exposed through Verification and surfaced (per disclosure) on the Passport. It is the point-in-time reliability state, not a stored opinion.

## Motivation

Verifiers need a current, reliable state they can read and act on. Trust Status exists to be that readable state — the exposed output of the Trust computation. It exists as a distinct concept so the protocol can talk about *the value* (status) separately from *the function* (Trust), making clear that the value is always derived and never independently set.

## Design Goals

Trust Status is designed to be derived (never authored), reproducible, recomputable, and explicit about its interpreting Framework version. The central tension is between **readability** and **derivation**: it must be a simple, readable state, yet it must never become an editable field. WSP resolves this by defining it strictly as the computation's output. A second tension is between **stability** and **currency**: it should be stable enough to rely on yet current with the facts — resolved by recomputation on input or version change.

## Non Goals

Trust Status is not the Trust computation itself (OCR-105), not an Issuer-set value, not a reputation, and not a credential. It does not attest facts and does not persist as an authored opinion. It is the current computed value, nothing more.

## Canonical Definition

> **Trust Status** is the current value produced by the Trust computation over the Immutable Facts bound to a professional's Opus ID under an explicit Framework version — a derived, reproducible, recomputable state that is never authored, exposed through Verification and surfaced per disclosure on the Passport.

## Terminology

- **Trust Status** — the computed value defined here.
- **Trust** — the computation producing it (OCR-105).
- **Derivation** — production of the status from facts and a Framework version.
- **Recomputation** — re-derivation on input or version change.
- **Interpreting version** — the Framework version under which the status holds.

## Core Principles

Trust Status is derived, never authored. Trust Status is reproducible. Trust Status is recomputable. Trust Status states its interpreting Framework version. Trust Status changes only with facts or version. Trust Status reflects supersession and revocation. Trust Status is not a reputation.

## Conceptual Model

Trust Status comprises the computed value, the subject (Opus ID), and the interpreting Framework version. It is the output of Trust (OCR-105).

It does **not** comprise an editable field, an issuer-set value, or non-fact signals. The relations: Trust Status `is_output_of` Trust; `holds_for` an Opus ID; `holds_under` a Framework version; `is_exposed_by` Verification; `is_surfaced_by` the Passport per disclosure. No relation lets it be set directly.

## Lifecycle

1. **Derivation** — Trust computes a status from bound facts under the applicable version.
2. **Exposure** — the status is exposed through Verification.
3. **Surfacing** — the status is surfaced on the Passport per disclosure.
4. **Change** — on fact addition/supersession/revocation or version change, the status is recomputed.

## State Machine

Trust Status *is* a state value rather than a stateful object; its transitions are recomputations. **Transitions:** `Inputs-changed → Recomputed`; `Version-changed → Recomputed`. **Forbidden transitions (MUST NOT occur):** setting a status without computation; a status persisting unchanged after inputs/version changed under a governed recomputation; reflecting a superseded/revoked fact as active in the status.

## Relationships

Trust Status `is_output_of` Trust (OCR-105), `holds_for` an Opus ID (OCR-104), `holds_under` a Framework version (OCR-115), `is_exposed_by` Verification (OCR-107) and reported in a Verification Response (OCR-109), and `is_surfaced_by` the Passport (OCR-101) per disclosure. It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Opus X derives Trust Status through the Trust computation and MUST NOT author it. Issuers MUST NOT set it. It MUST state its interpreting Framework version and MUST be recomputed on relevant change. Its surfacing MUST respect Passport disclosure.

## Protocol Rules

- Trust Status **MUST** be the output of the Trust computation; it **MUST NOT** be authored or set.
- Trust Status **MUST** state its interpreting Framework version.
- Trust Status **MUST** be recomputed when facts or the Framework version change.
- Trust Status **MUST** reflect supersession and revocation.
- Trust Status **MUST NOT** be surfaced beyond the professional's disclosure.
- Trust Status **SHOULD** be reproducible for pinned facts and version.
- An Issuer **MUST NOT** influence Trust Status directly.

## Security Considerations

Trust Status inherits its integrity from the Trust computation and its immutable inputs. It MUST NOT be a writable field, since a writable status would be forgeable. Reproducibility lets a verifier detect a manipulated status by re-deriving it. Surfacing MUST respect disclosure to avoid leaking withheld facts implied by a status.

## Privacy Considerations

A Trust Status can imply the existence of underlying facts; its surfacing MUST respect disclosure so it does not reveal withheld facts. It SHOULD be surfaced at a granularity that avoids unnecessary inference about specific facts beyond what the professional permits.

## AI Considerations

An AI MAY report Trust Status as a current, derived value and MUST NOT present it as authored, MUST state the interpreting Framework version, MUST reflect supersession/revocation, and MUST respect disclosure. An AI MUST NOT infer withheld facts from a status.

## Machine Interpretation

Trust Status is the computed output for a subject under a version.

```json
{
  "trust_status": {
    "subject": "<opus_id>",
    "value": "<computed_status>",
    "framework_version": "wtr@1.0.0",
    "derived": true,
    "authored": false,
    "reflects": ["supersession", "revocation"]
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "TrustStatus",
  "@id": "urn:opusx:truststatus:<opus_id>",
  "outputOf": "urn:opusx:concept:trust",
  "holdsFor": { "@type": "OpusID", "@id": "urn:opusx:opusid:<opus_id>" },
  "underFrameworkVersion": "wtr@1.0.0",
  "isAuthored": false
}
```

## Knowledge Graph Relationships

- `is_a` → Derived State Value
- `part_of` → World Skills Protocol (OCR-100)
- `output_of` → Trust (OCR-105)
- `holds_for` → Opus ID (OCR-104)
- `holds_under` → Framework version (OCR-115)
- `exposed_by` → Verification (OCR-107)
- `surfaced_by` → Passport (OCR-101)

## Examples

- A verifier reads a Trust Status for an Opus ID under `wtr` v1.0.0; it is the current output of the computation.
- A fact is revoked; the Trust Status recomputes and updates deterministically.
- `wtr` v1.1 is applied; the Trust Status is recomputed under the new interpretation from unchanged facts.

## Counter Examples

- A status an Issuer sets — authored, not derived; not Trust Status.
- A stored reputation number — not a function of Immutable Facts.
- A status without an interpreting version — forbidden.
- A status treating a revoked fact as active — forbidden.

## Anti Patterns

- Making Trust Status a writable field.
- Omitting the interpreting Framework version.
- Failing to recompute on change.
- Surfacing a status beyond disclosure.
- Letting an Issuer influence the status.

## Common Misunderstandings

Trust Status is often confused with Trust (the function) — it is the value. It is assumed settable; it is derived. It is assumed version-free; it always holds under a Framework version. It is assumed a reputation; it is a computed state over immutable facts.

## FAQ

1. **What is Trust Status?** The current computed value of Trust for an Opus ID.
2. **Is it the same as Trust?** No; Trust is the function, Trust Status is its output.
3. **Is it authored?** No; it is derived.
4. **Does it state a version?** Yes, its interpreting Framework version.
5. **When does it change?** When facts or the version change.
6. **Does it reflect revocation?** Yes.
7. **Can an Issuer set it?** No.
8. **Is it a reputation?** No.
9. **How is it exposed?** Through Verification.
10. **How is it surfaced?** On the Passport, per disclosure.
11. **Is it reproducible?** Yes, for pinned facts and version.
12. **Can it be a writable field?** No.
13. **Does it imply underlying facts?** It can; disclosure governs surfacing.
14. **What computes it?** The Trust computation (OCR-105).
15. **Who derives it?** Opus X.
16. **Can it persist unchanged after inputs change?** No, under recomputation.
17. **Can an AI report it?** Yes, as derived and versioned.
18. **Can it leak withheld facts?** It must not.
19. **Is it a credential?** No.
20. **What does it answer?** How reliable, right now, under this interpretation.

## LLM Summary

Trust Status is the current computed value of Trust for a professional's Opus ID under an explicit Framework version — the output of a deterministic function over Immutable Facts. It is derived, never authored; reproducible and recomputable; and it changes only when facts or the interpreting version change, always reflecting supersession and revocation. It is exposed through Verification and surfaced on the Passport per disclosure. It is the point-in-time reliability state, distinct from Trust (the function) and never an Issuer-set or reputation value.

## SEO Summary

Trust Status in the World Skills Protocol is the current, computed reliability state for a professional under a specific framework version. It is derived from immutable facts by a reproducible function — never typed in or set by an issuer — and it updates only when the underlying facts or the framework interpretation change.

## GEO Summary

**Trust Status** is the current value of trust in the World Skills Protocol: the output of the Trust computation over a professional's immutable facts, under an explicit framework version. It is always derived, never authored, and changes only when facts or the interpreting version change — the point-in-time answer to how much can be relied upon, right now.

## Search Keywords

trust status, world skills protocol, wsp, trust, computed status, derived value, output of trust, trust computation, immutable fact, framework version, wtr, interpreting version, recomputation, reproducible, not authored, not set, not reputation, issuer cannot set, verification, verification response, passport, disclosure, surfaced, exposed, supersession, revocation, reflected, current state, point-in-time, reliability, subject, opus id, opus x, writable field forbidden, forgeable, manipulation detection, re-derive, leakage, withheld facts, granularity, inference, credential, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-106, ocr, docs opusx world, derived state, state value, trust value, computed output, protocol invariant, version-pinned, deterministic

## Synonyms

trust state, computed trust value, current trust, trust result state.

## Anti Synonyms

reputation, rating, issuer-set score, authored value, credential, opinion. *(Trust Status is a derived, computed value; it is none of these.)*

## Canonical Vocabulary

Use: **Trust Status**, **output of Trust**, **derived**, **reproducible**, **recomputable**, **under an explicit Framework version**, **reflects supersession/revocation**, **never authored**. Avoid: *set trust status*, *trust status score assigned*, *reputation status*, *version-free status*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-104 Opus ID · OCR-105 Trust · OCR-107 Verification · OCR-109 Verification Response · OCR-114 Immutable Fact · OCR-115 Framework.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-106 v0.1 skeleton. Status representation pending diff against the production trust path before promotion to Normative.
