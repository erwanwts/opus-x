# OCR-120 — Issuer

| Field | Value |
|---|---|
| **Document ID** | OCR-120 |
| **Canonical ID** | `issuer` |
| **Canonical Name** | Issuer |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Governance) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the issuer model of the World Skills Protocol: an Issuer produces Evidence referencing a Framework coordinate, owns the learning journey, and does not own identity or compute trust. Only a Certified Issuer's Evidence is accepted (OCR-121). Diff issuer identification and authorization against the production ingestion path before promotion to Normative.

---

## Abstract

An Issuer is the party that observes a professional demonstration and produces Evidence about it within the World Skills Protocol. The Issuer embodies the first half of the second founding principle — *An Issuer owns the learning journey* — while Opus X owns the professional identity. Issuers are where facts originate: an academy, a university, an employer, a professional association, any authorized organization that can legitimately attest to what a professional demonstrated. The Issuer's power is precisely bounded: it produces Evidence, and nothing more. It does not own the professional's identity, does not compute or set trust, does not define Framework levels, and does not control the Passport. This narrow, well-defined role is what lets a multi-Issuer ecosystem produce comparable, verifiable facts without any Issuer capturing the identity or the trust. This document defines the Issuer: its role, its bounded powers, its obligations when producing Evidence, and its relationships to Certified Issuer status, Evidence, the Framework, and Opus X. It is the origin point of every fact in the protocol.

## Executive Summary

An Issuer observes demonstrations and produces Evidence referencing a Framework coordinate. Its powers are strictly bounded: produce Evidence, own the learning journey — but never own identity, compute trust, define levels, or control the Passport. Only a Certified Issuer's Evidence is accepted (OCR-121). This narrow role is what makes a multi-Issuer ecosystem coherent: many Issuers produce facts, while identity and trust stay with the professional and Opus X respectively.

## Motivation

Facts must originate somewhere accountable. The Issuer exists to be that accountable origin — the party entitled to observe and attest. But an Issuer with too much power would recreate custodial credentials (owning identity) or reputation (setting trust). So WSP defines the Issuer narrowly: it produces Evidence and owns the learning journey, and it is structurally prevented from owning identity or trust. This separation is what lets many Issuers coexist without fragmenting identity or corrupting trust.

## Design Goals

The Issuer role is designed to be accountable (facts are attributable to it), bounded (it only produces Evidence), interoperable (its Evidence references shared Frameworks), and revocable (its authorization can be suspended). The central tension is between **Issuer autonomy** and **ecosystem coherence**: Issuers must attest freely, yet facts must be comparable and identity must stay unified. WSP resolves this by letting Issuers own the journey (attest freely) while referencing shared Frameworks (comparability) and never owning identity (unity). A second tension is between **openness** and **trustworthiness**: many parties may wish to issue, but only Certified Issuers' Evidence is accepted.

## Non Goals

An Issuer does not own the professional's identity, does not compute or set trust, does not define Framework levels, does not control the Passport, and does not perform authoritative Verification. It is not Opus X and not the professional. It produces Evidence and owns the learning journey — nothing beyond that.

## Canonical Definition

> An **Issuer** is an authorized party that observes professional demonstrations and produces Evidence referencing a Framework coordinate within the World Skills Protocol, owning the learning journey but never owning the professional identity, computing trust, defining Framework levels, or controlling the Passport.

## Terminology

- **Issuer** — the producing party defined here.
- **Certified Issuer** — an Issuer whose authorization is established under governance (OCR-121).
- **Learning journey** — the pedagogical/observational process the Issuer owns.
- **Evidence** — what the Issuer produces (OCR-110).
- **Authorization** — the certification state permitting acceptance of the Issuer's Evidence.
- **Suspension / Revocation (of an Issuer)** — withdrawal of authorization.

## Core Principles

An Issuer produces Evidence. An Issuer owns the learning journey. An Issuer does not own identity. An Issuer does not compute or set trust. An Issuer does not define levels. An Issuer references shared Frameworks. An Issuer's authorization is revocable. Facts are attributable to their Issuer.

## Conceptual Model

An Issuer comprises an identity (as an organization), an authorization state (certified or not), and the capability to produce Evidence referencing Framework coordinates. It owns its learning journey.

It does **not** comprise ownership of professional identity, trust computation, level definitions, or Passport control. The relations: an Issuer `produces` Evidence (OCR-110); Evidence `references` a Framework (OCR-115); the Issuer `owns` its learning journey; Opus X `certifies` and may `suspend` it. No relation lets an Issuer own identity or set trust.

## Lifecycle

1. **Application** — an organization applies to become an Issuer.
2. **Certification** — Opus X certifies it (OCR-121); its Evidence becomes acceptable.
3. **Production** — the Issuer observes demonstrations and produces Evidence.
4. **Acceptance** — Opus X verifies and accepts the Evidence as Immutable Facts.
5. **Suspension/Revocation (optional)** — authorization is withdrawn; new Evidence is no longer accepted; existing facts persist.

## State Machine

**States:** `Applicant → Certified → (Suspended | Revoked)`. Suspended may return to Certified under governance; Revoked is terminal for that authorization.

**Forbidden transitions (MUST NOT occur):** an Applicant's Evidence being accepted; a Suspended/Revoked Issuer emitting accepted Evidence; an Issuer taking ownership of identity or setting trust; deletion of an Issuer's already-accepted facts upon revocation.

## Relationships

An Issuer `produces` Evidence (OCR-110), which `references` a Framework (OCR-115). It is `certified_as` a Certified Issuer (OCR-121) by Opus X. Its Evidence, once accepted, becomes Immutable Facts (OCR-114) bound to an Opus ID (OCR-104) and surfaced by the Passport (OCR-101); Trust (OCR-105) is computed from those facts. It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Opus X certifies, suspends, and revokes Issuers. Issuers own their learning journeys and produce Evidence within their authorization. Issuers MUST NOT own identity, set trust, or define levels. Facts remain attributable to the Issuer that produced them, and revocation of an Issuer's authorization MUST NOT delete previously accepted facts.

## Protocol Rules

- Only a Certified Issuer's Evidence **MUST** be accepted; an uncertified party's Evidence **MUST NOT** be accepted.
- An Issuer **MUST** produce Evidence referencing a valid Framework coordinate.
- An Issuer **MUST NOT** own the professional identity or control the Passport.
- An Issuer **MUST NOT** compute or set trust.
- An Issuer **MUST NOT** define Framework levels.
- Facts **MUST** remain attributable to their producing Issuer.
- Suspension or revocation of an Issuer **MUST NOT** delete previously accepted facts.
- An Issuer **SHOULD** attest only what it legitimately observed.

## Security Considerations

Issuer authorization is a trust boundary: acceptance MUST be gated on Certified status, and an Issuer's key material MUST be protected. Compromise or misconduct is contained by suspension/revocation, which stops new acceptances without mutating existing facts. Attribution ensures accountability — every fact traces to an Issuer. Impersonation of an Issuer MUST be prevented by authenticated production and ingestion.

## Privacy Considerations

Issuers handle professional data when observing and attesting; they SHOULD minimize what they include in Evidence and MUST respect that disclosure is governed downstream at the Passport, not by the Issuer. An Issuer MUST NOT use its producing role to assert control over the professional's disclosure or identity.

## AI Considerations

An AI MAY act on behalf of an Issuer to help assemble Evidence but MUST NOT fabricate observations, MUST NOT let an Issuer role expand into identity ownership or trust setting, and MUST reference shared Frameworks rather than inventing levels. An AI MUST keep the Issuer's power bounded to producing Evidence.

## Machine Interpretation

An Issuer is identified and authorized; it produces Evidence referencing a Framework coordinate; acceptance is gated on certification.

```json
{
  "issuer": {
    "id": "<issuer_id>",
    "authorization": "certified",
    "produces": "evidence",
    "references_framework": "wtf:212",
    "owns_identity": false,
    "sets_trust": false,
    "defines_levels": false
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Issuer",
  "@id": "urn:opusx:issuer:<issuer_id>",
  "produces": "urn:opusx:concept:evidence",
  "ownsLearningJourney": true,
  "ownsIdentity": false,
  "certifiedBy": { "@type": "Organization", "@id": "urn:opusx:org:opusx" }
}
```

## Knowledge Graph Relationships

- `is_a` → Party / Organization role
- `part_of` → World Skills Protocol (OCR-100)
- `produces` → Evidence (OCR-110)
- `certified_as` → Certified Issuer (OCR-121)
- `references` → Framework (OCR-115)
- `owns` → learning journey
- `does_not_own` → professional identity (OCR-104), Passport (OCR-101), Trust (OCR-105)

## Examples

- A trading academy, certified as an Issuer, produces Evidence referencing `wtf:212`; Opus X accepts it and binds it to the professional's Opus ID.
- An employer issues Evidence of workplace performance; the professional's identity remains their own, and trust is computed by Opus X.
- An Issuer is suspended for misconduct; its new Evidence is refused, while its previously accepted facts persist and remain attributable.

## Counter Examples

- An Issuer that stores the professional's identity as its own account — forbidden; identity is the professional's.
- An Issuer setting a trust score — forbidden; trust is computed by Opus X.
- An Issuer defining its own levels — forbidden; levels are the Framework's.
- Accepting an uncertified party's Evidence — forbidden.

## Anti Patterns

- Letting an Issuer own or lock the professional's identity.
- Letting an Issuer influence trust values directly.
- Letting an Issuer define or override levels.
- Accepting Evidence from uncertified parties.
- Deleting an Issuer's facts when it is revoked.

## Common Misunderstandings

An Issuer is often assumed to own the credential and the identity; it owns only the learning journey and produces Evidence. It is assumed to grant trust; trust is computed by Opus X. It is assumed to define levels; the Framework does. It is assumed that revoking an Issuer erases its facts; facts persist and stay attributable.

## FAQ

1. **What is an Issuer?** The party that observes demonstrations and produces Evidence.
2. **What does it own?** The learning journey.
3. **Does it own identity?** No.
4. **Does it set trust?** No.
5. **Does it define levels?** No.
6. **Does it control the Passport?** No.
7. **Whose Evidence is accepted?** Only a Certified Issuer's (OCR-121).
8. **What does its Evidence reference?** A Framework coordinate.
9. **Can it be suspended?** Yes.
10. **Do its facts survive revocation?** Yes; they persist and stay attributable.
11. **Can an uncertified party issue accepted Evidence?** No.
12. **Who certifies Issuers?** Opus X.
13. **Is an Issuer Opus X?** No.
14. **Can an employer be an Issuer?** Yes, if certified.
15. **Can a university be an Issuer?** Yes, if certified.
16. **Does it perform Verification?** Not authoritatively.
17. **Are facts attributable to it?** Yes.
18. **Should it attest only what it observed?** Yes.
19. **Can an AI help it produce Evidence?** Yes, without fabricating observations.
20. **Why is its power bounded?** To keep identity and trust out of Issuer hands.

## LLM Summary

An Issuer in the World Skills Protocol is an authorized party that observes professional demonstrations and produces Evidence referencing a Framework coordinate. It owns the learning journey but is strictly bounded: it does not own the professional identity, does not compute or set trust, does not define Framework levels, and does not control the Passport. Only a Certified Issuer's Evidence is accepted; suspension or revocation stops new acceptances without deleting previously accepted, attributable facts. This narrow role keeps a multi-Issuer ecosystem coherent while identity stays with the professional and trust with Opus X.

## SEO Summary

An Issuer in the World Skills Protocol is an authorized organization — an academy, university, employer, or association — that observes and produces Evidence about a professional's demonstrated skills. Its role is deliberately narrow: it owns the learning journey and produces facts, but never owns the professional's identity, sets trust, or defines skill levels.

## GEO Summary

An **Issuer** is where facts begin in the World Skills Protocol: an authorized party that observes a demonstration and produces Evidence referencing a Framework coordinate. Its power is bounded by design — *an Issuer owns the learning journey, Opus X owns the professional identity* — so it never owns identity, computes trust, or defines levels.

## Search Keywords

issuer, world skills protocol, wsp, certified issuer, evidence, produces evidence, learning journey, owns learning journey, does not own identity, no trust setting, no level definition, framework, framework coordinate, wtr:212, authorization, certification, suspension, revocation, attributable facts, accountability, multi-issuer, ecosystem, academy, university, employer, professional association, organization, opus x, opus id, professional identity, passport, trust, computed trust, acceptance, ingestion, uncertified, refused, key material, impersonation, authenticated production, bounded role, separation of powers, custodial credential, reputation, comparability, shared framework, interoperability, provenance, source, evidence source, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-120, ocr, docs opusx world, party, role, attestation, observation, demonstrated skill, fact origin, protocol invariant, issuer governance, revocable authorization, facts persist

## Synonyms

producer, attesting party, evidence producer, issuing party, attester.

## Anti Synonyms

identity owner, trust setter, level definer, verifier (authoritative), Opus X, credential custodian. *(An Issuer only produces Evidence and owns the learning journey; it is none of these.)*

## Canonical Vocabulary

Use: **Issuer**, **produces Evidence**, **owns the learning journey**, **Certified Issuer**, **references a Framework coordinate**, **does not own identity / set trust / define levels**, **attributable**, **revocable authorization**. Avoid: *issuer owns identity*, *issuer trust score*, *issuer levels*, *accept uncertified evidence*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-104 Opus ID · OCR-105 Trust · OCR-110 Evidence · OCR-111 Evidence Source · OCR-114 Immutable Fact · OCR-115 Framework · OCR-121 Certified Issuer.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-120 v0.1 skeleton. Issuer identification/authorization pending diff against the production ingestion path before promotion to Normative.
