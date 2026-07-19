# OCR-007 — Canonical Predicate Registry

> **Document produit en application de la doctrine de l'architecte** (`docs/registry/OCR-007-doctrine-architecte.md`,
> 7 décisions, Approved/Normative). Ce document **applique** cette doctrine aux 101 prédicats de l'inventaire
> Lot 0 ; il ne la modifie pas. **Status : Approved / Normative** — validé et gravé par l'architecte le
> 2026-07-17 (16 champs, famille Lifecycle, `distinct_from` Conceptual ; Evolving maintenus par décision explicite).

| Field | Value |
|---|---|
| Document ID | OCR-007 |
| Canonical Name | Canonical Predicate Registry |
| Version | 1.2.0 |
| Status | Approved / Normative |
| Approved by | Architecte / Protocol Authority — 2026-07-17 |
| Changelog | v1.2.0 (2026-07-19) : famille **Identity Resolution** créée ; prédicat `reidentified_as` (PRD-801, Domain Canonical) + inverse dérivé `was_reidentified_from` — amendement architecte (Lot B). · v1.1.0 (2026-07-17) : Lifecycle formalisée (5 PRD+contrats), `protects` créé (Governance), `interpreted_against`/`separates` Evolving confirmés, doublons d'id PRD-103/certifies corrigés — décision architecte. |
| Owner | Architecte / Protocol Authority |
| Normative / Informative | Normative |
| Layer | Meta — Ontology |
| Kind | Ontology Registry — Predicates dimension |
| Part of | Ontology of the World Skills Protocol |
| Governed by | doctrine architecte (7 décisions) |
| Source material | docs/wsp001-lot0/ (inventaire 101 prédicats) |
| Related | OCR-004 · OCR-008..012 (registres d'ontologie à venir) |

---

## 0. Cadre (rappel de la doctrine, non modifiable)

Noyau canonique **≤ 10** (8 actifs + `extends` Reserved). Inverses = **vues dérivées** (une seule
direction stockée). Séparation en 6 registres d'ontologie : **OCR-007 décrit les relations** ; états →
OCR-008, contraintes/négations → OCR-009, types → OCR-010, inférence → OCR-011, cardinalités → OCR-012
(référencées, jamais définies ici). Arbitrages dépendant du graphe = `semantic_stability: Evolving`,
non figés. Principe de réduction : chaque prédicat classé **Canonical / Alias / Derived / Reserved /
Deprecated / Rejected**, vers le plus petit vocabulaire suffisant.

## 1. Modèle de prédicat (16 champs)

`predicate_id` · `name` · `semantic_contract` · `family` · `relationship_type` · `ontology_domain` ·
`signature` (réf OCR-010) · `obligation` · `canonical_inverse` · `symmetry` · `constraints_ref` (réf
OCR-009/012) · `stability` · `semantic_stability` · `introduced_in` · `governed_by` · `used_by`.

> **Décision architecte (2026-07-17) — 16 champs.** Le décompte est arrêté à **16** : les 3 métadonnées
> de traçabilité (`introduced_in`, `governed_by`, `used_by`) **font partie du modèle normatif**, au même
> titre que les champs de définition. La doctrine (décision 5) est corrigée en conséquence (« 14 » → « 16 »).

---

## 2. Canonical Predicates — primitives (statut : Canonical)

> 8 primitives actives. Chaque `semantic_contract` est la définition normative, indépendante de toute
> implémentation. Signatures marquées `pending type registry` (OCR-010 non publié). Exemples ancrés
> sur l'inventaire Lot 0.

### PRD-001 · `is_a` — Canonical
- **semantic_contract** : "The source is a specialization or instance of the target."
- family : Structural · relationship_type : Taxonomic · ontology_domain : primitive
- signature : `{source:[*], target:[*]}` — *pending type registry (OCR-010)*
- obligation : Optional · canonical_inverse : `subsumes` · symmetry : asymmetric
- constraints_ref : [] · stability : Core · semantic_stability : **Fixed**
- introduced_in : OCR-100 · governed_by : [OCR-004, OCR-007] · used_by : 26 Records (occ. la plus élevée)
- *ex. : World Skills Protocol(OCR-100) → Protocol · Professional Passport(OCR-101) → Identity Surface*

### PRD-002 · `part_of` — Canonical
- **semantic_contract** : "The source is a constituent component of the target."
- family : Structural · relationship_type : Structural · ontology_domain : primitive
- signature : `{source:[*], target:[*]}` — *pending type registry*
- obligation : Optional · canonical_inverse : `contains` · symmetry : asymmetric
- constraints_ref : [] · stability : Core · semantic_stability : **Fixed**
- introduced_in : OCR-100 · governed_by : [OCR-004, OCR-007] · used_by : 25 Records
- *ex. : Professional Passport(OCR-101) → World Skills Protocol(OCR-100) · Professional Identity(OCR-102) → WSP(OCR-100)*

### PRD-003 · `depends_on` — Canonical
- **semantic_contract** : "The source cannot exist or be evaluated independently of the target."
- family : Dependency · relationship_type : Dependency · ontology_domain : primitive
- signature : `{source:[*], target:[*]}` — *pending type registry*
- obligation : Optional · canonical_inverse : `depended_on_by` · symmetry : asymmetric
- constraints_ref : [] · stability : Core · semantic_stability : **Fixed**
- introduced_in : OCR-100 · governed_by : [OCR-004, OCR-007] · used_by : 4 Records
- *ex. : WSP(OCR-100) → append-only fact store, Framework publication · Evidence(OCR-110) → Framework publication of levels*

### PRD-004 · `produces` — Canonical
- **semantic_contract** : "The source creates the target as a new protocol object."
- family : Production · relationship_type : Causal · ontology_domain : primitive
- signature : `{source:[Issuer,CertifiedIssuer,WSP,Verification], target:[Evidence,ImmutableFact,VerificationResponse]}` — *pending type registry*
- obligation : Optional · canonical_inverse : `produced_by` · symmetry : asymmetric
- constraints_ref : [OCR-009:inv-append-only] · stability : Core · semantic_stability : **Fixed**
- introduced_in : OCR-100 · governed_by : [OCR-004, OCR-007] · used_by : 3 Records
- *ex. : WSP(OCR-100) → verifiable professional truth · Verification(OCR-107) → Verification Response(OCR-109)*

### PRD-005 · `consumes` — Canonical
- **semantic_contract** : "The source takes the target as input without altering it."
- family : Consumption · relationship_type : Causal · ontology_domain : primitive
- signature : `{source:[Trust], target:[Evidence,ImmutableFact]}` — *pending type registry*
- obligation : Optional · canonical_inverse : `consumed_by` · symmetry : asymmetric
- constraints_ref : [] · stability : Core · semantic_stability : **Fixed**
- introduced_in : OCR-105 · governed_by : [OCR-004, OCR-007] · used_by : 1 Record
- *ex. : Trust(OCR-105) → Immutable Fact(OCR-114), Evidence(OCR-110)*

### PRD-006 · `references` — Canonical
- **semantic_contract** : "The source points to the target without asserting ownership or production."
- family : Reference · relationship_type : Referential · ontology_domain : primitive
- signature : `{source:[*], target:[*]}` — *pending type registry*
- obligation : Optional · canonical_inverse : `referenced_by` · symmetry : asymmetric
- constraints_ref : [] · stability : Core · semantic_stability : **Fixed**
- introduced_in : OCR-108 · governed_by : [OCR-004, OCR-007] · used_by : 3 Records
- *ex. : Verification Request(OCR-108) → Framework version(OCR-115) · Evidence(OCR-110) → Framework(OCR-115)*

### PRD-007 · `supersedes` — Canonical
- **semantic_contract** : "The source replaces the target as the authoritative version, preserving the target immutably."
- family : Temporal · relationship_type : Temporal · ontology_domain : primitive
- signature : `{source:[Evidence,Framework,ImmutableFact], target:[same]}` (réflexif) — *pending type registry*
- obligation : Optional · canonical_inverse : `superseded_by` · symmetry : asymmetric
- constraints_ref : [OCR-009:inv-append-only] · stability : Core · semantic_stability : **Fixed**
- introduced_in : OCR-110 · governed_by : [OCR-004, OCR-007] · used_by : 2 Records
- *ex. : Evidence(OCR-110) → Evidence (réflexif) · Framework(OCR-115) → Framework version (réflexif)*

### PRD-008 · `related_to` — Canonical
- **semantic_contract** : "The source and target are associated without a more specific governed relation."
- family : Reference · relationship_type : Referential · ontology_domain : primitive
- signature : `{source:[*], target:[*]}` — *pending type registry*
- obligation : Optional · canonical_inverse : `related_to` · symmetry : **symmetric**
- constraints_ref : [] · stability : Core · semantic_stability : **Fixed**
- introduced_in : OCR-100 · governed_by : [OCR-004, OCR-007] · used_by : 1 Record
- *ex. : WSP(OCR-100) → Verifiable Credentials, DID Core, Open Badges (prior art, non équivalents)*

---

## 3. Réservé (statut : Reserved)

### PRD-009 · `extends` — Reserved
- **semantic_contract** : "The source is a canonical relation held in reserve; no admitted use exists yet."
- family : Structural · relationship_type : Taxonomic · ontology_domain : primitive
- signature : — *pending type registry* · obligation : — · canonical_inverse : `extended_by`
- symmetry : asymmetric · constraints_ref : [] · stability : **Reserved** · semantic_stability : Fixed
- introduced_in : OCR-004 · governed_by : [OCR-004, OCR-007] · used_by : **0 occurrence**
- *Note doctrine : conservé au registre, statut Reserved tant qu'aucun besoin réel n'apparaît. Un futur
  usage devra démontrer qu'il n'est pas exprimable par `is_a`/`part_of`.*

---

## 4. Inverses dérivés (statut : Derived)

> Doctrine décision 2 : le graphe ne stocke **qu'une seule direction canonique**. Ces prédicats
> existent dans SDK/API/UI mais ne sont **jamais** une seconde source de vérité. Chacun pointe vers
> sa direction canonique via `canonical_inverse`. Aucun `semantic_contract` propre : ils héritent
> (inversé) de leur canonical. `semantic_stability : Fixed` sauf mention.

| predicate (Derived) | → direction canonique | famille | note (ancrage inventaire) |
|---|---|---|---|
| `produced_by` (2×) | INV de `produces` (PRD-004) | Production | Verification Response→Verification ⇒ Verification `produces` Response |
| `consumed_by` (2×) | INV de `consumes` (PRD-005) | Consumption | Evidence→Trust ⇒ Trust `consumes` Evidence |
| `referenced_by` (2×) | INV de `references` (PRD-006) | Reference | Opus ID→Evidence ⇒ Evidence `references` Opus ID |
| `superseded_by` (3×) | INV de `supersedes` (PRD-007) | Temporal | réflexif préservé (Evidence, Immutable Fact) |
| `owned_by` (2×) | INV de `owns` (PRD-201) | Ownership | Passport→Professional ⇒ Professional `owns` Passport |
| `resolved_by` (4×) | INV de `resolves` (PRD-301) | Resolution | Framework→Registry ⇒ Registry `resolves` Framework |
| `defined_by` (3×) | INV de `defines` (PRD-601) | Conceptual | Skill→Framework ⇒ Framework `defines` Skill |
| `attested_by` (2×) | INV de `attests` (PRD-101) | Provenance | Skill→Evidence ⇒ Evidence `attests` Skill |
| `inspected_by` (2×) | INV de `inspects` (PRD-303) | Verification | Trust→Verification ⇒ Verification `inspects` Trust |
| `surfaced_by` (2×) | INV de `surfaces` (PRD-401) | Projection | Identity→Passport ⇒ Passport `surfaces` Identity |
| `named_by` (2×) | INV de `identifies` (PRD-302) | Resolution | Identity→Opus ID ⇒ Opus ID `identifies` Identity |
| `revoked_by` (2×) | INV de `revokes` (PRD-704) | Lifecycle | Revocation fact → Evidence |
| `identified_by` (1×) | INV de `identifies` (PRD-302) | Resolution | Professional→Opus ID |
| `initiated_by` (1×) | INV de `initiates` (PRD-701) | Lifecycle | Verification→Request ⇒ Request `initiates` Verification |
| `certified_by` (1×) | INV de `certifies` (PRD-206) | Governance | Certified Issuer→Opus X |
| `output_of` (1×) | INV de `produces` (PRD-004) | Production | Trust Status→Trust ⇒ Trust `produces` Status |
| `exposed_by` (1×) | INV de `exposed_as`→`exposes` (PRD-402) | Projection | Trust Status→Verification |
| `property_of` (1×) | INV de `has_property` (→`part_of`, voir §6) | Structural | Evidence Integrity→Immutable Fact |
| `preserved_by` (1×) | INV de `preserves` (PRD-103 provenance) | Provenance | Evidence Source→Immutable Fact |
| `relied_on_by` (1×) | INV de `supports` (Evolving) | Dependency | ⟨dépend de `supports` — voir §7⟩ |
| `queried_by` (1×) | INV de `queries` (PRD-304 verification) | Verification | Framework Registry→ingestion/Verification |
| `checked_by` (1×) | INV de `checks`→`inspects` (PRD-303) | Verification | Passport→Verification |
| `validated_by` (1×) | INV de `validates`→`inspects` (PRD-303) | Verification | Evidence Integrity→conformance test |
| `held_by` (1×) | INV de `holds` (PRD-202 custody) | Ownership | Identity→Opus X (custody, pas ownership) |
| `bound_to` (2×) | INV de `binds` (Evolving→identifies?) | Resolution | ⟨dépend de `binds` — voir §7⟩ |
| `subject_of` (1×) | INV de `references` (PRD-006) | Reference | Professional→Evidence |
| `instantiated_by` (1×) | INV de `is_a` (PRD-001) | Structural | Identity→Professional Identity |
| `was_reidentified_from` (0×) | INV de `reidentified_as` (PRD-801) | Identity Resolution | réidentification canonique ; même définition logique ; relation directe uniquement |

---

## 5. Domain Predicates (statut : Canonical, hors noyau primitif)

> Prédicats de domaine qui **ne se réduisent pas** à une primitive sans perte de sens, et que la
> doctrine autorise comme Canonical dans leur famille (chacun devra, à terme, démontrer sa nécessité
> — décision 1). `semantic_contract` propre. Identifiants PRD-2xx (Ownership), 3xx (Resolution/Verif),
> 4xx (Projection), 5xx (Computation), 6xx (Conceptual), 1xx (Provenance).

### Provenance
| PRD | name | semantic_contract | occ |
|---|---|---|---|
| PRD-101 | `attests` | "The source formally testifies to the existence or validity of the target." | (via attested_by 2×) |
| PRD-102 | `attributed_to` (`attributes_to`) | "The source's origin is assigned to the target as its author." | 1× |
| PRD-103 | `preserves` (formes dérivées : `originated_from`, `provenance_of`) | "The target is the documented origin of the source." | 1× |

### Ownership / Custody / Governance
| PRD | name | semantic_contract | occ |
|---|---|---|---|
| PRD-201 | `owns` | "The source holds inalienable ownership of the target." | 2× |
| PRD-202 | `holds` | "The source holds custody of the target without owning it." | 1× (Organization→roles) |
| PRD-203 | `governed_by` | "The target holds governing authority over the source." | 3× |
| PRD-204 | `governs` (INV de governed_by) | *inverse dérivé* | 1× |
| PRD-205 | `gates` | "The source authorizes or blocks the target's admission." | 1× (Certified Issuer→acceptance) |
| PRD-206 | `certifies` (`certified_as`/`certified_by`) | "The source grants certified status to the target." | 1× |
| PRD-207 | `publishes` (`published_by` inv.) | "The source issues the target as an authoritative publication." | 1× (Framework→Opus X) |
| PRD-208 | `protects` | "The source preserves the integrity, availability or validity of the target." | 1× (Evidence Integrity→Evidence) |

### Resolution / Identity
| PRD | name | semantic_contract | occ |
|---|---|---|---|
| PRD-301 | `resolves` | "The source resolves the target's coordinates or criteria to canonical form." | 1× |
| PRD-302 | `identifies` (`names`/`identified_by`) | "The source uniquely designates the target." | 1× |
| PRD-303 | `inspects` (`inspected_by`/`checks`/`validates`) | "The source examines the target to establish a verification fact." | 1× |
| PRD-304 | `queries` (`queried_by`) | "The source interrogates the target for resolution during verification." | 1× |
| PRD-305 | `maps` | "The source associates the target across two coordinate systems." | 1× (Registry→Criterion/Coordinate) |

### Projection
| PRD | name | semantic_contract | occ |
|---|---|---|---|
| PRD-401 | `surfaces` | "The source publicly exposes the target as a projection, without owning it." | 1× |
| PRD-402 | `exposes` (`exposed_as`/`exposed_by`) | "The source presents the target as its outward, read-only form." | 1× |
| PRD-403 | `reports` (`presents`) | "The source renders the target for external reading without altering it." | 1× |

### Computation
| PRD | name | semantic_contract | occ |
|---|---|---|---|
| PRD-501 | `computed_from` (`standing_computed_from`) | "The source is derived by computation over the target; never asserted directly." | 1× |
| PRD-502 | `computed_for` | "The source is a computation produced on behalf of the target subject." | 1× (Trust→Opus ID) |

### Conceptual
| PRD | name | semantic_contract | occ |
|---|---|---|---|
| PRD-601 | `defines` (`defined_by`) | "The source establishes the normative meaning of the target." | 2× |
| PRD-602 | `distinct_from` | "The source and target both exist and are not identical; a positive relation of differentiation (not a negation)." | 2× |

> **Décision architecte (2026-07-17) — `distinct_from` est Canonical.** Reclassé ici (Conceptual, PRD-602),
> retiré des Alias (§6). C'est une **relation positive de différenciation** — les deux extrémités existent
> et ne sont pas identiques — **jamais une négation** : il ne relève donc PAS d'OCR-009 (Constraints).

### Lifecycle
> **Formalisée en v1.1 (décision architecte, 2026-07-17).** Famille **Lifecycle** = transition d'état d'un
> objet protocolaire (distincte de Temporal = relation chronologique, cf. §7). Les 5 prédicats reçoivent
> un PRD-id (bloc 7xx) et un `semantic_contract` propre — ils ne sont plus Evolving.

| PRD | name | semantic_contract | occ |
|---|---|---|---|
| PRD-701 | `initiates` (`initiated_by` inv.) | "The source starts the lifecycle of the target." | 1× |
| PRD-702 | `precedes` | "The source occurs before the target within the same lifecycle." | 2× |
| PRD-703 | `orders` | "The source defines the execution order of the target." | 1× |
| PRD-704 | `revokes` (`revoked_by` inv.) | "The source invalidates the target while preserving its historical existence." | 2× |
| PRD-705 | `answers` | "The source is the formal response to the target request." | 1× |

### Identity Resolution
> **Famille NOUVELLE — créée par amendement (2026-07-19, décision architecte, Lot B).**
> Résolution d'identité canonique : réattribution d'un identifiant à une définition
> **publiée**, SANS aucun changement de sens. Distincte de **Temporal** (`supersedes` =
> remplacement *avec* évolution) et de **Resolution / Identity** (3xx = résolution de
> coordonnées / désignation d'un objet). Le noyau primitif (≤ 10) est inchangé :
> `reidentified_as` est un **Domain Predicate**, hors noyau.

### PRD-801 · `reidentified_as` — Canonical (Domain) · Canonical Name : "Reidentified As"
- **semantic_contract** : "Indicates that a published definition has been assigned a new canonical identifier without any change to its semantic meaning, normative behavior, structure, or constraints."
- family : Identity Resolution · relationship_type : Identity · ontology_domain : domain
- signature : `{source:[published definition], target:[published definition]}` — *pending type registry (OCR-010)*
- obligation : Optional · canonical_inverse : `was_reidentified_from` · symmetry : **asymmetric (antisymmetric)**
- algebraic properties : **transitive · non-reflexive · antisymmetric**
- persistence : **direct relations only** — une relation déductible n'est jamais stockée ; la chaîne se reconstruit à la lecture
- domain : toute définition publiée · scope : relations entre deux **représentations canoniques** d'une même **définition logique**
- **exclusion normative** : **interdit** dès qu'une propriété sémantique évolue (sens, comportement normatif, structure ou contraintes) — dans ce cas le prédicat applicable est **`supersedes` (PRD-007)**, jamais `reidentified_as`.
- constraints_ref : [OCR-009:inv-append-only] · stability : Core · semantic_stability : **Fixed**
- introduced_in : OCR-007 v1.2 (amendement Lot B) · governed_by : [OCR-004, OCR-007] · used_by : **0 occurrence** (la projection du graphe l'intégrera APRÈS publication)
- *ex. : `framework:wtf` → `framework:wtr` (réidentification canonique — même définition logique, nouvel identifiant)*

---

## 6. Alias (statut : Alias — résolus, jamais stockés)

> Doctrine décision 6 : la longue traîne se **résout** vers un canonical/derived. Le graphe ne stocke
> jamais un alias. Les alias marqués **⟨Evolving⟩** relèvent d'un arbitrage de sens **non figé** (§7) :
> leur résolution ci-dessous est **provisoire**, en attente du graphe.

| alias | occ | → résolution | note |
|---|---|---|---|
| `has_part` (1×) | INV de `part_of` (PRD-002) | WSP has_part {Evidence,Trust…} |
| `contains` (1×) | INV de `part_of` (PRD-002) | Registry contains OCR |
| `layered_into` (1×) | → `part_of` (PRD-002) | Registry→100s/200s/300s |
| `has_property` (2×) | → `part_of` (PRD-002) | ⟨Evolving : property vs part⟩ |
| `composes` (2×) | → `part_of` (PRD-002, inv.) | ⟨Evolving : composition vs part_of⟩ |
| `clusters` (1×) | → `part_of` (PRD-002, inv.) | ⟨Evolving⟩ Competency→Skill |
| `accumulates` (1×) | → `produces` (PRD-004) | ⟨Evolving⟩ Passport→Fact |
| `accepted_form_of` (1×) | → `is_a` (PRD-001) | Immutable Fact is_a accepted Evidence |
| `belongs_to` (1×) | → `owned_by` (INV PRD-201) | Identity→Professional |
| `governs` (1×) | → `governed_by` (INV PRD-203) | Professional→Passport |
| `governed_for_disclosure_by` (1×) | → `governed_by` (PRD-203) | spécialisation disclosure |
| `accountable_for` (1×) | → `governed_by` (PRD-203, inv.) | Organization→its facts |
| `held_for` / `holds_for` (1×) | → `computed_for` (PRD-502) | ⟨Evolving⟩ Trust Status→Opus ID |
| `holds_under` (1×) | → `references` (PRD-006) | ⟨Evolving⟩ Trust Status→Framework version |
| `anchors` (1×) | → `identifies` (PRD-302) | Opus ID→Fact/Passport |
| `names` (1×) | → `identifies` (PRD-302) | Request→Opus ID |
| `binds` (2×) | → `identifies` (PRD-302) | ⟨Evolving⟩ Identity→Immutable Fact |
| `maps` (see PRD-305) | Canonical | — |
| `defers_levels_to` (1×) | → `depends_on` (PRD-003) | Registry→Framework |
| `enables` (1×) | → `depends_on` (PRD-003, inv.) | ⟨Evolving⟩ Identity→Verification |
| `supports` (2×) | → `depends_on` (PRD-003, inv.) | ⟨Evolving⟩ |
| `used_by` (1×) | → `consumes` (PRD-005, inv.) | Framework→Trust |
| `applies` (1×) | → `references` (PRD-006) | ⟨Evolving⟩ Verification→Framework |
| `works_with` (1×) | → `related_to` (PRD-008) | Source→Integrity |
| `beneficiary_of` (1×) | → `related_to` (PRD-008) | ⟨Evolving⟩ Professional→Trust |
| `derived_from` (1×) | → `computed_from` (PRD-501) | ⟨Evolving : Computation vs Projection⟩ |
| `presents` (1×) | → `reports` (PRD-403) | Profile→Facts |
| `reads` (1×) | → `consumes` (PRD-005) | ⟨Evolving⟩ Verification→Trust |
| `recomputes` (1×) | → `inspects` (PRD-303) | Verification→Integrity |
| `reports` (see PRD-403) | Canonical | — |
| `resolves` (see PRD-301) | Canonical | — |
| `about` (3×) | → `references` (PRD-006) | ⟨Evolving : describes vs references⟩ |
| `subject_of` (1×) | → `references` (PRD-006, inv.) | Professional→Evidence |
| `links_to` (1×) | → `references` (PRD-006) | Lifecycle→Passport |
| `basis_for` (2×) | → `computed_from` (PRD-501, inv.) | ⟨Evolving : Computation vs Dependency⟩ |
| `interpreted_against` (1×) | → `interprets`/`references` | ⟨Evolving : Conceptual vs Reference⟩ |
| `bounded_by` (2×) | → `governed_by` (PRD-203, consent) | Request→consent |
| `separates` (1×) | → Governance/Conceptual | ⟨Evolving⟩ WSP separates production/verification |
| `produces_accepted` (1×) | → `produces` (PRD-004) | spécialisation conditionnelle |
| `produces_at_acceptance` (1×) | → `produces` (PRD-004) | spécialisation conditionnelle |
| `produces_when_issuer` (1×) | → `produces` (PRD-004) | spécialisation conditionnelle |

---

## 7. Arbitrages ouverts (statut : Canonical/Alias, semantic_stability : Evolving)

> Doctrine décision 4 : les prédicats dont le sens **dépend de la construction du graphe** ne sont
> **pas figés artificiellement**. Ils portent `semantic_stability : Evolving` — stables en cycle de vie,
> interprétation ouverte jusqu'à validation par le graphe. **Contrats provisoires ci-dessous, à
> confirmer par l'architecte après construction du graphe.** Concerne Conceptual, Computation, composition.
>
> **Décision architecte (2026-07-17) — Evolving maintenus.** Ces arbitrages restent **ouverts par choix
> explicite** : *« OCR-007 ne doit pas inventer une sémantique que le graphe pourra démontrer
> objectivement. »* Leur validation intervient **après WSP-001** (construction du graphe), sans rouvrir
> le registre.

| prédicat | résolution provisoire | question ouverte (pour l'architecte / le graphe) |
|---|---|---|
| `interpreted_against` | Conceptual `interprets` ou `references` ? | Trust→Framework : sens sémantique ou simple référence ? |
| `basis_for` | Computation (`computed_from` inv.) ou Dependency ? | Identity→Trust : fondement calculatoire ou dépendance ? |
| `composes` / `clusters` | `part_of` ou composition distincte ? | Skill→Capability : agrégation ou méréologie propre ? |
| `has_property` | `part_of` ou attribut (→OCR-008) ? | property vs part : relation ou attribut ? |
| `about` | `references` ou `describes` (Conceptual) ? | Response→Opus ID : pointer ou décrire ? |
| `derived_from` | `computed_from` ou Projection ? | Profile→Passport : calcul ou projection ? |
| `separates` | Governance ou Conceptual ? | WSP separates production/verification : structurel ou normatif ? |
| `supports` / `enables` | `depends_on` (inv.) ou Dependency propre ? | soutien vs dépendance stricte ? |
| `binds` | `identifies` ou liaison propre ? | Identity→Fact : désignation ou attachement ? |
| `reads` / `applies` | `consumes` / `references` ? | actes de Verification : quelle primitive porte l'acte ? |

**Famille Lifecycle — FORMALISÉE en v1.1 (décision architecte, 2026-07-17).** La famille **Lifecycle** est
**créée et dotée de contrats** : `initiates` (PRD-701), `precedes` (PRD-702), `orders` (PRD-703),
`revokes` (PRD-704), `answers` (PRD-705) — voir §5 sous-section Lifecycle. Chacun porte un
`semantic_contract` propre et n'est **plus Evolving**. `supersedes` (PRD-007) **reste Temporal**
(relation chronologique).

> **Note pour les moteurs d'inférence.** **Temporal = relation chronologique** (ordre dans le temps,
> supersession documentaire) ; **Lifecycle = transition d'état** d'un objet protocolaire. La distinction
> est normative : un moteur ne doit pas confondre « B remplace A » (Temporal) avec « l'objet passe de
> l'état X à l'état Y » (Lifecycle). La **famille** est arrêtée ; la **résolution sémantique fine** de
> `precedes`/`orders` reste `semantic_stability : Evolving` jusqu'à validation par le graphe.

---

## 8. Exclusions (statut : Rejected / renvoyé vers un autre registre)

> Doctrine décision 3 : OCR-007 décrit **les relations**. Ce qui n'en est pas relève d'un autre registre.

| élément | occ | statut | registre cible |
|---|---|---|---|
| `not_a` | 2× | Rejected (négation) | **OCR-009** Constraints |
| `does_not_own` | 2× | Rejected (négation) | **OCR-009** Constraints |
| `does_not_grant` | 1× | Rejected (négation) | **OCR-009** Constraints |
| `must_agree_with` | 1× | Rejected (contrainte de conformité) | **OCR-009** Constraints |
| `state` | 1× | Rejected (attribut, pas relation) | **OCR-008** Attributes |

---

## 9. Definition of Done (critère de validation — doctrine décision 7)

OCR-007 est **Approved / Normative** (v1.1). Critères de validation (doctrine décision 7), **tous satisfaits SANS réserve** :
1. chaque relation du Lot 0 (101) a une résolution normative — **fait** (100% classés ; **plus aucun UNRESOLVED** — `protects` formalisé PRD-208) ;
2. aucun prédicat ambigu ne subsiste sans statut explicite — **fait** ;
3. chaque entrée Canonical/Domain possède un `semantic_contract` — **fait** (Lifecycle PRD-701→705 dotée de contrats en v1.1) ;
4. les familles sont stabilisées — **fait** (famille **Lifecycle** formalisée, distincte de Temporal — §5, §7) ;
5. les inverses sont entièrement normalisés — **fait** (§4) ;
6. les dépendances vers OCR-008/012 sont référencées — **fait** (§8, §7) ;
7. le registre peut servir de source unique par WSP-001 — **fait**.

**Décisions de l'architecte — tranchées le 2026-07-17 :**
- **(A) 16 champs** — les 3 métadonnées (`introduced_in`/`governed_by`/`used_by`) font partie du modèle normatif. Doctrine décision 5 corrigée « 14 » → « 16 ».
- **(B) famille Lifecycle** — **formalisée en v1.1** : `initiates`/`precedes`/`orders`/`revokes`/`answers` = Domain Predicates Lifecycle (PRD-701→705, contrats propres) ; `supersedes` reste Temporal.
- **(D) `distinct_from`** — Canonical Domain Predicate, famille Conceptual (PRD-602) : différenciation positive, jamais une négation.
- **v1.1 — `protects`** créé (Domain Governance, PRD-208) ; **PRD-103 = `preserves`** (nom unique, `originated_from`/`provenance_of` dérivés) ; **`certifies` = PRD-206** (référence à PRD-305 supprimée, PRD-305 réservé à `maps`).
- **v1.2 (2026-07-19) — Identity Resolution** : famille créée ; **`reidentified_as` (PRD-801, Domain Canonical)** + inverse dérivé **`was_reidentified_from`** (§4). Réidentification canonique = nouvel identifiant **sans** changement de sens (définition logique inchangée) ; si une propriété sémantique évolue, c'est **`supersedes` (PRD-007)**. Transitif, non réflexif, antisymétrique ; relations directes uniquement. Amendement Lot B. *(Champs de format non dictés — `predicate_id` PRD-801, `signature`, `stability`, `introduced_in`, etc. — renseignés par convention, à confirmer.)*

**Reste ouvert par décision explicite de l'architecte (n'affecte pas le DoD) :**
- **(C)** les résolutions **Evolving** résiduelles (§7 — dont `interpreted_against`, `separates`) restent ouvertes jusqu'à validation par le graphe (WSP-001). *« OCR-007 ne doit pas inventer une sémantique que le graphe pourra démontrer objectivement. »* Elles se confirmeront après construction du graphe, **sans rouvrir le registre**.

OCR-007 v1.1 est **gravé** : il sert de source unique et **débloque WSP-001** (l'extracteur d'arêtes).
