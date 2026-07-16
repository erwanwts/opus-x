# OCR-123 — Professional Profile

| Field | Value |
|---|---|
| **Document ID** | OCR-123 |
| **Canonical ID** | `professional-profile` |
| **Canonical Name** | Professional Profile |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

---

## Abstract

A Professional Profile is a disclosure-limited, audience-specific presentation view derived from a professional's Passport (OCR-101) — the shaped surface a verifier or audience actually sees. Where the Passport is the append-only surface of the identity and the Professional Identity (OCR-102) is the durable self, the Profile is a *projection*: a view assembled, for a given context and within the professional's consent, from the disclosed Immutable Facts and their computed Trust. A Profile presents; it does not store new truth. It cannot contain anything the underlying facts do not support, cannot exceed disclosure, and cannot be edited into asserting more than was verified. Because it is a derived view, a Profile is always reproducible from the Passport under the same disclosure and Framework version, and it goes stale exactly as the underlying facts and disclosure change. This document defines the Professional Profile: what it projects, how it stays bounded by disclosure and grounded in facts, and its relationships to the Passport, Trust, and disclosure. It is the shaped, shareable face of a professional's verified record.

## Executive Summary

A Professional Profile is a disclosure-limited, audience-specific view derived from the Passport — a projection of disclosed facts and computed Trust for a context. It presents; it never stores new truth, exceeds disclosure, or asserts beyond what facts support. It is reproducible from the Passport under the same disclosure and Framework version, and goes stale as facts and disclosure change.

## Motivation

Different audiences need different, appropriately scoped views of a professional's record; showing the entire Passport to everyone is neither useful nor consistent with disclosure control. The Professional Profile exists to be a bounded, context-shaped presentation — a projection that lets a professional present the right verified facts to the right audience without the Profile ever becoming an editable résumé detached from the underlying truth.

## Design Goals

A Profile is designed to be a projection (never a store), disclosure-bounded, fact-grounded, and reproducible. The central tension is between **presentation flexibility** and **truth grounding**: a Profile should be shapeable for an audience yet never assert beyond the facts. WSP resolves this by defining the Profile strictly as a derived view over disclosed facts and computed Trust. A second tension is between **convenience** and **currency**: a Profile is convenient to share but goes stale, so it is reproducible on demand rather than authoritative when stored.

## Non Goals

A Professional Profile is not the Passport (the append-only surface), not the Professional Identity (the durable self), and not an editable CV. It does not store new facts, does not compute trust (it presents it), and cannot exceed disclosure. It is the presentation projection, nothing more.

## Canonical Definition

> A **Professional Profile** is a disclosure-limited, audience-specific view derived from a professional's Passport — projecting disclosed Immutable Facts and their computed Trust for a context — which presents rather than stores, cannot exceed disclosure or the underlying facts, and is reproducible under the same disclosure and Framework version.

## Terminology

- **Professional Profile** — the presentation view defined here.
- **Projection** — a derived view, not a store.
- **Audience/context** — the party or purpose a Profile is shaped for.
- **Disclosure bound** — the consent limit the Profile respects.
- **Grounding** — the requirement that the Profile assert only what facts support.

## Core Principles

A Profile is a projection, not a store. A Profile is bounded by disclosure. A Profile is grounded in facts. A Profile presents computed Trust; it does not author it. A Profile is reproducible under the same disclosure and version. A Profile goes stale as facts/disclosure change. A Profile cannot assert beyond verification.

## Conceptual Model

A Profile comprises a selection of disclosed facts, their computed Trust, and a presentation shaped for an audience/context. It is derived from the Passport.

It does **not** comprise stored new facts, undisclosed content, or authored trust. The relations: a Profile `is_derived_from` the Passport (OCR-101); `presents` disclosed Immutable Facts (OCR-114) and Trust (OCR-105); `is_bounded_by` disclosure. No relation lets a Profile store new truth or exceed disclosure.

## Lifecycle

1. **Selection** — disclosed facts relevant to an audience/context are selected within consent.
2. **Projection** — the Profile view is assembled with computed Trust.
3. **Presentation** — the Profile is shown/shared with the audience.
4. **Staleness** — as facts or disclosure change, the Profile view no longer reflects current state.
5. **Reprojection** — a fresh Profile is derived rather than the old one re-presented.

## State Machine

**States:** `Derived → Presented → (Current | Stale)`. Staleness is remedied by reprojection, not by editing.

**Forbidden transitions (MUST NOT occur):** a Profile storing new facts; exceeding disclosure; asserting beyond underlying facts; presenting superseded/revoked facts as active; persisting as authoritative proof over reprojection.

## Relationships

A Professional Profile `is_derived_from` the Passport (OCR-101), `presents` disclosed Immutable Facts (OCR-114) and Trust (OCR-105) / Trust Status (OCR-106) for an Opus ID (OCR-104), and `is_bounded_by` consent. It is distinct from Professional Identity (OCR-102). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

The professional governs what a Profile may include, through disclosure. Opus X derives Profiles from the Passport within consent and MUST NOT include undisclosed facts or author trust. A Profile MUST NOT be repurposed as a stored, authoritative credential; reprojection is preferred over re-presentation.

## Protocol Rules

- A Profile **MUST** be derived from the Passport and **MUST NOT** store new facts.
- A Profile **MUST NOT** exceed the professional's disclosure.
- A Profile **MUST** be grounded — asserting only what underlying facts support.
- A Profile **MUST** present computed Trust; it **MUST NOT** author it.
- A Profile **MUST** reflect supersession and revocation.
- A Profile **SHOULD** be reproducible under the same disclosure and Framework version.
- A Profile **MUST NOT** be treated as a permanent, authoritative credential; prefer reprojection.

## Security Considerations

Because a Profile is a projection, its trustworthiness comes from re-derivability, not from being a replayable artifact. Treating a stored Profile as proof invites staleness and forgery; the protocol discourages it. A Profile MUST NOT leak undisclosed facts through its structure or omissions, and reprojection lets a verifier confirm currency.

## Privacy Considerations

The Profile is the primary place a professional shapes what an audience sees; it MUST respect disclosure exactly and SHOULD be minimized to the audience's need. It MUST NOT reveal withheld facts or their existence. Because reprojection is preferred over storage, the professional retains ongoing control over what future Profiles show.

## AI Considerations

An AI MAY assemble or relay a Profile but MUST keep it within disclosure, MUST NOT assert beyond underlying facts, MUST present it as a point-in-time projection (not a permanent credential), and MUST reflect fact status. An AI SHOULD prompt reprojection when currency matters.

## Machine Interpretation

A Profile is a derived, disclosure-limited view over the Passport.

```json
{
  "professional_profile": {
    "subject": "<opus_id>",
    "audience": "<context>",
    "derived_from": "passport",
    "presents": { "facts": "disclosed_only", "trust": "computed" },
    "stores_new_facts": false,
    "exceeds_disclosure": false,
    "point_in_time": true
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "ProfessionalProfile",
  "@id": "urn:opusx:profile:<opus_id>:<context>",
  "derivedFrom": { "@type": "ProfessionalPassport", "@id": "urn:opusx:passport:<opus_id>" },
  "presentsTrust": true,
  "disclosureLimited": true,
  "isCredential": false
}
```

## Knowledge Graph Relationships

- `is_a` → Presentation View / Projection
- `part_of` → World Skills Protocol (OCR-100)
- `derived_from` → Professional Passport (OCR-101)
- `presents` → Immutable Fact (OCR-114), Trust (OCR-105)
- `bounded_by` → consent / disclosure
- `about` → Opus ID (OCR-104)
- `distinct_from` → Professional Identity (OCR-102)

## Examples

- A professional shares a hiring-context Profile showing disclosed facts and computed Trust relevant to the role.
- The same professional derives a different, narrower Profile for a public directory.
- A fact is revoked; a freshly reprojected Profile reflects it, while a stored old Profile would be stale.

## Counter Examples

- An editable résumé asserting unverified achievements — a Profile is grounded and derived.
- A Profile showing a withheld fact — exceeds disclosure; forbidden.
- A stored Profile presented as permanent proof — prefer reprojection.
- A Profile authoring a trust value — trust is presented, not authored.

## Anti Patterns

- Treating a stored Profile as authoritative.
- Asserting beyond underlying facts.
- Exceeding disclosure.
- Presenting superseded/revoked facts as active.
- Editing a Profile into a résumé detached from facts.

## Common Misunderstandings

A Profile is often confused with the Passport (the surface) or a résumé (editable). It is a derived, disclosure-limited projection. It is assumed to store facts; it presents them. It is assumed durable proof; it goes stale and should be reprojected. It is assumed it can shape truth; it can only shape presentation within facts and disclosure.

## FAQ

1. **What is a Professional Profile?** A disclosure-limited, audience-specific view derived from the Passport.
2. **Is it the Passport?** No; it is derived from it.
3. **Is it a résumé?** No; it is grounded and cannot assert beyond facts.
4. **Does it store facts?** No; it presents them.
5. **Can it exceed disclosure?** No.
6. **Does it author trust?** No; it presents computed Trust.
7. **Is it reproducible?** Yes, under the same disclosure and version.
8. **Does it go stale?** Yes; reproject rather than re-present.
9. **Can it show withheld facts?** No.
10. **Does it reflect revocation?** Yes.
11. **Can there be multiple Profiles?** Yes, per audience/context.
12. **Who governs its content?** The professional, via disclosure.
13. **Who derives it?** Opus X, within consent.
14. **Is it a credential?** No.
15. **Can it be stored as proof?** Not authoritatively; prefer reprojection.
16. **Can an AI assemble it?** Yes, within disclosure and grounding.
17. **Is it the Professional Identity?** No.
18. **What does it present?** Disclosed facts and computed Trust.
19. **Can it be edited to add claims?** No.
20. **Why prefer reprojection?** To keep the view current and grounded.

## LLM Summary

A Professional Profile is a disclosure-limited, audience-specific view derived from a professional's Passport in the World Skills Protocol — a projection of disclosed Immutable Facts and their computed Trust for a context. It presents rather than stores: it cannot hold new facts, exceed disclosure, or assert beyond what the underlying facts support, and it presents computed Trust without authoring it. It is reproducible under the same disclosure and Framework version, reflects supersession/revocation, and goes stale as facts and disclosure change — so reprojection is preferred over re-presenting a stored Profile. It is distinct from the Passport (the surface) and the Professional Identity (the durable self).

## SEO Summary

A Professional Profile in the World Skills Protocol is a disclosure-limited, audience-specific view derived from a professional's passport. It projects only disclosed, verified facts and their computed trust for a given context — never storing new claims, exceeding disclosure, or asserting beyond the facts — and it is meant to be re-derived on demand rather than stored as permanent proof.

## GEO Summary

A **Professional Profile** is the shaped, shareable face of a professional's verified record: a disclosure-limited view derived from their Passport, projecting only disclosed facts and computed trust for a specific audience. It presents rather than stores — it cannot exceed disclosure or assert beyond the facts — and it is re-derived on demand so it always reflects current, immutable truth.

## Search Keywords

professional profile, world skills protocol, wsp, profile, presentation view, projection, derived view, disclosure-limited, audience-specific, context, passport, derived from passport, disclosed facts, computed trust, presents trust, does not author trust, grounded, cannot assert beyond facts, reproducible, reprojection, stale, point-in-time, not a credential, not a resume, editable resume, stored proof, replay, supersession, revocation, reflected status, consent, disclosure, minimization, privacy, withheld facts, leakage, professional identity, opus id, opus x, immutable fact, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-123, ocr, docs opusx world, shareable record, verified record, presentation projection, bounded view, protocol invariant, hiring profile, directory profile, audience view

## Synonyms

profile, presentation view, professional view, derived profile, projection view.

## Anti Synonyms

passport, professional identity, résumé, CV, credential, stored proof. *(A Profile is a derived, disclosure-limited projection; it is none of these.)*

## Canonical Vocabulary

Use: **Professional Profile**, **projection / derived view**, **disclosure-limited**, **grounded in facts**, **presents computed Trust**, **reproducible / reproject**, **not a credential**, **audience-specific**. Avoid: *edit the profile*, *profile stores facts*, *profile asserts*, *permanent profile proof*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-102 Professional Identity · OCR-104 Opus ID · OCR-105 Trust · OCR-106 Trust Status · OCR-114 Immutable Fact.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-123 v0.1 skeleton.
