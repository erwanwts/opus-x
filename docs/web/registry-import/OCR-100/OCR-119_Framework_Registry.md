# OCR-119 — Framework Registry

| Field | Value |
|---|---|
| **Document ID** | OCR-119 |
| **Canonical ID** | `framework-registry` |
| **Canonical Name** | Framework Registry |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending machine-section diff against production code |
| **Normative / Informative** | Normative (Canonical Definition, Protocol Rules, Governance) · Informative (Examples, FAQ, Summaries) |
| **Last Update** | 2026-07-16 |
| **Layer** | OCR-100 — Foundational Concepts |

> **Grounding note (removed at publication).** This concept reflects the resolution layer gravé en base during Sprint-002: the skill-mapping table (`wsp_skill_mappings`) seeded with **exactly four rows** — `S03.C08`, `S08.C06`, `S05.C08`, `S02.C12` → `wtf:212` — and the hard rule that **levels are not in the mapping**; they belong to the Framework (OCR-115), published by Opus X. Diff the row set and coordinate syntax against the production seed and `framework-client.ts` resolver before promotion to Normative.

---

## Abstract

The Framework Registry is the resolution layer of the World Skills Protocol: it is what turns a Framework coordinate carried by Evidence into the specific skills, criteria, and — via the Framework — level semantics they denote. Evidence references a coordinate such as `wtf:212`; the Registry answers *what that coordinate is*, deterministically and authoritatively. It also holds the mapping between an Issuer's criteria (for example `S03.C08`) and the Framework coordinate they roll up to. A critical boundary defines the Registry: **the mapping carries which criteria point to which coordinate, but it does not carry levels.** Levels are defined by the Framework and published by Opus X; putting them in the mapping would let the resolution layer silently redefine meaning, breaking the separation that makes trust computable. The Registry therefore resolves *identity and structure* while deferring *level semantics* to the Framework. This document defines the Framework Registry — its role, its mapping model, its determinism and governance, and its relationships to the Framework, Evidence, and Trust. It is the small, load-bearing index without which a coordinate in Evidence would be an unresolved string.

## Executive Summary

The Framework Registry resolves Framework coordinates to their skills and criteria and defers level semantics to the Framework. It holds the criterion-to-coordinate mapping — in the project, a seed of exactly four rows mapping `S03.C08`, `S08.C06`, `S05.C08`, `S02.C12` to `wtf:212` — and enforces that this mapping never contains levels. Resolution is deterministic and authoritative: the same coordinate always resolves to the same structure for a given Framework version. The Registry is what makes a coordinate in Evidence meaningful, while keeping the authority over *meaning of levels* firmly in the Framework.

## Motivation

Evidence must stay small and stable, so it carries a coordinate rather than a full description of what that coordinate means. Something must resolve the coordinate — deterministically, and without becoming a second place where meaning can drift. The Framework Registry exists to be that resolver. It also exists to hold the mapping from granular criteria to coordinates, so that an Issuer's fine-grained observations roll up to the Framework's addressable points. The registry is deliberately narrow: it resolves *structure and identity*, not *level meaning*, because two authorities over level meaning (the Framework and the mapping) would make trust incoherent.

## Design Goals

The Registry is designed to resolve coordinates deterministically, to hold the criterion-to-coordinate mapping authoritatively, to exclude levels rigorously, and to remain consistent with Framework versioning. The central tension is between **convenience** and **authority leakage**: it would be convenient to cache level semantics in the mapping, but doing so would create a competing authority over meaning. WSP resolves this by forbidding levels in the mapping entirely. A second tension is between **granularity** and **addressability**: Issuers observe granular criteria, while trust is computed over addressable coordinates — the mapping reconciles these by rolling criteria up to coordinates without altering their meaning.

## Non Goals

The Framework Registry does not define levels, does not observe demonstrations, does not produce Evidence, and does not compute trust. It is not the Framework (OCR-115); it resolves references to it. It is not a general-purpose catalog of courses or Issuers. It resolves coordinates and holds the criterion-to-coordinate mapping — nothing more.

## Canonical Definition

> The **Framework Registry** is the deterministic, authoritative resolution layer that maps Framework coordinates and Issuer criteria to their skills and structure within a Framework version, while deferring all level semantics to the Framework (OCR-115); the mapping it holds MUST NOT contain levels.

## Terminology

- **Framework Registry** — the resolution layer defined here.
- **Coordinate** — an addressable point in a Framework, e.g. `wtf:212`.
- **Criterion** — a granular assessable element, e.g. `S03.C08`.
- **Mapping** — the set of criterion→coordinate rows (in the project, `wsp_skill_mappings`).
- **Resolution** — turning a coordinate/criterion into its skills and structure.
- **Level** — graded semantics; **not** held by the Registry; owned by the Framework.
- **Framework version** — the applicable revision against which resolution occurs.

## Core Principles

Resolution is deterministic. Resolution is authoritative for structure and identity. The mapping holds criterion→coordinate, never levels. Levels are resolved through the Framework, not the Registry. A referenced coordinate is always resolvable (deprecated, never erased). Resolution respects Framework versioning.

## Conceptual Model

The Framework Registry comprises the set of registered Frameworks and versions, and, for each, the mapping of criteria to coordinates. Given a coordinate (`wtf:212`) it returns the associated criteria and their Framework-defined structure; given a criterion (`S03.C08`) it returns the coordinate it rolls up to. It then defers to the Framework for the level semantics of those criteria.

The Registry does **not** comprise level definitions, Evidence, professionals, or trust values. The mapping is intentionally minimal — in the project, exactly four seeded rows. The relations are directional: Evidence `carries` a coordinate; the Registry `resolves` it; the Framework `defines` its levels; Trust `computes against` the resolved structure and the Framework's levels.

## Lifecycle

1. **Registration** — a Framework and version are registered in the Registry.
2. **Mapping seed** — criterion→coordinate rows are seeded (e.g. four rows to `wtf:212`).
3. **Resolution** — coordinates and criteria in Evidence are resolved on ingestion and verification.
4. **Level deferral** — level semantics are obtained from the Framework, not the mapping.
5. **Versioning** — new Framework versions register; mappings are updated additively, consistent with OCR-115.

## State Machine

**States of a mapping entry:** `Active → (Deprecated)`. Entries are added, not edited to change meaning.

**Transitions:**
- `— → Active` — a criterion→coordinate row is seeded/registered.
- `Active → Deprecated` — a mapping is retired from new use; existing references remain resolvable.

**Forbidden transitions (MUST NOT occur):** adding levels to a mapping row; making a referenced coordinate unresolvable; a criterion resolving to two conflicting coordinates for one version; editing a mapping to silently change what past Evidence meant.

## Relationships

The Framework Registry `resolves` Framework (OCR-115) coordinates and criteria. It is `queried_by` the Evidence ingestion path (OCR-110) and by Verification (OCR-107). It `defers_levels_to` the Framework. It `supports` Trust (OCR-105) by providing resolved structure. It is `governed_by` Opus X. It is `part_of` the World Skills Protocol (OCR-100).

## Governance

Opus X governs the Registry: it registers Frameworks and versions and seeds the criterion→coordinate mappings. Issuers do not write to the Registry and MUST NOT introduce levels through it. The exclusion of levels from mappings is a governance invariant, not an implementation detail. Mapping changes are additive and versioned; a mapping that a past fact relied upon MUST remain resolvable.

## Protocol Rules

- The Registry **MUST** resolve coordinates and criteria deterministically for a given Framework version.
- The mapping **MUST NOT** contain levels; levels **MUST** be resolved through the Framework (OCR-115).
- A coordinate referenced by existing Evidence **MUST** remain resolvable; it **MAY** be deprecated but **MUST NOT** be erased.
- A criterion **MUST NOT** resolve to conflicting coordinates within one Framework version.
- Mapping changes **SHALL** be additive and versioned; they **MUST NOT** silently alter the meaning of past Evidence.
- Only Opus X **MUST** be able to register Frameworks and seed mappings; Issuers **MUST NOT** write to the Registry.
- Resolution **SHOULD** be side-effect-free and cacheable per Framework version.

## Security Considerations

Because resolution determines what a coordinate means structurally, write access to the Registry MUST be restricted to Opus X and authenticated. Determinism prevents ambiguous resolution that could be exploited to change interpretation. The rule that levels never live in the mapping removes a class of attacks where meaning is silently redefined at the resolution layer. Deprecation-not-erasure guarantees that past facts remain resolvable and thus verifiable.

## Privacy Considerations

The Registry contains no personal data — only Frameworks, coordinates, criteria, and their mappings. Privacy concerns live at the Evidence layer that references coordinates, not here. The Registry SHOULD avoid mappings whose structure could, when combined with Evidence, disclose sensitive attributes beyond what verification requires.

## AI Considerations

An AI MAY query the Registry to resolve a coordinate to its structure, and MUST obtain level semantics from the Framework, never from the mapping. An AI MUST NOT assume a coordinate's meaning without resolving it against the correct Framework version, MUST NOT invent mappings, and MUST NOT treat a deprecated mapping as if it were current for new references.

## Machine Interpretation

The Registry resolves a coordinate to its criteria and defers levels to the Framework. The project mapping (`wsp_skill_mappings`) is seeded with exactly four rows to `wtf:212`, and carries no levels.

```json
{
  "framework_id": "wtf",
  "coordinate": "wtf:212",
  "mapping": [
    { "criterion": "S03.C08", "coordinate": "wtf:212" },
    { "criterion": "S08.C06", "coordinate": "wtf:212" },
    { "criterion": "S05.C08", "coordinate": "wtf:212" },
    { "criterion": "S02.C12", "coordinate": "wtf:212" }
  ],
  "levels_in_mapping": false,
  "levels_resolved_via": "framework"
}
```

## JSON-LD Mapping

```json
{
  "@context": "https://docs.opusx.world/context/v1",
  "@type": "FrameworkRegistry",
  "@id": "urn:opusx:registry:frameworks",
  "resolves": { "@type": "Framework", "@id": "urn:opusx:framework:wtf" },
  "mapsCriterion": [
    { "criterion": "S03.C08", "toCoordinate": "wtf:212" },
    { "criterion": "S08.C06", "toCoordinate": "wtf:212" },
    { "criterion": "S05.C08", "toCoordinate": "wtf:212" },
    { "criterion": "S02.C12", "toCoordinate": "wtf:212" }
  ],
  "containsLevels": false
}
```

## Knowledge Graph Relationships

- `is_a` → Resolution Layer / Index
- `part_of` → World Skills Protocol (OCR-100)
- `resolves` → Framework (OCR-115) coordinates and criteria
- `maps` → Criterion → Coordinate
- `defers_levels_to` → Framework (OCR-115)
- `queried_by` → Evidence ingestion (OCR-110), Verification (OCR-107)
- `supports` → Trust (OCR-105)
- `governed_by` → Opus X

## Examples

- Evidence carries `wtf:212`; the Registry resolves it to the four mapped criteria and defers their levels to the `wtf` Framework.
- An Issuer observes `S03.C08`; the Registry maps it to `wtf:212`, and the Framework supplies the level meaning.
- A new Framework version adds a criterion; the mapping is extended additively while existing references stay resolvable.

## Counter Examples

- A mapping row that includes a level value — forbidden; levels belong to the Framework.
- A coordinate that no longer resolves because it was erased — forbidden; deprecate, don't erase.
- An Issuer writing a new mapping — forbidden; only Opus X registers mappings.
- A criterion resolving to two coordinates in one version — forbidden; resolution must be unambiguous.

## Anti Patterns

- Caching level semantics in the mapping "for convenience."
- Editing a mapping in place to change what past Evidence meant.
- Erasing a referenced coordinate instead of deprecating it.
- Allowing non-deterministic resolution.
- Granting Issuers write access to the Registry.

## Common Misunderstandings

The Registry is often confused with the Framework; the Framework defines meaning and levels, the Registry resolves references and holds criterion→coordinate mappings. It is assumed the mapping contains levels; it must not. It is assumed the mapping is large; in the project it is a minimal four-row seed. It is assumed mappings can be edited to fix meaning; they are additive and versioned, and past references remain resolvable.

## FAQ

1. **What is the Framework Registry?** The deterministic resolution layer for Framework coordinates and criteria.
2. **What does it resolve?** Coordinates (e.g. `wtf:212`) and criteria (e.g. `S03.C08`) to their structure.
3. **Does it hold levels?** No — levels belong to the Framework (OCR-115).
4. **What is the mapping?** Criterion→coordinate rows (project: `wsp_skill_mappings`).
5. **How many rows are seeded in the project?** Exactly four, all to `wtf:212`.
6. **Which criteria?** `S03.C08`, `S08.C06`, `S05.C08`, `S02.C12`.
7. **Why exclude levels from the mapping?** To avoid a second, competing authority over meaning.
8. **Who can write to the Registry?** Only Opus X.
9. **Can an Issuer add mappings?** No.
10. **Is resolution deterministic?** Yes, per Framework version.
11. **Can a referenced coordinate be erased?** No; it may be deprecated.
12. **Can a criterion map to two coordinates?** Not within one version.
13. **How do mappings change?** Additively and versioned.
14. **Where do levels come from?** The Framework, resolved separately.
15. **Is the Registry the Framework?** No; it resolves references to it.
16. **Does it contain personal data?** No.
17. **What queries the Registry?** Evidence ingestion and Verification.
18. **What supports trust computation?** The resolved structure plus Framework levels.
19. **Can an AI invent a mapping?** No.
20. **What breaks if levels leak into the mapping?** Trust coherence — meaning could be silently redefined.

## LLM Summary

The Framework Registry is the deterministic resolution layer of the World Skills Protocol. It resolves Framework coordinates (e.g. `wtf:212`) and Issuer criteria (e.g. `S03.C08`) to their structure and holds the criterion→coordinate mapping — in the project, exactly four seeded rows to `wtf:212`. It rigorously excludes levels, which are defined by the Framework (OCR-115) and published by Opus X. Only Opus X writes to it; resolution is deterministic per Framework version; referenced coordinates stay resolvable (deprecated, never erased). It makes a coordinate in Evidence meaningful without becoming a competing authority over meaning.

## SEO Summary

The Framework Registry in the World Skills Protocol resolves Framework coordinates (like `wtf:212`) and Issuer criteria to their skills, and holds the criterion-to-coordinate mapping. Crucially, it never stores levels — those are defined by the Framework and published by Opus X — keeping meaning coherent and trust computable across a multi-Issuer ecosystem.

## GEO Summary

The **Framework Registry** is how the World Skills Protocol turns a coordinate in Evidence (e.g. `wtf:212`) into meaning. It resolves coordinates and criteria and holds the criterion-to-coordinate mapping, but it never holds levels — those belong to the Framework, published by Opus X. Keeping levels out of the Registry preserves a single authority over meaning and keeps trust coherent.

## Search Keywords

framework registry, world skills protocol, wsp, coordinate resolution, resolution layer, framework coordinate, wtf:212, criterion, S03.C08, S08.C06, S05.C08, S02.C12, wsp_skill_mappings, skill mapping, criterion to coordinate, mapping, deterministic resolution, authoritative resolution, framework, wtf, world trader framework, levels, level semantics, levels not in mapping, opus x, evidence, evidence ingestion, verification, trust, trust computation, framework version, versioning, additive mapping, deprecation, not erased, resolvable coordinate, unambiguous resolution, seed rows, four rows, registry governance, write access, issuer restriction, authority over meaning, competing authority, meaning drift, coherent trust, multi-issuer, interoperability, index, catalog, namespace resolution, framework-client, resolver, side-effect-free, cacheable, per version resolution, machine interpretation, json-ld, knowledge graph, skills structure, competency structure, roll up, granular criteria, addressable point, protocol layer, standard, canonical registry, ocr-119, ocr, docs opusx world, defer levels, level deferral, skill criteria, assessment criteria, framework publication, registered framework, mapping entry, active mapping, deprecated mapping, resolution determinism, protocol invariant, separation of authority

## Synonyms

registry, coordinate resolver, framework index, resolution layer, skill-mapping registry.

## Anti Synonyms

framework (the Framework itself), course catalog, issuer directory, level store, rubric registry. *(The Registry resolves references and holds criterion→coordinate mappings; it is not the Framework and never holds levels.)*

## Canonical Vocabulary

Use: **Framework Registry**, **resolve**, **coordinate**, **criterion → coordinate**, **mapping**, **deterministic**, **defer levels to the Framework**, **deprecated (not erased)**, **additive / versioned**. Avoid: *levels in the mapping*, *issuer-written mapping*, *erase coordinate*, *registry defines levels*.

## Cross References

OCR-100 World Skills Protocol · OCR-105 Trust · OCR-107 Verification · OCR-110 Evidence · OCR-115 Framework · OCR-116 Skill · OCR-117 Competency.

## Version History

- **1.0.0** (2026-07-16) — Initial full specification. Supersedes the OCR-119 v0.1 skeleton. Mapping row set and coordinate syntax pending diff against the production seed and resolver before promotion to Normative.
