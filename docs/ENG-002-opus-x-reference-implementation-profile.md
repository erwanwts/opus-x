# ENG-002 — Opus X Reference Implementation Profile (Sprint 2)

**World Skills Protocol**

| | |
|---|---|
| **Document** | ENG-002 |
| **Title** | Opus X Reference Implementation Profile (Sprint 2) |
| **Series** | Engineering |
| **Version** | 0.2 |
| **Status** | Draft — Execution Phase |
| **Date** | 2026-07-13 |
| **Language** | English |

> **NOTE — Position and authority of this document.** ENG-002 is the first *Implementation Profile* of the corpus. It exists because of a governance rule adopted on 2026-07-13: **a frozen normative document is never reopened to solve an implementation need.** Where the protocol deliberately leaves a choice open — as SCHEMA-001 §2 leaves the canonical encoding to be bound, and SCHEMA-003 §6.4 reserves the concrete primitive suite — an implementation must nevertheless choose. That choice belongs here.
>
> **This document creates no protocol requirement and relaxes no invariant.** It selects, for the Opus X reference implementation, from among what the protocol permits. Where it appears to diverge from a normative document (FOUNDATION, WSP, MODEL, SCHEMA, CONFORMANCE), **the normative document prevails.** Where it appears to diverge from ARCH-001, ARCH-001 prevails. It is subordinate to ENG-001, which it specializes and never contradicts.
>
> Its normative keywords (MUST, MUST NOT, SHOULD, MAY) bind **the implementation**, not the protocol. This is a Draft.

---

## Version History

| Version | Date | Status | Summary of Changes |
|---|---|---|---|
| 0.1 | 2026-07-13 | Draft — Execution Phase | Initial publication. Founds the Implementation Profile document type. Binds the canonicalization profile (RFC 8785 / JCS), the hashable object, the identity-of-emission key, the consolidated ingestion order, the Framework coherence check, the `wsp_` naming convention, the subject anchor, and `is_declaration`. Recorded during Sprint 2, Lot O1 design. No normative document was modified. |
| 0.2 | 2026-07-13 | Draft — Execution Phase | Adds Chapter 9 — **The Published Correspondence**: the Framework publishes its observation-to-level table, versioned and dated, so that an Issuer *applies* a public rule rather than inventing a private one (§5.3). Records the conceptual clarification that **a level is an interpretation, not a fact** — and that what the fact store records is the *act of claiming*, not the level itself (§6.1.1), which is why `claimed_level` is a **checksum** and why it will eventually leave the contract (§9.5). Clarifies §10.2.4: the two mappings run in opposite directions and only one is private to the Issuer. Adds the TRUNCATE guard to the locked list. Recorded during Sprint 2, Lot O1 closure. No normative document was modified. |

---

## Table of Contents

1. Introduction
2. The Governance Rule: A Profile Specializes; It Never Modifies
3. The Protocol Zone: The `wsp_` Naming Convention
4. The Subject Anchor
5. The Canonicalization Profile
6. The Hashable Object
7. Identity of Emission versus Integrity of Content
8. The Consolidated Ingestion Order
9. The Published Correspondence
10. The Framework Coherence Check
11. Declarations Are Not Attestations
12. Permanent Verifiability: What Every Fact Retains
13. What This Profile Locks, and What It Leaves Open
14. Summary

References

---

## 1. Introduction

### 1.1 Purpose

The normative corpus states *what must be true*. ENG-001 projects it into a reference data model. Neither answers a question that a running system cannot avoid: **among the several forms the protocol permits, which one does this implementation actually use?**

Two systems cannot exchange a verifiable fact unless they serialize it identically, byte for byte. The protocol requires that a canonical form exist (SCHEMA-001 §5) and deliberately declines to fix it, so that cryptographic and encoding practice can evolve for decades (SCHEMA-003 §6.1). That deliberate openness is correct at the protocol layer and unusable at the implementation layer. This document closes it — **for the implementation, and only for the implementation.**

### 1.2 Scope

The implementation choices of the Opus X reference implementation for Sprint 2: canonicalization and hashing, the hashable object, the idempotency key, the ingestion verification order, the Framework coherence check, the database naming convention, the subject anchor, and the declaration flag.

Out of scope: protocol semantics (WSP, MODEL), the canonical schema contract (SCHEMA-001), the envelope and signature scheme (SCHEMA-003), the reference data model (ENG-001, which this specializes), the sprint's product decisions (SPRINT-002, frozen), and the founding architecture (ARCH-001).

### 1.3 Normativity

**Informative with respect to the protocol. Normative with respect to the implementation.** Capitalized keywords bind Opus X code and any Issuer integrating with it during Sprint 2. They create no conformance requirement for the World Skills Protocol, and they bind no third party outside this implementation.

### 1.4 Prerequisites

ENG-001 (the reference data model), SCHEMA-001 §5 (the canonicalization requirement this profile satisfies), SCHEMA-003 §6 (the agility this profile respects), ARCH-001 (the trust flow it serves), SPRINT-002 v1.2 (the frozen sprint specification it implements), and IETF RFC 8785 (JCS) and RFC 3339.

---

## 2. The Governance Rule: A Profile Specializes; It Never Modifies

Adopted 2026-07-13, and recorded here because this document is its first instance.

> **When an implementation need is discovered:**
>
> - If it **changes the meaning of the protocol** → the protocol is revised, through a new official version.
> - If it only **specifies how Opus X implements the protocol** → it belongs to an Engineering or Sprint document.
>
> **An implementation difficulty is never resolved by modifying a frozen normative document.** It is resolved by a profile, a reference implementation, an Engineering document, or — if and only if the protocol is genuinely incomplete — a new official protocol version.

This is how durable standards evolve. HTTP, TLS, OAuth, and SQL are not amended each time a product needs something; they acquire profiles, implementation guides, and companion specifications. A protocol that changes whenever its first implementation is inconvenienced is not a standard — it is one product's documentation. The discipline of *not* reopening frozen documents is what will let the World Skills Protocol be adopted by parties who did not write it.

The consequence for this document is exact: **everything below is a choice among permitted options.** Nothing below adds a requirement the protocol did not already impose. Where this profile enforces something, it is enforcing an existing rule, never inventing one.

---

## 3. The Protocol Zone: The `wsp_` Naming Convention

**The problem.** Opus X already carries tables from Sprint 1 — `evidence`, `skills`, `frameworks`, `trust_index` — whose semantics are those of a *display* layer, incompatible with the protocol objects that bear the same names in ENG-001 §5–§7. The governing rule of the execution phase is that nothing already proven may be broken.

**The choice.** ENG-001 §11 places *"exact table and column names, types, and indexing"* explicitly within engineering latitude. This profile therefore binds:

- **3.1** Every table of the protocol zone MUST carry the prefix `wsp_`. This applies across all three zones of ENG-001 §3 — semantics, facts, and interpretations — not only to the zone in front of the current lot:
  - **Semantics:** `wsp_frameworks`, `wsp_framework_versions`, `wsp_skills`, `wsp_skill_levels`
  - **Facts:** `wsp_issuers`, `wsp_evidence`, `wsp_evidence_demonstrates_skill`, `wsp_fact_revocations`
  - **Interpretations:** `wsp_interpretations`, `wsp_interpretation_inputs`, `wsp_index_values`
- **3.2** The prefix is **semantically neutral**. It names the protocol zone, never an Issuer, and therefore honors the multi-Issuer rule (ARCH-001 §4.5; SPRINT-002 D9, W7).
- **3.3** No Sprint-1 display table is ever reused to carry a protocol fact. `wsp_*` is authoritative; the pre-existing `public.*` tables are legacy display.
- **3.4** The API surface is **not** renamed. Route and payload field names follow the frozen contract; the prefix is a storage convention only.

**Recorded debt — DETTE-01.** Two representations of "skill" now coexist: `public.skills` (display, Sprint 1) and `wsp_skills` (protocol, versioned, immutable). This is tolerable and it is not permanent. In time the display layer MUST derive from the protocol zone rather than stand beside it as a parallel definition. Until then, `wsp_*` prevails on conflict. This debt is recorded, not silently carried.

---

## 4. The Subject Anchor

**The problem.** ENG-001 §5 lists `subjects` in the fact store. Sprint 1 established the professional's identity under a different name, and `subjects` does not exist in the schema. A fact must anchor somewhere.

**The choice.**

- **4.1** `wsp_evidence.subject_id` MUST reference **`profiles(opus_id)`** — the Opus ID, the professional's protocol identity.
- **4.2** No `wsp_subjects` table is created in Sprint 2. A second representation of the professional MUST NOT be introduced while `profiles` already carries that role.
- **4.3** `profiles.opus_id` MUST be `UNIQUE` and `NOT NULL`. This is a precondition of 4.1 and MUST be verified before the migration, not assumed.

**Why identity and not the Passport.** ENG-001 §8 establishes that **the Passport is a generated view, never a stored authored document.** Anchoring facts on `passports` would make the existence of a fact depend on an object that is, by architecture, not a table of truth — and would quietly make the Passport the owner of the facts, when the entire corpus says the reverse. Facts anchor on **identity**, which is permanent and never reused (WSP-001). The Passport is what is *computed* above them. This is precisely why the Passport survives the applications that feed it (ARCH-001 §7): it is derived, not stored.

**Why no abstraction.** A generic `subjects` table would today be an abstraction with exactly one case. The corpus discipline is that **an abstraction is revealed by a second real case, not anticipated by an elegant one.** When subjects other than professionals genuinely exist — organizations, AI agents, devices — the second case will show what the abstraction must be, and the model will evolve on evidence rather than on foresight.

---

## 5. The Canonicalization Profile

SCHEMA-001 §5.2 requires that canonicalization fix field ordering, whitespace, number and time representation, identifier form, and the treatment of absent versus null — and it fixes none of them, deferring the binding (SCHEMA-001 §2) to SCHEMA-003, which reserves it (§6.4). This chapter is that binding, **for this implementation.**

### 5.1 Algorithm Identification

- **5.1.1** `canonicalization_algorithm` = `"RFC8785"`
- **5.1.2** `hash_algorithm` = `"SHA-256"`
- **5.1.3** `canonical_hash` = the SHA-256 digest, rendered as **lowercase hexadecimal**, of the preimage:

```
UTF8( JCS( hashable_evidence_object ) )
```

- **5.1.4** Both algorithm fields MUST be carried **inside the hashable object** (§6), not outside it. An algorithm identifier that is not itself hashed is an algorithm identifier an attacker can change. Because they are covered, a tampered algorithm field invalidates the digest.
- **5.1.5** A `canonical_hash` whose algorithm is implicit is a `canonical_hash` that becomes unverifiable when practice moves on. In twenty years, a fact recorded under this profile MUST still be verifiable **by reading the fact itself** — never by inferring what the implementation happened to do at the time.

### 5.2 Serialization Rules

- **5.2.1** The object to be hashed MUST be a valid JSON object conforming to **I-JSON** and to the constraints of **RFC 8785**.
- **5.2.2** Canonicalization MUST be performed by an **RFC 8785 implementation**. A hand-rolled `JSON.stringify()` with a local key sort MUST NOT be used. The two are not equivalent, and the difference is invisible until it is a production divergence.
- **5.2.3** Property ordering MUST follow **RFC 8785 §3.2.3** exactly. This profile deliberately does not restate the rule as "lexicographic order," because that simplification conceals the Unicode code-point handling JCS defines.
- **5.2.4** Insignificant whitespace MUST be absent.
- **5.2.5** Numbers MUST follow the ECMAScript serialization RFC 8785 imposes. `3` and `3.0` MUST NOT depend on a local choice made by either side.
- **5.2.6** Values incompatible with I-JSON or JCS — notably `NaN` and infinities — MUST be rejected **before** canonicalization, with an explicit error.
- **5.2.7** The canonicalized result MUST be encoded in **UTF-8** before hashing.

### 5.3 Temporal Normalization

- **5.3.1** Every timestamp in the contract MUST be normalized to **RFC 3339, UTC, `Z` suffix**, before insertion into the object to be canonicalized.
- **5.3.2** The temporal precision is **fixed** for Sprint 2:

```
YYYY-MM-DDTHH:mm:ss.SSSZ
```

Exactly three fractional digits. Always UTC. Always `Z`.

- **5.3.3** The reason is not aesthetic. `2026-07-20T14:32:00Z` and `2026-07-20T14:32:00.000Z` are the same instant and different bytes — therefore different digests. Fixing the precision is what prevents two semantically identical facts from being cryptographically different.

### 5.4 Absent versus Null

- **5.4.1** An absent optional property MUST be **omitted**.
- **5.4.2** `null` MUST NOT appear anywhere in the Evidence payload.
- **5.4.3** This prohibition is a **rule of this schema profile**, not a property of RFC 8785. Unknown, inapplicable, or unprovided data is expressed by the **absence of the field** where the schema permits absence.

### 5.5 Arrays

- **5.5.1** Arrays retain their order under JCS. JCS sorts object keys; it does not sort arrays.
- **5.5.2** Where an array represents a **set** — a collection whose order carries no business meaning — this profile MUST define an explicit sort applied before canonicalization. JCS MUST NOT be used to invent the semantics of an array.
- **5.5.3** For Sprint 2, the only such array is `observation.criteria`. It MUST be sorted **ascending by Unicode code point** before canonicalization.

---

## 6. The Hashable Object

The word *payload* is ambiguous, and ambiguity here is a divergence waiting to happen. This chapter defines the covered object exhaustively.

### 6.1 Fields Covered by the Hash

The hash MUST cover the whole of the attested fact necessary to its identity and its interpretation:

| Field | Meaning |
|---|---|
| `schema_version` | The Evidence schema version this fact was recorded under |
| `canonicalization_algorithm` | `"RFC8785"` (§5.1.4 — covered, not external) |
| `hash_algorithm` | `"SHA-256"` |
| `issuer.id` | The Issuer's protocol identifier |
| `issuer.evidence_id` | **The Issuer's immutable identifier for this Evidence** |
| `issuer.attested_by.actor_id` | The accountable attester |
| `issuer.attested_by.role` | The attester's role |
| `subject.opus_id` | The professional's protocol identity |
| `framework.id`, `framework.version` | The Framework and the pinned version giving the fact its meaning |
| `demonstrates.skill_id` | The Skill attested |
| `demonstrates.claimed_level` | The level the Issuer claims — a **checksum**, not a data field (§9.5) |
| `observation.criteria` | The observation grid consulted, in the Issuer's own vocabulary (sorted, §5.5.3) |
| `observation.criterion_levels` | The observation, in the Issuer's own scale |
| `provenance.evidence_ref.kind`, `.id` | The hard reference to the founding proof (W4) |
| `occurred_at` | When the observation occurred |
| `attested_at` | When the attestation was made |
| `is_declaration` | Whether this is a declaration or a third-party attestation (§10) |

### 6.1.1 What Is Recorded Is the Claim, Not the Level

`claimed_level` is **already an interpretation** (§9.1) — the Issuer has applied a Framework rule to translate its observation. What the fact store records is therefore **not the level**, but **the act of accountably claiming it**: *this Issuer, at this time, claimed this level, on this evidence.* The act is a fact. The content of the claim is an interpretation, and it is verified (§10), never trusted.

Opus X's own interpretation — the level the Passport shows — lives in `wsp_interpretations` (Lot O3), physically separate and derived from **all** of a professional's Evidence (D6). W3 is preserved.

### 6.2 Fields Excluded from the Hash

The hash MUST be computed after excluding every derived or transport field:

- `canonical_hash` itself
- The transport signature (HMAC), and any proof of transport
- HTTP headers
- Any identifier, timestamp, or status **added by Opus X at ingestion** (`recorded_at`, internal keys, verification status)
- Retry and delivery metadata

### 6.3 The Two Protections Are Not the Same Thing

**The transport signature protects the exchange. The `canonical_hash` identifies and protects the canonical fact.** They serve different parties over different timespans: the HMAC is a shared secret between two systems, valid for the duration of a delivery; the `canonical_hash` must let anyone, at any time, confirm that a stored fact is the fact that was attested. Conflating them would make the fact's integrity depend on a secret it does not carry — and would end the day the secret rotates.

### 6.4 Worked Example

**The hashable object**, as an Issuer constructs it (shown here indented for reading; the canonical form has no insignificant whitespace):

```json
{
  "attested_at": "2026-07-20T14:35:12.480Z",
  "canonicalization_algorithm": "RFC8785",
  "demonstrates": {
    "claimed_level": "applied",
    "skill_id": "wtr:212"
  },
  "framework": {
    "id": "framework:wtr",
    "version": "0.1"
  },
  "hash_algorithm": "SHA-256",
  "is_declaration": false,
  "issuer": {
    "attested_by": {
      "actor_id": "8f2b1c44-0e91-4a7d-9c33-1b6f0d5a77e2",
      "role": "coach"
    },
    "evidence_id": "pu_01JQZ8K4T7X2",
    "id": "issuer:example-os"
  },
  "observation": {
    "criteria": ["S03.C08", "S08.C06"],
    "criterion_levels": { "S03.C08": 3 }
  },
  "occurred_at": "2026-07-20T14:32:00.000Z",
  "provenance": {
    "evidence_ref": {
      "id": "3d9e5a10-77bc-4f21-8e04-2a9c6b1f0d55",
      "kind": "mission_result"
    }
  },
  "schema_version": "1.0",
  "subject": {
    "opus_id": "opx_01K7QZ3M9V"
  }
}
```

**Note what the example already demonstrates.** `criteria` lists two criteria — the grid the coach consulted — while `criterion_levels` carries **one** entry: the observation that grounds the attestation. That asymmetry is deliberate and is made a rule in §9.2. And the observation is `3`, which maps to `applied` under the published Framework table — which is what §9 verifies, and which the `claimed_level` above honestly reflects.

The canonical form is this object serialized per RFC 8785 — keys ordered, no whitespace, ECMAScript numbers — UTF-8 encoded. `canonical_hash` is the lowercase hex SHA-256 of those bytes, and is **not** a member of the object above.

---

## 7. Identity of Emission versus Integrity of Content

A content hash MUST NOT become, by itself, the business identity of an Evidence.

Two distinct attestations may legitimately carry identical content — the same coach, the same skill, the same observation, on two different occasions. Conversely, a retried delivery of one attestation must be recognized as the same fact. A design that deduplicates on content alone gets both cases wrong.

This profile therefore separates two concepts:

- **Identity of emission** — `(issuer_id, issuer_evidence_id)`, carrying a **UNIQUE constraint** in `wsp_evidence`.
- **Integrity of content** — `canonical_hash`.

### 7.1 Required Behavior

| Case | Behavior |
|---|---|
| Same `issuer_id` + same `issuer_evidence_id` + **same** hash | **Idempotent retry.** Return the existing Evidence. No new fact. |
| Same `issuer_id` + same `issuer_evidence_id` + **different** hash | **Integrity conflict.** Reject explicitly (`evidence_integrity_conflict`). No write. The Issuer is claiming one identity for two different facts. |
| Different `issuer_evidence_id` + same hash | **MUST NOT be silently deduplicated.** Absent an explicit business rule, these are two distinct attestations. |

### 7.2 Consequence for the QA Matrix

SPRINT-002 §9.2 tests #3 (double send) and #4 (concurrent send ×5) MUST demonstrate the **idempotency of emission** — that is, the uniqueness of `(issuer_id, issuer_evidence_id)` under concurrency — and not merely a content collision. A test that passes because two payloads hashed alike has not tested what it claims to test.

---

## 8. The Consolidated Ingestion Order

SPRINT-002 Lot O2 states seven verifications. This profile consolidates them with the hash verification and the coherence check into one ordered sequence. **No verification of the frozen specification is removed.** The order is normative for the implementation.

| # | Verification | Failure |
|---|---|---|
| 1 | Authenticate the Issuer (HMAC) and verify authorization | `401`, no write |
| 2 | Issuer is recognized and active; **an active consent exists** (W6) | Reject, no write |
| 3 | Validate the payload against the declared `schema_version` | Reject, no write |
| 4 | **No forbidden field** — no trust score, no index, no certification claim (**W1**) | Explicit reject, no write |
| 5 | **Provenance present** — a valid `evidence_ref` (**W4**) | Explicit reject, no write |
| 6 | Framework, Framework version, Skill, and Subject exist | **Non-enumerating** reject, no write |
| 7 | Normalize only what this profile explicitly permits (§5.3) → build the covered object (§6) → apply **RFC 8785** → recompute **SHA-256** → compare in **constant time** to the received hash | `canonical_hash_mismatch`, no write |
| 8 | **Framework coherence** (§10) | `claimed_level_incoherent` or `below_emission_threshold`, no write |
| 9 | Idempotency on `(issuer_id, issuer_evidence_id)` and the **recomputed** hash (§7) | Per §7.1 |
| 10 | Write the fact, append-only. **And nothing else.** | — |

**8.1** Opus X MUST NOT trust the `canonical_hash` sent by an Issuer. It **recomputes** it.
**8.2** Deduplication MUST use the **recomputed** value, never the received one.
**8.3** Verification (7) MUST precede idempotency (9). A fact must be proven intact before it is compared to anything.
**8.4** The Registry records; it never computes (WSP-001). Step 10 writes a fact and performs no interpretation.

---

## 9. The Published Correspondence

### 9.1 A Level Is an Interpretation, Not a Fact

This chapter exists because of a conceptual clarification made on 2026-07-13, and the clarification is worth stating before its consequences.

**A level is not a fact. It is already an interpretation.** When an Issuer sends `claimed_level: "applied"`, it is not merely reporting what it observed — it has already *applied a rule of the Framework* to translate an observation into the protocol's vocabulary. The corpus exists to keep facts and interpretations apart; here they meet, in the contract itself.

**This is acceptable under exactly one condition:** that the rule the Issuer applies is **published by Opus X**, not invented by the Issuer. Then the Issuer decides nothing. It applies a public rule, and Opus X — which owns the rule — recomputes the same interpretation and rejects any divergence (§10).

- The rule always belongs to Opus X.
- The Issuer only ever applies a rule it did not write.
- Opus X never trusts the Issuer; it verifies.

This honors ARCH-001 §5 exactly. **Trust is not self-attributed, because interpretation is not self-authored.**

**And it resolves the apparent tension with W3** — *an interpretation never becomes a fact.* What the fact store records is **not the level**; it is **the act of claiming it**: *this Issuer, at this time, accountably claimed this level, on this evidence.* The act is a fact — dated, attributed, accountable. The content of the claim is an interpretation. Opus X's *own* interpretation — the level the Passport shows — lives in `wsp_interpretations` (Lot O3), physically separate, derived from **all** of a professional's Evidence (D6). W3 holds.

### 9.2 What the Framework Publishes

`GET /frameworks/{id}/skills` MUST publish, for each Skill and **for each Framework version**:

| Field | Purpose |
|---|---|
| `framework.id`, `framework.version` | Which Framework, which version |
| `framework.effective_date` | **The date from which this version's rules are in force** |
| `skills[].id`, `.code`, `.name` | The Skill's canonical identity |
| `skills[].levels[].slug`, `.label`, `.rank` | The protocol vocabulary |
| **`skills[].levels[].observation_min`** | **The published correspondence** |
| **`skills[].levels[].observation_max`** | **The published correspondence** |

- **9.2.1** The correspondence MUST be published **with the Framework version it belongs to**, never as a standalone or global table. It is Framework content (§5.3), and Framework content is versioned.
- **9.2.2** Discovery MUST be readable by any conforming Issuer **without configuration specific to it** (D9). No Issuer is a special case.
- **9.2.3** An observation value that falls in **no published band** demonstrates nothing. The correspondence therefore encodes the emission threshold (P2) **by omission**: bands 0–1 simply do not exist, so no level can be derived from them. This is a structural consequence, not a rule a developer can forget.

### 9.3 Publishing Is Not Delegating

The distinction the whole chapter rests on:

> **Publishing a rule is the opposite of delegating it.** A rule kept private forces the Issuer to reinvent it — privately, unverifiably, and differently for each Issuer. A rule published is a rule the Issuer *applies* and the publisher *verifies*. Withholding the correspondence would not have protected §5.3; it would have guaranteed its violation, out of sight.

### 9.4 Versioning and Effective Date

- **9.4.1** Every Evidence pins `framework.id` + `framework.version` (already enforced structurally by a composite foreign key on the fact store).
- **9.4.2** Framework versions are **immutable and permanently preserved** — never updated, never deleted, never truncated (WSP-001; FRAMEWORK-003; enforced by `wsp_reject_mutation` on all four semantic tables, across UPDATE, DELETE, and TRUNCATE, including in `service_role` and `postgres`).
- **9.4.3** Therefore **an Evidence emitted today can always be re-interpreted under the exact version of the Framework in force at the moment of its emission.** A correspondence published in 2026 still means, in 2046, what it meant when the fact was admitted.

This is not a database precaution. **It is the condition under which a proof retains meaning across a career** — and therefore the condition under which the Professional Passport is traceable at all.

### 9.5 Why `claimed_level` Will Eventually Disappear

Because Opus X recomputes the level and rejects any divergence, **`claimed_level` carries no information that is not already derivable** from `observation.criterion_levels` and the published correspondence. It can only confirm, or betray.

**It is therefore not a data field. It is a checksum** — the proof that the Issuer correctly applied a rule that is not its own. That is a real and useful function today: an Issuer that diverges is *detected*, rather than silently corrected.

The natural evolution — recorded here as a direction, not built — is that the Issuer eventually transmits only **the observation, the criteria, the evidence, and the context**, and Opus X derives the level entirely. `claimed_level` will leave the contract without loss, precisely because it never carried anything.

That is not Sprint 2. **Sprint 2 must demonstrate the complete chain**, and it does so with an implementation that is simple, robust, and comprehensible — not the most abstract one available. The abstraction will be revealed by the second real case, as every abstraction in this ecosystem is.

### 9.6 The Framework as a Service — A Direction, Not a Build

The deeper implication, recorded so it is not lost and **deliberately not implemented**: a Framework is not merely a document. **It is becoming a service** — one that will one day answer questions like *"how is this observation interpreted?"*, *"what is the official level correspondence for version 2.3?"*, *"does this Skill still exist in this version?"*

This strengthens the founding architecture rather than complicating it: **the WSP is the standard, Frameworks are versioned reference works, and Opus X is the engine that publishes them, applies them, and guarantees their coherence.** Nothing is built toward this in Sprint 2. Publishing the correspondence is the smallest step that makes the chain honest — and it happens to be the first step of that road.

---

## 10. The Framework Coherence Check

### 10.1 Why It Exists

SPRINT-002 D6 — *"the most important decision of this sprint"* — holds that an Issuer never sends a WSP level, and §5.3 holds that the level correspondence is **published by Opus X with the Framework, never decided by the Issuer.** ARCH-001 §5 holds that trust is never self-attributed, and W1 forbids an Issuer from transmitting a WSP level.

Without a check, these are commitments an Issuer makes to itself. An Issuer could send `criterion_levels: { "S03.C08": 3 }` with `claimed_level: "mastery"` — a signed, schema-valid, provenance-bearing payload whose recomputed hash matches perfectly — and Opus X would record an inflated fact, **append-only, in perpetuity.** The hash would prove the integrity of the falsehood, not its truth.

**This check creates no new requirement.** It is how Opus X *applies* D6, §5.3, and W1. It exists so that an implementation cannot bypass requirements the corpus already imposes.

### 10.2 The Observation

- **9.2.1** For Sprint 2, `observation.criterion_levels` MUST contain **exactly one entry**. Its value is the observation.
- **9.2.2** `observation.criteria` MAY list several criteria — the grid the attester consulted. The criterion carrying the level MUST be present in `criteria`.
- **9.2.3** No aggregation rule across several observed criteria is defined, **and none is invented here.** The sprint is a thin vertical slice: one Skill, one kind of proof, one attestation. When an attester genuinely needs to attest several criteria at once, that second real case will reveal what the aggregation must be — and it will be defined then, on evidence rather than on anticipation.
- **9.2.4** Opus X does not know, and MUST NOT know, the Issuer's criterion-to-Skill mapping — that table lives with the Issuer and is its way of applying the Framework (SPRINT-002 §5.2, Lot C2). Opus X verifies only what the **published Framework** authorizes it to verify: the observation-to-level correspondence.

### 10.3 The Check

Given `framework.id`, `framework.version`, `demonstrates.skill_id`, and the single observation value `v`:

1. Read the published correspondence in `wsp_skill_levels` for that Skill **at that Framework version**.
2. Find the level whose band satisfies `observation_min ≤ v ≤ observation_max`.
3. **If no band matches** — the observation falls below the emission threshold (P2: values 0–1 demonstrate nothing) — reject: `below_emission_threshold`. No write.
4. **If the derived level differs from `demonstrates.claimed_level`** — reject: `claimed_level_incoherent`. No write.
5. Otherwise, proceed.

### 10.4 What Makes This Sound

The seeded correspondence carries **no band for observations 0–1**. The emission threshold (P2) is therefore not an application rule a developer can forget — it is a **structural consequence**: an observation of 0 or 1 matches no level, and no Evidence can be admitted. This is the discipline the corpus asks for everywhere: an invariant enforced by construction rather than by convention.

### 10.5 What This Check Is Not

It is **not** the Passport level. Opus X's Skills Engine (Lot O3) derives the level shown on the Passport from **all** of a professional's Evidence, with corroboration (D6). This check verifies only that a single attested fact is internally honest under the Framework that gives it meaning. A fact may be perfectly coherent and still carry little weight.

---

## 11. Declarations Are Not Attestations

- **11.1** `wsp_evidence.is_declaration` MUST be present, **`NOT NULL`**, with an explicit `true` or `false`.
- **11.2** It MUST NOT be nullable. A professional's own declaration MUST NEVER become indistinguishable from a third party's attestation, and a nullable flag is exactly how that distinction is lost — silently, and irreversibly, in an append-only store.
- **11.3** This implements WSP-001 and ENG-001 §5, which require declarations to remain distinguishable from evidence.
- **11.4** For Sprint 2 the value is always `false` — every Evidence originates in a coach's attestation. The column exists nonetheless, because adding a column to an append-only fact table costs nothing today and cannot be done cleanly later.

---

## 12. Permanent Verifiability: What Every Fact Retains

Every row of `wsp_evidence` MUST retain, permanently:

- `schema_version`
- `canonicalization_algorithm`
- `hash_algorithm`
- `canonical_hash`
- `framework_id` + `framework_version`

**The reason is the whole point of the fact store.** If a future protocol version adopts a different canonicalization profile, the facts admitted under *this* profile remain verifiable **under the rules that existed when they were admitted** (SCHEMA-001 §5.5; SCHEMA-003 §6.2). A fact whose verification rules are not recoverable from the fact itself is a fact that expires — and facts do not expire. This is what allows the profile to change without ever invalidating history.

---

## 13. What This Profile Locks, and What It Leaves Open

**Locked (for the Opus X implementation, Sprint 2):**

- Canonicalization is RFC 8785 (JCS); the digest is SHA-256, lowercase hex (§5.1).
- Timestamps are RFC 3339 UTC `Z`, with exactly three fractional digits (§5.3).
- `null` is forbidden; absent fields are omitted (§5.4).
- The hashable object is exactly §6.1, less exactly §6.2.
- Opus X recomputes the hash and rejects any divergence (§8.1).
- Identity of emission is `(issuer_id, issuer_evidence_id)`; integrity of content is the hash; they are never conflated (§7).
- The ingestion order is §8, with no verification of the frozen spec removed.
- The Framework coherence check is performed on every Evidence (§10).
- The Framework publishes its observation-to-level correspondence, versioned and dated (§9).
- The append-only guard covers UPDATE, DELETE, **and TRUNCATE** (including CASCADE), on facts *and* semantics, in `service_role` and `postgres`.
- `is_declaration` is `NOT NULL` (§11).
- The protocol zone is `wsp_`-prefixed across all three zones (§3).
- `wsp_evidence.subject_id` references `profiles(opus_id)` (§4).

**Deliberately left open (and owned elsewhere):**

- The **cryptographic primitive suite** for protocol signatures and its rotation — SCHEMA-003 §6.4 reserves it, and this profile does not pre-empt it. Canonicalization and cryptographic primitive are two distinct responsibilities.
- The **aggregation rule** across several observed criteria — no second real case exists yet (§10.2.3).
- The **removal of `claimed_level`** from the contract — a direction, not a Sprint-2 change (§9.5).
- **The Framework as a service** (an interpretation API) — recorded as a direction, deliberately not built (§9.6).
- The **interpretation methods** of the Skills and Trust Engines — platform artifacts (MODEL-002; OPUS-300).
- The **convergence** of the Sprint-1 display tables onto the protocol zone — DETTE-01 (§3).
- Whether a **future protocol revision** adopts this profile, another, or several — a governance matter (FOUNDATION-001), which this document is designed to survive (§11).

---

## 14. Summary

ENG-002 is the first Implementation Profile of the corpus, and it exists to protect a governance rule: **a frozen normative document is never reopened to solve an implementation need.** The protocol requires a canonical form and deliberately declines to fix one; this profile fixes one — RFC 8785 (JCS), SHA-256, RFC 3339 UTC to the millisecond, `null` forbidden, the hashable object enumerated exhaustively — **for the reference implementation, and only for it.** It separates the identity of an emission from the integrity of its content, so that a retry is recognized and two genuine attestations are never merged. It consolidates the ingestion order without removing a single vigilance of the frozen specification, and it adds the Framework coherence check — which invents no rule, but makes it impossible for an implementation to bypass the rules the corpus already imposes: *an Issuer never sends a WSP level; the level correspondence belongs to the Framework; trust is never self-attributed.* It anchors facts on identity rather than on a generated view, and it declines to abstract a subject model that has only one case. Every fact it admits retains the rules under which it was admitted, so that the profile may change and history may not. It publishes the Framework's observation-to-level correspondence — versioned and dated — because *publishing a rule is the opposite of delegating it*: a rule kept private forces the Issuer to reinvent it unverifiably, while a rule published is a rule the Issuer applies and the publisher verifies. **No normative document was modified to write any of this.** That is the point of the document, and it is the property that will let the protocol be adopted by parties who did not write it.

---

## References

### Informative References

- ENG-001 — Opus X Reference Data Model (§3, §4, §5, §6, §8, §11); SPRINT-002 — La première chaîne du World Skills Protocol, v1.2 (D6, D8, D9, W1–W7, §5.2, §5.3, §7, §9, P1, P2, Annex A)
- SCHEMA-001 — Object Schemas (§2, §5); SCHEMA-003 — Exchange Envelopes and Signatures (§3, §4, §6); WSP-001 — Core Objects and Semantics (§3.1, §8.5, §13.3, §14)
- ARCH-001 — Evidence Is Produced. Trust Is Verified. (§4.5, §5, §6, §7); ARCH-002 — The Opus X Operating Method; FOUNDATION-000 — The Trust Manifesto; FOUNDATION-001 — Governance Charter
- MODEL-002 — Trust and Interpretation Model; OPUS-300 — Professional Trust Intelligence; PRODUCT-001 — The Opus X Design System (§14.6)
- IETF RFC 8785 — JSON Canonicalization Scheme (JCS); IETF RFC 3339 — Date and Time on the Internet; IETF RFC 7493 — The I-JSON Message Format; IETF BCP 14 — RFC 2119, RFC 8174

---

*World Skills Protocol — ENG-002 — Opus X Reference Implementation Profile (Sprint 2) — Version 0.1 (Draft)*
*Copyright © 2026 World Skills Protocol Contributors.*
