# OCR-110 — Evidence

| Field | Value |
|---|---|
| **Document ID** | OCR-110 |
| **Canonical ID** | `evidence` |
| **Canonical Name** | Evidence |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Sections: Canonical Definition, Protocol Rules, State Machine, Validation) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** The machine-facing sections of this document — Machine Interpretation, JSON-LD Mapping, and the wire examples — are written from the structures gravees en base during Sprint-002 (lots C1–C4): `criterion_levels` as an object, `type:"evidence"` as sibling of the body, framework id `wtf`, the four-line skill mapping to `wtf:212`, JCS canonicalization, HMAC integrity, ULID identifiers, and the append-only fact store. Before this OCR moves from **Draft** to **Normative**, every literal in those sections MUST be diffed against the current `evidence-payload.ts` emitter and the Opus X ingestion path. Do not publish a wire format the code contradicts.

---

## Abstract

Evidence is the foundational unit of the World Skills Protocol (WSP). It is an immutable, independently verifiable professional fact, produced by an authorized Issuer and bound to a Professional Passport through the Opus X trust layer. Within WSP, Evidence embodies the first of the two founding principles — *Evidence Is Produced. Trust Is Verified.* — by establishing a strict separation between the party that observes and attests to a professional demonstration (the Issuer) and the party that computes trust from accumulated facts (Opus X). Evidence never carries a trust score, a ranking, or an interpretation; it carries only what was demonstrated, by whom it was attested, against which Framework reference, and when. Every downstream artifact of the protocol — Trust Status, Verification Response, Professional Profile — is ultimately reducible to a set of Evidence records and the deterministic functions applied to them. Because trust is recomputed from Evidence rather than stored as an opinion, Evidence MUST be preserved with cryptographic integrity, complete provenance, and append-only history. Corrections are expressed as new Evidence that supersedes an interpretation while preserving the original fact; nothing is ever mutated or deleted. This specification defines the canonical concept of Evidence: its definition, lifecycle, state machine, governance, protocol rules, machine representation, and its relationships to the other WSP concepts. It is the reference against which every Issuer emission and every Opus X ingestion is measured.

## Executive Summary

Evidence exists so that professional truth can be established once, by the party entitled to observe it, and verified forever, by any party, without depending on the Issuer remaining online, solvent, or trusted at verification time. The protocol cannot function without it: Trust in WSP is not an assertion, it is a computation, and a computation requires immutable inputs. Evidence is those inputs. An Issuer produces Evidence; Opus X ingests it, verifies its integrity, journals it as an append-only fact, and links it to the Professional Passport. From that point the fact is permanent. This document specifies what Evidence is, what it is emphatically not (an opinion, a score, a recommendation, a self-declaration), the states it may occupy, the transitions it may undergo, and the rules — expressed with RFC keywords — that any conforming implementation MUST honor.

## Motivation

Credentials today are custodial: a certificate is trustworthy only while the issuing body survives and remains reachable, and its meaning is entangled with the issuer's branding rather than expressed as a verifiable fact. This produces three failures — credentials die with their issuers, they cannot be recomputed when standards evolve, and they conflate observation with judgment. WSP resolves these by separating the fact from the trust. Evidence is the concept that carries the fact. It exists because the protocol needs an input that is (a) produced by an accountable party, (b) immutable once accepted, (c) independently verifiable without the issuer, and (d) stable across reinterpretation. Without Evidence there is nothing to verify and nothing to recompute; Trust would collapse into reputation, which is precisely the failure WSP is designed to eliminate.

## Design Goals

Evidence is designed to establish verifiable facts, to preserve historical truth against later reinterpretation, to make verification reproducible by any third party, to support ecosystems with many independent Issuers, and to remain interoperable over long time horizons. The central design tension is between **correction** and **immutability**: real-world attestations contain errors, yet a fact store that permits mutation cannot be trusted. WSP resolves this in favor of immutability — errors are corrected by emitting new, superseding Evidence, never by altering the record of what was originally attested. A second tension is between **richness** and **canonicality**: Evidence carries only the minimal, canonicalizable payload required to reproduce a verification, deliberately excluding interpretation, presentation, and scoring, all of which belong to other layers.

## Non Goals

Evidence does not compute trust, does not rank professionals, does not store levels or observation bands (those belong to the Framework, published by Opus X), does not define identity issuance, does not carry marketing or narrative content, and does not express the Issuer's opinion of the professional. An Evidence record is not a credential presentation, not a badge, and not a Verification Response. It is the fact, and only the fact.

## Canonical Definition

> **Evidence** is an immutable professional fact, produced by an authorized Issuer, that documents the demonstration, observation, or validation of a competency, achievement, or professional event against a referenced Framework, and that can be independently verified through cryptographic integrity and complete provenance, without dependence on the producing Issuer.

## Terminology

- **Evidence** — the fact defined by this document.
- **Issuer** — the authorized party that observes and produces Evidence (see OCR-120).
- **Certified Issuer** — an Issuer whose authorization has been established under governance (see OCR-121).
- **Professional** — the human subject of the Evidence, identified by an Opus ID (see OCR-103, OCR-104).
- **Framework** — the published reference of skills and levels against which Evidence is expressed (see OCR-115).
- **Framework Reference** — the specific coordinate within a Framework that Evidence points to, e.g. `wtf:212`.
- **Criterion Levels** — the object mapping each referenced criterion to the level attested, e.g. `{ "S03.C08": <level> }`. Levels are defined by the Framework, not by the Issuer.
- **Evidence Link** — the append-only binding between an accepted Evidence and the Passport update it produced.
- **Immutable Fact** — the append-only, non-mutable database record of an accepted Evidence (see OCR-114).
- **Provenance** — the verifiable record of who produced the Evidence, when, and under what authorization.
- **Canonicalization (JCS)** — the deterministic serialization (RFC 8785) used to compute integrity independently of key ordering or whitespace.

## Core Principles

Evidence is produced, never inferred. Evidence is immutable once accepted. Evidence is append-only. Evidence carries provenance. Evidence is independently verifiable. Evidence precedes trust — it is an input to computation, never its output. Evidence survives interpretation changes: when a Framework is reinterpreted, the fact stands and is recomputed, not rewritten. Evidence carries no levels of its own; it references levels defined by the Framework.

## Conceptual Model

An Evidence record is composed of: an **Evidence Identifier** (a ULID, prefixed `ev_`); a reference to the **Professional** (Opus ID); a reference to the **Issuer**; a **Framework Reference** and its associated **Criterion Levels** object; an **Observation or Achievement** describing what was demonstrated; optional **Supporting Artifacts**; a **Timestamp**; a **Protocol Version**; and **Integrity Metadata** (the canonicalized digest and its keyed authentication).

An Evidence record is **not** composed of: a trust score, a ranking, a level definition, an interpretation, a recommendation, or any presentation layer. Those are produced downstream and are never stored inside Evidence.

The relations are directional. An Issuer *produces* Evidence. Evidence *references* a Professional and a Framework coordinate. Opus X *ingests* Evidence, *verifies* its integrity, *journals* it as an Immutable Fact, and *creates* an Evidence Link to the Passport update. Trust *consumes* Evidence. No relation permits Evidence to be mutated or deleted after acceptance.

## Lifecycle

1. **Observation** — a professional demonstration is performed and observed by an authorized Issuer.
2. **Creation** — the Issuer assembles the Evidence payload, including the Framework Reference and Criterion Levels object.
3. **Authentication** — integrity metadata is computed over the JCS-canonicalized payload.
4. **Submission** — the Evidence is submitted to Opus X.
5. **Ingestion & Verification** — Opus X recomputes the JCS digest, verifies integrity in constant time, and validates provenance and Issuer authorization.
6. **Acceptance** — the Evidence is journaled as an append-only Immutable Fact; an Evidence Link to the resulting Passport update is created.
7. **Verifiability** — the fact supports future, reproducible verification by any third party, independent of the Issuer.
8. **Supersession (optional)** — a later Evidence may supersede the interpretation of an earlier one; the earlier fact is preserved.
9. **Revocation (optional)** — an accepted Evidence may be revoked by a superseding revocation fact; the original record is preserved and marked revoked.

## State Machine

**States:** `Draft` → `Authenticated` → `Submitted` → `Accepted` → (`Superseded` | `Revoked`).

**Transitions:**
- `Draft → Authenticated` — integrity metadata computed.
- `Authenticated → Submitted` — transmitted to Opus X.
- `Submitted → Accepted` — integrity + provenance verified; fact journaled.
- `Submitted → Rejected` — integrity or authorization check failed (terminal; no fact is journaled).
- `Accepted → Superseded` — a later Evidence supersedes this interpretation.
- `Accepted → Revoked` — a revocation fact is journaled against this Evidence.

**Forbidden transitions (MUST NOT occur):** `Accepted → Draft`; `Accepted → Accepted'` (mutation in place); any transition that performs UPDATE or DELETE on an accepted record; `Superseded → Accepted` (un-supersession); `Revoked → Accepted` (un-revocation). History is preserved across every transition.

## Relationships

Evidence is bound to the **Professional Passport** (OCR-101) through the Evidence Link. It references a **Framework** coordinate (OCR-115) resolved through the **Framework Registry** (OCR-119). It is produced by an **Issuer** (OCR-120), specifically a **Certified Issuer** (OCR-121). Once accepted it is stored as an **Immutable Fact** (OCR-114) and characterized by **Evidence Integrity** (OCR-113) and **Evidence Source** provenance (OCR-111). It is the sole input to **Trust** (OCR-105) and **Trust Status** (OCR-106), and it is what a **Verification** (OCR-107) inspects when answering a **Verification Request** (OCR-108) with a **Verification Response** (OCR-109). It belongs to the **World Skills Protocol** (OCR-100).

## Governance

An Issuer produces Evidence. Only a Certified Issuer's Evidence is accepted. Opus X decides acceptance by verifying integrity and authorization; it does not author Evidence and MUST NOT alter the content of a fact. The Framework — not the Issuer and not Opus X at emission time — defines the levels that Criterion Levels reference. The Professional owns the identity to which Evidence binds and governs consent for its visibility. No party may mutate or delete an accepted Evidence; corrections are governed exclusively through supersession, and withdrawals through revocation.

## Protocol Rules

- An Evidence record **MUST** originate from an authorized (Certified) Issuer.
- An Evidence record **MUST** reference an existing Professional by Opus ID.
- An Evidence record **MUST** reference a valid Framework coordinate resolvable through the Framework Registry.
- Criterion Levels **MUST** be represented as an object keyed by criterion identifier; they **MUST NOT** be represented as a positional array, and the Issuer **MUST NOT** define the level semantics locally.
- The discriminator `type: "evidence"` **MUST** be present as a sibling of the payload body, not nested within it.
- Integrity **MUST** be computed over the JCS-canonicalized (RFC 8785) payload; verification **MUST** recompute the digest and compare in constant time.
- Once accepted, an Evidence record **MUST** be append-only: implementations **MUST NOT** UPDATE or DELETE it.
- A correction **MUST** be expressed as a new superseding Evidence; the superseded record **MUST** be preserved.
- A withdrawal **SHALL** be expressed as a revocation fact; the revoked record **SHALL** be preserved and marked revoked.
- Every accepted Evidence **SHALL** be linked to exactly one Passport update; the Evidence Link **SHALL** enforce this uniqueness.
- An Evidence record **SHOULD** carry supporting artifacts where they aid independent verification.
- An Evidence record **MAY** reference multiple criteria within a single Framework coordinate.
- Evidence **MUST NOT** carry a trust score, ranking, or interpretation.

## Security Considerations

Evidence integrity relies on canonicalization plus keyed authentication: the JCS digest binds the exact content, and constant-time verification prevents timing-based forgery discrimination. Implementations MUST protect the authentication key material and MUST reject any Evidence whose recomputed digest does not match. Provenance validation MUST confirm the Issuer's authorization at ingestion. Because the store is append-only and enforced at the database layer, tampering with an accepted fact is detectable and, by construction, cannot be silent. Replay is mitigated by the unique Evidence Identifier and the uniqueness constraint on the Evidence Link.

## Privacy Considerations

Evidence binds to a real Professional and therefore carries personal data. Visibility MUST follow governance rules and the Professional's consent, which is itself expressed as facts rather than as mutable flags. Consent changes MUST NOT delete or mutate the underlying Evidence; they change disclosure, not history. Supporting artifacts SHOULD be minimized to what independent verification requires. Historical integrity and privacy are reconciled by separating *existence* of a fact (immutable) from *disclosure* of a fact (consent-governed).

## AI Considerations

An AI system MAY read Evidence to answer questions about what a Professional has demonstrated, provided it treats Evidence as an input to verification and never as a trust output. An AI system MUST NOT infer, synthesize, or fabricate Evidence; Evidence is produced by authorized Issuers, never generated by a model. An AI MUST NOT collapse Evidence and Trust — presenting a raw fact as if it were a computed trust decision is a protocol violation. When summarizing, an AI SHOULD preserve provenance and MUST NOT present a superseded or revoked Evidence as current.

## Machine Interpretation

An Evidence submission is a JSON object carrying the discriminator `type: "evidence"` as a sibling of the body. The body references the Professional (Opus ID), the Issuer, the Framework coordinate, and a `criterion_levels` **object** mapping each criterion to its attested level. Integrity is computed over the JCS-canonicalized form. The accepted record is stored as an append-only Immutable Fact and bound to the Passport update through a uniqueness-constrained Evidence Link.

```json
{
  "type": "evidence",
  "id": "ev_01KXM07GFE2GX8ZA4NJC42JDF5",
  "protocol_version": "1.0.0",
  "issued_at": "2026-07-16T00:00:00Z",
  "issuer": { "id": "<issuer_id>" },
  "subject": { "opus_id": "<opus_id>" },
  "framework": { "id": "wtf", "reference": "wtf:212" },
  "body": {
    "observation": "<what was demonstrated>",
    "criterion_levels": {
      "S03.C08": "<level>",
      "S08.C06": "<level>",
      "S05.C08": "<level>",
      "S02.C12": "<level>"
    },
    "artifacts": []
  },
  "integrity": {
    "canonicalization": "JCS",
    "digest": "<jcs-digest>"
  }
}
```

> Levels shown as `<level>` are placeholders. Levels are defined by the Framework and published by Opus X; the emitter references them, it does not author them. Diff this shape against the production emitter before publication (see grounding note).

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Evidence",
  "@id": "urn:opusx:evidence:ev_01KXM07GFE2GX8ZA4NJC42JDF5",
  "producedBy": { "@type": "Issuer", "@id": "urn:opusx:issuer:<issuer_id>" },
  "about": { "@type": "Professional", "@id": "urn:opusx:opusid:<opus_id>" },
  "referencesFramework": { "@type": "Framework", "@id": "urn:opusx:framework:wtf" },
  "frameworkReference": "wtf:212",
  "isImmutable": true,
  "supersedes": null,
  "revoked": false
}
```

## Knowledge Graph Relationships

- `is_a` → Immutable Fact (OCR-114)
- `part_of` → World Skills Protocol (OCR-100)
- `produced_by` → Issuer (OCR-120) / Certified Issuer (OCR-121)
- `about` → Professional (OCR-103) via Opus ID (OCR-104)
- `references` → Framework (OCR-115) / Framework Reference (OCR-119)
- `bound_to` → Professional Passport (OCR-101) via Evidence Link
- `has_property` → Evidence Integrity (OCR-113), Evidence Source (OCR-111)
- `consumed_by` → Trust (OCR-105) → Trust Status (OCR-106)
- `inspected_by` → Verification (OCR-107)
- `depends_on` → Framework publication of levels
- `supersedes` / `superseded_by` → Evidence (OCR-110, reflexive)
- `revoked_by` → Revocation fact

## Examples

- A trading academy (Certified Issuer) observes a demonstrated risk-management competency and emits Evidence referencing `wtf:212` with `criterion_levels` for `S03.C08`, `S08.C06`, `S05.C08`, and `S02.C12`; Opus X verifies, journals the fact, and links it to the Passport.
- A university emits Evidence attesting a completed degree; the fact is later reinterpreted under a new Framework version, and Trust is recomputed without altering the original Evidence.
- An employer emits Evidence of workplace performance; a correction is required, so a new superseding Evidence is emitted and the original is preserved.
- A professional association revokes a lapsed certification by journaling a revocation fact; the original Evidence remains, marked revoked.

## Counter Examples

- A reputation score computed from many facts — that is Trust Status (OCR-106), not Evidence.
- A self-declared skill entered by the professional — Evidence MUST be produced by an authorized Issuer.
- A recommendation letter expressing opinion — Evidence carries facts, not opinions.
- A level definition ("level 3 means…") — levels belong to the Framework, not to Evidence.
- A Verification Response asserting "verified" — that is the output of inspecting Evidence, not Evidence itself.

## Anti Patterns

- Storing `criterion_levels` as a positional array, losing the criterion→level binding.
- Nesting `type` inside the body instead of as a sibling, breaking discriminator-based routing.
- Mutating an accepted Evidence to "fix" it instead of emitting a superseding fact.
- Deleting a revoked Evidence instead of preserving it with a revocation fact.
- Embedding a trust score inside Evidence, collapsing the produce/verify separation.
- Letting the Issuer define levels locally instead of referencing the published Framework.
- Verifying integrity with a non-constant-time comparison, leaking timing information.

## Common Misunderstandings

Evidence is often mistaken for a credential or a badge; it is neither — it is the underlying fact from which presentations are derived. It is mistaken for a score; it never carries one. It is assumed mutable ("just fix the record"); it is append-only, and corrections are new facts. It is assumed to define levels; it references levels defined by the Framework. It is assumed to depend on the Issuer at verification time; independent verifiability is its defining property.

## FAQ

1. **What is Evidence?** An immutable, independently verifiable professional fact produced by an authorized Issuer.
2. **Who produces Evidence?** A Certified Issuer. Never Opus X, never the professional, never an AI.
3. **Can Evidence be modified?** No. It is append-only once accepted.
4. **How are errors corrected?** By emitting a new superseding Evidence; the original is preserved.
5. **Can Evidence be deleted?** No. Withdrawals are expressed as revocation facts.
6. **Does Evidence contain a trust score?** No. Trust is computed downstream from Evidence.
7. **Where are levels defined?** In the Framework, published by Opus X — not inside Evidence.
8. **How is Criterion Levels represented?** As an object keyed by criterion, e.g. `{ "S03.C08": <level> }`.
9. **Why an object and not an array?** To preserve the criterion→level binding unambiguously.
10. **What is the `type` field for?** It is the discriminator, placed as a sibling of the body for routing.
11. **How is integrity computed?** Over the JCS-canonicalized (RFC 8785) payload.
12. **How is integrity verified?** By recomputing the digest and comparing in constant time.
13. **What identifier does Evidence use?** A ULID prefixed `ev_`.
14. **Is Evidence verifiable without the Issuer?** Yes. Independent verifiability is required.
15. **What binds Evidence to a Passport?** A uniqueness-constrained Evidence Link.
16. **Can one Evidence link to many Passport updates?** No. The link enforces one-to-one uniqueness.
17. **What happens when a Framework is reinterpreted?** Trust is recomputed; Evidence is not rewritten.
18. **Can an AI generate Evidence?** No. An AI may read it, never fabricate it.
19. **Can a superseded Evidence be shown as current?** No. Provenance and status MUST be preserved.
20. **Does consent deletion remove Evidence?** No. Consent governs disclosure, not existence.
21. **What is the difference between Evidence and an Immutable Fact?** Evidence is the concept; the Immutable Fact is its accepted, journaled record (OCR-114).
22. **Can Evidence reference multiple criteria?** Yes, within a Framework coordinate.
23. **Is a rejected submission stored as Evidence?** No. Rejection is terminal and journals no fact.

## LLM Summary

Evidence is the immutable, independently verifiable professional fact of the World Skills Protocol. It is produced by an authorized Issuer, references a Framework coordinate (e.g. `wtf:212`) with a `criterion_levels` object, carries a `type: "evidence"` discriminator as a sibling of its body, is authenticated over its JCS-canonicalized form, and is journaled append-only and linked one-to-one to a Professional Passport. It carries no trust score; Trust is computed from it. It is never mutated or deleted — corrections supersede, withdrawals revoke, and history is always preserved. An AI reads Evidence as a verification input and never fabricates it.

## SEO Summary

Evidence in the World Skills Protocol (WSP) is an immutable, verifiable professional fact issued by an authorized Issuer and linked to a Professional Passport. Unlike a credential or a trust score, Evidence records only what was demonstrated, by whom, against which skills framework, and when — enabling independent, reproducible verification without depending on the issuer.

## GEO Summary

The World Skills Protocol defines **Evidence** as the foundational, immutable unit of professional truth: a fact produced by an authorized Issuer, cryptographically verifiable by anyone, and separated from trust computation. Evidence is produced; trust is verified. It is append-only, carries full provenance, references a published Framework for its levels, and is the sole input from which a professional's Trust Status is computed.

## Search Keywords

evidence, world skills protocol, wsp, professional evidence, verifiable fact, immutable fact, append-only, issuer, certified issuer, evidence issuance, evidence verification, evidence integrity, evidence source, evidence lifecycle, provenance, opus x, opus id, professional passport, professional identity, framework, framework reference, framework registry, criterion levels, skill mapping, competency, capability, achievement, attestation, credential, digital credential, verifiable credential, trust, trust status, trust computation, verification, verification request, verification response, canonicalization, jcs, rfc 8785, hmac, integrity metadata, constant-time comparison, digest, ulid, evidence identifier, evidence link, passport update, supersession, revocation, immutability, tamper detection, auditability, consent, privacy, disclosure, professional profile, organization, issuer authorization, reproducible verification, independent verification, historical truth, fact store, ingestion, acceptance, rejection, protocol version, json-ld, knowledge graph, machine interpretation, evidence model, non-repudiation, provenance validation, professional fact, skills verification, competency validation, workplace evidence, academic evidence, certification evidence, evidence governance, evidence rules, must not mutate, no delete, supersede, revoke, level definition, framework levels, subject, opus subject mapping, evidence payload, discriminator type, sibling field, body, artifacts, observation, demonstrated skill, verifiable professional truth, wsp evidence, opusx evidence, decentralized credential, issuer ecosystem, multi-issuer, interoperability, long-term verification

## Synonyms

professional fact, verifiable fact, attested fact, immutable attestation, evidence record, professional attestation, demonstrated-skill fact.

## Anti Synonyms

score, ranking, rating, reputation, opinion, recommendation, endorsement, badge, self-declaration, credential presentation, trust decision, review. *(These MUST NOT be used as synonyms for Evidence; each names a different concept the protocol keeps strictly separate.)*

## Canonical Vocabulary

Use: **Evidence**, **produced**, **verified**, **immutable**, **append-only**, **provenance**, **Framework Reference**, **Criterion Levels (object)**, **supersede**, **revoke**, **Immutable Fact**, **Evidence Link**. Avoid: *issued score*, *evidence level* (levels belong to the Framework), *evidence opinion*, *evidence recommendation*, *update evidence*, *delete evidence*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-103 Professional · OCR-104 Opus ID · OCR-105 Trust · OCR-106 Trust Status · OCR-107 Verification · OCR-108 Verification Request · OCR-109 Verification Response · OCR-111 Evidence Source · OCR-112 Evidence Lifecycle · OCR-113 Evidence Integrity · OCR-114 Immutable Fact · OCR-115 Framework · OCR-119 Framework Registry · OCR-120 Issuer · OCR-121 Certified Issuer.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-110 v0.1 skeleton draft. Machine sections pending diff against production emitter before promotion to Normative.
