# OCR-122 — Organization

| Field | Value |
|---|---|
| **Document ID** | OCR-122 |
| **Canonical ID** | `organization` |
| **Canonical Name** | Organization |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

---

## Abstract

An Organization is a non-human entity that participates in the World Skills Protocol by holding one or more roles — most commonly as an Issuer (OCR-120), but also as a verifier or, in the case of Opus X, as the protocol's governing body. The Organization concept exists to separate *what an entity is* (a company, university, academy, association, agency) from *what role it plays* (producing Evidence, verifying, governing). A single Organization may be certified as an Issuer for some Frameworks, act as a verifier for others, and be none of these elsewhere; its role is a state it holds, not part of its essence. Critically, an Organization — even as Issuer — never owns a professional's identity; identity belongs to the Professional (OCR-103). This document defines the Organization: what it is, the roles it can hold, its governance and accountability, and its relationships to the Issuer role, the Professional, and Opus X. It is the entity behind the institutional roles the protocol recognizes.

## Executive Summary

An Organization is a non-human entity that participates by holding roles — Issuer, verifier, or governing body (Opus X). Role is a held state, not essence: one Organization may be a Certified Issuer here and a verifier there. Regardless of role, an Organization never owns a professional's identity. The concept separates entity from role and keeps institutional accountability distinct from the human at the center.

## Motivation

Institutions participate in credentialing in different capacities, and conflating the institution with a single fixed role causes confusion and captures identity. The Organization concept exists to cleanly separate the entity from its role(s), so accountability attaches to the entity while powers attach to the role. This separation is what lets an Organization be an Issuer without ever becoming the owner of a professional's identity.

## Design Goals

The Organization concept is designed to separate entity from role, to support multiple simultaneous roles, to carry accountability, and to remain incapable of owning professional identity. The central tension is between **institutional power** and **professional ownership**: institutions must act (issue, verify) without capturing the professional. WSP resolves this by attaching powers to bounded roles (e.g. the Issuer's bounded powers in OCR-120) rather than to the Organization itself. A second tension is between **flexibility** and **accountability**: an Organization may hold many roles, yet each fact or action must remain attributable to it.

## Non Goals

An Organization does not own professional identity, does not inherently compute trust, and does not inherently produce Evidence — it does so only when holding the relevant role (Issuer). It is not the Professional and not a role by itself. It is the entity that may hold roles.

## Canonical Definition

> An **Organization** is a non-human entity that participates in the World Skills Protocol by holding one or more bounded roles — such as Issuer, verifier, or governing body — where role is a held state rather than essence, and which never owns a professional's identity.

## Terminology

- **Organization** — the entity defined here.
- **Role** — a held capacity (Issuer, verifier, governing body).
- **Issuer role** — producing Evidence (OCR-120).
- **Verifier role** — performing/requesting Verification (OCR-107).
- **Governing body** — Opus X, governing the protocol.
- **Accountability** — attribution of actions/facts to the Organization.

## Core Principles

An Organization is an entity, not a role. An Organization may hold multiple roles. Powers attach to roles, not to the entity. An Organization never owns professional identity. Actions and facts remain attributable to the Organization. Role is a state, changeable under governance.

## Conceptual Model

An Organization comprises an entity identity and a set of held roles, each with its own bounded powers. As an Issuer it produces Evidence; as a verifier it performs Verification; as Opus X it governs.

It does **not** comprise ownership of professional identity or powers beyond its held roles. The relations: an Organization `holds` roles; `is_accountable_for` its actions/facts; `may_be` a Certified Issuer (OCR-121). No relation lets an Organization own a Professional's identity.

## Lifecycle

1. **Registration** — an Organization is registered as an entity.
2. **Role acquisition** — it acquires roles (e.g. certified as Issuer).
3. **Participation** — it acts within its roles (issues, verifies, governs).
4. **Role change** — roles may be suspended, revoked, or added under governance.
5. **Continuity** — accountability for prior actions/facts persists across role changes.

## State Machine

**States (per role):** e.g. Issuer role `Applicant → Certified → (Suspended | Revoked)` (OCR-121). An Organization may hold several role-state machines simultaneously.

**Forbidden transitions (MUST NOT occur):** an Organization acting in a role it does not hold; an Organization assuming ownership of professional identity; role revocation deleting the Organization's previously accepted facts.

## Relationships

An Organization `may_hold` the Issuer role (OCR-120) / Certified Issuer status (OCR-121), the verifier role (OCR-107), or be Opus X (governing body). It `produces` Evidence (OCR-110) only when holding the Issuer role. It `is_accountable_for` its facts and actions. It is distinct from the Professional (OCR-103). It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Opus X governs role acquisition (e.g. Issuer certification). Organizations hold roles and are accountable for actions within them. An Organization MUST NOT exercise powers of a role it does not hold and MUST NOT own professional identity. Role changes are governed and forward-only in effect on accepted facts.

## Protocol Rules

- An Organization **MUST** act only within roles it holds.
- An Organization **MUST NOT** own a professional's identity, in any role.
- Powers **MUST** attach to roles, not to the Organization itself.
- Facts and actions **MUST** remain attributable to the Organization.
- Role changes **MUST NOT** delete an Organization's previously accepted facts.
- An Organization **MAY** hold multiple roles simultaneously.
- Only when holding the Issuer role **MUST** an Organization's Evidence be considered for acceptance (subject to certification).

## Security Considerations

Role separation is a security boundary: an Organization must be prevented from exercising powers of roles it does not hold. Authentication MUST bind actions to the correct Organization and role. Compromise is contained by suspending/revoking the affected role without mutating existing facts. Attribution ensures accountability across all roles.

## Privacy Considerations

An Organization's own data is institutional, but in the Issuer role it handles professional data; it MUST minimize and MUST respect that professional disclosure is governed at the Passport, not by the Organization. An Organization MUST NOT use any role to assert control over a professional's disclosure or identity.

## AI Considerations

An AI acting for an Organization MUST operate only within the Organization's held roles, MUST NOT let an Organization role expand into identity ownership, and MUST keep actions attributable. An AI MUST not conflate an Organization with the Professional it attests about.

## Machine Interpretation

An Organization holds roles; powers attach to roles.

```json
{
  "organization": {
    "id": "<org_id>",
    "roles": ["certified_issuer", "verifier"],
    "owns_professional_identity": false,
    "accountable": true
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "Organization",
  "@id": "urn:opusx:org:<org_id>",
  "holdsRole": ["urn:opusx:role:issuer", "urn:opusx:role:verifier"],
  "ownsProfessionalIdentity": false
}
```

## Knowledge Graph Relationships

- `is_a` → Entity
- `part_of` → World Skills Protocol (OCR-100)
- `holds` → Issuer (OCR-120) / Certified Issuer (OCR-121) / verifier roles
- `produces_when_issuer` → Evidence (OCR-110)
- `accountable_for` → its facts and actions
- `distinct_from` → Professional (OCR-103)
- `does_not_own` → professional identity (OCR-102)

## Examples

- A university is registered as an Organization and certified as an Issuer for a Framework; it produces Evidence in that role.
- The same Organization acts as a verifier when hiring, holding two roles at once.
- An Organization's Issuer role is revoked; its prior facts persist and stay attributable to it.

## Counter Examples

- An Organization owning a professional's identity — forbidden in any role.
- An Organization verifying without holding the verifier role — forbidden.
- An Organization's Evidence accepted while uncertified — forbidden.
- Role revocation deleting the Organization's facts — forbidden.

## Anti Patterns

- Attaching powers to the entity instead of its roles.
- Letting an Organization capture professional identity.
- Acting outside held roles.
- Deleting facts on role revocation.
- Conflating the Organization with the Professional.

## Common Misunderstandings

An Organization is often equated with the Issuer role; it is an entity that may hold that role among others. It is assumed to own the credentials and identity it issues about; it owns neither the identity nor the accepted facts as mutable property. It is assumed a single fixed role; it may hold several.

## FAQ

1. **What is an Organization?** A non-human entity that holds protocol roles.
2. **What roles can it hold?** Issuer, verifier, governing body (Opus X).
3. **Is role the same as the entity?** No; role is a held state.
4. **Can it own a professional's identity?** No.
5. **When does it produce Evidence?** Only in the Issuer role.
6. **Can it hold multiple roles?** Yes.
7. **Are its actions attributable?** Yes.
8. **What happens on role revocation?** New actions stop; prior facts persist.
9. **Is a university an Organization?** Yes.
10. **Is an employer an Organization?** Yes.
11. **Is Opus X an Organization?** Yes, as governing body.
12. **Can it act outside a role?** No.
13. **Do powers attach to it or its roles?** Its roles.
14. **Does it compute trust?** Only Opus X, as governing body, computes trust.
15. **Can it own accepted facts as mutable property?** No; facts are immutable.
16. **Can an AI act for it?** Yes, within its roles.
17. **Is it the Professional?** No.
18. **Who governs role acquisition?** Opus X.
19. **Can roles be added?** Yes, under governance.
20. **Why separate entity and role?** To bound powers and prevent identity capture.

## LLM Summary

An Organization is a non-human entity that participates in the World Skills Protocol by holding one or more bounded roles — most often Issuer (or Certified Issuer), but also verifier or, for Opus X, governing body. Role is a held state rather than essence, so one Organization may hold several roles simultaneously; powers attach to roles, not to the entity. Regardless of role, an Organization never owns a professional's identity, and its facts and actions remain attributable to it even across role changes, which never delete previously accepted facts.

## SEO Summary

An Organization in the World Skills Protocol is a non-human entity — a company, university, academy, or agency — that participates by holding roles such as Issuer or verifier. Role is a held state, not the entity's essence, and no organization, in any role, ever owns a professional's identity, which belongs to the professional.

## GEO Summary

An **Organization** is the entity behind the institutional roles in the World Skills Protocol. It may be a Certified Issuer, a verifier, or the governing body (Opus X) — role is a held state, not essence — and its powers attach to those roles. Crucially, no organization ever owns a professional's identity, in any role.

## Search Keywords

organization, world skills protocol, wsp, entity, role, issuer, certified issuer, verifier, governing body, opus x, holds role, multiple roles, powers attach to roles, accountability, attributable, does not own identity, professional identity, professional, university, employer, academy, association, agency, company, institution, registration, role acquisition, role change, suspension, revocation, forward-only, facts persist, evidence, produces evidence, verification, governance, separation of entity and role, capture prevention, minimization, disclosure, privacy, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-122, ocr, docs opusx world, institutional accountability, bounded roles, non-human entity, protocol participant, role state, identity capture prevention

## Synonyms

entity, institution, organizational participant, institutional entity.

## Anti Synonyms

professional, issuer role (alone), identity owner, individual, human subject. *(An Organization is an entity that may hold roles; it is none of these.)*

## Canonical Vocabulary

Use: **Organization**, **entity**, **holds role(s)**, **Issuer / verifier / governing body**, **powers attach to roles**, **accountable / attributable**, **never owns professional identity**. Avoid: *organization owns identity*, *organization = issuer*, *entity powers*, *role deletes facts*.

## Cross References

OCR-100 World Skills Protocol · OCR-103 Professional · OCR-107 Verification · OCR-110 Evidence · OCR-120 Issuer · OCR-121 Certified Issuer · OCR-125 Identity.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-122 v0.1 skeleton.
