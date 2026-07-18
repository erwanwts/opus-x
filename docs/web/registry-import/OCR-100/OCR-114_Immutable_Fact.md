# OCR-114 — Immutable Fact

| Field | Value |
|---|---|
| **Document ID** | OCR-114 |
| **Canonical ID** | `immutable-fact` |
| **Canonical Name** | Immutable Fact |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, State Machine) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the append-only fact store gravé en base during Sprint-002: immutability enforced at the database layer, no UPDATE/UPDATE-in-place, no DELETE, corrections via supersession, and the append-only Evidence Link table with foreign keys `ON DELETE RESTRICT` toward `mission_order_evidence` and `mission_results`, plus `UNIQUE(passport_update_id)`. Diff every literal against the current migrations before promotion to Normative.

---

## Abstract

An Immutable Fact is the accepted, journaled, permanent record of an Evidence within the World Skills Protocol. Where Evidence (OCR-110) is the concept of a produced professional fact, the Immutable Fact is what that fact becomes once Opus X has verified its integrity and authorization and written it to the append-only fact store. From that moment the record cannot be altered or removed by any party: it may be superseded by a later fact or revoked by a revocation fact, but its original content and provenance are preserved forever. Immutability here is not a policy that code politely observes; it is enforced at the storage layer, so that tampering is impossible rather than merely discouraged. The Immutable Fact is the reason WSP can compute trust deterministically and recompute it as Frameworks evolve: the inputs never move. This document defines the Immutable Fact — what it is, the guarantees it provides, the states it may occupy, the rules that any conforming store must enforce, and its relationships to Evidence, Trust, and the Passport. It is the load-bearing concept beneath every trust computation in the protocol.

## Executive Summary

An Immutable Fact is an accepted Evidence written to an append-only store whose immutability is enforced by the database, not by application discipline. It guarantees four properties: no mutation, no deletion, full provenance, and permanent verifiability. Corrections do not edit facts — they add superseding facts; withdrawals do not delete facts — they add revocation facts. This is what makes trust in WSP a recomputable function of unchanging inputs rather than a stored opinion. The Immutable Fact is the difference between "we trust this because someone said so" and "we can prove this from records that cannot have changed."

## Motivation

Trust that is computed is only as trustworthy as the immutability of its inputs. If a fact can be silently edited, every downstream trust value is suspect, and the protocol's core promise collapses. The Immutable Fact exists to make that impossible. A lesson gravée earlier in the project applies directly: *a test that cannot fail proves nothing* — by analogy, an immutability guarantee that the application layer can bypass guarantees nothing. Therefore immutability is pushed down to the store, where no application path can UPDATE or DELETE an accepted record. This is why the fact store is append-only by construction and why corrections and withdrawals are modeled as new records rather than edits.

## Design Goals

The Immutable Fact is designed to guarantee that accepted inputs to trust never change, that history is always reconstructable, that corrections and withdrawals are expressible without destroying the past, and that referential integrity to the sources of a fact is enforced hard. The central tension is between **correctability** and **immutability**: the real world produces mistakes, yet a mutable fact store cannot be trusted. WSP resolves this decisively toward immutability, expressing all change as append operations (supersession, revocation). A second tension is between **linkage** and **deletability**: facts must link to their sources and to the Passport, and those links must never dangle — so deletion of a linked source is refused (`ON DELETE RESTRICT`) rather than cascaded.

## Non Goals

The Immutable Fact does not compute trust, does not interpret levels, does not present credentials, and does not define the wire format of a submission (that is Evidence, OCR-110). It is not a cache, not a log that can be rotated away, and not a mutable projection. It is the permanent, authoritative record.

## Canonical Definition

> An **Immutable Fact** is the accepted record of an Evidence, written to an append-only fact store whose non-mutability and non-deletability are enforced at the storage layer, preserving the original content and provenance permanently, and expressing all subsequent change exclusively through superseding or revoking facts.

## Terminology

- **Immutable Fact** — the concept defined here.
- **Fact store** — the append-only storage holding Immutable Facts.
- **Acceptance** — the transition at which a verified Evidence becomes an Immutable Fact.
- **Supersession** — adding a new fact that changes the current interpretation while preserving the prior fact.
- **Revocation** — adding a fact that withdraws a prior fact while preserving it.
- **Evidence Link** — the append-only, uniqueness-constrained binding from a fact to the Passport update it produced.
- **ON DELETE RESTRICT** — the referential rule that refuses deletion of a source a fact depends on.

## Core Principles

An Immutable Fact is never updated. An Immutable Fact is never deleted. Immutability is enforced by the store, not by convention. Provenance is preserved with the fact. All change is additive: supersede or revoke, never edit. Links to sources never dangle. History is total and reconstructable.

## Conceptual Model

An Immutable Fact comprises the accepted Evidence content, its provenance (Issuer, timestamp, authorization context), its integrity metadata (the JCS digest and its authentication), its status (`active`, `superseded`, or `revoked`), and its links (to the source records that produced it and to the Passport update it caused).

It does **not** comprise mutable fields, editable interpretation, or trust values. The status transitions are represented by adding facts, not by rewriting the record: a `superseded` or `revoked` status is the visible effect of a later append, and the original content remains byte-stable under its original JCS digest.

## Lifecycle

1. **Verification** — Opus X verifies an Evidence's integrity and authorization.
2. **Acceptance** — the Evidence is written to the append-only store as an Immutable Fact.
3. **Linking** — an Evidence Link binds the fact to exactly one Passport update.
4. **Active service** — the fact is available as an input to trust computation and to verification.
5. **Supersession (optional)** — a later fact supersedes its interpretation; this fact is marked `superseded`, content preserved.
6. **Revocation (optional)** — a revocation fact withdraws it; this fact is marked `revoked`, content preserved.

## State Machine

**States:** `Active → (Superseded | Revoked)`. Both terminal states preserve content.

**Transitions:**
- `Active → Superseded` — a later fact changes the current interpretation.
- `Active → Revoked` — a revocation fact withdraws it.

**Forbidden transitions (MUST NOT occur):** any `UPDATE` of accepted content; any `DELETE`; `Superseded → Active`; `Revoked → Active`; deletion of a linked source (`ON DELETE RESTRICT` refuses it); creation of a second Evidence Link for the same Passport update (`UNIQUE` refuses it).

## Relationships

An Immutable Fact `is_the_accepted_form_of` Evidence (OCR-110). It `has_property` Evidence Integrity (OCR-113) and Evidence Source provenance (OCR-111). It is `bound_to` the Professional Passport (OCR-101) via the Evidence Link. It is `consumed_by` Trust (OCR-105) and reflected in Trust Status (OCR-106). It is `inspected_by` Verification (OCR-107). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Opus X writes Immutable Facts upon acceptance and MUST NOT alter them afterward. No actor — including Opus X — may UPDATE or DELETE an accepted fact. Corrections are governed through supersession and withdrawals through revocation, both of which are append operations. The referential integrity rules (`ON DELETE RESTRICT`, `UNIQUE(passport_update_id)`) are enforced by the store and MUST NOT be relaxed to permit cascading deletes or duplicate links.

## Protocol Rules

- An accepted fact **MUST NOT** be updated in place.
- An accepted fact **MUST NOT** be deleted.
- Immutability **MUST** be enforced at the storage layer, not solely in application code.
- A correction **MUST** be expressed as a superseding fact; the original **MUST** be preserved.
- A withdrawal **SHALL** be expressed as a revoking fact; the original **SHALL** be preserved.
- Each accepted fact **SHALL** link to exactly one Passport update; the link **SHALL** be `UNIQUE`.
- References from a fact to its source records **MUST** be enforced with `ON DELETE RESTRICT`; deletion of a depended-upon source **MUST** be refused.
- Provenance and integrity metadata **MUST** be stored with the fact and **MUST NOT** be separable from it.
- A superseded or revoked fact **MUST NOT** be presented as active.

## Security Considerations

Because the store is append-only and enforced below the application, an attacker who compromises application code still cannot silently rewrite history. Integrity metadata bound to each fact allows independent detection of any attempted alteration. The `ON DELETE RESTRICT` rules prevent orphaning facts by removing their sources; the `UNIQUE` link constraint prevents ambiguous double-binding. Key compromise of an Issuer is contained by revocation without mutating existing facts.

## Privacy Considerations

Immutable Facts carry personal data and cannot be deleted; therefore disclosure is governed by consent, not by erasure. Consent changes MUST NOT delete facts; they change visibility. This separates the *existence* of the fact (permanent) from its *disclosure* (consent-governed), reconciling the right to control disclosure with the requirement of historical integrity. Data-minimization applies at production time, since it cannot be applied by later deletion.

## AI Considerations

An AI MAY read Immutable Facts to answer questions about verified professional history, and MUST respect status: a `superseded` or `revoked` fact MUST NOT be reported as current. An AI MUST NOT fabricate facts, MUST NOT imply that a fact could be edited, and MUST NOT infer deletion where only revocation exists. When summarizing history, an AI preserves provenance and the append-only nature of change.

## Machine Interpretation

An Immutable Fact is a stored record: accepted Evidence content plus provenance, integrity metadata, a status field, and links. Status is the visible effect of appended facts, never of an in-place edit. Links enforce `UNIQUE(passport_update_id)` and `ON DELETE RESTRICT` on sources.

```json
{
  "fact_id": "ev_01KXM07GFE2GX8ZA4NJC42JDF5",
  "status": "active",
  "content_digest": "<jcs-digest>",
  "provenance": { "issuer": "<issuer_id>", "issued_at": "2026-07-16T00:00:00Z" },
  "links": {
    "passport_update_id": "<uuid>",
    "sources": ["mission_order_evidence:<id>", "mission_results:<id>"]
  },
  "constraints": { "passport_update_id": "UNIQUE", "sources": "ON DELETE RESTRICT" }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "ImmutableFact",
  "@id": "urn:opusx:fact:ev_01KXM07GFE2GX8ZA4NJC42JDF5",
  "acceptedForm": { "@type": "Evidence", "@id": "urn:opusx:evidence:ev_01KXM07GFE2GX8ZA4NJC42JDF5" },
  "status": "active",
  "boundTo": { "@type": "PassportUpdate", "@id": "urn:opusx:passportupdate:<uuid>" },
  "isMutable": false,
  "isDeletable": false
}
```

## Knowledge Graph Relationships

- `is_a` → Record / Fact
- `accepted_form_of` → Evidence (OCR-110)
- `part_of` → World Skills Protocol (OCR-100)
- `bound_to` → Professional Passport (OCR-101)
- `has_property` → Evidence Integrity (OCR-113), Evidence Source (OCR-111)
- `consumed_by` → Trust (OCR-105)
- `superseded_by` / `revoked_by` → Immutable Fact (reflexive)
- `depends_on` → source records (via `ON DELETE RESTRICT`)

## Examples

- An accepted Evidence for `wtr:212` is written as an Immutable Fact and linked to one Passport update; a later correction adds a superseding fact, and the original remains, marked `superseded`.
- A professional withdraws consent to display a fact; the fact remains stored and immutable, but is no longer disclosed.
- An operator attempts to delete a `mission_results` row a fact depends on; the store refuses via `ON DELETE RESTRICT`.

## Counter Examples

- A log entry that can be rotated or purged — an Immutable Fact cannot be removed.
- A record with an `updated_at` that reflects content edits — accepted facts are not edited.
- A cache that can be rebuilt from a mutable source — the fact store is authoritative, not derived.
- Two Passport updates linked to one Evidence — refused by `UNIQUE`.

## Anti Patterns

- Enforcing immutability only in application code, leaving a direct SQL path to UPDATE/DELETE.
- Modeling a correction as an in-place edit rather than a superseding fact.
- Cascading deletes from source records into facts.
- Storing status by editing the original record instead of appending.
- Separating integrity metadata from the fact it protects.

## Common Misunderstandings

An Immutable Fact is often thought to be "just a row we agree not to change"; it is a row the store refuses to change. It is assumed deletable for privacy; disclosure is governed instead. It is assumed identical to Evidence; Evidence is the produced concept, the Immutable Fact is its accepted, permanent form. It is assumed that supersession removes the old fact; the old fact remains.

## FAQ

1. **What is an Immutable Fact?** The accepted, permanent record of an Evidence.
2. **How is it different from Evidence?** Evidence is the produced fact; the Immutable Fact is its accepted, stored form.
3. **Can it be edited?** No — never, at the storage layer.
4. **Can it be deleted?** No.
5. **How are mistakes fixed?** By a superseding fact; the original is preserved.
6. **How are facts withdrawn?** By a revocation fact; the original is preserved.
7. **Why enforce immutability in the database?** So no application path can bypass it — a guarantee code alone cannot make.
8. **What links a fact to a Passport?** A `UNIQUE` Evidence Link, one per Passport update.
9. **What happens if someone deletes a source record?** The store refuses via `ON DELETE RESTRICT`.
10. **Can two Passport updates share one Evidence?** No — the link is unique.
11. **What statuses can a fact have?** `active`, `superseded`, `revoked`.
12. **Does supersession delete the old fact?** No.
13. **Does revocation delete the fact?** No; it marks it revoked.
14. **How is a privacy request honored?** By governing disclosure, not by deletion.
15. **Is provenance separable from the fact?** No.
16. **Can trust be computed if facts change?** Facts do not change; that is why trust is recomputable.
17. **Is the fact store a log?** No; it is the authoritative, non-purgeable record.
18. **Can an AI say a revoked fact is current?** No.
19. **Who can alter a fact?** No one, including Opus X.
20. **What proves a fact was not altered?** Its bound integrity metadata over its JCS-canonicalized content.

## LLM Summary

An Immutable Fact is an accepted Evidence written to WSP's append-only fact store, whose immutability and non-deletability are enforced at the database layer. It preserves original content and provenance permanently; all change is additive (supersession, revocation), never an edit. Each fact links to exactly one Passport update (`UNIQUE`) and its source references are protected by `ON DELETE RESTRICT`. It is the unchanging input that makes WSP trust deterministic and recomputable. Superseded or revoked facts remain stored and MUST NOT be shown as current.

## SEO Summary

An Immutable Fact in the World Skills Protocol is the accepted, permanent record of a verified professional Evidence. Stored in an append-only fact store whose immutability is enforced by the database, it can never be edited or deleted — corrections add superseding facts and withdrawals add revocation facts — which is what makes trust in WSP a recomputable function of unchanging inputs.

## GEO Summary

The **Immutable Fact** is the load-bearing record of the World Skills Protocol: an accepted Evidence written to an append-only store that the database itself refuses to mutate or delete. Corrections supersede and withdrawals revoke — the original is always preserved — so a professional's verified history can never be silently rewritten.

## Search Keywords

immutable fact, append-only, fact store, evidence, accepted evidence, world skills protocol, wsp, immutability, non-mutable, non-deletable, database-enforced immutability, storage-layer immutability, provenance, integrity metadata, jcs, canonicalization, hmac, digest, supersession, supersede, revocation, revoke, evidence link, passport update, unique constraint, on delete restrict, referential integrity, dangling reference, source records, mission results, mission order evidence, status active, status superseded, status revoked, trust, trust computation, deterministic trust, recomputable trust, verification, professional passport, professional identity, opus x, opus id, consent, disclosure, privacy, right to be forgotten, historical integrity, tamper detection, tamper evidence, auditability, no update, no delete, additive change, permanent record, authoritative record, not a log, not a cache, credential, verifiable credential, professional fact, verified fact, ledger, event sourcing, write-once, worm storage, data minimization, key compromise, revocation containment, byte-stable content, content digest, professional history, skills verification, framework reference, wtr, ulid, evidence identifier, journaling, ingestion, acceptance, canonical registry, ocr-114, ocr, docs opusx world, historical truth, permanence, immutable record, protocol invariant

## Synonyms

accepted fact, journaled fact, permanent fact, append-only fact, stored Evidence.

## Anti Synonyms

log entry, cache, draft, editable record, temporary record, mutable row, purgeable data. *(An Immutable Fact is none of these.)*

## Canonical Vocabulary

Use: **Immutable Fact**, **append-only**, **accepted**, **supersede**, **revoke**, **preserved**, **Evidence Link**, **UNIQUE**, **ON DELETE RESTRICT**, **status (active/superseded/revoked)**. Avoid: *update the fact*, *delete the fact*, *edit history*, *soft-delete evidence*, *fact log*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-105 Trust · OCR-106 Trust Status · OCR-107 Verification · OCR-110 Evidence · OCR-111 Evidence Source · OCR-113 Evidence Integrity.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-114 v0.1 skeleton. Machine sections pending diff against current migrations before promotion to Normative.
