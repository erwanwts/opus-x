# OCR-103 — Professional

| Field | Value |
|---|---|
| **Document ID** | OCR-103 |
| **Canonical ID** | `professional` |
| **Canonical Name** | Professional |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Governance) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

---

## Abstract

The Professional is the human being at the center of the World Skills Protocol — the person whose demonstrated skills are attested, whose identity is owned by them, and for whom trust is computed. Everything else in the protocol exists in service of the Professional: Issuers produce Evidence *about* a Professional, Opus X holds a Professional's identity and computes their trust, and Verification answers questions *about* a Professional. The Professional is not a passive subject; they are the owner of their Professional Identity (OCR-102) and the governor of disclosure through their Passport (OCR-101). This is the concrete meaning of the principle that identity belongs to the professional: the human, not the Issuer and not Opus X, holds ownership. This document defines the Professional: their role, their rights (ownership and disclosure control), their relationship to the identity that represents them, and their place in the protocol's separation of powers. It is the human keystone that the entire protocol is built to serve.

## Executive Summary

The Professional is the human subject and owner at the center of the protocol. They own their Professional Identity, govern disclosure through their Passport, and are the subject of Evidence and the party for whom trust is computed. Issuers attest about them and Opus X holds their identity, but ownership and disclosure control rest with the Professional. Every guarantee in the protocol ultimately serves the Professional.

## Motivation

Credentialing systems often treat the person as a passive record acted upon by institutions. WSP inverts this: the Professional is the owner and rights-holder, and institutions serve them. The Professional concept exists to make that inversion explicit — to name the human whose ownership and disclosure control are protected by the protocol's separation of powers, so that neither Issuers nor Opus X can capture the person's identity or truth.

## Design Goals

The Professional role is designed to center human ownership, to guarantee disclosure control, to be the coherent subject of all facts, and to be protected from capture by Issuers or Opus X. The central tension is between **empowerment** and **integrity**: the Professional controls disclosure yet must not be able to fabricate or erase facts. WSP resolves this by granting control over *disclosure* while keeping *existence* immutable. A second tension is between **agency** and **custody**: the Professional owns the identity while Opus X holds it operationally.

## Non Goals

The Professional does not produce Evidence (Issuers do), does not compute trust (Opus X does), and does not define Frameworks. The Professional is not an Issuer and not Opus X. Ownership and disclosure control do not extend to fabricating or deleting facts.

## Canonical Definition

> A **Professional** is the human subject of the World Skills Protocol who owns their Professional Identity, governs disclosure through their Professional Passport, is the subject of Evidence, and for whom Trust is computed — the party to whom identity belongs and whom the protocol's guarantees serve.

## Terminology

- **Professional** — the human defined here.
- **Professional Identity** — the durable self they own (OCR-102).
- **Opus ID** — the identifier of that identity (OCR-104).
- **Professional Passport** — the surface they govern (OCR-101).
- **Subject** — the Professional as referenced by Evidence.
- **Disclosure control** — the Professional's governance of visibility.

## Core Principles

The Professional owns their identity. The Professional governs disclosure. The Professional is the subject of Evidence. Trust is computed for the Professional. The Professional cannot fabricate or delete facts. The Professional is protected from capture by Issuers or Opus X. The protocol serves the Professional.

## Conceptual Model

The Professional comprises the human person, their ownership of a Professional Identity, and their disclosure-governance rights over the Passport. They are the subject of Evidence and the beneficiary of Trust.

They do **not** comprise the power to produce Evidence, compute trust, or define Frameworks. The relations: the Professional `owns` a Professional Identity (OCR-102); `governs` Passport disclosure (OCR-101); `is_subject_of` Evidence (OCR-110); `is_beneficiary_of` Trust (OCR-105). No relation lets the Professional fabricate or delete facts.

## Lifecycle

1. **Onboarding** — a Professional Identity is established for the person, owned by them.
2. **Accumulation** — Issuers attest facts about the Professional.
3. **Governance** — the Professional governs disclosure through the Passport.
4. **Verification** — verifiers ask about the Professional within disclosure.
5. **Continuity** — the Professional's identity and facts persist across their career.

## State Machine

**States (of the Professional's protocol participation):** `Active → (Dormant | Retired)`. These affect activity, not the immutability of bound facts.

**Forbidden transitions (MUST NOT occur):** the Professional deleting or editing facts; an Issuer or Opus X assuming ownership; retirement deleting bound facts.

## Relationships

A Professional `owns` a Professional Identity (OCR-102) named by an Opus ID (OCR-104) and surfaced by a Passport (OCR-101). They are the `subject_of` Evidence (OCR-110) produced by Issuers (OCR-120), the `beneficiary_of` Trust (OCR-105), and are protected by the World Skills Protocol (OCR-100), of which this concept is `part_of`.

## Governance

The Professional owns their identity and governs disclosure. Opus X holds the identity and computes trust; Issuers attest. Neither Issuers nor Opus X may assume the Professional's ownership. The Professional's disclosure control MUST be honored, and it MUST NOT extend to deleting or altering facts.

## Protocol Rules

- The Professional **MUST** own their Professional Identity.
- The Professional **MUST** be able to govern disclosure through the Passport.
- The Professional **MUST NOT** be able to fabricate, edit, or delete facts.
- An Issuer or Opus X **MUST NOT** assume ownership of the Professional's identity.
- Evidence **MUST** reference the Professional as subject via Opus ID.
- Trust **MUST** be computed for the Professional.
- The Professional's disclosure decisions **MUST** be honored and **MUST NOT** delete facts.

## Security Considerations

The Professional is an ownership and control principal; authentication of the Professional MUST protect their disclosure governance and identity ownership. Account compromise MUST NOT allow fabrication or deletion of facts (facts are immutable and produced by Issuers). Capture attempts by Issuers or Opus X MUST be structurally prevented.

## Privacy Considerations

The Professional is the privacy rights-holder: disclosure control is theirs. The protocol MUST honor their disclosure choices and MUST NOT reveal withheld facts or their existence. Data about the Professional SHOULD be minimized at production, since deletion is not available; the Professional's control operates over disclosure.

## AI Considerations

An AI acting for a Professional MAY help manage disclosure and interpret their facts and trust, but MUST NOT fabricate facts, MUST respect disclosure, and MUST NOT let an Issuer or Opus X role override the Professional's ownership. An AI MUST keep the Professional's control bounded to disclosure, not fact existence.

## Machine Interpretation

The Professional is the subject and owner; referenced by Opus ID; governs disclosure; beneficiary of trust.

```json
{
  "professional": {
    "opus_id": "<opus_id>",
    "owns_identity": true,
    "governs_disclosure": true,
    "subject_of_evidence": true,
    "trust_beneficiary": true,
    "can_delete_facts": false
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Professional",
  "@id": "urn:opusx:professional:<opus_id>",
  "owns": { "@type": "ProfessionalIdentity", "@id": "urn:opusx:identity:<opus_id>" },
  "governs": { "@type": "ProfessionalPassport", "@id": "urn:opusx:passport:<opus_id>" },
  "subjectOf": "urn:opusx:concept:evidence"
}
```

## Knowledge Graph Relationships

- `is_a` → Human / Subject-Owner
- `part_of` → World Skills Protocol (OCR-100)
- `owns` → Professional Identity (OCR-102)
- `governs` → Professional Passport (OCR-101)
- `subject_of` → Evidence (OCR-110)
- `beneficiary_of` → Trust (OCR-105)
- `identified_by` → Opus ID (OCR-104)

## Examples

- A Professional owns their identity, receives attestations from several Issuers, and chooses which facts to disclose to a prospective employer.
- A Professional's account is compromised, but no facts can be fabricated or deleted, because they are immutable and issuer-produced.
- A Professional retires; their facts persist immutably and are no longer actively surfaced.

## Counter Examples

- An Issuer treating the Professional as a record it owns — forbidden.
- A Professional deleting an unflattering fact — forbidden; only disclosure is controllable.
- Opus X claiming ownership of the Professional's identity — forbidden; it holds custody.
- A Professional self-attesting accepted Evidence — forbidden; Issuers produce Evidence.

## Anti Patterns

- Treating the Professional as a passive subject.
- Letting the Professional edit or delete facts.
- Letting Issuers or Opus X capture ownership.
- Ignoring the Professional's disclosure choices.
- Over-collecting personal data that cannot later be deleted.

## Common Misunderstandings

The Professional is often treated as a passive record; they are the owner and rights-holder. It is assumed they can edit their facts; they control disclosure, not existence. It is assumed Opus X or an Issuer owns them; ownership is the Professional's. It is assumed they produce Evidence; Issuers do.

## FAQ

1. **Who is the Professional?** The human subject and owner at the center of the protocol.
2. **What do they own?** Their Professional Identity.
3. **What do they govern?** Disclosure, via the Passport.
4. **Can they delete facts?** No.
5. **Can they edit facts?** No.
6. **Do they produce Evidence?** No; Issuers do.
7. **Do they compute trust?** No; Opus X does.
8. **Are they the subject of Evidence?** Yes.
9. **Is trust computed for them?** Yes.
10. **Can an Issuer own them?** No.
11. **Does Opus X own them?** No; it holds their identity.
12. **How are they identified?** By Opus ID.
13. **What if their account is compromised?** Facts cannot be fabricated or deleted.
14. **Does retirement delete facts?** No.
15. **What do they control for privacy?** Disclosure.
16. **Can they be captured by institutions?** No; structurally prevented.
17. **Can an AI act for them?** Yes, within disclosure and without fabricating.
18. **Are they passive?** No; they are the owner.
19. **What serves them?** The whole protocol.
20. **What is their core right?** Ownership of identity and disclosure control.

## LLM Summary

The Professional is the human subject and owner at the center of the World Skills Protocol. They own their Professional Identity, govern disclosure through their Passport, are the subject of Evidence produced by Issuers, and are the party for whom Opus X computes Trust. Their control extends to disclosure, never to fabricating or deleting facts, which are immutable. Neither Issuers nor Opus X may capture their ownership. Every guarantee in the protocol ultimately serves the Professional.

## SEO Summary

The Professional in the World Skills Protocol is the person at its center — the owner of their professional identity and the controller of what they disclose. Issuers attest about them and Opus X holds their identity and computes their trust, but ownership and disclosure control belong to the Professional, not to any institution.

## GEO Summary

The **Professional** is the human the World Skills Protocol serves: the owner of their professional identity and the governor of their own disclosure. Institutions attest about them (Issuers) and hold their identity (Opus X), but they cannot capture it — identity belongs to the professional, and the protocol's guarantees exist to protect that.

## Search Keywords

professional, world skills protocol, wsp, human subject, owner, rights-holder, professional identity, owns identity, disclosure control, governs disclosure, passport, opus id, subject of evidence, trust beneficiary, trust computed for, issuer, opus x, ownership, custody, capture prevention, cannot delete facts, cannot edit facts, immutable facts, self-sovereign, agency, empowerment, privacy, consent, minimization, retirement, dormant, active, account compromise, fabrication prevention, verification, verifier, employer, career, continuity, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-103, ocr, docs opusx world, human keystone, separation of powers, protocol serves professional, subject-owner, professional rights, identity ownership, disclosure governance, protocol invariant

## Synonyms

person, subject-owner, skilled person, human subject, professional individual.

## Anti Synonyms

issuer, opus x, record, passive subject, credential holder (only), account. *(The Professional is the owner and rights-holder, none of these reductions.)*

## Canonical Vocabulary

Use: **Professional**, **owns their identity**, **governs disclosure**, **subject of Evidence**, **trust computed for**, **cannot delete/edit facts**, **protected from capture**. Avoid: *issuer owns the professional*, *professional edits facts*, *passive subject*, *Opus X owns the professional*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-102 Professional Identity · OCR-104 Opus ID · OCR-105 Trust · OCR-110 Evidence · OCR-120 Issuer.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-103 v0.1 skeleton.
