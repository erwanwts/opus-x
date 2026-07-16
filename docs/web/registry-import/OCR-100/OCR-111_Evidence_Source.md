# OCR-111 — Evidence Source

| Field | Value |
|---|---|
| **Document ID** | OCR-111 |
| **Canonical ID** | `evidence-source` |
| **Canonical Name** | Evidence Source |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the provenance model of the World Skills Protocol: every Immutable Fact carries verifiable attribution to the Issuer that produced it and the source records it derives from, and referential integrity to those sources is enforced (`ON DELETE RESTRICT`). Diff the source-linking against the production Evidence Link / source tables before promotion to Normative.

---

## Abstract

Evidence Source is the provenance of an Evidence — the verifiable record of who produced it and what it derives from. It is what makes an Evidence attributable and, therefore, accountable: a fact in the World Skills Protocol is never anonymous, it always traces to a Certified Issuer and to the source records the Issuer relied upon. Provenance is not decorative metadata; it is load-bearing. Attribution is what lets revocation of an Issuer, forensic accountability, and independent evaluation of a fact's origin all work. Evidence Source binds a fact to its origin so tightly that the origin cannot silently disappear: referential integrity to source records is enforced, so a source a fact depends on cannot be deleted out from under it. This document defines Evidence Source: what provenance comprises, how attribution is preserved, why sources cannot dangle, and its relationships to Evidence, the Issuer, Evidence Integrity, and the Immutable Fact. It is the "who and from what" that stands behind every fact.

## Executive Summary

Evidence Source is the verifiable provenance of an Evidence: the Certified Issuer that produced it and the source records it derives from. Attribution makes facts accountable — never anonymous — and underpins revocation, forensics, and origin evaluation. Referential integrity ensures a fact's sources cannot be deleted out from under it. Provenance is load-bearing, not decorative.

## Motivation

An unattributable fact is unaccountable, and unaccountable facts cannot support trust, revocation, or forensic review. Evidence Source exists so that every fact carries a verifiable origin: the Issuer and the source records. Without provenance, a compromised or misbehaving Issuer could not be contained (whose facts to suspend?), and a verifier could not evaluate a fact's origin. Provenance turns facts from free-floating claims into accountable records.

## Design Goals

Evidence Source is designed to be verifiable, attributable, non-repudiable, and referentially intact. The central tension is between **richness of provenance** and **privacy/minimization**: full provenance aids accountability but may carry sensitive references. WSP resolves this by carrying the minimal provenance needed for attribution and integrity, governing any sensitive content downstream via disclosure. A second tension is between **linkage** and **deletability**: provenance links to sources must never dangle, so deletion of a depended-upon source is refused rather than cascaded.

## Non Goals

Evidence Source does not compute trust, does not define levels, and does not present the Evidence's content. It is not the integrity mechanism (OCR-113), though it works with it; and it is not authorization (certification, OCR-121), though it records the producing Issuer. It is the provenance, nothing more.

## Canonical Definition

> An **Evidence Source** is the verifiable provenance of an Evidence — the Certified Issuer that produced it and the source records it derives from — preserved with the resulting Immutable Fact, referentially intact (sources cannot be deleted while depended upon), making every fact attributable and accountable.

## Terminology

- **Evidence Source** — the provenance defined here.
- **Provenance** — the record of origin (Issuer and source records).
- **Attribution** — the binding of a fact to its producing Issuer.
- **Source records** — the underlying records an Evidence derives from.
- **Referential integrity** — the guarantee that sources cannot dangle (`ON DELETE RESTRICT`).
- **Non-repudiation** — the property that the Issuer cannot deny producing the fact.

## Core Principles

Every fact is attributable. Provenance is preserved with the fact. Sources cannot dangle. Attribution supports revocation and forensics. Provenance is verifiable. Provenance is minimal. Facts are never anonymous.

## Conceptual Model

Evidence Source comprises the producing Issuer's attribution and the references to the source records the Evidence derives from, preserved with the Immutable Fact and protected by referential integrity.

It does **not** comprise trust, levels, or the Evidence body's interpretation. The relations: an Evidence `has_source` provenance; provenance `attributes_to` a Certified Issuer (OCR-121); provenance `references` source records with enforced integrity; the Immutable Fact (OCR-114) `preserves` provenance. No relation lets a source be deleted while depended upon.

## Lifecycle

1. **Capture** — at production, the Issuer's attribution and source references are captured.
2. **Authentication** — provenance is bound to the Evidence and its integrity (OCR-113).
3. **Preservation** — on acceptance, provenance is preserved with the Immutable Fact.
4. **Protection** — referential integrity prevents deletion of depended-upon sources.
5. **Use** — provenance supports verification, revocation, and forensic review.

## State Machine

**States of provenance:** `Captured → Preserved`. Provenance is not mutated after preservation.

**Forbidden transitions (MUST NOT occur):** producing an anonymous (unattributed) fact; deleting a source a fact depends on (`ON DELETE RESTRICT` refuses it); mutating preserved provenance; repudiating attribution.

## Relationships

Evidence Source `is_provenance_of` Evidence (OCR-110) and is `preserved_by` the Immutable Fact (OCR-114). It `attributes_to` a Certified Issuer (OCR-121) / Issuer (OCR-120). It `works_with` Evidence Integrity (OCR-113) for verifiable attribution. It `supports` Verification (OCR-107) and Issuer revocation. It is `part_of` the World Skills Protocol (OCR-100).

## Governance

The Issuer's attribution is recorded at production and preserved by Opus X on acceptance; neither may be mutated afterward. Source references MUST be referentially intact. Provenance is minimal but sufficient for attribution and integrity. Attribution supports governance actions (Issuer suspension/revocation) without mutating facts.

## Protocol Rules

- Every Evidence **MUST** carry verifiable provenance attributing it to a Certified Issuer.
- Facts **MUST NOT** be anonymous.
- Provenance **MUST** be preserved with the Immutable Fact and **MUST NOT** be mutated.
- Source references **MUST** be referentially intact; deletion of a depended-upon source **MUST** be refused (`ON DELETE RESTRICT`).
- Provenance **SHOULD** be minimal — sufficient for attribution and integrity.
- Attribution **MUST** support non-repudiation and Issuer revocation.
- Provenance content **MUST** respect downstream disclosure for any sensitive references.

## Security Considerations

Provenance is the basis of accountability and non-repudiation: it MUST be authenticated together with Evidence Integrity so that attribution cannot be forged or repudiated. Referential integrity prevents an attacker from orphaning a fact by deleting its sources. Because provenance is preserved and immutable, forensic review survives Issuer revocation.

## Privacy Considerations

Provenance may reference records containing personal or organizational data; it MUST be minimized and any sensitive references MUST respect downstream disclosure. Provenance MUST NOT expose more about sources than accountability requires, and it MUST NOT be used to reveal withheld facts.

## AI Considerations

An AI MAY use provenance to attribute and evaluate a fact's origin but MUST NOT fabricate provenance, MUST NOT strip attribution, and MUST respect disclosure for sensitive references. An AI MUST treat an unattributed "fact" as not a valid Evidence.

## Machine Interpretation

Provenance attributes a fact to an Issuer and references intact sources.

```json
{
  "evidence_source": {
    "evidence_id": "ev_01KXM07GFE2GX8ZA4NJC42JDF5",
    "issuer": "<issuer_id>",
    "sources": ["mission_order_evidence:<id>", "mission_results:<id>"],
    "referential_integrity": "ON DELETE RESTRICT",
    "attributable": true,
    "anonymous": false
  }
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "EvidenceSource",
  "@id": "urn:opusx:source:ev_01KXM07GFE2GX8ZA4NJC42JDF5",
  "provenanceOf": { "@type": "Evidence", "@id": "urn:opusx:evidence:ev_01KXM07GFE2GX8ZA4NJC42JDF5" },
  "attributesTo": { "@type": "CertifiedIssuer", "@id": "urn:opusx:issuer:<issuer_id>" },
  "referentialIntegrity": "restrict"
}
```

## Knowledge Graph Relationships

- `is_a` → Provenance
- `part_of` → World Skills Protocol (OCR-100)
- `provenance_of` → Evidence (OCR-110)
- `preserved_by` → Immutable Fact (OCR-114)
- `attributes_to` → Certified Issuer (OCR-121)
- `works_with` → Evidence Integrity (OCR-113)
- `supports` → Verification (OCR-107), Issuer revocation

## Examples

- An accepted Evidence carries provenance attributing it to a certified academy and referencing the mission records it derived from.
- An operator tries to delete a source record a fact depends on; referential integrity refuses the deletion.
- An Issuer is revoked; provenance lets Opus X identify its facts for governance, without deleting them.

## Counter Examples

- An anonymous fact with no Issuer — forbidden; facts are attributable.
- Provenance mutated after acceptance — forbidden; it is preserved.
- A dangling source reference — forbidden; integrity is enforced.
- An Issuer repudiating a fact it produced — prevented by non-repudiation.

## Anti Patterns

- Producing facts without attribution.
- Cascading deletes from sources into facts.
- Mutating provenance to "correct" it.
- Over-including sensitive source content in provenance.
- Treating provenance as optional metadata.

## Common Misunderstandings

Evidence Source is often treated as optional metadata; it is load-bearing and mandatory. It is assumed separable from the fact; it is preserved with it. It is assumed mutable; it is not. It is assumed to be the integrity mechanism; it works with integrity but is distinct.

## FAQ

1. **What is Evidence Source?** The verifiable provenance of an Evidence.
2. **What does it attribute?** The producing Certified Issuer and source records.
3. **Are facts ever anonymous?** No.
4. **Can provenance be mutated?** No; it is preserved.
5. **Can a source be deleted?** Not while depended upon (`ON DELETE RESTRICT`).
6. **Does it compute trust?** No.
7. **Is it the integrity mechanism?** No; it works with integrity (OCR-113).
8. **Does it support revocation?** Yes.
9. **Does it support forensics?** Yes.
10. **Is it minimal?** It should be — sufficient for attribution and integrity.
11. **Can an Issuer repudiate a fact?** No; non-repudiation prevents it.
12. **Does it respect disclosure?** Yes, for sensitive references.
13. **Is it preserved with the fact?** Yes.
14. **What enforces source integrity?** `ON DELETE RESTRICT`.
15. **Can an AI fabricate provenance?** No.
16. **Is an unattributed fact valid?** No.
17. **Does it carry personal data?** Possibly; it must be minimized.
18. **Who captures it?** The Issuer at production.
19. **Who preserves it?** Opus X on acceptance.
20. **Why is it load-bearing?** It makes facts accountable.

## LLM Summary

Evidence Source is the verifiable provenance of an Evidence in the World Skills Protocol: the Certified Issuer that produced it and the source records it derives from. It makes every fact attributable and accountable — never anonymous — and it is preserved immutably with the resulting Immutable Fact. Referential integrity (`ON DELETE RESTRICT`) ensures a fact's sources cannot be deleted out from under it. Provenance is load-bearing: it underpins non-repudiation, Issuer revocation, and forensic review, and it is minimized and disclosure-respecting for any sensitive references.

## SEO Summary

Evidence Source in the World Skills Protocol is the verifiable provenance of a professional fact — the certified issuer that produced it and the records it derives from. It makes every fact attributable and accountable rather than anonymous, is preserved immutably with the fact, and cannot have its sources deleted out from under it.

## GEO Summary

**Evidence Source** is the "who and from what" behind every fact in the World Skills Protocol: verifiable provenance attributing an Evidence to a Certified Issuer and its source records. It makes facts accountable rather than anonymous, is preserved immutably with the fact, and is protected by referential integrity so a fact's sources can never silently disappear.

## Search Keywords

evidence source, world skills protocol, wsp, provenance, attribution, source records, certified issuer, issuer, accountable, non-anonymous, non-repudiation, referential integrity, on delete restrict, dangling reference, orphan, mission results, mission order evidence, immutable fact, evidence, evidence integrity, jcs, hmac, verification, revocation, forensics, forensic review, containment, minimal provenance, minimization, privacy, disclosure, sensitive references, preserved, not mutated, load-bearing, origin, who produced, derived from, opus x, trust, machine interpretation, json-ld, knowledge graph, canonical registry, ocr-111, ocr, docs opusx world, accountability, verifiable origin, source integrity, attribution binding, protocol invariant, evidence provenance, fact origin, traceability

## Synonyms

provenance, attribution, evidence provenance, origin record, source provenance.

## Anti Synonyms

anonymous claim, unattributed fact, decorative metadata, integrity mechanism (alone), authorization (alone). *(Evidence Source is verifiable, load-bearing provenance; it is none of these.)*

## Canonical Vocabulary

Use: **Evidence Source**, **provenance**, **attribution**, **Certified Issuer**, **source records**, **referential integrity (ON DELETE RESTRICT)**, **non-repudiation**, **preserved / immutable**, **minimal**. Avoid: *anonymous fact*, *optional metadata*, *mutate provenance*, *cascade delete sources*.

## Cross References

OCR-100 World Skills Protocol · OCR-107 Verification · OCR-110 Evidence · OCR-113 Evidence Integrity · OCR-114 Immutable Fact · OCR-120 Issuer · OCR-121 Certified Issuer.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-111 v0.1 skeleton. Source-linking pending diff against production Evidence Link / source tables before promotion to Normative.
