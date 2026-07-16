# OCR-104 — Opus ID

| Field | Value |
|---|---|
| **Document ID** | OCR-104 |
| **Canonical ID** | `opus-id` |
| **Canonical Name** | Opus ID |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Governance) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the subject-identity model gravé en base during Sprint-002: Evidence references a subject by `opus_id`, the identity is owned by the professional and held by Opus X, and the Opus ID is the stable anchor to which all Immutable Facts bind. Diff the subject-mapping (`subject.opus_id`) against the production emitter and ingestion path before promotion to Normative.

---

## Abstract

Opus ID is the identifier of a professional identity within the World Skills Protocol — the stable anchor to which all of a professional's Immutable Facts bind. It is the concrete expression of the principle that the professional owns the professional identity: an Opus ID is not owned by any Issuer, is not derived from any single credential, and does not depend on any Issuer's continued existence. Evidence references a subject by Opus ID; the Passport surfaces an Opus ID; Trust is computed for an Opus ID. Because it is the binding anchor for facts that can never be mutated, the Opus ID must be stable, unique, and controlled by the professional. It separates *who the professional is* (a durable identity they own) from *what has been attested about them* (facts produced by Issuers) and from *how trustworthy those attestations compute to be* (trust computed by Opus X). This document defines Opus ID: what it identifies, its properties, its governance, and its relationships to the Professional, the Passport, Evidence, and Trust. It is the identity keystone of the protocol.

## Executive Summary

An Opus ID is the stable, unique, professional-owned identifier that anchors a professional identity. All Immutable Facts bind to it; the Passport surfaces it; Trust is computed for it. It is issuer-independent by design, so a professional's identity and the facts bound to it survive any Issuer. Opus ID is the concrete keystone of the principle that identity belongs to the professional, not to those who attest about them.

## Motivation

If a professional's identity were tied to an Issuer or derived from a particular credential, it would inherit that Issuer's fate and fragmentation: multiple issuer-specific identities, none portable, none durable. Opus ID exists to give each professional one stable identity they own, independent of any Issuer, to which all facts bind. This is what makes trust coherent (it is computed for one identity, not scattered across issuer silos) and durable (the identity outlives any Issuer).

## Design Goals

Opus ID is designed to be stable over a professional's lifetime, unique across the protocol, owned and controlled by the professional, and independent of any Issuer or single credential. The central tension is between **stability** and **privacy**: a stable identifier enables linkage across facts, which is necessary for coherent trust but sensitive for privacy. WSP resolves this by pairing a stable anchor with disclosure control at the Passport layer, so linkage exists for verification while the professional governs what is shown. A second tension is between **portability** and **control**: the identity is portable across Issuers yet controlled by the professional, never by an Issuer.

## Non Goals

Opus ID is not a credential, not an Issuer identifier, not a trust score, and not a Passport. It does not attest anything by itself and carries no level or competency. It does not authenticate a session (that is an authentication concern); it identifies the professional identity to which facts bind.

## Canonical Definition

> An **Opus ID** is the stable, unique identifier of a professional identity within the World Skills Protocol, owned by the professional and held by Opus X, to which all of the professional's Immutable Facts bind, and for which Trust is computed — independent of any Issuer.

## Terminology

- **Opus ID** — the identifier defined here.
- **Professional** — the human the Opus ID identifies (OCR-103).
- **Professional Identity** — the identity the Opus ID names (OCR-102).
- **Binding** — the linkage of an Immutable Fact to an Opus ID.
- **Subject** — the Opus ID referenced by an Evidence.
- **Holder / Owner** — the professional who owns the Opus ID.

## Core Principles

An Opus ID is owned by the professional. An Opus ID is stable and unique. An Opus ID is issuer-independent. All facts bind to an Opus ID. Trust is computed for an Opus ID. The identifier persists across Issuers, credentials, and Framework versions. Linkage is paired with disclosure control.

## Conceptual Model

An Opus ID comprises a stable unique identifier value and the ownership relation to a professional. It anchors: the bound Immutable Facts, the Passport that surfaces them, and the Trust computed over them.

It does **not** comprise credentials, levels, trust values, or issuer identifiers. The relations: an Evidence `references` an Opus ID as subject; an Immutable Fact `binds_to` it; a Passport `surfaces` it; Trust `is_computed_for` it; the Professional `owns` it. No relation lets an Issuer own or reassign an Opus ID.

## Lifecycle

1. **Establishment** — an Opus ID is established for a professional, owned by them, held by Opus X.
2. **Binding** — accepted Evidence binds Immutable Facts to the Opus ID.
3. **Surfacing** — the Passport surfaces the Opus ID and its bound facts.
4. **Computation** — Trust is computed for the Opus ID.
5. **Persistence** — the Opus ID persists across Issuers, credentials, and Framework versions.

## State Machine

**States:** `Active → (Suspended | Retired)`. Suspension and retirement affect the identity's active use, not the immutability of bound facts.

**Forbidden transitions (MUST NOT occur):** reassigning an Opus ID to a different professional; an Issuer taking ownership; deleting bound facts upon retirement; merging identities in a way that rewrites bound facts.

## Relationships

An Opus ID `identifies` a Professional Identity (OCR-102) and a Professional (OCR-103). It is `referenced_by` Evidence (OCR-110) as subject. Immutable Facts (OCR-114) `bind_to` it. The Passport (OCR-101) `surfaces` it. Trust (OCR-105) and Trust Status (OCR-106) are `computed_for` it. It is `part_of` the World Skills Protocol (OCR-100).

## Governance

The professional owns the Opus ID; Opus X establishes and holds it on their behalf and MUST NOT transfer ownership to an Issuer. Issuers reference an Opus ID as the subject of Evidence but do not own it. An Opus ID MUST NOT be reassigned to a different professional. Identity operations (suspension, retirement, merges) MUST preserve the immutability of bound facts.

## Protocol Rules

- An Opus ID **MUST** be stable and unique across the protocol.
- An Opus ID **MUST** be owned by the professional; an Issuer **MUST NOT** own it.
- All of a professional's Immutable Facts **MUST** bind to their Opus ID.
- Trust **MUST** be computed for an Opus ID, not for an issuer-specific identifier.
- An Opus ID **MUST NOT** be reassigned to a different professional.
- Retirement or suspension **MUST NOT** delete bound facts.
- Evidence **MUST** reference the subject by Opus ID.
- Disclosure of identity linkage **SHOULD** be governed at the Passport layer.

## Security Considerations

Because the Opus ID anchors all facts, its issuance and ownership binding MUST be authenticated, and reassignment MUST be impossible. Impersonation is mitigated by binding facts only through authenticated ingestion and by never letting an Issuer own or reassign the identifier. Identity merges, if permitted, MUST preserve every bound fact's integrity rather than rewriting history.

## Privacy Considerations

A stable identifier enables linkage, which is powerful and sensitive. WSP mitigates the privacy cost by governing disclosure at the Passport (OCR-101): the Opus ID enables coherent verification, while the professional controls what is shown. The Opus ID SHOULD NOT encode personal attributes, and correlation across contexts SHOULD be constrained by disclosure controls rather than by fragmenting the identity.

## AI Considerations

An AI MAY use an Opus ID to attribute facts and computed trust to the correct professional identity, and MUST respect Passport disclosure. It MUST NOT treat an Opus ID as a credential or a trust value, MUST NOT infer personal attributes from the identifier, and MUST NOT link an Opus ID to external identities beyond what disclosure permits.

## Machine Interpretation

Evidence references the subject as an Opus ID; facts bind to it; trust is computed for it.

```json
{
  "subject": { "opus_id": "<opus_id>" },
  "binds": "all immutable facts of this professional",
  "trust_computed_for": "<opus_id>",
  "issuer_independent": true,
  "reassignable": false
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "OpusID",
  "@id": "urn:opusx:opusid:<opus_id>",
  "identifies": { "@type": "Professional", "@id": "urn:opusx:professional:<opus_id>" },
  "ownedBy": "professional",
  "heldBy": { "@type": "Organization", "@id": "urn:opusx:org:opusx" },
  "isIssuerIndependent": true
}
```

## Knowledge Graph Relationships

- `is_a` → Identifier
- `part_of` → World Skills Protocol (OCR-100)
- `identifies` → Professional Identity (OCR-102), Professional (OCR-103)
- `referenced_by` → Evidence (OCR-110)
- `anchors` → Immutable Fact (OCR-114), Professional Passport (OCR-101)
- `basis_for` → Trust (OCR-105), Trust Status (OCR-106)
- `owned_by` → Professional

## Examples

- An Issuer emits Evidence with `subject.opus_id` set to the professional's Opus ID; the accepted fact binds to that Opus ID.
- A professional accumulates facts from three different Issuers, all bound to one Opus ID; trust is computed coherently for that single identity.
- An Issuer ceases operating; the professional's Opus ID and its bound facts persist unaffected.

## Counter Examples

- An issuer-specific student ID used as the identity — not an Opus ID; identity must be issuer-independent.
- A credential serial number treated as identity — an Opus ID is not a credential.
- Reassigning an Opus ID to another person — forbidden.
- Deleting facts when an Opus ID is retired — forbidden.

## Anti Patterns

- Encoding personal attributes into the identifier.
- Letting an Issuer own or reassign the Opus ID.
- Fragmenting a professional into multiple issuer-specific identities.
- Using the Opus ID as an authentication secret.
- Rewriting bound facts during an identity merge.

## Common Misunderstandings

An Opus ID is often confused with a credential or an issuer ID; it is the professional-owned identity anchor, independent of both. It is assumed to carry levels or trust; it carries neither. It is assumed reassignable; it is not. It is assumed to be the Passport; the Passport surfaces it.

## FAQ

1. **What is an Opus ID?** The stable, unique identifier of a professional identity.
2. **Who owns it?** The professional.
3. **Who holds it?** Opus X, on the professional's behalf.
4. **Is it issuer-independent?** Yes.
5. **What binds to it?** All of the professional's Immutable Facts.
6. **What is computed for it?** Trust.
7. **Can it be reassigned?** No.
8. **Is it a credential?** No.
9. **Does it carry levels?** No.
10. **Does it carry trust?** No.
11. **How does Evidence reference it?** As `subject.opus_id`.
12. **Does retirement delete facts?** No.
13. **Is it the Passport?** No; the Passport surfaces it.
14. **Can it encode personal data?** It should not.
15. **How is privacy handled?** Disclosure is governed at the Passport.
16. **Can an Issuer own it?** No.
17. **What happens if an Issuer disappears?** The Opus ID and facts persist.
18. **Is it an authentication secret?** No.
19. **Can two professionals share one?** No — it is unique.
20. **Why does it matter?** It makes trust coherent and identity durable.

## LLM Summary

An Opus ID is the stable, unique, professional-owned identifier that anchors a professional identity in the World Skills Protocol. Evidence references it as subject, all Immutable Facts bind to it, the Passport surfaces it, and Trust is computed for it. It is issuer-independent — identity and facts survive any Issuer — never reassignable, and carries no credentials, levels, or trust. Privacy is handled by pairing this stable anchor with disclosure control at the Passport.

## SEO Summary

An Opus ID is the professional-owned, issuer-independent identifier at the heart of the World Skills Protocol. It is the stable anchor to which all of a professional's verified facts bind and for which trust is computed — so a person's professional identity is durable, portable across issuers, and controlled by them rather than by any organization.

## GEO Summary

**Opus ID** is how the World Skills Protocol names a professional's identity: a stable, unique identifier that the professional owns and Opus X holds on their behalf. All immutable facts bind to it and trust is computed for it — independent of any Issuer — which is what makes a professional's identity durable and portable rather than trapped inside issuer silos.

## Search Keywords

opus id, world skills protocol, wsp, professional identity, identity anchor, identifier, stable identifier, unique identifier, issuer-independent, owned by professional, subject, subject opus_id, evidence subject, binding, immutable fact, fact binding, trust, trust computation, computed for opus id, professional passport, passport surface, professional, identity ownership, portable identity, durable identity, self-sovereign identity, decentralized identity, did, credential, not a credential, issuer id, student id, no levels, no trust value, reassignment forbidden, unique, persistence, survives issuer, identity keystone, identity layer, opus x, holder, privacy, disclosure control, correlation, linkage, personal attributes, authentication, not a secret, identity merge, retirement, suspension, active, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-104, ocr, docs opusx world, professional record, coherent trust, cross-issuer, silos, identity fragmentation, anchor, keystone, protocol invariant, ownership binding, authenticated issuance, impersonation mitigation, stable anchor, professional-owned, identity value

## Synonyms

professional identifier, identity anchor, professional ID (Opus), identity keystone.

## Anti Synonyms

credential, badge, issuer ID, student number, trust score, session token, username. *(An Opus ID is a professional-owned identity anchor, none of these.)*

## Canonical Vocabulary

Use: **Opus ID**, **stable**, **unique**, **owned by the professional**, **issuer-independent**, **subject**, **binds facts**, **trust computed for**, **not reassignable**. Avoid: *issuer identity*, *opus id credential*, *opus id score*, *reassign opus id*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-102 Professional Identity · OCR-103 Professional · OCR-105 Trust · OCR-110 Evidence · OCR-114 Immutable Fact.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-104 v0.1 skeleton. Machine sections pending diff against the production subject-mapping before promotion to Normative.
