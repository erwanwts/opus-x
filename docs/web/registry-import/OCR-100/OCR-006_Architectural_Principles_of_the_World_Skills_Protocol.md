# OCR-006 — Architectural Principles of the World Skills Protocol

*Normative architectural constraints governing identity, representation, publication, versioning and protocol evolution.*

| Field | Value |
|---|---|
| **Document ID** | OCR-006 |
| **Canonical ID** | `architectural-principles-of-the-world-skills-protocol` |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Opus X — Canonical Registry |
| **Review Status** | Pending editorial review |
| **Normative / Informative** | Normative (Canonical Statements, Normative Consequences) · Informative (Introduction, Motivations, Notes) |
| **Last Update** | 2026-07-20 |
| **Kind** | Meta — Governance |

---

## Introduction

The World Skills Protocol was not built by accumulating features. It was built by resolving contradictions encountered during its design.

Each principle recorded here exists to preserve a property of the protocol. Where a principle was established after a concrete failure, that failure is evidence of the property's necessity; it is not the justification of the principle. Where a principle was established in anticipation, no failure is cited and its necessity is stated directly. Both possess identical normative value.

The motivations in this Record therefore do not describe how the protocol was built. They describe what each principle protects. A motivation that depended on the memory of its authors would cease to be intelligible once those authors are gone; the constraints recorded here are intended to remain readable and enforceable independently of any knowledge of their origin.

This Record establishes no authority above the protocol. It is governed by the same rules as every other Record: it is versioned, citable and amendable. Its scope is the set of architectural constraints to which the entire corpus is subject.

The ten principles are ordered by logical dependency rather than by chronology. Fundamental concepts define the objects of the protocol. Architectural mechanisms define how those objects behave. Architectural guarantees define what must remain true as they change. Evolution governance defines how the protocol itself may change. No principle presupposes a concept introduced later.

---

# I. Fundamental Concepts

These principles define the conceptual objects of the protocol. They describe no behaviour.

## Principle 1 — Distinction between Logical Definition and Canonical Representation

### Canonical Statement

The definition is the normative object. A canonical representation is one of the published expressions of that definition. A logical definition is never multiplied by the number of representations expressing it.

### Motivation

Without this distinction, a system cannot express that two published representations mean the same thing. Any operation producing a second published expression of an existing definition — a change of identifier, a republication under a different scheme, a migration between registries — becomes indistinguishable from the creation of a second definition. The corpus then carries two meanings where it holds one, and every dependent computation must determine, without guidance, which is authoritative.

The distinction also bounds what publication can do. Publishing a representation adds an expression; it never adds meaning. Where the two are conflated, every publication is treated as a semantic event, and the ability to distinguish substantive change from representational change is lost.

### Normative Consequences

* A logical definition SHALL be treated as a single normative object regardless of the number of canonical representations expressing it.
* Publishing an additional canonical representation SHALL NOT be interpreted as creating, modifying or superseding the logical definition it expresses.
* Implementations SHALL NOT assume that two distinct canonical identifiers denote two distinct logical definitions.
* Any statement concerning meaning, behaviour, scope or validity SHALL be attributed to the logical definition, never to one of its representations.

### Notes

Duplication of representation is a consequence of append-only publication: an existing representation cannot be altered, so a new identity requires a new representation. This is duplication of expression, not duplication of meaning.

## Principle 2 — Distinction between Immutable Facts and Reading Mechanisms

### Canonical Statement

Facts belong to the immutable record. Reading is a behaviour that interprets those facts without modifying them.

### Motivation

A fact records what was asserted at the moment it was accepted. Its value derives entirely from the guarantee that it has not been altered since. Any mechanism permitted to modify a published fact — to correct it, or to align it with a later state of the protocol — destroys that guarantee for every fact in the record, not only for the one it touched.

The ambiguity this principle prevents is the treatment of interpretation as an occasion for correction. When the protocol evolves, previously published facts continue to carry the terms in force when they were made. The correct response is to interpret them, never to rewrite them.

### Normative Consequences

* Published facts SHALL NOT be modified, replaced or deleted by any mechanism, at any privilege level.
* Correction of a published fact SHALL proceed by publishing a further fact, never by altering the original.
* Reading mechanisms SHALL operate without write access to the fact record.
* Where a fact carries an identifier, that identifier SHALL be understood as the identifier in force at the time of publication, and SHALL NOT be updated to reflect a later state.

### Notes

Where integrity protection covers an identifier carried by a fact, modifying that identifier invalidates the integrity of the fact independently of any immutability rule. Immutability is therefore both a governance rule and a structural property.

## Principle 3 — Distinction between Identity and Discovery Address

### Canonical Statement

An identity is not a discovery address. An identity identifies an object of the protocol. An address allows a reader to discover it. The protocol shall never presume that an identity constitutes, by itself, a resolvable address. All resolution is an explicit behaviour of the discovery layer, never a property of identity itself.

### Motivation

Where identity and address are conflated, a single string carries several irreconcilable requests: an identity resolution, a discovery request, a reference borne by a fact, or a logical key. The system cannot determine which is intended, and any answer it returns is correct under one reading and wrong under another.

The distinction also protects stability. An identity must remain constant for as long as the object exists; an address must remain free to change with the discovery surface. Binding them makes each hostage to the other.

### Normative Consequences

* Identities and discovery addresses SHALL be defined independently.
* An identity SHALL NOT be resolvable as a discovery address unless a discovery address of that form has been explicitly published.
* Discovery addresses SHALL be published explicitly, and the set of published addresses SHALL be enumerable.
* Changing a discovery address SHALL NOT change any identity, and changing an identity SHALL NOT be assumed to change any address.

### Notes

An abbreviated identifier carried by facts is an identity. Exposing it as a discovery address reintroduces the ambiguity this principle removes.

---

# II. Architectural Mechanisms

Once the objects are defined, the protocol may describe their behaviour.

## Principle 4 — Identity Resolution Belongs Exclusively to the Reading Layer

### Canonical Statement

Resolution is a behaviour. It never modifies published representations.

### Motivation

Where several identities denote a single logical definition, some component must reconcile them. Two placements are possible: resolution at write time, which rewrites stored references to converge on a current identity, or resolution at read time, which leaves stored references untouched and converges only in interpretation.

Write-time resolution is incompatible with an immutable record. It modifies published representations to reflect a later state, and destroys the correspondence between what was published and what is stored. Read-time resolution preserves both. The ambiguity this principle prevents is the assumption that convergence of meaning requires convergence of stored data.

### Normative Consequences

* Identity resolution SHALL be performed at read time only.
* Resolution SHALL NOT write to, or cause any write to, published representations.
* The interpretation sequence SHALL resolve identities before any semantic computation is applied.
* Computation depending on identity SHALL consume resolved identities and SHALL NOT re-derive them independently.

### Notes

Read-time resolution requires every consumer to traverse the resolution behaviour. This cost is the price of the immutability guarantee and is not a defect of the design.

## Principle 5 — Reidentification Proceeds Exclusively by Addition

### Canonical Statement

A published representation is never modified. A new canonical representation is added and related to the previous one. Both remain published.

### Motivation

Changing the canonical identifier of a published definition is a recurring requirement: an identifier may prove ambiguous, misleading, or incompatible with a later scheme. Where representations are immutable, the operation cannot be performed by modification, and the apparent alternatives — deleting and republishing, or suspending immutability for the duration of the change — each destroy the property that made the record trustworthy.

Addition is the only operation compatible with immutability. The previous representation remains published because it was published. The new representation exists alongside it. A published relationship establishes the continuity between them. The ambiguity this principle prevents is the belief that a change of identity requires a change of what is stored.

### Normative Consequences

* Reidentification SHALL be performed by publishing a new canonical representation, never by modifying an existing one.
* The previous canonical representation SHALL remain published and SHALL remain retrievable at its own discovery address.
* The relationship between the two representations SHALL itself be published.
* No mechanism SHALL delete, suspend or retire a representation as part of a reidentification.

### Notes

The relationship is directional: the previous identifier is reidentified as the current one. The inverse direction is a derived view and is not separately published.

## Principle 6 — Only Relationships Referenceable from Immutable Facts Are Published

### Canonical Statement

The registry publishes only those relationships whose existence is necessary to preserve immutable references.

### Motivation

When a definition is reidentified, every identifier it comprises has a counterpart under the new identity. Publishing a relationship for each of them appears complete, but most such relationships would never be traversed: only identifiers actually carried by facts require resolution.

Relationships no consumer can reach are not neutral. They enlarge the registry, they suggest to a reader that a resolution path exists where none is needed, and they must be maintained for as long as the corpus exists. The ambiguity this principle prevents is the treatment of structural completeness as a normative requirement.

### Normative Consequences

* A relationship SHALL be published only where the identifier it concerns is directly referenceable by immutable facts.
* Determination of which identifiers are directly referenceable by immutable facts SHALL be established by examination of the fact structure, never by analogy with other identifiers.
* Relationships derivable from published relationships SHALL NOT themselves be published.
* The absence of a relationship SHALL NOT be interpreted as an absence of continuity where continuity is derivable from a published relationship at a higher level.

### Notes

Where a fact stores a subordinate identifier in abbreviated form rather than as a complete identifier, that identifier is not directly referenceable by immutable facts and requires no relationship.

---

# III. Architectural Guarantees

The preceding mechanisms entail guarantees that must always be preserved.

## Principle 7 — Reidentification Preserves Normative Properties

### Canonical Statement

> **The representation changes. The norm remains.**
> **Reidentification shall alter no property expressing the meaning, behaviour, scope or validity of the definition.**

### Motivation

If a change of identity were permitted to carry any change of substance, reidentification would become indistinguishable from revision, and no consumer could rely on a resolved identity without re-examining the entire definition. The published relationship would assert continuity while concealing divergence.

The principle draws a line any implementation can apply without case-by-case arbitration: a property answering what the definition says is preserved; a property answering under what identity it is published may change. The ambiguity this principle prevents is the silent introduction of substantive change under cover of an identity operation.

### Normative Consequences

* Every property expressing meaning, behaviour, scope, validity, constraints, guarantees or conformance requirements SHALL be carried unchanged to the new canonical representation.
* The effective date of the definition SHALL be preserved, and reidentification SHALL NOT be treated as an entry into force.
* Only properties proper to the act of publication — the canonical identifier, the publication metadata of the new representation, and the relationship establishing continuity — MAY differ.
* Where modifying a value would change the meaning, effects or obligations of the definition, that value SHALL NOT be modified during a reidentification.
* An operation requiring a change of substance SHALL NOT be performed as a reidentification.

### Notes

The criterion applies to any property, including properties introduced after this Record. Where classification is uncertain, the property is preserved.

## Principle 8 — The Three Versioning Layers Are Independent

### Canonical Statement

Documentary versioning, normative versioning and representation versioning are independent. Each versioning layer identifies a distinct object of change and therefore follows its own life cycle. None shall be deduced from the others.

### Motivation

A single version value appearing in several places invites the assumption that it denotes a single thing. It does not: a Record carries a version, the norm it describes carries a version, and each published representation carries a version. These do not version the same object, and they evolve for unrelated reasons and at unrelated rates.

Where the layers are conflated, a correction applied to one propagates to the others by analogy, and a change carrying no normative content is recorded as a change of the norm. The ambiguity this principle prevents is the inference of one version from another.

### Normative Consequences

* Each versioning layer SHALL be identified explicitly wherever a version is stated.
* The version of one layer SHALL NOT be inferred, derived or aligned from the version of another.
* A change in one layer SHALL NOT require a change in any other.
* Where a version value is corrected, the correction SHALL be applied only to the layer concerned.

### Notes

Identical version values across layers are coincidental and carry no relationship.

## Principle 9 — Status Is Derived and Never Persisted

### Canonical Statement

Status is a consequence of published relationships. It never constitutes persisted data.

### Motivation

Any information derivable from published data creates, once persisted, a second source for the same truth. The two may diverge — through a failed write, an incomplete migration, or a path updating one and not the other — and nothing in the system indicates which is correct.

This risk does not require an incident to justify prevention: it is a property of duplication itself. Deriving status at read time eliminates the possibility by construction, since no second source exists.

### Normative Consequences

* Status SHALL be computed from published relationships at read time.
* Status SHALL NOT be stored as a column, field or attribute of any published representation.
* Publication of a relationship SHALL be sufficient to establish the status it implies, and no additional write SHALL be required.
* Any value derivable from published data SHALL be derived rather than persisted.

### Notes

Persisting a status on an existing published representation would additionally require modifying that representation, which Principle 5 forbids.

---

# IV. Evolution Governance

The final principle does not describe the protocol. It describes how the protocol evolves.

## Principle 10 — Architectural Decisions Must Be Normalized Before a Project Is Closed

### Canonical Statement

Any architectural decision durably altering the expected behaviour of the protocol shall be normalized in a Record before the closure of the work that produced it. No conversation, working report or implementation shall constitute the sole durable support of an architectural rule. Normalization precedes closure.

### Motivation

Architectural decisions are taken in the course of work, in exchanges and reports that are not part of the corpus. A decision remaining there governs implementations while being invisible to the protocol: it cannot be cited, amended or versioned, and it holds only for as long as its authors remain available to recall it.

The consequence is a growing divergence between the doctrine actually applied and the norm actually published. A later contributor, reading only the corpus, may undo a rule without knowing it exists. The ambiguity this principle prevents is the coexistence of two bodies of doctrine, one published and one remembered.

### Normative Consequences

* An architectural decision durably altering expected behaviour SHALL be recorded in a Record before the work that produced it is declared closed.
* A conversation, working report, design exchange or implementation SHALL NOT be cited as the normative source of a rule.
* Where an existing Record is conceptually appropriate, the decision SHALL be recorded there, and otherwise a new Record SHALL be created.
* Work SHALL NOT be declared closed while a decision it produced remains unnormalized.

### Notes

An implementation may demonstrate that a rule is necessary. It never establishes it. The protocol is modifiable only by its own artefacts.

---

## Conclusion

These principles define the architectural constraints governing the interpretation, evolution and implementation of the World Skills Protocol. Any future Record SHALL be interpreted consistently with them unless they are themselves amended through the protocol's normative amendment process.

They establish no authority above the corpus. They state the constraints to which the corpus, including this Record, is subject.

Where an inconsistency is identified between this Record and another normative Record, the inconsistency SHALL be resolved through the protocol's normative amendment process rather than by interpretative precedence.

---

## Version History

- **1.0.0** (2026-07-20) — Initial governance specification.
