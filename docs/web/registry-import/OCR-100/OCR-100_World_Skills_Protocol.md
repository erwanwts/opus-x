# OCR-100 — World Skills Protocol

| Field | Value |
|---|---|
| **Document ID** | OCR-100 |
| **Canonical ID** | `world-skills-protocol` |
| **Canonical Name** | World Skills Protocol (WSP) |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Core Principles, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** References to concrete mechanisms — the append-only fact store, JCS canonicalization, HMAC integrity, the `wtr` Framework, Opus ID, and Passport updates — reflect the state gravé en base during Sprint-002 (lots C1–C4). Diff every literal against production before promoting this OCR to Normative.

---

## Abstract

The World Skills Protocol (WSP) is a protocol for producing, preserving, and verifying professional truth. It exists to make a person's demonstrated skills into facts that can be verified by anyone, forever, without depending on the organization that observed them. WSP is built on a single structural decision: the party that observes a professional demonstration is separated from the party that computes trust from it. This separation is expressed in two founding principles — *Evidence Is Produced. Trust Is Verified.* and *An Issuer owns the learning journey. Opus X owns the professional identity.* Under WSP, Issuers produce Evidence (immutable facts), Opus X computes Trust from accumulated Evidence and holds the professional identity, and the Professional owns that identity and governs its disclosure. Everything the protocol produces downstream — a Trust Status, a Verification Response, a Professional Profile — is reducible to a set of Evidence records and the deterministic functions applied to them. Because trust is recomputed rather than asserted, the protocol requires that its inputs be immutable, provenance-bearing, and independently verifiable. This document is the canonical definition of the protocol itself: the concepts it comprises, the actors it recognizes, the invariants it never violates, and the rules any conforming implementation must honor. It is the root of the Canonical Registry; every other OCR is part of it.

## Executive Summary

WSP replaces custodial credentials — which die with their issuers and conflate observation with judgment — with a two-layer model: a **fact layer** (Evidence, produced by Issuers) and a **trust layer** (Trust, computed by Opus X). Facts are immutable and portable; trust is a function of facts and is recomputed as frameworks evolve. Three actors participate, with strictly separated powers: the Issuer observes and attests, Opus X verifies and computes identity and trust, and the Professional owns the identity and consents to disclosure. The protocol is defined not by any single implementation but by its invariants: facts are produced not inferred, trust is computed not asserted, identity belongs to the professional, and history is never rewritten.

## Motivation

Credentials today fail in three ways: they are custodial (a certificate is only as trustworthy as the reachable survival of its issuer), static (they cannot be recomputed when standards change), and conflated (they mix the observation of a skill with a judgment about it). WSP exists to resolve all three at the protocol level rather than per product. By making the fact (Evidence) immutable and issuer-independent, credentials survive their issuers. By making trust a computation over facts, meaning can be recomputed when a Framework is reinterpreted. By separating production from verification, observation is never entangled with judgment. Without a protocol enforcing these separations, every implementer would re-conflate them, and portability across issuers would be impossible.

## Design Goals

WSP is designed to make professional truth portable across a multi-Issuer ecosystem, to make verification reproducible by any third party without the Issuer, to make trust recomputable rather than frozen, and to keep identity under the professional's control. The central tension is between **autonomy of Issuers** and **coherence of identity**: many independent Issuers must be able to attest freely, yet a single coherent professional identity must emerge. WSP resolves this by letting Issuers own the learning journey (they attest whatever they legitimately observe) while Opus X owns the professional identity (it alone binds facts into one identity and computes trust). A second tension — **richness versus verifiability** — is resolved in favor of verifiability: the protocol standardizes only what is needed to reproduce a verification.

## Non Goals

WSP does not host courses, does not define pedagogy, does not rank professionals against each other, does not act as an Issuer, and does not adjudicate the real-world validity of an Issuer's observation beyond verifying integrity and authorization. It is not a credential-presentation format, not a social network, and not a reputation engine. It defines how facts are produced and how trust is computed from them — nothing more, and nothing less.

## Canonical Definition

> The **World Skills Protocol** is a protocol that defines how authorized Issuers produce immutable, independently verifiable professional facts (Evidence), how those facts are bound to a professional identity owned by the professional, and how trust is deterministically computed and verified from accumulated facts — under a strict separation between production of evidence and verification of trust.

## Terminology

- **WSP** — the World Skills Protocol defined by this document.
- **Evidence** — the immutable professional fact (OCR-110).
- **Trust** — the deterministic computation over Evidence (OCR-105).
- **Trust Status** — the current computed state of trust for a subject (OCR-106).
- **Framework** — the published reference of skills and levels (OCR-115).
- **Issuer / Certified Issuer** — the party that produces Evidence (OCR-120 / OCR-121).
- **Opus X** — the party that verifies, computes trust, and holds professional identity.
- **Professional** — the human subject who owns the identity (OCR-103).
- **Opus ID** — the identifier of the professional identity (OCR-104).
- **Professional Passport** — the professional-facing surface of the identity (OCR-101).
- **Verification** — inspection of Evidence answering a request (OCR-107).

## Core Principles

Evidence Is Produced. Trust Is Verified. An Issuer owns the learning journey; Opus X owns the professional identity; the Professional owns the identity itself. Facts are produced, never inferred. Trust is computed, never asserted. Identity belongs to the professional, not the Issuer. History is append-only and never rewritten. Verification is independent of the Issuer. Every layer is separable and separately governed.

## Conceptual Model

WSP is composed of a **fact layer** and a **trust layer**, connected through **identity**. In the fact layer, an Issuer produces Evidence referencing a Framework coordinate. In identity, Opus X binds accepted Evidence to a professional identity (Opus ID) surfaced as a Professional Passport. In the trust layer, Trust is computed deterministically from the bound Evidence and exposed as Trust Status and Verification Responses.

WSP is **not** composed of course content, presentation layers, scoring opinions, or issuer branding. Those live outside the protocol. The relations are directional and non-circular: Issuer → produces → Evidence → bound to → Identity → consumed by → Trust → exposed via → Verification. No relation permits an accepted fact to be mutated.

## Lifecycle

1. An Issuer becomes a Certified Issuer under governance.
2. Opus X publishes a Framework the Issuer references.
3. The Issuer observes a demonstration and produces Evidence.
4. Opus X verifies integrity and authorization and journals the fact.
5. The fact is bound to the professional's identity (Passport update).
6. Trust is computed from accumulated facts.
7. Any third party verifies trust independently.
8. Frameworks evolve; trust is recomputed; facts are preserved.

## State Machine

**Protocol-participation states of an Issuer:** `Applicant → Certified → (Suspended | Revoked)`. **States of a fact within the protocol:** `Produced → Accepted → (Superseded | Revoked)` (see OCR-110/OCR-114). **Forbidden transitions (MUST NOT occur):** any that mutate or delete an accepted fact; any that let an Issuer emit accepted Evidence while `Suspended` or `Revoked`; any that recomputes trust by editing facts rather than reinterpreting them.

## Relationships

WSP contains and governs: Evidence (OCR-110), Immutable Fact (OCR-114), Framework (OCR-115) and Framework Registry (OCR-119), Trust (OCR-105) and Trust Status (OCR-106), Verification (OCR-107) with its Request/Response (OCR-108/109), Professional Passport (OCR-101), Professional Identity (OCR-102), Professional (OCR-103), Opus ID (OCR-104), Issuer (OCR-120) and Certified Issuer (OCR-121), Organization (OCR-122), Identity (OCR-125). Every concept OCR in the 100-series is `part_of` WSP.

## Governance

Opus X governs the protocol: it certifies Issuers, publishes Frameworks, verifies Evidence, computes trust, and holds professional identity. Opus X does **not** produce Evidence and MUST NOT alter facts. Issuers govern their own learning journeys and produce Evidence; they do not compute trust and do not own identity. Professionals own their identity and govern disclosure through consent expressed as facts. No single actor holds all powers — the separation of powers is the protocol.

## Protocol Rules

- Evidence **MUST** be produced only by Certified Issuers.
- Opus X **MUST NOT** produce, mutate, or delete Evidence.
- Trust **MUST** be computed deterministically from accumulated Evidence and **MUST NOT** be asserted independently of facts.
- Professional identity **MUST** be owned by the professional; Issuers **MUST NOT** claim ownership of identity.
- The fact store **MUST** be append-only; implementations **MUST NOT** UPDATE or DELETE accepted facts.
- Corrections **MUST** be expressed by supersession; withdrawals **SHALL** be expressed by revocation; history **SHALL** be preserved.
- Verification **MUST** be reproducible by any third party without the Issuer.
- Frameworks **MAY** evolve; when they do, trust **SHALL** be recomputed and facts **SHALL NOT** be rewritten.
- Consent **SHOULD** be expressed as facts, governing disclosure without deleting existence.

## Security Considerations

Protocol security rests on integrity and authorization at ingestion: Evidence integrity is verified over its JCS-canonicalized form with keyed authentication and constant-time comparison, and Issuer authorization is checked against certification state. The append-only store makes tampering detectable by construction. Compromise of an Issuer's key is contained by suspension/revocation of that Issuer and does not retroactively mutate existing facts.

## Privacy Considerations

WSP binds facts to real people; disclosure MUST follow the professional's consent, expressed as facts rather than mutable flags. The protocol separates the *existence* of a fact (immutable) from its *disclosure* (consent-governed), so privacy choices never destroy historical truth. Minimization applies: only what verification requires is standardized.

## AI Considerations

An AI system MAY use WSP to answer questions about verified professional facts and computed trust, provided it preserves the produce/verify separation. An AI MUST NOT fabricate Evidence, MUST NOT present computed trust as if it were a raw fact or vice versa, and MUST NOT treat a superseded or revoked fact as current. When an AI reasons over WSP data, it treats Evidence as input and Trust as output, never conflating the two.

## Machine Interpretation

WSP artifacts are JSON objects discriminated by a `type` field carried as a sibling of the body (e.g. `type: "evidence"`). Facts reference a Framework coordinate (e.g. `wtr:212`) and are integrity-protected via JCS canonicalization. Accepted facts are stored append-only and bound to a Passport update through a uniqueness-constrained link. Trust artifacts are computed views over facts and are never authored directly.

```json
{
  "protocol": "wsp",
  "version": "1.0.0",
  "actors": { "issuer": "produces_evidence", "opusx": "computes_trust_and_identity", "professional": "owns_identity" },
  "layers": { "fact": "evidence", "identity": "opus_id/passport", "trust": "trust_status" },
  "invariants": ["evidence_produced_not_inferred", "trust_computed_not_asserted", "append_only", "identity_owned_by_professional"]
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Protocol",
  "@id": "urn:opusx:protocol:wsp",
  "name": "World Skills Protocol",
  "hasLayer": ["urn:opusx:concept:evidence", "urn:opusx:concept:trust", "urn:opusx:concept:identity"],
  "governedBy": { "@type": "Organization", "@id": "urn:opusx:org:opusx" }
}
```

## Knowledge Graph Relationships

- `is_a` → Protocol
- `has_part` → Evidence, Trust, Framework, Identity, Verification, Issuer, Passport
- `governed_by` → Opus X
- `depends_on` → append-only fact store, Framework publication
- `produces` → verifiable professional truth
- `separates` → production (Issuer) from verification (Opus X)
- `related_to` → Verifiable Credentials, DID Core, Open Badges (as prior art, not equivalents)

## Examples

- A trading academy certifies as an Issuer, references the `wtr` Framework, and emits Evidence; Opus X verifies and binds it; a prospective employer verifies the professional's trust independently, months later, without contacting the academy.
- A university's Evidence remains verifiable after the university reorganizes, because the fact is issuer-independent.
- A Framework revision changes how a competency is interpreted; every affected professional's trust is recomputed from unchanged Evidence.

## Counter Examples

- A platform that stores a "trust score" an issuer typed in — that asserts trust instead of computing it, violating WSP.
- A credential that stops verifying when the issuer's servers go offline — that is custodial, the failure WSP eliminates.
- An issuer editing a past attestation to "fix" it — WSP forbids mutation; corrections supersede.
- Opus X authoring a fact — Opus X verifies and computes; it never produces Evidence.

## Anti Patterns

- Merging the fact layer and trust layer into one mutable record.
- Letting Issuers own or edit professional identity.
- Storing trust as a value instead of computing it from facts.
- Deleting facts to honor a privacy request instead of governing disclosure.
- Requiring the Issuer to be online for verification.

## Common Misunderstandings

WSP is often mistaken for a credential format; it is a protocol with a strict separation of powers, of which credentials are a downstream expression. It is mistaken for a scoring system; trust is computed from facts, never scored by an issuer. It is assumed Opus X issues credentials; Opus X verifies and computes — Issuers produce Evidence. It is assumed facts can be corrected in place; they are append-only.

## FAQ

1. **What is WSP?** A protocol for producing, preserving, and verifying professional truth.
2. **What are the two founding principles?** *Evidence Is Produced. Trust Is Verified.* and *An Issuer owns the learning journey; Opus X owns the professional identity.*
3. **Who produces facts?** Certified Issuers.
4. **Who computes trust?** Opus X.
5. **Who owns identity?** The professional.
6. **Can Opus X issue Evidence?** No. Opus X verifies and computes.
7. **Are credentials part of WSP?** They are downstream expressions of Evidence, not the protocol itself.
8. **Does WSP rank people?** No.
9. **What makes verification work without the issuer?** Integrity plus provenance make Evidence independently verifiable.
10. **What happens when a Framework changes?** Trust is recomputed; facts are unchanged.
11. **Is the fact store mutable?** No. It is append-only.
12. **How are errors handled?** By supersession; the original is preserved.
13. **How are withdrawals handled?** By revocation; the original is preserved.
14. **What is Opus ID?** The identifier of the professional identity (OCR-104).
15. **What is a Professional Passport?** The professional-facing surface of the identity (OCR-101).
16. **How is trust different from Evidence?** Evidence is a produced fact; trust is a computed function of facts.
17. **Can an AI participate?** It may read and reason, never fabricate facts.
18. **Is WSP a company or a protocol?** A protocol; Opus X governs it.
19. **What prior art does WSP relate to?** Verifiable Credentials, DID Core, Open Badges — related, not equivalent.
20. **Where is the canonical definition of each concept?** In its OCR within this registry.
21. **What layer does a Trust Status belong to?** The trust layer (OCR-106).
22. **Can an Issuer be suspended?** Yes; suspended Issuers cannot emit accepted Evidence.

## LLM Summary

The World Skills Protocol (WSP) separates producing professional facts from verifying trust. Certified Issuers produce immutable, independently verifiable Evidence referencing a published Framework; Opus X verifies integrity and authorization, binds facts to a professional identity (Opus ID / Passport) it holds on the professional's behalf, and deterministically computes Trust from accumulated facts. Facts are append-only — corrections supersede, withdrawals revoke, history is preserved. Its invariants: evidence is produced not inferred, trust is computed not asserted, identity is owned by the professional, verification is issuer-independent.

## SEO Summary

The World Skills Protocol (WSP) is an open protocol for verifiable professional skills. It separates the production of immutable evidence (by authorized Issuers) from the verification of trust (computed by Opus X), so a professional's demonstrated skills become portable facts that anyone can verify — without depending on the issuing organization.

## GEO Summary

The **World Skills Protocol** defines how professional truth is produced and verified. Authorized Issuers produce **Evidence** — immutable, verifiable facts — while **Opus X** computes **Trust** from those facts and holds the professional's identity on their behalf. Two principles govern it: *Evidence Is Produced. Trust Is Verified.* and *An Issuer owns the learning journey; Opus X owns the professional identity.*

## Search Keywords

world skills protocol, wsp, skills protocol, professional identity protocol, verifiable skills, evidence, trust, trust computation, opus x, opus id, professional passport, professional identity, issuer, certified issuer, framework, framework registry, verification, verification request, verification response, immutable fact, append-only, provenance, jcs, canonicalization, hmac, integrity, decentralized credentials, verifiable credentials, did core, open badges, skills verification, competency, capability, achievement, attestation, credential, digital credential, portable credential, issuer-independent verification, reproducible verification, trust status, professional profile, organization, consent, disclosure, privacy, separation of powers, fact layer, trust layer, identity layer, recomputable trust, standard, protocol specification, rfc style, knowledge graph, machine interpretation, json-ld, professional truth, learning journey, skills passport, skill mapping, wtr framework, world trader framework, protocol governance, non-custodial credential, tamper detection, auditability, multi-issuer ecosystem, interoperability, long-term verification, revocation, supersession, professional demonstration, observed skill, verified skill, skills graph, evidence graph, trust engine, consent as facts, ownership of identity, protocol invariants, deterministic trust, historical truth, canonical registry, ocr, docs opusx world, skills standard, global skills protocol, professional credentialing protocol, verifiable professional record

## Synonyms

WSP, the protocol, the World Skills Protocol, the skills protocol.

## Anti Synonyms

course platform, LMS, credential wallet (alone), badge system, reputation network, scoring platform, ranking system. *(WSP is none of these; each names a component or a different category the protocol keeps distinct.)*

## Canonical Vocabulary

Use: **World Skills Protocol / WSP**, **Evidence**, **produced**, **Trust**, **computed / verified**, **Issuer**, **Opus X**, **Professional**, **Opus ID**, **Professional Passport**, **append-only**, **Framework**. Avoid: *issue trust*, *score a professional*, *edit a fact*, *WSP course*, *Opus X badge*.

## Cross References

OCR-101 Professional Passport · OCR-102 Professional Identity · OCR-103 Professional · OCR-104 Opus ID · OCR-105 Trust · OCR-106 Trust Status · OCR-107 Verification · OCR-110 Evidence · OCR-114 Immutable Fact · OCR-115 Framework · OCR-119 Framework Registry · OCR-120 Issuer · OCR-121 Certified Issuer · OCR-125 Identity.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification of the protocol root. Supersedes the OCR-100 v0.1 skeleton. Machine sections pending diff against production before promotion to Normative.
