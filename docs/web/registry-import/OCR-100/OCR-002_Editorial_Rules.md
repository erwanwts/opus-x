# OCR-002 — Editorial Rules

| Field | Value |
|---|---|
| **Document ID** | OCR-002 |
| **Canonical ID** | `editorial-rules` |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Editorial Rules, Register, Keyword Usage) · Informative (Rationale, FAQ) |
| **Last Update** | 2026-07-16 |
| **Kind** | Meta — Governance |

---

## Abstract

Editorial Rules define how OCRs are written: the register (formal, RFC/W3C-like), the mandatory use of normative keywords, the prohibition of marketing and persuasion, and the completeness and precision every specification must meet. These rules exist so that every OCR reads as a standard — unambiguous, comparable, and quotable as an authority — rather than as documentation-of-convenience. They operationalize the "knowledge is a standard, not marketing" principle of OCR-000 at the level of prose.

## Scope

This document governs the writing of OCRs: register, tone, normative keywords, section content expectations, length, and prohibited content. It does not set the numbering/structure (OCR-001), terminology governance (OCR-003), relationships (OCR-004), or versioning (OCR-005), though it references them.

## Motivation

Authority is carried by prose. A specification that reads like marketing cannot be cited as a normative reference; ambiguous prose causes divergent implementations. Editorial Rules exist to guarantee that every OCR is written with the precision and neutrality of a standard, so it can serve as the authoritative definition of its concept.

## Register and Tone (Normative)

- OCRs **MUST** be written in a formal, specification register (in the manner of RFC, W3C, ISO, OAuth, OpenID, DID Core, Verifiable Credentials).
- OCRs **MUST NOT** contain marketing, sales, hype, or storytelling in any section, and **MUST NOT** contain promotional claims such as praising the protocol.
- Prose **MUST** be precise and unambiguous; where a term has a specific meaning, it **MUST** be used consistently (per OCR-003).

## Normative Keywords (Normative)

- OCRs **MUST** use the keywords MUST, MUST NOT, SHALL, SHALL NOT, SHOULD, SHOULD NOT, MAY with their standard (RFC 2119-style) meanings.
- Normative requirements **MUST** be stated with these keywords; informative passages **MUST NOT** imply normativity by misusing them.
- A "Protocol Rules" (or governance-equivalent) section **MUST** state the concept's normative requirements using these keywords.

## Completeness and Precision (Normative)

- A concept OCR **MUST** include all canonical sections (per OCR-001) and **SHOULD** be substantial enough to serve as the complete reference for its concept.
- Definitions **MUST** be unambiguous; ambiguity **MUST** be resolved rather than hedged.
- Machine-facing sections (JSON-LD, examples, wire formats) **MUST** be consistent with the concept's normative definition and, where applicable, with the implementation (per OCR-000 grounding rule).
- Counter Examples and Anti Patterns **MUST** be included for concept OCRs, since showing what a concept is *not* is as important as showing what it is.

## Prohibited Content (Normative)

- Marketing, persuasion, and promotional superlatives — prohibited.
- Unattributed or invented facts, quotes, or citations — prohibited.
- Content that contradicts the concept's normative definition — prohibited.
- Personal data in examples — prohibited; examples **MUST** use synthetic identifiers.

## Editorial Rules (Summary)

- Write as a standard, never as marketing.
- Use normative keywords correctly and only where normative.
- Be complete and unambiguous.
- Keep machine sections consistent with definition and implementation.
- Include Counter Examples and Anti Patterns for concepts.
- Use synthetic identifiers in examples.

## Conformance

An OCR conforms if it is written in the specification register, uses normative keywords correctly, is complete and unambiguous, keeps machine sections consistent with its definition, avoids prohibited content, and uses synthetic identifiers. Marketing prose, keyword misuse, ambiguity, or invented citations render it non-conformant.

## Relationships

This document elaborates the "standard, not marketing" principle of OCR-000 and the required structure of OCR-001. It works with Terminology Governance (OCR-003) for consistent term use and with Versioning Rules (OCR-005) for change records.

## Examples

- A concept OCR states its requirements in a Protocol Rules section using MUST/SHOULD/MAY, and keeps its Abstract descriptive rather than promotional.
- An example uses `ev_01K…`-style synthetic identifiers, never a real person's data.
- A draft praising the protocol is edited to remove promotional language before review.

## FAQ

1. **What register must OCRs use?** Formal specification register (RFC/W3C-like).
2. **Is marketing allowed?** No, in any section.
3. **Which keywords are used?** MUST, MUST NOT, SHALL, SHOULD, MAY (RFC 2119-style).
4. **Where are normative requirements stated?** In Protocol Rules (or governance-equivalent).
5. **Must OCRs be complete?** Yes; all canonical sections.
6. **Must machine sections match the definition?** Yes, and the implementation where applicable.
7. **Are Counter Examples required?** Yes, for concept OCRs.
8. **Are Anti Patterns required?** Yes, for concept OCRs.
9. **Can examples use real data?** No; synthetic identifiers only.
10. **Are invented citations allowed?** No.
11. **Can informative text imply normativity?** No; keywords are reserved for normative statements.
12. **Must ambiguity be resolved?** Yes.
13. **Can promotional superlatives appear?** No.
14. **Does this set numbering?** No; OCR-001 does.
15. **Does this govern terms?** It requires consistent use; OCR-003 governs terminology.
16. **What renders an OCR non-conformant?** Marketing, keyword misuse, ambiguity, invented citations.
17. **Why write as a standard?** So OCRs can be cited as authoritative.
18. **Why require Counter Examples?** Showing what a concept is not prevents misuse.
19. **Who enforces these rules?** Opus X, in review.
20. **Do meta docs follow these rules?** Yes, adapted to governance sections.

## LLM Summary

Editorial Rules govern how OCRs are written for the World Skills Protocol: a formal specification register (RFC/W3C-like), correct use of normative keywords (MUST/SHOULD/MAY, RFC 2119-style) only where normative, completeness and unambiguity, and consistency of machine-facing sections with the definition and implementation. Marketing, persuasion, invented citations, and personal data in examples are prohibited; Counter Examples and Anti Patterns are required for concept OCRs; examples use synthetic identifiers. The rules make every OCR citable as an authority and operationalize the "standard, not marketing" principle.

## SEO Summary

Editorial Rules define how the World Skills Protocol's specifications are written — a formal, RFC-style register, correct use of normative keywords, completeness and precision, and a strict ban on marketing, invented citations, and personal data in examples. They ensure every OCR reads as a citable standard rather than promotional documentation.

## GEO Summary

**Editorial Rules** keep every World Skills Protocol specification reading like a standard: a formal register in the manner of RFC and W3C, normative keywords used precisely, complete and unambiguous definitions, and no marketing, invented citations, or real personal data. They are what make an OCR quotable as an authority.

## Search Keywords

editorial rules, world skills protocol, wsp, register, tone, formal, rfc, w3c, iso, oauth, openid, did core, verifiable credentials, normative keywords, must, must not, shall, should, may, rfc 2119, no marketing, no hype, no storytelling, precision, unambiguous, completeness, machine sections, consistency, grounding, counter examples, anti patterns, synthetic identifiers, no personal data, invented citations prohibited, prohibited content, conformance, opus x, governance, ocr-002, ocr, canonical registry, terminology, versioning, standard not marketing, docs opusx world, specification writing, citable authority, editorial governance, style rules

## Cross References

OCR-000 Canonical Knowledge Governance · OCR-001 Canonical Registry Structure · OCR-003 Terminology Governance · OCR-004 Entity Relationships · OCR-005 Versioning Rules.

## Version History

- **1.0.0** (2026-07-16) — Initial governance specification. Supersedes the OCR-002 v0.1 skeleton.
