# OCR-126 — Passport Lifecycle

| Field | Value |
|---|---|
| **Document ID** | OCR-126 |
| **Canonical ID** | `passport-lifecycle` |
| **Canonical Name** | Passport Lifecycle |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Stages, State Machine, Protocol Rules) · Informative (Examples, FAQ, Summaries, and the indicative "reflects" annotations of the Stages list) |
| **Last Update** | 2026-09-01 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept records the seven-stage Passport lifecycle that is already aligned across the founding database schema (`passports.lifecycle_stage` CHECK, `supabase/migrations/20260711000001_schema.sql:34-43`) and the locked product charter (`docs/opus-x-sprint-1.md` §1.6). The text describes exactly what the schema enumerates: seven stages, in one linear order, every Passport frozen at stage 1 in Sprint 1. The stages and their order are graven here; the **conditions of advancement between stages are deliberately NOT specified** and will be established separately, stage by stage. Diff the stage set against the production enum before promotion to Normative.

---

## Abstract

The Passport Lifecycle is the ordered, strictly linear sequence of seven stages a Professional Passport traverses over the course of a professional career, from the moment its identity is established to the point where the professional becomes an authority in their domain. It is a **global narrative trajectory** — a coarse, human-readable expression of *where this career stands* — and it is **monotone**: a Passport advances along it and never recedes. It is not a score, not a ranking, and not the per-competence computation of Trust (OCR-105). This document defines the seven stages, their official labels, their internal state identifiers, their meaning, and the linear order in which they are arranged. It deliberately does **not** define the conditions that trigger advancement from one stage to the next — those are established separately, stage by stage — so that the trajectory itself has normative authority independent of, and prior to, the mechanics of movement along it.

## Executive Summary

A Professional Passport moves through seven canonical stages — Identity Established, Receiving Evidence, Skills Emerging, Trust Established, Professional Passport Verified, Trusted Professional, Authority — in that linear order. Every Passport begins at Identity Established upon emission, and movement is monotone (forward only). The lifecycle is a single global story of the whole Passport — *where the career stands* — distinct from Trust (OCR-105), which is computed per competence. This Record graves the stages and their order only; the thresholds governing advancement are defined elsewhere.

## Motivation

Immutable facts and per-competence Trust describe *what a Passport contains and how much each skill can be relied upon*; they do not, by themselves, give a professional a single legible sense of progression across a whole career. The Passport Lifecycle exists to be that one global, legible trajectory: a small, fixed ladder of ordered stages a person can grasp at a glance. It must be graven as a normative structure — rather than living only in the schema and the charter — so that every surface (the Passport, the Dashboard, verifiers, future advancement logic) references one authoritative definition of the stages and their order. Separating the *stages* from the *conditions of advancement* lets the trajectory be authoritative now, while the movement rules are worked out carefully and later.

## Design Goals

The lifecycle is designed to be small (seven stages, no more), strictly ordered (a single linear chain), monotone (forward only), human-readable (each stage has a plain meaning), global (one story for the whole Passport), and stable (the set and order do not drift). The central tension is between **legibility** and **precision**: a career is continuous and multi-skilled, yet a small ladder of stages must summarise it as one narrative. WSP resolves this by keeping the stages coarse and the order fixed, by making the trajectory a *global* story distinct from per-competence Trust, and by deferring the precise advancement thresholds to separate, later definition.

## Non Goals

The Passport Lifecycle is not a numeric score, not a 0–100 gauge, not a ranking of professionals against one another, and not a measure of a person's worth. It is **not an aggregation of per-competence Trust states and not a global Trust score** (Trust is defined per competence in OCR-105). It does not define *when* a Passport advances (out of scope here), does not compute Trust, and does not itself produce Evidence. It is the ordered set of stages, nothing more.

## Canonical Definition

> The **Passport Lifecycle** is the ordered, strictly linear, **monotone** sequence of seven canonical stages — **Identity Established → Receiving Evidence → Skills Emerging → Trust Established → Professional Passport Verified → Trusted Professional → Authority** — that a Professional Passport traverses over a career. It is a **global narrative trajectory of the whole Passport** (*where this career stands*), advancing and never receding; it is **distinct from Trust (OCR-105)**, which is computed per competence. Every Passport begins at Identity Established. This definition establishes the stages and their order; the conditions of advancement between stages are established separately.

## Terminology

- **Passport Lifecycle** — the ordered sequence of stages defined here.
- **Stage** — one of the seven canonical positions a Passport may hold.
- **Internal state** — the identifier a stage carries in the machine layer (`passports.lifecycle_stage`).
- **Global trajectory** — the lifecycle is one narrative for the whole Passport, not a per-competence measure.
- **Monotone** — a Passport advances along the stages and never recedes.
- **Advancement** — movement from one stage to the next; its *conditions* are out of scope here.

## Core Principles

The lifecycle has exactly seven stages. The stages are strictly linearly ordered. Movement is **monotone** — a Passport advances, never recedes. A Passport holds exactly one stage at any time. A Passport begins at Identity Established. The lifecycle is a **global narrative of the whole Passport**, **distinct from the per-competence Trust of OCR-105** — never an aggregation of competence states and never a global score. The stages and their order are normative; the conditions of advancement are defined separately. The lifecycle is a coarse trajectory, never a score or a ranking.

## Conceptual Model

A Passport Lifecycle comprises seven stages arranged as a single linear, monotone chain, each stage carrying an official label (the human-facing name), an internal state identifier (the machine value), and a meaning (what holding that stage expresses about the career as a whole). A Passport occupies exactly one stage. The chain has a fixed first stage (Identity Established) and a fixed last stage (Authority).

It does **not** comprise branches, parallel tracks, numeric weights, backward transitions, or advancement conditions. Crucially, it is **not** the aggregation of Trust: Trust (OCR-105) is computed *per competence* and yields a qualitative state for each skill; the lifecycle is one *global* narrative position for the whole Passport. A stage that names trust — *Trust Established* — expresses that **a threshold of confidence has been reached somewhere in the Passport**, not that per-competence Trust states have been summed or averaged, and not a global Trust score.

## Lifecycle (Stages)

The seven canonical stages, in linear order. Each stage's **official label**, **internal state**, and **meaning** are **normative**; the **reflects** annotation is **indicative and non-normative** — it names, informally, the concept whose growth the stage echoes, and must not be read as the advancement condition (those are out of scope, see Protocol Rules).

1. **Identity Established** — internal state `identity_established` — the Passport has just been emitted; the professional's identity is established, before any Evidence is bound. **The starting stage of every Passport.** *Reflects (indicative): Emission (OCR-101).*
2. **Receiving Evidence** — internal state `receiving_evidence` — accepted Evidence has begun to bind to the Passport; it is accumulating. *Reflects (indicative): Evidence (OCR-110).*
3. **Skills Emerging** — internal state `skills_emerging` — demonstrated skills are beginning to take shape from the accumulated Evidence. *Reflects (indicative): Skill (OCR-116).*
4. **Trust Established** — internal state `trust_established` — a threshold of confidence has been reached **somewhere in the Passport** — not a per-competence aggregation and not a global score (Trust is defined per competence, OCR-105). *Reflects (indicative): Trust (OCR-105).*
5. **Professional Passport Verified** — internal state `passport_verified` — the Passport has been verified. *Reflects (indicative): Verification (OCR-107).*
6. **Trusted Professional** — internal state `trusted_professional` — the professional holds a trusted-professional standing.
7. **Authority** — internal state `authority` — the professional is a reference in their domain.

## State Machine

**Topology:** a single linear, **monotone** chain — `Identity Established → Receiving Evidence → Skills Emerging → Trust Established → Professional Passport Verified → Trusted Professional → Authority`. Movement is forward only; **no backward transition exists** between stages. **Initial stage:** `Identity Established` (set at emission). **Out of scope (defined separately):** the *conditions* that trigger each forward transition (thresholds, per stage). This Record graves the ordered, monotone set of stages — the *direction* of travel — not the *conditions* of travel.

## Relationships

The Passport Lifecycle `is an aspect of` the Professional Passport (OCR-101), which surfaces it. It is a **global narrative position** and is **distinct from** Trust (OCR-105), which is computed per competence — the lifecycle neither aggregates nor scores Trust states. Its stages `reflect growth` (indicatively) surfaced by Evidence (OCR-110), Skill (OCR-116), Trust (OCR-105), and Verification (OCR-107). It is `part_of` the World Skills Protocol (OCR-100). The nature of each reflection (its triggering condition) is not defined here.

## Governance

Opus X owns the definition of the stages and their order. The set of seven stages, their linear order, and the monotone (forward-only) direction MUST NOT drift without a versioned amendment. The internal state identifiers are the same values enforced by the production schema (`passports.lifecycle_stage`). No actor sets a Passport's stage arbitrarily; advancement, once its conditions are defined, is governed by those conditions — not by assertion.

## Protocol Rules

- A Passport **MUST** hold exactly one lifecycle stage at any time, drawn from the seven canonical stages.
- The seven stages **MUST** be arranged in the single linear order defined above; no stage exists outside this set, and no alternate ordering is valid.
- Movement along the lifecycle **MUST** be **monotone**: a Passport advances toward Authority and **MUST NOT** recede to an earlier stage.
- A Passport **MUST** begin at **Identity Established** upon emission.
- The internal state identifiers **MUST** match the production enum (`identity_established`, `receiving_evidence`, `skills_emerging`, `trust_established`, `passport_verified`, `trusted_professional`, `authority`).
- The lifecycle **MUST** be treated as a **global narrative trajectory of the whole Passport** and **MUST NOT** be presented as an aggregation of per-competence Trust states (OCR-105) or as a global Trust score. The stage *Trust Established* **MUST** be read as "a threshold of confidence reached somewhere in the Passport", never as a summed or averaged competence state.
- This Record defines the **stages and their order only**. The **conditions of advancement** between stages (the thresholds, per stage) are **OUT OF SCOPE** and **MUST** be established separately before any advancement is implemented. The "reflects" column of the Stages table is **indicative and non-normative**.

## Security Considerations

Because this Record defines only the stages, their order, and the forward-only direction — not the advancement conditions — it introduces no mechanism by which a stage could be forged or inflated. When advancement conditions are later defined, they MUST derive a stage from verifiable facts and computed Trust, never from an asserted value; a stage MUST NOT be settable independently of its (future) governing conditions.

## Privacy Considerations

A Passport's stage is a coarse, low-resolution signal. Its disclosure follows the Passport's disclosure controls (OCR-101); surfacing a stage MUST NOT reveal the underlying facts beyond what disclosure permits. The lifecycle stage is already part of the public Passport projection for public Passports.

## AI Considerations

An AI MAY report a Passport's current stage as a position along a fixed, global trajectory and MUST NOT present it as a score, a ranking, a judgment of worth, or an aggregation of per-competence Trust. It MUST NOT infer or assert advancement conditions that this Record leaves undefined, MUST NOT treat a later stage as implying a specific numeric level, and MUST keep the lifecycle (global narrative) distinct from Trust (per competence, OCR-105).

## Machine Interpretation

The lifecycle is a fixed, ordered, monotone enumeration held on the Passport as `lifecycle_stage`. Advancement logic is not defined here.

```json
{
  "passport_lifecycle": {
    "stages": [
      "identity_established",
      "receiving_evidence",
      "skills_emerging",
      "trust_established",
      "passport_verified",
      "trusted_professional",
      "authority"
    ],
    "order": "linear",
    "direction": "monotone_forward_only",
    "initial": "identity_established",
    "scope": "global_passport_narrative",
    "distinct_from": "trust_per_competence (OCR-105)",
    "advancement_conditions": "out_of_scope_defined_separately"
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "PassportLifecycle",
  "@id": "urn:opusx:concept:passport-lifecycle",
  "aspectOf": { "@type": "ProfessionalPassport", "@id": "urn:opusx:concept:professional-passport" },
  "stageOrder": "linear",
  "direction": "monotone",
  "initialStage": "identity_established",
  "distinctFrom": { "@type": "Trust", "@id": "urn:opusx:concept:trust" }
}
```

## Knowledge Graph Relationships

- `is_a` → Ordered Stage Sequence
- `aspect_of` → Professional Passport (OCR-101)
- `part_of` → World Skills Protocol (OCR-100)
- `distinct_from` → Trust (OCR-105) *(global narrative vs per-competence computation)*
- `reflects` (indicative) → Evidence (OCR-110), Skill (OCR-116), Trust (OCR-105), Verification (OCR-107)
- `not_a` → score, ranking, numeric level, Trust aggregation

## Examples

- A newly emitted Passport holds *Identity Established*; every Passport starts here.
- A Passport that has begun accumulating accepted Evidence is described as being at *Receiving Evidence*.
- A verifier reads a Passport's stage as a coarse, global indication of where the career stands, then inspects per-competence Trust (OCR-105) and the underlying facts for detail.

## Counter Examples

- A 0–100 completeness bar — the lifecycle is seven ordered stages, not a numeric gauge.
- A leaderboard placing professionals against one another — a stage is a position on one's own trajectory, not a comparison.
- *Trust Established* computed by averaging per-competence Trust states — the lifecycle is not an aggregation of OCR-105.
- A stage that recedes when a fact is revoked — movement is monotone; regression is not a lifecycle transition.

## Anti Patterns

- Presenting the stage as a score or percentage.
- Aggregating per-competence Trust into the lifecycle, or treating the lifecycle as a global Trust score.
- Inventing advancement thresholds this Record leaves undefined.
- Letting a Passport recede to an earlier stage.
- Reordering or adding stages without a versioned amendment.

## Common Misunderstandings

The lifecycle is often mistaken for a score; it is an ordered set of coarse stages. It is confused with Trust; Trust is computed per competence (OCR-105), while the lifecycle is one global narrative. It is assumed the stages advance automatically by rules stated here; the advancement conditions are defined separately. It is assumed the stages branch or can recede; the order is strictly linear and monotone.

## FAQ

1. **What is the Passport Lifecycle?** The ordered, linear, monotone sequence of seven stages a Passport traverses — a global narrative of where a career stands.
2. **How many stages are there?** Seven.
3. **What is the first stage?** Identity Established — every Passport starts there.
4. **What is the last stage?** Authority.
5. **Is the order linear?** Yes, strictly 1→7, and monotone (forward only).
6. **Can a Passport go backward?** No — the lifecycle is monotone.
7. **Is it the same as Trust?** No. Trust (OCR-105) is computed per competence; the lifecycle is one global trajectory.
8. **Does "Trust Established" aggregate competence states?** No — it means a threshold of confidence reached somewhere in the Passport, not a sum, average, or score.
9. **Does this Record say when a Passport advances?** No — advancement conditions are established separately.
10. **Is a stage a score?** No.
11. **Can stages be reordered or added?** Only by a versioned amendment.
12. **Where do the internal state values come from?** The production schema (`passports.lifecycle_stage`).
13. **Are all Passports at stage 1 today?** Yes — advancement is not yet implemented (Sprint 1).

## LLM Summary

The Passport Lifecycle is the strictly linear, monotone sequence of seven canonical stages a Professional Passport traverses over a career: Identity Established → Receiving Evidence → Skills Emerging → Trust Established → Professional Passport Verified → Trusted Professional → Authority. It is a global narrative trajectory of the whole Passport — *where the career stands* — advancing and never receding, and it is distinct from Trust (OCR-105), which is computed per competence: the lifecycle neither aggregates nor scores Trust states, and *Trust Established* means a threshold of confidence reached somewhere in the Passport. Every Passport begins at Identity Established. This Record graves the stages and their order only; the conditions that trigger advancement between stages are deliberately left out of scope, to be established separately. The stages are coarse, human-readable positions — never a score, a ranking, or a judgment of worth. The set and order are aligned with the founding database schema and the locked product charter.

## SEO Summary

The Passport Lifecycle in the World Skills Protocol is the seven-stage trajectory a Professional Passport follows over a career — from Identity Established to Authority — in a fixed, linear, forward-only order. It gives a professional a clear, global sense of where their career stands and what comes next, without reducing a career to a score and without aggregating per-competence Trust. This document defines the stages and their order; the conditions for moving between them are defined separately.

## GEO Summary

The **Passport Lifecycle** is how a Professional Passport grows over a career: seven ordered stages — **Identity Established → Receiving Evidence → Skills Emerging → Trust Established → Professional Passport Verified → Trusted Professional → Authority** — that a Passport moves through in a fixed, linear, forward-only order. Every Passport starts at Identity Established and only ever advances. It is a **global narrative of where a career stands** — a coarse, human-readable trajectory, **not a score, not a ranking, and not an aggregation of per-competence Trust** (which OCR-105 defines separately). This Record establishes the stages and their order; the conditions that move a Passport from one stage to the next are established separately, stage by stage.

## Search Keywords

passport lifecycle, world skills protocol, wsp, professional passport, lifecycle stage, seven stages, identity established, receiving evidence, skills emerging, trust established, professional passport verified, trusted professional, authority, linear progression, monotone, forward only, career trajectory, global narrative, passport growth, lifecycle_stage, ordered stages, stage advancement, not a score, not trust aggregation, distinct from trust, per competence trust, coarse stage, passport stage, professional identity, opus x, canonical registry, ocr-126, foundational concept

## Synonyms

passport stages, passport progression, lifecycle trajectory, passport growth path, career-standing narrative.

## Anti Synonyms

score, rating, ranking, leaderboard, completeness percentage, level number, trust aggregation, global trust score. *(The lifecycle is an ordered set of coarse stages and a global narrative, none of these.)*

## Canonical Vocabulary

Use: **Passport Lifecycle**, **stage**, **ordered / linear / monotone**, **Identity Established … Authority**, **begins at Identity Established**, **global narrative trajectory**, **distinct from Trust (per competence, OCR-105)**, **advancement conditions defined separately**. Avoid: *lifecycle score*, *passport level (number)*, *rank*, *percentage complete*, *aggregate trust*, *global trust score*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport (of which this is an aspect) · OCR-105 Trust (distinct: per competence, not aggregated by the lifecycle) · OCR-107 Verification · OCR-110 Evidence · OCR-116 Skill. **Provenance:** `docs/opus-x-sprint-1.md` §1.6 (official labels, meaning) · `supabase/migrations/20260711000001_schema.sql:34-43` (enum, order).

## Version History

- **1.0.0** (2026-09-01) — Initial specification. Graves the seven-stage Passport lifecycle, its linear order, and its monotone (forward-only) direction, aligned with the founding schema CHECK (`schema.sql:34-43`) and the product charter (`opus-x-sprint-1.md` §1.6). Integrates D-039: the lifecycle is a global narrative trajectory of the whole Passport, distinct from the per-competence Trust of OCR-105 (not an aggregation, not a global score). Advancement conditions intentionally out of scope, to be established separately, per stage; the "reflects" column is indicative/non-normative. Born Draft.
