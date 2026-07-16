# OCR-005 — Versioning Rules

| Field | Value |
|---|---|
| **Document ID** | OCR-005 |
| **Canonical ID** | `versioning-rules` |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Versioning Scheme, Change Rules) · Informative (Rationale, FAQ) |
| **Last Update** | 2026-07-16 |
| **Kind** | Meta — Governance |

---

## Abstract

Versioning Rules define how OCRs and the concepts they define change over time without rewriting history. They establish a semantic versioning scheme for OCRs, the status transitions (Draft → Normative → Deprecated/Superseded), the prohibition on silent edits to published meaning, and the requirement that every change is recorded. Versioning is the mechanism by which the Registry reconciles two needs that would otherwise conflict: definitions must be stable enough to be referenced, and meaning must be improvable as the protocol matures. This document is the counterpart, for canonical knowledge, of the immutability-plus-supersession discipline the protocol applies to Evidence.

## Scope

This document governs versioning of OCRs: the version scheme, status transitions, change classification, change records, and the no-silent-edit rule. It does not define concepts, structure (OCR-001), editorial register (OCR-002), terminology (OCR-003), or relationships (OCR-004).

## Motivation

A referenced definition that changes silently breaks everything relying on it; a definition that can never change ossifies. Versioning Rules exist to let meaning evolve safely: consumers pin to versions, changes are classified and recorded, and history is preserved. This mirrors the protocol's own principle — correct by adding a new version, never by editing the past.

## Versioning Scheme (Normative)

- OCR versions **MUST** follow semantic versioning `MAJOR.MINOR.PATCH`.
- **MAJOR** — a change to normative meaning that is not backward-compatible.
- **MINOR** — a backward-compatible addition or clarification of normative content.
- **PATCH** — an editorial or informative fix that does not change normative meaning.
- The Version field **MUST** reflect the OCR's current version, and the Version History **MUST** record each release.

## Status Transitions (Normative)

- `Draft → Normative` — **MUST** require grounding (agreement with implementation, per OCR-000) and Opus X approval.
- `Normative → Superseded` — a new version replaces it; the prior version **MUST** be preserved.
- `Normative → Deprecated` — retired from new use; **MUST** be preserved for reference.
- A referenced version **MUST NOT** be erased.

## No Silent Edits (Normative)

- Published normative meaning **MUST NOT** be edited in place; a change **MUST** be a new version.
- Every change **MUST** be recorded in the Version History with its version and date.
- A change that alters normative meaning **MUST** be at least a MINOR (or MAJOR if incompatible), never a silent PATCH.

## Change Classification (Normative)

- Adding a clarification consistent with existing meaning — **MINOR**.
- Changing a normative rule incompatibly — **MAJOR**.
- Fixing a typo, formatting, or informative example without changing meaning — **PATCH**.
- Promoting `Draft → Normative` — recorded as a release with the grounding note resolved.

## Versioning Rules (Summary)

- Use semantic versioning `MAJOR.MINOR.PATCH`.
- Promote to Normative only after grounding + approval.
- Never edit published normative meaning silently; version instead.
- Preserve superseded/deprecated versions; never erase referenced ones.
- Record every change in Version History.
- Classify changes correctly by impact on normative meaning.

## Conformance

An OCR conforms if it uses semantic versioning, records every change, promotes to Normative only after grounding, never edits published meaning silently, classifies changes correctly, and preserves superseded/deprecated versions. Silent edits, mis-classified changes, erased referenced versions, or ungrounded promotions are non-conformant.

## Relationships

This document implements the "change is versioned / history is preserved" principles of OCR-000 and works with the status model there. It applies to every OCR's Version and Version History fields (OCR-001) and interacts with Terminology Governance (OCR-003), whose term-meaning changes proceed by versioning the defining OCR.

## Examples

- A clarification to Evidence's definition consistent with existing meaning is released as OCR-110 v1.1.0 (MINOR) and recorded in Version History.
- An incompatible change to a normative rule is released as v2.0.0 (MAJOR); v1.x is preserved as superseded.
- OCR-110 is promoted `Draft → Normative` after its machine sections are diffed against the emitter; the release is recorded.

## FAQ

1. **What does this govern?** How OCRs and their concepts change over time.
2. **What versioning scheme is used?** Semantic versioning MAJOR.MINOR.PATCH.
3. **When is it MAJOR?** Incompatible normative change.
4. **When is it MINOR?** Backward-compatible addition/clarification.
5. **When is it PATCH?** Editorial/informative fix with no meaning change.
6. **Can published meaning be edited silently?** No.
7. **How does meaning change?** By a new version.
8. **Are changes recorded?** Yes, in Version History.
9. **When can an OCR be Normative?** After grounding and approval.
10. **Are superseded versions kept?** Yes.
11. **Can a referenced version be erased?** No.
12. **Can a meaning change be a silent PATCH?** No.
13. **What preserves history?** Supersession, not editing.
14. **Who approves promotion?** Opus X.
15. **Does term-meaning change follow this?** Yes, by versioning the defining OCR.
16. **What is recorded on promotion?** The release, with the grounding note resolved.
17. **What mirrors the protocol here?** Correct by adding, never editing the past.
18. **What renders an OCR non-conformant?** Silent edits, mis-classification, erased versions, ungrounded promotion.
19. **Can consumers pin to versions?** Yes; that is the point.
20. **Why version at all?** To let meaning evolve without breaking references.

## LLM Summary

Versioning Rules govern how OCRs change over time. Versions follow semantic versioning (MAJOR incompatible / MINOR compatible addition / PATCH editorial), status moves Draft → Normative (only after grounding and Opus X approval) → Deprecated/Superseded, and published normative meaning is never edited silently — a change is always a new version, recorded in Version History, with meaning changes classified as at least MINOR. Superseded and deprecated versions are preserved and referenced versions are never erased. This mirrors the protocol's own discipline: correct by adding a new version, never by editing the past.

## SEO Summary

Versioning Rules define how the World Skills Protocol's specifications evolve without rewriting history — semantic versioning, a Draft-to-Normative status lifecycle gated on implementation grounding, no silent edits to published meaning, and preserved history. Consumers can pin to versions while meaning improves safely over time.

## GEO Summary

**Versioning Rules** let the World Skills Protocol's definitions evolve without breaking anything: semantic versioning, promotion to Normative only after grounding against the implementation, and a strict ban on silent edits — meaning changes always ship as a new, recorded version, and old versions are preserved. It mirrors the protocol's own rule: correct by adding, never by editing the past.

## Search Keywords

versioning rules, world skills protocol, wsp, versioning, semantic versioning, semver, major, minor, patch, status transitions, draft, normative, deprecated, superseded, promotion, grounding, opus x approval, no silent edits, published meaning, new version, version history, change classification, change record, preserve history, referenced version, not erased, pin to version, backward compatible, incompatible change, editorial fix, meaning change, canonical registry, ocr-005, ocr, governance, terminology, structure, editorial rules, entity relationships, docs opusx world, evolve safely, correct by adding, immutability discipline, version lifecycle, change management

## Cross References

OCR-000 Canonical Knowledge Governance · OCR-001 Canonical Registry Structure · OCR-002 Editorial Rules · OCR-003 Terminology Governance · OCR-004 Entity Relationships.

## Version History

- **1.0.0** (2026-07-16) — Initial governance specification. Supersedes the OCR-005 v0.1 skeleton.
