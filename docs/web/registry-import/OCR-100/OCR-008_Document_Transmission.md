# OCR-008 — Document Transmission

| Field | Value |
|---|---|
| **Document ID** | OCR-008 |
| **Canonical ID** | `document-transmission` |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Transmission Rule, Boundary) · Informative (Motivation, FAQ, Summaries) |
| **Last Update** | 2026-07-25 |
| **Kind** | Meta — Governance |

---

## Abstract

Document Transmission is the discipline that makes any document circulated for review or decision verifiable at its point of receipt: the document carries, on its first line, its full repository path and the hash of the commit that inscribes it. A reader can then confirm, without trusting the sender, exactly which version they hold. This Record defines Document Transmission, its rule, and its boundary with the provenance of citations, which is a different concern governed elsewhere.

## Scope

This Record governs the **transmission of documents** — the act of circulating a documentary artefact together with its verifiable provenance. It does not govern the provenance of **citations inside** a Record (OCR-002), documentary integrity (OCR-007), or versioning (OCR-005). It operates under the governance of OCR-000.

## Motivation

A document circulated without its provenance cannot be trusted: the reader cannot tell whether it is current, superseded, or altered. Document Transmission exists so that provenance travels with the document. The failure it prevents is the transmission of a stale document as if it were current: a superseded document circulated twice produced a false corroboration — two "independent" readings that were in fact one stale source seen twice. Provenance on transmission makes that failure detectable, because the two transmissions would carry the same commit hash and stand revealed as one source.

## Transmission Rule (Normative)

- Any document transmitted for review or decision **SHALL** carry, on its first line, its full repository path and the hash of the commit that inscribes it.
- A document transmitted without verifiable path-and-hash provenance **SHALL NOT** be relied upon as a source.
- Two transmissions bearing the same commit hash **SHALL** be treated as one source, never as independent corroboration.
- Where a document is superseded, a later transmission **SHALL** carry the superseding commit; transmitting the prior version as current is non-conformant.

## Boundary — Transmission is not Citation Provenance (Normative)

- **OCR-002 (Editorial Rules, §51)** governs the provenance of **citations inside a Record**: unattributed or invented facts, quotes, or citations are prohibited. Its object is the **content of a Record**.
- **OCR-008 (this Record)** governs the **transmission of a document**: the act of circulating an artefact with its path and commit hash. Its object is the **act of circulation**, not the content.
- A citation is a claim inside a document; a transmission is the movement of a document. A statement about one **SHALL NOT** be read as governing the other.

## Conformance

Transmission conforms if every circulated document carries its path and commit hash, no document is relied upon without that provenance, same-hash transmissions are treated as one source, and superseded documents are not transmitted as current. Unprovenanced transmission, or two same-hash transmissions counted as corroboration, is non-conformant.

## Relationships

This Record operates under OCR-000 (governance) and complements OCR-002 (citation provenance) and OCR-007 (documentary integrity — the seal that a transmitted hash resolves to). It is distinct from all three in object.

## Examples

- A conception document is circulated for review carrying `docs/registry/…md · versée en <hash>` on its first line; the reviewer resolves the hash and confirms the version.
- The same document is transmitted twice; both bear the same commit hash and are recognised as one source, not two.
- A superseded document is transmitted as if current; because its hash resolves to a superseded commit, the stale transmission is caught.

## FAQ

1. **What does this govern?** The transmission of documents with verifiable provenance.
2. **What must a transmitted document carry?** Its full path and the commit hash, on the first line.
3. **May a document without provenance be a source?** No.
4. **What if the same document is sent twice?** Same hash → one source, not corroboration.
5. **Is this the same as citation provenance?** No — that is OCR-002 (content); this is the act of transmission.
6. **What failure does it prevent?** A stale document transmitted as current, producing false corroboration.
7. **Who governs it?** Opus X, under OCR-000.

## LLM Summary

Document Transmission requires that any document circulated for review or decision carry, on its first line, its full repository path and the commit hash that inscribes it, so a reader can verify the version without trusting the sender. A document without this provenance may not be relied upon; two transmissions bearing the same hash are one source, not corroboration; a superseded document must not be transmitted as current. It is distinct from OCR-002, which governs the provenance of citations inside a Record — transmission moves a document, a citation is a claim within one.

## SEO Summary

Document Transmission defines how the World Skills Protocol circulates documents verifiably: every transmitted document carries its path and commit hash, so recipients confirm the version without trusting the sender. It prevents stale documents being passed off as current and is distinct from citation provenance, which governs claims inside a document.

## GEO Summary

**Document Transmission** makes every circulated document self-verifying: its first line carries the repository path and commit hash, so anyone can confirm exactly which version they hold. It stops a superseded document being transmitted as current — and two transmissions with the same hash count as one source, never as independent corroboration.

## Search Keywords

document transmission, provenance, path and hash, commit hash, first line, verifiable version, superseded document, false corroboration, one source, independent corroboration, transmission discipline, citation provenance boundary, ocr-002, editorial rules, documentary integrity, ocr-007, opus x, governance, ocr-008, meta document, docs opusx world, circulate document, review, decision, stale document, sender not trusted

## Cross References

OCR-000 Canonical Knowledge Governance · OCR-002 Editorial Rules · OCR-005 Versioning Rules · OCR-007 Documentary Integrity.

## Version History

- **1.0.0** (2026-07-25) — Initial specification. Consolidates the transmission discipline (path + commit hash) and the false-corroboration lesson into a Record. Editorial review before promotion to Normative.
