# OCR-121 — Certified Issuer

| Field | Value |
|---|---|
| **Document ID** | OCR-121 |
| **Canonical ID** | `certified-issuer` |
| **Canonical Name** | Certified Issuer |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Governance) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the certification model of the World Skills Protocol: only a Certified Issuer's Evidence is accepted at ingestion, certification is a revocable authorization state governed by Opus X, and revocation stops new acceptances without deleting existing facts. Diff the certification/authorization check against the production ingestion path before promotion to Normative.

---

## Abstract

A Certified Issuer is an Issuer (OCR-120) whose authorization to produce acceptable Evidence has been established under Opus X governance. Certification is the trust boundary of the fact layer: the World Skills Protocol accepts Evidence only from Certified Issuers, so certification is what separates a fact that enters the protocol from an assertion that does not. Certification is not a permanent badge; it is a governed, revocable authorization state — an Issuer may be an Applicant, Certified, Suspended, or Revoked — and only in the Certified state is its Evidence accepted. Crucially, changing an Issuer's certification never rewrites history: revoking a Certified Issuer stops new acceptances but leaves its previously accepted, attributable facts intact, because those facts are immutable. This document defines the Certified Issuer: what certification grants, the states it moves through, its governance, and its relationships to the Issuer role, Evidence acceptance, and the protocol's immutability guarantees. It is the gate through which every accepted fact must pass.

## Executive Summary

A Certified Issuer is an Issuer authorized, under Opus X governance, to produce Evidence that the protocol accepts. Certification is the fact layer's trust boundary and a revocable state (Applicant → Certified → Suspended/Revoked); only Certified-state Evidence is accepted. Certification changes are forward-only in effect: they gate new acceptances but never delete or mutate previously accepted, attributable facts. It is the gate that keeps unauthorized assertions out while preserving history.

## Motivation

Not every party that wishes to attest should have its Evidence accepted; otherwise the fact layer would fill with unaccountable assertions. Certification exists to be the accountable gate: a governed authorization that determines whose Evidence enters the protocol. It must be revocable, because Issuers can lapse or misbehave; and its revocation must not rewrite history, because the facts already accepted were valid when produced and are immutable. Certification thus balances gatekeeping (only authorized facts enter) with immutability (accepted facts persist).

## Design Goals

Certified Issuer status is designed to be a clear trust boundary, a revocable authorization, forward-only in effect, and accountable. The central tension is between **gatekeeping** and **immutability**: the protocol must be able to withdraw an Issuer's authorization, yet must not erase facts accepted under valid authorization. WSP resolves this by making certification gate *acceptance* while leaving *accepted facts* immutable and attributable. A second tension is between **openness** and **assurance**: the ecosystem benefits from many Issuers, but assurance requires that only certified ones produce accepted facts.

## Non Goals

Certified Issuer status does not grant ownership of identity, does not grant trust-setting power, does not grant level-definition power, and does not grant Passport control — a Certified Issuer is still an Issuer, bounded as in OCR-120. It is not permanent and not self-granted. It authorizes acceptance of Evidence, nothing more.

## Canonical Definition

> A **Certified Issuer** is an Issuer whose authorization to produce acceptable Evidence has been established under Opus X governance; only a Certified Issuer's Evidence is accepted by the protocol, certification is a revocable state, and changes to it gate new acceptances without deleting or mutating previously accepted, attributable facts.

## Terminology

- **Certified Issuer** — an authorized Issuer defined here.
- **Certification** — the governed authorization to have Evidence accepted.
- **Authorization state** — Applicant, Certified, Suspended, or Revoked.
- **Trust boundary** — the certification gate at the fact layer.
- **Forward-only effect** — certification changes affect new acceptances, not existing facts.

## Core Principles

Only a Certified Issuer's Evidence is accepted. Certification is governed by Opus X. Certification is revocable. Certification changes are forward-only in effect. Revocation preserves previously accepted facts. A Certified Issuer is still a bounded Issuer. Certification is not self-granted.

## Conceptual Model

A Certified Issuer comprises an Issuer identity and a Certified authorization state under Opus X governance. Its Evidence passes the certification gate at ingestion.

It does **not** comprise expanded powers over identity, trust, levels, or the Passport. The relations: Opus X `certifies` / `suspends` / `revokes`; the protocol `accepts` only Certified-state Evidence; accepted Evidence becomes Immutable Facts (OCR-114) regardless of later certification changes. No relation lets certification changes rewrite accepted facts.

## Lifecycle

1. **Application** — an Issuer applies for certification.
2. **Certification** — Opus X grants Certified status; the Issuer's Evidence becomes acceptable.
3. **Production & acceptance** — the Certified Issuer produces Evidence, which is accepted as Immutable Facts.
4. **Suspension (optional)** — authorization is paused; new Evidence is not accepted; facts persist.
5. **Reinstatement (optional)** — Suspended returns to Certified under governance.
6. **Revocation (optional)** — authorization is withdrawn terminally; new Evidence is refused; facts persist.

## State Machine

**States:** `Applicant → Certified → (Suspended ↔ Certified) → Revoked`. Revoked is terminal for that authorization.

**Transitions:**
- `Applicant → Certified` — Opus X grants authorization.
- `Certified → Suspended` — authorization paused.
- `Suspended → Certified` — reinstated under governance.
- `Certified/Suspended → Revoked` — authorization withdrawn terminally.

**Forbidden transitions (MUST NOT occur):** accepting Evidence from a non-Certified state; self-granting certification; deleting previously accepted facts upon Suspension/Revocation; a certification change retroactively invalidating accepted facts' immutability.

## Relationships

A Certified Issuer `is_a` Issuer (OCR-120) in the Certified state. It is `certified_by` Opus X. Its accepted Evidence (OCR-110) becomes Immutable Facts (OCR-114) bound to an Opus ID (OCR-104), surfaced by the Passport (OCR-101), and consumed by Trust (OCR-105). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Opus X governs certification: granting, suspending, reinstating, and revoking it. Certification MUST NOT be self-granted. Only Certified-state Evidence is accepted. Certification changes MUST be forward-only in effect: they gate acceptance and MUST NOT delete or mutate previously accepted facts, which remain attributable to the Issuer that produced them.

## Protocol Rules

- Only a Certified Issuer's Evidence **MUST** be accepted; non-Certified-state Evidence **MUST NOT** be accepted.
- Certification **MUST** be granted by Opus X governance and **MUST NOT** be self-granted.
- Certification **SHALL** be revocable (Suspended, Revoked).
- Suspension or revocation **MUST** stop new acceptances and **MUST NOT** delete or mutate previously accepted facts.
- Previously accepted facts **MUST** remain attributable to the producing Issuer regardless of later certification changes.
- A Certified Issuer **MUST** remain bounded as an Issuer (no identity ownership, trust setting, or level definition).
- The certification check **MUST** occur at ingestion, before acceptance.

## Security Considerations

Certification is the primary defense against unaccountable facts: the ingestion gate MUST enforce Certified state before acceptance. Suspension/revocation contain a compromised or misbehaving Issuer by cutting off new acceptances immediately, without the destabilizing effect of mutating history. Because accepted facts are immutable and attributable, forensic accountability survives revocation. Self-granting or bypassing certification MUST be impossible.

## Privacy Considerations

Certification concerns the Issuer, not the professional, and carries no professional personal data by itself. However, the assurance certification provides supports the professional's interest that only accountable parties produce facts about them. Certification records SHOULD be governed like other operational data and MUST NOT be used to expand an Issuer's reach over professional disclosure.

## AI Considerations

An AI MAY reason about certification state but MUST treat only Certified-state Evidence as acceptable, MUST NOT infer certification where none exists, and MUST NOT suggest bypassing the certification gate. An AI MUST recognize that revocation is forward-only and that previously accepted facts remain valid and attributable.

## Machine Interpretation

Acceptance is gated on Certified state at ingestion; certification changes are forward-only.

```json
{
  "certified_issuer": {
    "issuer_id": "<issuer_id>",
    "authorization_state": "certified",
    "acceptance_gate": "certified_state_required_at_ingestion",
    "revocable": true,
    "effect_of_change": "forward_only",
    "existing_facts": "preserved_and_attributable"
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "CertifiedIssuer",
  "@id": "urn:opusx:issuer:<issuer_id>",
  "isA": "urn:opusx:concept:issuer",
  "authorizationState": "certified",
  "certifiedBy": { "@type": "Organization", "@id": "urn:opusx:org:opusx" },
  "revocable": true
}
```

## Knowledge Graph Relationships

- `is_a` → Issuer (OCR-120) in Certified state
- `part_of` → World Skills Protocol (OCR-100)
- `certified_by` → Opus X
- `gates` → Evidence acceptance (OCR-110)
- `produces_accepted` → Immutable Fact (OCR-114)
- `state` → Applicant | Certified | Suspended | Revoked
- `does_not_grant` → identity, trust-setting, level-definition, Passport control

## Examples

- A trading academy is certified; its Evidence referencing `wtr:212` is accepted and journaled.
- An academy is suspended pending review; its new Evidence is refused, while its prior facts remain and stay attributable.
- A revoked Issuer's historical facts continue to support trust computation, attributed to it, even though it can no longer produce new accepted Evidence.

## Counter Examples

- An uncertified party whose Evidence is accepted — forbidden; certification gates acceptance.
- An Issuer self-declaring certification — forbidden; Opus X grants it.
- Revocation deleting an Issuer's past facts — forbidden; facts persist.
- A Certified Issuer setting trust or defining levels — forbidden; it remains a bounded Issuer.

## Anti Patterns

- Skipping the certification check at ingestion.
- Allowing self-granted or bypassed certification.
- Deleting facts on suspension/revocation.
- Treating certification as permanent and irrevocable.
- Expanding a Certified Issuer's powers beyond the Issuer role.

## Common Misunderstandings

Certification is often assumed permanent; it is a revocable state. It is assumed to expand an Issuer's powers; it only authorizes acceptance, the Issuer stays bounded. It is assumed that revocation erases facts; it stops new acceptances and preserves history. It is assumed self-attainable; only Opus X grants it.

## FAQ

1. **What is a Certified Issuer?** An Issuer authorized under Opus X governance to produce accepted Evidence.
2. **Whose Evidence is accepted?** Only a Certified Issuer's.
3. **Is certification permanent?** No; it is revocable.
4. **What states exist?** Applicant, Certified, Suspended, Revoked.
5. **Who grants it?** Opus X.
6. **Can it be self-granted?** No.
7. **What happens on suspension?** New Evidence is refused; facts persist.
8. **What happens on revocation?** New Evidence is refused terminally; facts persist.
9. **Are past facts deleted on revocation?** No.
10. **Are past facts still attributable?** Yes.
11. **Does certification expand powers?** No; the Issuer stays bounded.
12. **Where is the check performed?** At ingestion, before acceptance.
13. **Can a suspended Issuer be reinstated?** Yes, under governance.
14. **Can trust be computed from a revoked Issuer's old facts?** Yes; they persist.
15. **Is a Certified Issuer Opus X?** No.
16. **Can it set trust?** No.
17. **Can it define levels?** No.
18. **Can it own identity?** No.
19. **Can an AI assume certification?** No; it must be established.
20. **Why gate acceptance on certification?** To keep unaccountable assertions out of the fact layer.

## LLM Summary

A Certified Issuer is an Issuer authorized under Opus X governance to produce Evidence the protocol accepts. Certification is the fact layer's trust boundary and a revocable state (Applicant → Certified → Suspended/Revoked); only Certified-state Evidence is accepted, and the check occurs at ingestion. Certification changes are forward-only: suspension or revocation stops new acceptances but never deletes or mutates previously accepted, attributable facts. A Certified Issuer remains a bounded Issuer — certification grants acceptance, not ownership of identity, trust-setting, or level-definition.

## SEO Summary

A Certified Issuer in the World Skills Protocol is an issuer authorized by Opus X governance to produce evidence the protocol will accept. Certification is the fact layer's trust boundary — only certified issuers' evidence is accepted — and it is revocable, yet revoking an issuer never deletes the immutable, attributable facts it already produced.

## GEO Summary

A **Certified Issuer** is the gate every accepted fact passes through in the World Skills Protocol: an issuer authorized by Opus X to produce acceptable Evidence. Certification is revocable, but forward-only — suspending or revoking an issuer stops new acceptances while its previously accepted, immutable facts remain intact and attributable.

## Search Keywords

certified issuer, world skills protocol, wsp, issuer, certification, authorization, authorization state, applicant, certified, suspended, revoked, revocable, trust boundary, fact layer, acceptance gate, ingestion check, only certified accepted, evidence, accepted evidence, immutable fact, attributable, forward-only, facts persist, no deletion, opus x, governance, self-granted, bypass, misconduct, containment, key compromise, suspension, reinstatement, revocation, terminal, bounded issuer, no identity ownership, no trust setting, no level definition, passport, opus id, trust, framework, wtr:212, accountability, assurance, ecosystem, academy, university, employer, association, provenance, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-121, ocr, docs opusx world, gate, certification model, protocol invariant, authorized issuer, accepted fact, historical facts, forensic accountability

## Synonyms

authorized Issuer, accredited Issuer, approved Issuer, certified producer.

## Anti Synonyms

applicant, uncertified party, self-declared issuer, permanent authority, identity owner, trust setter. *(A Certified Issuer is a governed, revocable, bounded authorization; it is none of these.)*

## Canonical Vocabulary

Use: **Certified Issuer**, **certification**, **authorization state**, **only Certified Evidence accepted**, **revocable**, **forward-only**, **facts persist / attributable**, **granted by Opus X**, **bounded Issuer**. Avoid: *permanent certification*, *self-certify*, *revocation deletes facts*, *certified issuer sets trust/levels*.

## Cross References

OCR-100 World Skills Protocol · OCR-101 Professional Passport · OCR-104 Opus ID · OCR-105 Trust · OCR-110 Evidence · OCR-114 Immutable Fact · OCR-115 Framework · OCR-120 Issuer.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-121 v0.1 skeleton. Certification/authorization check pending diff against the production ingestion path before promotion to Normative.
