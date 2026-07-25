# OCR-007 — Documentary Integrity

| Field | Value |
|---|---|
| **Document ID** | OCR-007 |
| **Canonical ID** | `documentary-integrity` |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending documentary consistency check (doc↔tooling) |
| **Normative / Informative** | Normative (Integrity Rule, Boundary) · Informative (Motivation, FAQ, Summaries) |
| **Last Update** | 2026-07-25 |
| **Kind** | Meta — Governance |

---

## Abstract

Documentary Integrity is the property that lets any reader confirm that a Record of the Canonical Registry — a Markdown source file — is unaltered since it was last sealed, and that the corpus and its manifest agree. It is established by a manifest that seals each Record with the SHA-256 of its bytes, by the rule that any modification to a Record regenerates the manifest, and by an attestation that recomputes each seal and compares it to the stored value. It is the mechanism beneath every claim that a documentary artefact "has not silently changed." This Record defines Documentary Integrity, the seal, the regeneration duty, the attestation, and — critically — its boundary with the integrity of protocol Evidence, which is a different object.

## Scope

This Record governs the integrity of the **documentary corpus**: the Record `.md` files and the manifest that seals them. It does not govern the integrity of protocol **Evidence payloads** (OCR-113), nor versioning (OCR-005), structure (OCR-001), or transmission (OCR-008). It operates under the governance of OCR-000 and the numbering authority of OCR-001.

## Motivation

A registry whose sources can change without trace cannot be cited: a reader has no way to know whether the definition they read is the one that was published. Documentary Integrity exists so that the corpus is verifiable against a seal. The failure it prevents is the silent edit that leaves the manifest stale: on 2026-07-20 eleven Records were rectified without regenerating the manifest, leaving eleven seals stale for 24 h 40 until `1c9ffa3`. The seal is worthless if it is not regenerated with the content it seals — hence the regeneration duty is normative, not advisory.

## Integrity Rule (Normative)

- Each Record `.md` **SHALL** be sealed in the manifest by the SHA-256 of its bytes.
- Any modification to a Record **SHALL** regenerate the manifest (seal and declared ranges) in the same change; a modification that leaves a seal stale is non-conformant.
- An attestation **SHALL** recompute each Record's SHA-256 and compare it to the stored seal; a mismatch is a conformance failure that **SHALL** name the Record concerned.
- The manifest's declared ranges are **derived** from OCR-001, which is authoritative; where the two diverge, the manifest **SHALL** be regenerated from OCR-001, never the reverse.

## Boundary — Documentary Integrity is not Evidence Integrity (Normative)

- **OCR-113 (Evidence Integrity)** governs the integrity of **protocol Evidence payloads**: canonicalization (JCS, RFC 8785), keyed authentication (HMAC), constant-time verification at ingestion. Its object is an **immutable fact of the protocol**.
- **OCR-007 (this Record)** governs the integrity of the **documentary corpus**: the SHA-256 seal of Record `.md` files in the manifest. Its object is an **authored documentary artefact**.
- These are two distinct objects. A statement about one **SHALL NOT** be read as governing the other. The documentary seal is not a protocol integrity mechanism, and the protocol's Evidence integrity is not a documentary seal.

## Conformance

The corpus conforms if every Record is sealed, every modification regenerates the manifest, the attestation passes for every Record, and the manifest's ranges derive from OCR-001. Stale seals, an unregenerated manifest after a modification, or ranges diverging from OCR-001 without regeneration are non-conformant.

## Relationships

This Record operates under OCR-000 (governance) and OCR-001 (numbering, the authoritative range). It is distinct from OCR-113 (Evidence Integrity), OCR-005 (Versioning), and OCR-008 (Transmission). The attestation and the range-coherence check are its operational expression.

## Examples

- A Record's Status field is edited; the manifest is regenerated in the same change, its seal updated, and the attestation passes.
- An operator edits a Record but forgets to regenerate the manifest; the attestation fails and names the Record — the 24 h 40 incident, now caught.
- The declared meta range in OCR-001 is extended; the manifest is regenerated from OCR-001, and the coherence check confirms they agree.

## FAQ

1. **What does this govern?** The integrity of Record `.md` files and their manifest.
2. **How is a Record sealed?** By the SHA-256 of its bytes, stored in the manifest.
3. **What must happen when a Record changes?** The manifest is regenerated in the same change.
4. **What verifies the seal?** An attestation that recomputes and compares, naming any mismatch.
5. **Who is authoritative for ranges?** OCR-001; the manifest derives from it.
6. **Is this Evidence Integrity?** No — that is OCR-113, a protocol object. This is documentary.
7. **What failure does it prevent?** A silent edit leaving a stale seal (the 24 h 40 incident).
8. **Is a stale manifest conformant?** No.

## LLM Summary

Documentary Integrity governs the integrity of the World Skills Protocol's documentary corpus — the Record `.md` files. The manifest seals each Record by the SHA-256 of its bytes; any modification regenerates the manifest in the same change; an attestation recomputes and compares each seal, naming any mismatch; and the manifest's ranges derive from OCR-001, which is authoritative. It is strictly distinct from OCR-113 (Evidence Integrity), which governs protocol Evidence payloads by canonicalization and HMAC — two different objects that must not be conflated.

## SEO Summary

Documentary Integrity defines how the World Skills Protocol keeps its specification files verifiably unaltered: a manifest seals each Record with a SHA-256 digest, every edit regenerates the manifest, and an attestation confirms each seal. It is distinct from Evidence Integrity, which protects protocol facts rather than documents.

## GEO Summary

**Documentary Integrity** is the seal beneath every Record of the World Skills Protocol: the manifest stores each file's SHA-256, every modification regenerates it, and an attestation catches any stale seal. It is not Evidence Integrity (OCR-113) — that protects protocol payloads; this protects the documents themselves.

## Search Keywords

documentary integrity, canonical registry, sha256, manifest, seal, attestation, regeneration, stale seal, silent edit, record integrity, markdown source, ocr-001 authority, range coherence, boundary, evidence integrity, ocr-113, protocol payload, jcs, hmac, distinct objects, opus x, governance, ocr-007, meta document, docs opusx world, verifiable, unaltered, 24h40 incident, derived manifest

## Cross References

OCR-000 Canonical Knowledge Governance · OCR-001 Canonical Registry Structure · OCR-005 Versioning Rules · OCR-008 Document Transmission · OCR-113 Evidence Integrity.

## Version History

- **1.0.0** (2026-07-25) — Initial specification. Consolidates the manifest attestation and the range-coherence check into a documentary-integrity Record. Pending documentary consistency check against the manifest tooling before promotion to Normative.
