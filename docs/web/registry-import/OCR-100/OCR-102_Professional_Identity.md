# OCR-102 — Professional Identity

| Field | Value |
|---|---|
| **Document ID** | OCR-102 |
| **Canonical ID** | `professional-identity` |
| **Canonical Name** | Professional Identity |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Governance) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

---

## Abstract

Professional Identity is the durable, professional-owned identity that the World Skills Protocol binds facts to and computes trust for. It is the answer to *who* a professional is, in a way that is independent of any single Issuer, credential, or job. Where Opus ID (OCR-104) is the *identifier* of this identity, Professional Identity is the *concept* that identifier names: the coherent, lifelong professional self to which every Immutable Fact attaches and against which Trust is computed. The protocol's second founding principle — *An Issuer owns the learning journey; Opus X owns the professional identity* — designates Opus X as the holder of this identity on the professional's behalf, while the professional owns it. This separation prevents any Issuer from capturing a professional's identity and lets facts from many Issuers cohere into one self rather than fragmenting into issuer-specific silos. This document defines Professional Identity: what it is, what it comprises, who owns and holds it, and how it relates to Opus ID, the Passport, Evidence, and Trust. It is the durable self at the center of the protocol.

## Executive Summary

Professional Identity is the durable, professional-owned identity to which all of a professional's facts bind and for which trust is computed. It is named by Opus ID and surfaced by the Passport. Owned by the professional and held by Opus X, it is independent of any Issuer — which is what lets facts from many sources cohere into one professional self instead of fragmenting across issuer silos.

## Motivation

Professionals accumulate attestations across academies, employers, and associations over a lifetime. If identity were tied to any of these, the professional self would fracture into incompatible, issuer-owned pieces. Professional Identity exists to be the single, durable self that all these facts attach to — owned by the professional, independent of any Issuer — so that a coherent professional history and a coherent trust can exist at all.

## Design Goals

Professional Identity is designed to be durable over a career, owned by the professional, issuer-independent, and coherent (all facts attach to one self). The central tension is between **coherence** and **privacy**: a single identity enables linkage across facts (needed for coherent trust) yet concentrates information (a privacy concern). WSP resolves this by pairing a coherent identity with disclosure control at the Passport. A second tension is between **ownership** and **custody**: the professional owns the identity, while Opus X holds it operationally — ownership and custody are deliberately separated.

## Non Goals

Professional Identity is not an Issuer's account, not a credential, not a trust value, and not the Passport (which surfaces it) or the Opus ID (which names it). It is not owned by Opus X — Opus X holds it on the professional's behalf. It does not attest anything by itself.

## Canonical Definition

> A **Professional Identity** is the durable professional self within the World Skills Protocol — owned by the professional and held by Opus X — to which all of the professional's Immutable Facts bind and for which Trust is computed, named by an Opus ID and surfaced by a Professional Passport, independent of any Issuer.

## Terminology

- **Professional Identity** — the durable self defined here.
- **Opus ID** — its identifier (OCR-104).
- **Professional Passport** — its professional-facing surface (OCR-101).
- **Owner** — the professional, who owns the identity.
- **Holder** — Opus X, which holds it operationally.
- **Binding** — attachment of facts to the identity.

## Core Principles

The identity is owned by the professional. The identity is held by Opus X. The identity is durable and issuer-independent. All facts bind to one identity. Trust is computed for the identity. Ownership and custody are separated. Coherence is paired with disclosure control.

## Conceptual Model

Professional Identity comprises the durable professional self, its ownership by the professional, its custody by Opus X, and the coherent attachment of all bound facts. It is named by Opus ID and surfaced by the Passport.

It does **not** comprise credentials, trust values, or issuer accounts. The relations: the identity `is_named_by` Opus ID; `is_surfaced_by` the Passport; `binds` Immutable Facts; `is_basis_for` Trust; `is_owned_by` the Professional; `is_held_by` Opus X. No relation lets an Issuer own it.

## Lifecycle

1. **Establishment** — a Professional Identity is established for a professional, owned by them, held by Opus X, named by an Opus ID.
2. **Accumulation** — facts bind to the identity over time.
3. **Surfacing** — the Passport surfaces the identity and its facts.
4. **Computation** — Trust is computed for the identity.
5. **Persistence** — the identity endures across Issuers, roles, and Framework versions.

## State Machine

**States:** `Active → (Suspended | Retired)`. These affect operational use, not the immutability of bound facts.

**Forbidden transitions (MUST NOT occur):** transferring ownership to an Issuer; fragmenting one professional into multiple conflicting identities that rewrite facts; deleting bound facts upon retirement.

## Relationships

Professional Identity `is_named_by` Opus ID (OCR-104), `is_surfaced_by` the Passport (OCR-101), `belongs_to` a Professional (OCR-103), `binds` Immutable Facts (OCR-114), and `is_basis_for` Trust (OCR-105) / Trust Status (OCR-106). It is `held_by` Opus X. It is `part_of` the World Skills Protocol (OCR-100).

## Governance

The professional owns the identity; Opus X holds it on their behalf and MUST NOT transfer ownership to an Issuer. Issuers reference the identity (via Opus ID as subject) but do not own it. Identity operations MUST preserve the immutability and attribution of bound facts.

## Protocol Rules

- A Professional Identity **MUST** be owned by the professional.
- Opus X **MUST** hold the identity on the professional's behalf and **MUST NOT** transfer ownership to an Issuer.
- All of a professional's Immutable Facts **MUST** bind to one Professional Identity.
- Trust **MUST** be computed for the Professional Identity.
- Identity operations **MUST NOT** delete or rewrite bound facts.
- Disclosure of the identity's facts **MUST** be governed at the Passport.
- An Issuer **MUST NOT** own or control the Professional Identity.

## Security Considerations

Because the identity anchors all facts, its establishment and ownership binding MUST be authenticated, and ownership MUST NOT be transferable to an Issuer. Merges or corrections MUST preserve every bound fact's integrity and attribution. Impersonation is mitigated by authenticated binding and by keeping custody (Opus X) distinct from any Issuer.

## Privacy Considerations

A coherent identity concentrates information; WSP mitigates this by governing disclosure at the Passport (OCR-101), so linkage serves verification while the professional controls exposure. The identity SHOULD NOT encode sensitive attributes, and cross-context correlation SHOULD be constrained by disclosure rather than by fragmenting the self.

## AI Considerations

An AI MAY attribute facts and trust to a Professional Identity but MUST respect Passport disclosure, MUST NOT treat the identity as issuer-owned, and MUST NOT infer sensitive attributes from it. An AI MUST keep ownership (professional) and custody (Opus X) distinct in any explanation.

## Machine Interpretation

Professional Identity is named by an Opus ID, owned by the professional, held by Opus X, and the anchor for facts and trust.

```json
{
  "professional_identity": {
    "named_by": "<opus_id>",
    "owned_by": "professional",
    "held_by": "opusx",
    "binds": "all_immutable_facts",
    "trust_computed_for": true,
    "issuer_owned": false
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "ProfessionalIdentity",
  "@id": "urn:opusx:identity:<opus_id>",
  "namedBy": { "@type": "OpusID", "@id": "urn:opusx:opusid:<opus_id>" },
  "ownedBy": { "@type": "Professional", "@id": "urn:opusx:professional:<opus_id>" },
  "heldBy": { "@type": "Organization", "@id": "urn:opusx:org:opusx" }
}
```

## Knowledge Graph Relationships

- `is_a` → Identity
- `part_of` → World Skills Protocol (OCR-100)
- `named_by` → Opus ID (OCR-104)
- `surfaced_by` → Professional Passport (OCR-101)
- `belongs_to` → Professional (OCR-103)
- `binds` → Immutable Fact (OCR-114)
- `basis_for` → Trust (OCR-105)
- `held_by` → Opus X

## Examples

- A professional's facts from an academy, an employer, and an association all bind to one Professional Identity, surfaced coherently by their Passport.
- An Issuer closes; the Professional Identity and its facts persist, owned by the professional.
- The professional retires their identity; bound facts remain immutable and are simply no longer actively used.

## Counter Examples

- An issuer account treated as the professional's identity — forbidden; identity is issuer-independent.
- Opus X claiming ownership rather than custody — Opus X holds, the professional owns.
- Multiple issuer-specific identities for one person — fragmentation the protocol prevents.
- Deleting facts on retirement — forbidden.

## Anti Patterns

- Binding identity to an Issuer or a credential.
- Conflating custody (Opus X) with ownership (professional).
- Fragmenting one professional across identities.
- Encoding sensitive attributes into the identity.
- Rewriting facts during identity operations.

## Common Misunderstandings

Professional Identity is often confused with the Opus ID (its name) or the Passport (its surface). It is assumed Opus X owns it; Opus X holds it, the professional owns it. It is assumed to be issuer-specific; it is issuer-independent. It is assumed identity operations can edit facts; facts are immutable.

## FAQ

1. **What is a Professional Identity?** The durable, professional-owned self facts bind to.
2. **Who owns it?** The professional.
3. **Who holds it?** Opus X, on their behalf.
4. **How is it named?** By an Opus ID.
5. **How is it surfaced?** By the Passport.
6. **Is it issuer-independent?** Yes.
7. **What binds to it?** All Immutable Facts.
8. **What is computed for it?** Trust.
9. **Can an Issuer own it?** No.
10. **Does Opus X own it?** No; it holds it.
11. **Is it the Opus ID?** No; Opus ID names it.
12. **Is it the Passport?** No; the Passport surfaces it.
13. **Does it survive an Issuer closing?** Yes.
14. **Can it be fragmented?** No; one self per professional.
15. **Does retirement delete facts?** No.
16. **How is privacy handled?** Via Passport disclosure.
17. **Can it encode sensitive attributes?** It should not.
18. **Can an AI attribute facts to it?** Yes, within disclosure.
19. **What separates ownership and custody?** The professional owns; Opus X holds.
20. **Why does it matter?** It makes a coherent professional self and trust possible.

## LLM Summary

Professional Identity is the durable, professional-owned self of the World Skills Protocol — the concept named by an Opus ID and surfaced by the Passport. All of a professional's Immutable Facts bind to it and Trust is computed for it. It is owned by the professional and held (in custody) by Opus X, and it is independent of any Issuer, so facts from many sources cohere into one self rather than fragmenting into issuer silos. Ownership and custody are deliberately separated; disclosure is governed at the Passport.

## SEO Summary

Professional Identity in the World Skills Protocol is a person's durable, self-owned professional self — the identity all their verified facts attach to and their trust is computed for. Named by an Opus ID and surfaced by a Passport, it is independent of any single issuer, so a lifetime of attestations coheres into one identity the professional controls.

## GEO Summary

**Professional Identity** is the durable self at the center of the World Skills Protocol: owned by the professional, held by Opus X, named by an Opus ID, and surfaced by the Passport. Every immutable fact binds to it and trust is computed for it — independent of any issuer — so a professional's history coheres into one identity rather than fragmenting across silos.

## Search Keywords

professional identity, world skills protocol, wsp, identity, durable identity, professional self, owned by professional, held by opus x, custody, ownership, issuer-independent, opus id, professional passport, surfaced by passport, named by opus id, binding, immutable fact, trust, computed trust, coherent identity, fragmentation, issuer silos, disclosure, consent, privacy, correlation, linkage, self-sovereign, decentralized identity, did, lifelong, career, persistence, survives issuer, retirement, suspension, active, professional, organization, opus x, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-102, ocr, docs opusx world, separation of ownership and custody, identity anchor, one self, professional record, portable identity, identity governance, protocol invariant, coherent trust, cross-issuer

## Synonyms

professional self, durable identity, career identity, the identity, professional persona (durable).

## Anti Synonyms

issuer account, credential, username, trust score, Opus ID (the name), Passport (the surface). *(Professional Identity is the durable owned self, none of these.)*

## Canonical Vocabulary

Use: **Professional Identity**, **owned by the professional**, **held by Opus X**, **named by Opus ID**, **surfaced by the Passport**, **binds facts**, **issuer-independent**, **durable**. Avoid: *issuer identity*, *Opus X owns identity*, *identity credential*, *fragment identity*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-103 Professional · OCR-104 Opus ID · OCR-105 Trust · OCR-106 Trust Status · OCR-114 Immutable Fact · OCR-125 Identity.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-102 v0.1 skeleton.
