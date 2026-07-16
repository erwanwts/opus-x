# OCR-125 — Identity

| Field | Value |
|---|---|
| **Document ID** | OCR-125 |
| **Canonical ID** | `identity` |
| **Canonical Name** | Identity |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

---

## Abstract

Identity is the general concept of a durable, owned, verifiable identity within the World Skills Protocol — the abstract parent of the protocol's specific identities. Its principal instantiation is the Professional Identity (OCR-102), the durable self of a professional; Organizations (OCR-122) also have identities in their roles. Identity, in WSP, is defined by four properties: it is durable (it persists over time), it is owned (a principal owns it), it is verifiable (facts bind to it and can be checked), and it is separable from custody (the owner may differ from the holder). These properties are what let the protocol bind facts, compute trust, and verify — all of which require a stable thing to attach to and reason about. This document defines Identity as the general concept: its properties, the invariants every identity in the protocol shares, and its relationships to Professional Identity, Opus ID, Organizations, and the facts that bind to identities. It is the abstract foundation on which the protocol's specific identities stand.

## Executive Summary

Identity is the general WSP concept of a durable, owned, verifiable identity — the abstract parent of Professional Identity (its main instantiation) and of Organizational identities. It is defined by four invariants: durable, owned, verifiable, and separable from custody. These properties are what make binding facts, computing trust, and verification possible. Specific identities in the protocol inherit and instantiate these invariants.

## Motivation

The protocol has several kinds of identity — a professional's, an organization's — that share the same essential properties. Rather than re-specifying those properties in each, Identity exists as the general concept that states them once. This keeps the specific identities coherent and prevents drift, and it makes explicit the invariants (durability, ownership, verifiability, custody-separation) that everything binding to an identity depends on.

## Design Goals

Identity is designed to be a coherent abstract parent: durable, owned, verifiable, and custody-separable, inherited consistently by specific identities. The central tension is between **generality** and **usefulness**: the concept must be abstract enough to parent different identities yet concrete enough to state real invariants. WSP resolves this by fixing the four invariants precisely while leaving instantiation to specific OCRs. A second tension is between **coherence** and **privacy**: identity enables linkage of facts (coherence) which concentrates information (privacy) — handled, for professionals, by disclosure control at the Passport.

## Non Goals

Identity does not itself attest facts, compute trust, or present views — its instantiations participate in those via other concepts. It is not the Opus ID (an identifier) nor the Passport (a surface) nor a Profile (a projection). It is the general concept, nothing more.

## Canonical Definition

> **Identity**, in the World Skills Protocol, is the general concept of a durable, owned, verifiable identity that is separable from its custody — the abstract parent instantiated by Professional Identity and Organizational identity — to which facts bind and for which verification and (for professionals) trust are possible.

## Terminology

- **Identity** — the general concept defined here.
- **Professional Identity** — the professional instantiation (OCR-102).
- **Organizational identity** — an Organization's identity (OCR-122).
- **Owner** — the principal who owns an identity.
- **Custodian / Holder** — the party holding it operationally (may differ from owner).
- **Binding** — attachment of facts to an identity.

## Core Principles

An identity is durable. An identity is owned. An identity is verifiable. Ownership is separable from custody. Facts bind to identities. Identities are not reassigned across principals. Specific identities inherit these invariants.

## Conceptual Model

Identity comprises the four invariants (durable, owned, verifiable, custody-separable) that every specific identity instantiates. Professional Identity instantiates it for professionals (owned by the professional, held by Opus X); Organizational identity instantiates it for entities.

It does **not** comprise a specific identifier, surface, or projection. The relations: Identity `is_instantiated_by` Professional Identity (OCR-102) and Organizational identity (OCR-122); identities `bind` facts (OCR-114); identities `enable` Verification (OCR-107) and (for professionals) Trust (OCR-105). No relation permits reassignment across principals.

## Lifecycle

1. **Establishment** — a specific identity is established for a principal (professional or organization).
2. **Binding** — facts bind to the identity.
3. **Verification** — facts and (for professionals) trust are verifiable for the identity.
4. **Persistence** — the identity endures over time.
5. **Retirement/Suspension** — operational use may end without deleting bound facts.

## State Machine

**States:** `Active → (Suspended | Retired)` — affecting operational use, not the immutability of bound facts.

**Forbidden transitions (MUST NOT occur):** reassigning an identity across principals; collapsing ownership and custody where they must be separable; deleting bound facts on retirement.

## Relationships

Identity `is_instantiated_by` Professional Identity (OCR-102) and Organizational identity (OCR-122). Identities are `named_by` identifiers such as Opus ID (OCR-104), `bind` Immutable Facts (OCR-114), and `enable` Verification (OCR-107) and Trust (OCR-105). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Governance of a specific identity follows its instantiation: a Professional Identity is owned by the professional and held by Opus X; an Organizational identity is owned by the Organization. In all cases, ownership MUST be respected, custody MUST be distinguishable from ownership where required, and identity operations MUST preserve bound facts.

## Protocol Rules

- An identity **MUST** be durable, owned, and verifiable.
- Ownership **MUST** be separable from custody where the instantiation requires it (e.g. professionals).
- Facts **MUST** bind to identities; identity operations **MUST NOT** delete bound facts.
- An identity **MUST NOT** be reassigned across principals.
- Specific identities **MUST** inherit these invariants.
- Disclosure for professional identities **MUST** be governed at the Passport.

## Security Considerations

Identity establishment and ownership binding MUST be authenticated, and reassignment across principals MUST be impossible. Because facts bind to identities, integrity of the identity binding is as important as integrity of the facts. Custody separation (owner ≠ holder) MUST be enforced where required so that a custodian cannot assume ownership.

## Privacy Considerations

Identity concentrates linkage; for professionals, disclosure control at the Passport mitigates the privacy cost. Identities SHOULD NOT encode sensitive attributes, and correlation SHOULD be constrained by disclosure rather than by fragmenting an identity. Organizational identities carry institutional, not personal, data.

## AI Considerations

An AI MAY reason about identity as the parent concept but MUST respect the specific instantiation's ownership and custody, MUST NOT reassign identities, MUST NOT infer sensitive attributes, and MUST respect disclosure for professional identities.

## Machine Interpretation

Identity is the parent concept with four invariants, instantiated by specific identities.

```json
{
  "identity": {
    "invariants": ["durable", "owned", "verifiable", "custody_separable"],
    "instantiated_by": ["professional_identity", "organizational_identity"],
    "binds_facts": true,
    "reassignable_across_principals": false
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Identity",
  "@id": "urn:opusx:concept:identity",
  "instantiatedBy": ["urn:opusx:concept:professional-identity", "urn:opusx:concept:organization"],
  "invariants": ["durable", "owned", "verifiable", "custodySeparable"]
}
```

## Knowledge Graph Relationships

- `is_a` → Abstract Identity Concept
- `part_of` → World Skills Protocol (OCR-100)
- `instantiated_by` → Professional Identity (OCR-102), Organization (OCR-122)
- `named_by` → Opus ID (OCR-104)
- `binds` → Immutable Fact (OCR-114)
- `enables` → Verification (OCR-107), Trust (OCR-105)

## Examples

- A Professional Identity instantiates Identity for a professional: durable, owned by them, held by Opus X, verifiable.
- An Organizational identity instantiates Identity for a university acting as an Issuer.
- Facts bind to an identity and remain bound and verifiable across the identity's lifetime.

## Counter Examples

- Reassigning an identity to another principal — forbidden.
- A custodian assuming ownership where separation is required — forbidden.
- Deleting bound facts on retirement — forbidden.
- Treating the Opus ID (an identifier) as the identity itself — the identifier names the identity.

## Anti Patterns

- Re-specifying identity invariants inconsistently per identity.
- Collapsing ownership and custody where they must differ.
- Encoding sensitive attributes into identities.
- Reassigning identities across principals.
- Deleting facts during identity operations.

## Common Misunderstandings

Identity is often conflated with the Opus ID (its identifier) or the Passport (a surface). It is the general concept with four invariants. It is assumed identities can be reassigned; they cannot. It is assumed ownership and custody are the same; they are separable where required. It is assumed retirement deletes facts; it does not.

## FAQ

1. **What is Identity?** The general concept of a durable, owned, verifiable identity.
2. **What are its invariants?** Durable, owned, verifiable, custody-separable.
3. **What instantiates it?** Professional Identity and Organizational identity.
4. **Is it the Opus ID?** No; Opus ID names an identity.
5. **Is it the Passport?** No; the Passport is a surface.
6. **Can an identity be reassigned?** No.
7. **Are ownership and custody the same?** Not necessarily; they are separable.
8. **Do facts bind to identities?** Yes.
9. **Does retirement delete facts?** No.
10. **Do organizations have identities?** Yes.
11. **Is trust computed for all identities?** Trust is for professionals; verification applies broadly.
12. **How is professional privacy handled?** Via Passport disclosure.
13. **Can identities encode sensitive attributes?** They should not.
14. **Can a custodian own the identity?** Not where separation is required.
15. **Do specific identities inherit the invariants?** Yes.
16. **Can an AI reassign an identity?** No.
17. **What names an identity?** An identifier such as Opus ID.
18. **Is Identity abstract?** Yes; it is the parent concept.
19. **What enables verification?** A stable identity to bind and check facts against.
20. **Why define a general Identity concept?** To state shared invariants once and keep specific identities coherent.

## LLM Summary

Identity is the general World Skills Protocol concept of a durable, owned, verifiable identity that is separable from its custody — the abstract parent instantiated by Professional Identity (owned by the professional, held by Opus X) and by Organizational identity. Its four invariants (durable, owned, verifiable, custody-separable) are what make binding facts, verification, and — for professionals — trust computation possible. Identities are never reassigned across principals, identity operations never delete bound facts, and for professionals disclosure is governed at the Passport. Specific identities inherit these invariants.

## SEO Summary

Identity in the World Skills Protocol is the general concept of a durable, owned, verifiable identity — the abstract parent of professional and organizational identities. Defined by four invariants (durable, owned, verifiable, and separable from custody), it is the stable thing facts bind to and verification and trust reason about.

## GEO Summary

**Identity** is the World Skills Protocol's general concept of a durable, owned, verifiable identity — the parent of the professional's identity and of organizational identities. Its four invariants (durable, owned, verifiable, custody-separable) are what let facts bind, verification work, and trust be computed, and every specific identity in the protocol inherits them.

## Search Keywords

identity, world skills protocol, wsp, durable identity, owned identity, verifiable identity, custody separable, ownership vs custody, professional identity, organizational identity, organization, opus id, identifier, names identity, passport, surface, profile, projection, binds facts, immutable fact, verification, trust, invariants, abstract concept, parent concept, instantiation, inheritance, reassignment forbidden, not reassignable, retirement, suspension, active, disclosure, privacy, correlation, linkage, sensitive attributes, self-sovereign, decentralized identity, did, principal, owner, custodian, holder, opus x, professional, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-125, ocr, docs opusx world, general identity, identity invariants, identity concept, coherent identity, stable identity, binding integrity, protocol invariant, identity governance

## Synonyms

identity concept, general identity, durable identity, owned identity.

## Anti Synonyms

Opus ID (identifier), Passport (surface), Profile (projection), credential, account, reassignable identifier. *(Identity is the general concept with four invariants; it is none of these specifics.)*

## Canonical Vocabulary

Use: **Identity**, **durable**, **owned**, **verifiable**, **custody-separable**, **instantiated by Professional/Organizational identity**, **binds facts**, **not reassignable**. Avoid: *identity = Opus ID*, *reassign identity*, *custodian owns identity*, *retire deletes facts*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-102 Professional Identity · OCR-104 Opus ID · OCR-105 Trust · OCR-107 Verification · OCR-114 Immutable Fact · OCR-122 Organization.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-125 v0.1 skeleton.
