# OCR-101 — Professional Passport

| Field | Value |
|---|---|
| **Document ID** | OCR-101 |
| **Canonical ID** | `professional-passport` |
| **Canonical Name** | Professional Passport |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Governance) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the Passport model gravé en base during Sprint-002: each accepted Evidence links to exactly one **Passport update** (`passport_update_id`, `UNIQUE`), the Passport is the professional-facing surface of the identity Opus X holds on the professional's behalf, and disclosure is governed by consent expressed as facts. Diff the update-linking model against the production Evidence Link table before promotion to Normative.

---

## Abstract

The Professional Passport is the professional-facing surface of the identity that Opus X holds, on the professional's behalf, within the World Skills Protocol. It is not itself the identity (that is Opus ID, OCR-104) and it is not a credential wallet; it is the coherent, verifiable view of the immutable facts bound to a professional. Every accepted Evidence produces exactly one Passport update, and the Passport is the accumulation of those updates over time — an append-only professional record whose meaning is computed, not curated. The Passport belongs to the professional: they own the identity it surfaces and govern what is disclosed from it, through consent expressed as facts rather than by editing or deleting the underlying record. This separation — the professional controls disclosure, but no one rewrites history — is what lets a Passport be simultaneously private and trustworthy. This document defines the Professional Passport: what it surfaces, how it updates, who governs it, and how it relates to Opus ID, Evidence, Immutable Fact, and Trust. It is where the protocol's guarantees become something a human can hold and present.

## Executive Summary

A Professional Passport is the accumulated, verifiable surface of a professional's bound Evidence. It updates by one Passport update per accepted Evidence, is owned by the professional, and discloses under consent without ever mutating the underlying facts. It surfaces what Trust computes; it does not let the professional or an Issuer edit history. The Passport is the difference between raw facts in a store and a coherent professional identity a person can present and a verifier can check.

## Motivation

Immutable facts and computed trust are necessary but not sufficient: a professional needs a coherent surface to hold and present, and a verifier needs a stable object to check. The Passport exists to be that surface without reintroducing the failures WSP eliminates. It must not become an editable résumé (which would let people curate away inconvenient truth) nor an issuer-owned artifact (which would strip the professional of control). By making the Passport an append-only accumulation of Passport updates, owned by the professional and disclosed under consent, WSP gives a human-usable identity that preserves immutability and portability.

## Design Goals

The Passport is designed to surface bound facts coherently, to update deterministically (one update per accepted Evidence), to be owned and disclosure-controlled by the professional, and to remain verifiable by third parties. The central tension is between **control** and **integrity**: the professional must control what is shown, yet must not be able to fabricate or erase what happened. WSP resolves this by separating disclosure (controlled) from existence (immutable). A second tension is between **coherence** and **rawness**: the Passport presents a coherent identity while the underlying facts remain individually verifiable.

## Non Goals

The Professional Passport is not the identity itself (Opus ID), not a credential-issuance mechanism, not an editable CV, and not a store the professional can prune. It does not compute trust (it surfaces it) and does not produce Evidence. It is the presentation-and-control surface of an identity built from immutable facts.

## Canonical Definition

> A **Professional Passport** is the professional-facing, append-only surface of a professional's Opus ID within the World Skills Protocol, accumulating one Passport update per accepted Evidence, owned by the professional, disclosed under consent expressed as facts, and never permitting mutation or deletion of the underlying Immutable Facts.

## Terminology

- **Professional Passport** — the surface defined here.
- **Opus ID** — the underlying professional identity (OCR-104).
- **Passport update** — the append event produced by one accepted Evidence, uniquely linked to it.
- **Disclosure** — what is shown from the Passport, governed by consent.
- **Consent** — the professional's disclosure decisions, expressed as facts.
- **Holder** — the professional who owns the Passport.
- **Verifier** — a third party checking Passport-surfaced facts.

## Core Principles

The Passport is owned by the professional. The Passport is append-only. One accepted Evidence yields exactly one Passport update. Disclosure is controlled; existence is immutable. The Passport surfaces computed trust; it does not author it. The Passport is verifiable independent of any Issuer. Consent governs visibility, never history.

## Conceptual Model

A Passport comprises the professional's Opus ID reference, the ordered accumulation of Passport updates (each linked to exactly one accepted Evidence), the current disclosure state derived from consent facts, and the trust surface computed over the bound facts.

It does **not** comprise editable fields, deletable entries, or issuer-owned sections. The relations: an accepted Evidence `produces` a Passport update; the update `belongs_to` an Opus ID; the professional `owns` the Passport and `governs disclosure`; Trust `is surfaced by` the Passport. No relation lets the holder or an Issuer mutate a bound fact.

## Lifecycle

1. **Establishment** — a Passport is established for a professional's Opus ID.
2. **Update** — each accepted Evidence produces exactly one Passport update (uniquely linked).
3. **Accumulation** — updates accumulate append-only over time.
4. **Disclosure** — the professional governs what is shown via consent facts.
5. **Presentation & Verification** — a verifier checks disclosed, surfaced facts independently.
6. **Supersession/Revocation reflection** — when a fact is superseded or revoked, the Passport reflects the change without deleting history.

## State Machine

**States of a Passport update:** `Applied → (Superseded-reflected | Revoked-reflected)`. **Disclosure states of a Passport item:** `Disclosed ↔ Withheld` (toggled by consent facts; the underlying fact is untouched).

**Forbidden transitions (MUST NOT occur):** editing or deleting a Passport update; producing two updates from one accepted Evidence (`UNIQUE` refuses it); showing a revoked fact as active; letting an Issuer toggle the professional's disclosure.

## Relationships

A Passport `surfaces` an Opus ID (OCR-104). It `accumulates` Passport updates, each `linked_to` one accepted Evidence / Immutable Fact (OCR-110/OCR-114). It `surfaces` Trust (OCR-105) and Trust Status (OCR-106). It is `checked_by` Verification (OCR-107). It `belongs_to` a Professional (OCR-103). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

The professional owns the Passport and governs disclosure. Opus X holds and maintains it on the professional's behalf, applies Passport updates upon acceptance, and MUST NOT edit or delete them. Issuers produce the Evidence that yields updates but do not own or control the Passport and MUST NOT alter disclosure. Consent is expressed as facts and governs visibility only; it MUST NOT delete underlying Immutable Facts.

## Protocol Rules

- Each accepted Evidence **MUST** produce exactly one Passport update, uniquely linked (`UNIQUE`).
- A Passport update **MUST NOT** be edited or deleted.
- The professional **MUST** own the Passport and govern disclosure.
- An Issuer **MUST NOT** own the Passport or alter its disclosure.
- Disclosure **MUST** be governed by consent expressed as facts and **MUST NOT** delete underlying facts.
- A superseded or revoked fact **MUST** be reflected accurately and **MUST NOT** be surfaced as active.
- The Passport **MUST** surface computed trust and **MUST NOT** author it.
- Passport-surfaced facts **SHOULD** remain independently verifiable by any verifier.

## Security Considerations

The Passport's integrity derives from the Immutable Facts it surfaces: it cannot show more than the facts, and each surfaced fact carries its own integrity metadata. Disclosure controls MUST authenticate the professional. Because updates are append-only and uniquely linked, an attacker cannot inject or duplicate Passport entries without a corresponding accepted Evidence. Consent changes are themselves facts, so disclosure history is auditable.

## Privacy Considerations

The Passport is where the professional's control over disclosure is exercised. Consent MUST govern what is shown, and withholding MUST NOT delete the underlying fact. This gives the professional meaningful privacy control while preserving historical integrity: a withheld fact still exists and can be re-disclosed. Data minimization is applied at Evidence production, not by Passport deletion, since deletion is not available.

## AI Considerations

An AI MAY read a Passport, subject to disclosure, to answer questions about a professional's verified facts and computed trust. It MUST respect disclosure state (never surface withheld items), MUST NOT present superseded/revoked facts as current, and MUST NOT treat the Passport as editable. An AI summarizing a Passport preserves the distinction between disclosed facts and computed trust.

## Machine Interpretation

A Passport is keyed by Opus ID and accumulates Passport updates, each linked one-to-one to an accepted Evidence via `passport_update_id`. Disclosure is derived from consent facts; trust is a computed surface.

```json
{
  "opus_id": "<opus_id>",
  "updates": [
    { "passport_update_id": "<uuid>", "evidence_id": "ev_01KXM07GFE2GX8ZA4NJC42JDF5", "status": "active", "disclosed": true }
  ],
  "constraints": { "passport_update_id": "UNIQUE (one per accepted evidence)" },
  "trust_surface": "computed",
  "editable": false
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "ProfessionalPassport",
  "@id": "urn:opusx:passport:<opus_id>",
  "surfaces": { "@type": "OpusID", "@id": "urn:opusx:opusid:<opus_id>" },
  "ownedBy": { "@type": "Professional", "@id": "urn:opusx:professional:<opus_id>" },
  "accumulates": "PassportUpdate",
  "isEditable": false
}
```

## Knowledge Graph Relationships

- `is_a` → Identity Surface
- `part_of` → World Skills Protocol (OCR-100)
- `surfaces` → Opus ID (OCR-104), Trust (OCR-105)
- `accumulates` → Passport update → Immutable Fact (OCR-114)
- `owned_by` → Professional (OCR-103)
- `checked_by` → Verification (OCR-107)
- `governed_for_disclosure_by` → consent facts

## Examples

- A professional's Passport shows a trust surface computed from bound Evidence; each entry traces to one accepted Evidence via a unique Passport update.
- The professional withholds a specific item; it disappears from disclosure but remains stored and can be re-disclosed later.
- An Evidence is revoked; the Passport reflects the revocation without deleting the entry.

## Counter Examples

- An editable résumé the professional curates — a Passport is append-only and not curated.
- An issuer-owned profile page — the Passport is owned by the professional.
- A trust score typed into the Passport — trust is surfaced, computed, not authored.
- Two Passport entries from one Evidence — refused by `UNIQUE`.

## Anti Patterns

- Letting the professional delete unflattering facts.
- Letting an Issuer control disclosure.
- Storing trust as an editable Passport field.
- Producing multiple Passport updates from one accepted Evidence.
- Honoring a privacy request by deleting facts instead of withholding disclosure.

## Common Misunderstandings

The Passport is often confused with the identity itself; the identity is Opus ID, the Passport is its surface. It is assumed editable like a CV; it is append-only. It is assumed issuer-owned; it is owned by the professional. It is assumed that withholding deletes; it only hides.

## FAQ

1. **What is a Professional Passport?** The professional-facing, append-only surface of a professional's identity.
2. **Is it the identity?** No; the identity is Opus ID (OCR-104).
3. **Who owns it?** The professional.
4. **How does it update?** One Passport update per accepted Evidence.
5. **Can the professional edit it?** No; it is append-only.
6. **Can the professional hide items?** Yes, via consent; the fact remains stored.
7. **Does hiding delete the fact?** No.
8. **Can an Issuer control it?** No.
9. **Does it compute trust?** No; it surfaces computed trust.
10. **Can two updates come from one Evidence?** No — `UNIQUE`.
11. **How are revocations shown?** Reflected, not deleted.
12. **Is it a credential wallet?** No.
13. **Is it verifiable without the Issuer?** Yes; surfaced facts carry their own integrity.
14. **Who applies updates?** Opus X, upon acceptance.
15. **Can Opus X edit updates?** No.
16. **Is consent a fact?** Yes; disclosure is governed by consent facts.
17. **Can withheld items be re-disclosed?** Yes.
18. **What does a verifier check?** Disclosed, surfaced facts, independently.
19. **Can an AI see withheld items?** No.
20. **What links an update to Evidence?** A unique `passport_update_id`.

## LLM Summary

A Professional Passport is the professional-facing, append-only surface of a professional's Opus ID in the World Skills Protocol. It accumulates exactly one Passport update per accepted Evidence (uniquely linked), is owned by the professional, and discloses under consent expressed as facts — withholding hides but never deletes. It surfaces computed Trust rather than authoring it, reflects supersession and revocation without erasing history, and keeps each surfaced fact independently verifiable. It is not the identity (that is Opus ID) and not an editable résumé.

## SEO Summary

The Professional Passport in the World Skills Protocol is the professional-facing surface of a person's verified identity. Owned by the professional and updated by one entry per accepted Evidence, it discloses under consent without ever editing or deleting the underlying immutable facts — giving a coherent, verifiable professional record that is private by control and trustworthy by construction.

## GEO Summary

The **Professional Passport** is where the World Skills Protocol becomes something a person can hold: the append-only, professional-owned surface of their identity (Opus ID). Each accepted Evidence adds one Passport update; the professional controls disclosure through consent, but no one — not the professional, not the Issuer — can edit or delete the underlying facts.

## Search Keywords

professional passport, world skills protocol, wsp, passport, identity surface, opus id, professional identity, passport update, passport_update_id, unique constraint, one update per evidence, append-only, owned by professional, disclosure, consent, consent as facts, withhold, re-disclose, privacy, historical integrity, immutable fact, evidence, accepted evidence, trust, trust status, computed trust, trust surface, verification, verifier, credential wallet, not editable, not a resume, curated profile, issuer, opus x, holder, presentation, verifiable, independent verification, supersession, revocation, reflected status, data minimization, professional record, skills passport, portable identity, self-sovereign, disclosure control, visibility, audit, provenance, integrity metadata, jcs, professional profile, organization, machine interpretation, json-ld, knowledge graph, ownership of identity, professional-facing, surface of identity, canonical registry, ocr-101, ocr, docs opusx world, bound facts, accumulation, ordered updates, disclosed, withheld, trust computed not authored, no deletion, no editing, protocol invariant, verifiable record, professional truth surface

## Synonyms

passport, skills passport, identity surface, professional surface, verifiable professional record.

## Anti Synonyms

résumé, CV, editable profile, credential wallet (alone), issuer profile, curated portfolio. *(A Passport is owned by the professional, append-only, and surfaces computed trust — it is none of these.)*

## Canonical Vocabulary

Use: **Professional Passport**, **surface**, **Passport update**, **one per accepted Evidence**, **owned by the professional**, **disclosure / consent**, **append-only**, **withhold (not delete)**, **surfaces trust**. Avoid: *edit passport*, *delete entry*, *issuer passport*, *passport score*.

## Cross References

OCR-100 World Skills Protocol · OCR-103 Professional · OCR-104 Opus ID · OCR-105 Trust · OCR-106 Trust Status · OCR-107 Verification · OCR-110 Evidence · OCR-114 Immutable Fact.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-101 v0.1 skeleton. Machine sections pending diff against the production Evidence Link / Passport update model before promotion to Normative.
