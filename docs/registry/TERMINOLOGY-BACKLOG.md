# TERMINOLOGY BACKLOG — concepts envisagés, non encore introduits

> **NON NORMATIF. MATIÈRE POUR DE FUTURES ÉVOLUTIONS. JAMAIS SOURCE DE GÉNÉRATION.**
>
> Ce document n'établit aucun terme, ne définit rien et ne crée aucune obligation. Il
> conserve des concepts **envisagés** mais **non introduits** dans le corpus, pour qu'ils
> ne se perdent pas. Aucun de ses textes n'a été vérifié contre une source.
>
> **Décision gravée** : « Le dictionnaire sera généré à partir du premier [l'audit],
> jamais du second [le backlog]. »

**Origine.** L'architecte a rédigé 46 définitions **avant** l'audit terminologique. Elles
citent des sources telles que *Foundation Records*, *Architecture Records*, *Governance
Records*, *Concept Records*, *Registry Records* — des **familles inventées**, sans aucun
identifiant réel du corpus. Là où le constat établissait que **12 termes sur 47** ont une
source citable, ces 46 en citent 46.

**Sa distinction, reprise ici** : il a produit un **glossaire idéal** — quels concepts un
protocole comme celui-ci *devrait* posséder — là où la règle imposait un **dictionnaire du
corpus** — quels concepts le corpus établit *aujourd'hui*. Les deux sont utiles ; ils ne
se substituent pas.

**Documents liés** : [TERMINOLOGY-AUDIT.md](TERMINOLOGY-AUDIT.md) (les concepts que le
protocole possède aujourd'hui — **seule** source du futur dictionnaire) ·
[TERMINOLOGY-QUALIFICATION-REVIEW.md](TERMINOLOGY-QUALIFICATION-REVIEW.md) ·
[CONSTAT-established-by.md](CONSTAT-established-by.md) · [REGLES-DECOUVERTES.md](REGLES-DECOUVERTES.md).

---

## ⚠️ STATUT DE CE DOCUMENT DANS LE CHANTIER TERMINOLOGY GOVERNANCE — à trancher

Le chantier autonome **Terminology Governance** nomme **trois** livrables :

1. Terminology Qualification Review
2. Terminology Audit
3. Canonical Dictionary

**Ce document n'y figure pas.** Il existe pourtant, il est committé, et il porte les
20 définitions écartées ainsi que la trace des 20 `Established By` non vérifiés.

Deux lectures possibles, **non tranchées ici** :

- **quatrième livrable du chantier** — il alimenterait l'amont du cycle : quels concepts
  le protocole *pourrait* acquérir, en amont même de la QUALIFICATION ;
- **hors chantier** — matière d'archive conservée pour mémoire, sans rôle dans le cycle de
  gouvernance terminologique.

**Il n'est ni supprimé ni déplacé.** La décision revient à l'architecte. Dans les deux cas
la règle gravée reste entière : « Le dictionnaire sera généré à partir du premier
[l'audit], jamais du second [le backlog]. »

---

## Comparaison des deux périmètres

Sa liste : **46 termes.** Le périmètre de l'audit : **47** (42 concepts du graphe
`4b39afcc3ebd` + 5 termes du chantier présents dans la prose d'OCR-006).

| | |
|---|---:|
| **Communs aux deux** | **10** |
| **Ses termes absents du périmètre de l'audit** | **36** |
| **Termes de l'audit absents de sa liste** | **37** |

Les deux ensembles se recouvrent donc **très peu** : 10 termes sur 46 et 47. Ce n'est pas
une anomalie, c'est la mesure de l'écart entre le glossaire idéal et le corpus réel.

### Les 10 communs — déjà traités par l'audit, NON dupliqués ici

`Record` · `Logical Definition` · `Canonical Identifier` · `Canonical Representation` ·
`Identity Resolution` · `Projection` · `Provenance` · `Reidentification` · `Framework` ·
`Framework Version`

### Les 37 termes de l'audit absents de sa liste

`Abstract Identity Concept` · `Answer` · `Applied Competence Cluster` ·
`Atomic Competence Unit` · `Broad Competence Capacity` · `Computation` · `Coordinate` ·
`Criterion` · `Cryptographic Property` · `Derived State` · `Derived State Value` ·
`Entity` · `Evidence Link` · `Framework publication` · `Framework publication of levels` ·
`Identifier` · `Identity Surface` · `Index` · `Inspection Act` · `Level` · `OCR` ·
`Passport update` · `Presentation View` · `Process` · `Query` · `Reference Model` ·
`Resolution Layer` · `Revocation fact` · `Standard` · `State Sequence` · `Subject-Owner` ·
`append-only fact store` · `consent` · `consent facts` · `disclosure` ·
`learning journey` · `verifiable professional truth`

Le glossaire idéal est **architectural** ; le corpus réel est largement **métier**
(Evidence, Passport, Framework, consentement, niveaux, coordonnées). Aucun des deux
ensembles ne peut se déduire de l'autre.

---

## ⚠️ ANGLE MORT — 16 termes ne sont NI audités NI mis au backlog

**À remonter à l'architecte.** Ce n'est pas un défaut de l'un des deux documents : c'est
un effet de la règle d'entrée, mesuré.

La règle est : *seuls les termes absents à la fois du corpus et du graphe entrent au
backlog ; ceux qui existent déjà sont traités par l'audit.* Or **l'audit ne couvre que les
concepts déclarés du graphe**. Un terme employé dans la prose du corpus mais jamais déclaré
comme concept échappe donc aux deux :

- **exclu du backlog** — il n'est pas absent du corpus ;
- **absent de l'audit** — il n'est pas un concept du graphe.

Seize de ses 46 termes sont dans ce cas. Décompte littéral sur les 33 Records :

| Terme | Records | Occurrences | Premiers Records |
|---|---:|---:|---|
| Protocol | 33 | 505 | OCR-000, OCR-001, OCR-002… |
| Status | 33 | 253 | OCR-000, OCR-001, OCR-002… |
| Governance | 33 | 169 | OCR-000, OCR-001, OCR-002… |
| **Canonical Registry** | **33** | **104** | OCR-000, OCR-001, OCR-002… |
| Concept | 31 | 201 | OCR-000, OCR-001, OCR-002… |
| Knowledge Graph | 28 | 60 | OCR-001, OCR-004, OCR-100… |
| Implementation | 11 | 76 | OCR-000, OCR-001, OCR-002… |
| Conformance | 8 | 21 | OCR-000, OCR-001, OCR-002… |
| Interoperability | 5 | 5 | OCR-100, OCR-110, OCR-115… |
| Relationship | 3 | 26 | OCR-004, OCR-006, OCR-103 |
| Discovery | 1 | 12 | OCR-006 |
| Predicate | 1 | 11 | OCR-004 |
| Published Fact | 1 | 2 | OCR-006 |
| Amendment | 1 | 2 | OCR-006 |
| Instance | 1 | 1 | OCR-115 |
| Reading Layer | 1 | 1 | OCR-006 |

**`Canonical Registry` est le cas le plus net** : non seulement il est le **titre du Record
OCR-124**, mais il apparaît dans **les 33 Records, 104 fois**. Tout sauf un concept
envisagé — et pourtant il ne figure dans aucun des deux documents.

**Même réserve de méthode que dans l'audit** : le décompte est **littéral**. Il ne
distingue pas l'emploi du concept de l'emploi courant du mot anglais — `Protocol` (505),
`Status` (253), `Concept` (201) sont massivement génériques. Le volume ne mesure donc pas
la maturité d'un terme ; il mesure seulement que la règle d'entrée du backlog ne s'y
applique pas.

**Rien n'a été ajouté ni retiré pour combler cet angle mort.** La règle d'entrée est
appliquée telle quelle, et les 20 entrées ci-dessous s'y conforment strictement. Étendre le
périmètre de l'audit à ces 16 termes — ou les admettre au backlog malgré leur présence en
prose — est une **décision d'architecture**, pas une correction.

---

## LES 20 ENTRÉES DU BACKLOG

Termes **absents du corpus et du graphe**. La définition de l'architecte est conservée
**verbatim comme matière de référence**.

> **Pour chacune, sans exception** : ce texte **n'a aucune valeur normative** et **ne cite
> aucune source vérifiée**. Le champ *Established by* est reproduit **tel qu'il a été
> écrit**, y compris lorsqu'il désigne une famille de Records qui n'existe pas. Il n'est
> ni corrigé, ni remplacé, ni supprimé : **la trace doit rester lisible** — c'est
> exactement ce qui a bloqué le dictionnaire.

---

### 2. Canonical Corpus

**Definition** — The Canonical Corpus is the complete collection of published Records that collectively establish the World Skills Protocol. It is the authoritative documentary source of every normative concept, relationship and rule.

**Why it matters** — No implementation, registry or graph establishes protocol meaning independently. All normative meaning originates in the Canonical Corpus.

**Related concepts** — Record · Knowledge Graph · Canonical Representation · Documentary Version

**Established by** — `Corpus Governance Records` ⚠️ **NON VÉRIFIÉ** — aucune famille de ce nom dans le corpus.

---

### 16. Documentary Version

**Definition** — A Documentary Version identifies a specific published revision of a Record as a document. It records changes to the published text independently of their normative impact.

**Why it matters** — Editorial improvements, corrections and clarifications may produce new documentary versions without altering protocol meaning.

**Related concepts** — Normative Version · Representation Version · Record

**Established by** — `OCR-006` ⚠️ **NON VÉRIFIÉ** — OCR-006 n'a aucune section Terminology et n'établit pas ce terme.

---

### 17. Normative Version

**Definition** — A Normative Version identifies a change to the meaning, obligations or logical definition established by the protocol. Not every documentary revision produces a new normative version.

**Why it matters** — Separating documentary evolution from semantic evolution prevents editorial corrections from being interpreted as protocol changes.

**Related concepts** — Documentary Version · Logical Definition · Record

**Established by** — `OCR-006` ⚠️ **NON VÉRIFIÉ**.

---

### 18. Representation Version

**Definition** — A Representation Version identifies a change in the canonical expression of a published object while preserving or accompanying its logical definition. Representation changes concern how information is expressed rather than what it means.

**Why it matters** — Separating representation from meaning allows publication formats and technical encodings to evolve without unnecessarily changing protocol semantics.

**Related concepts** — Canonical Representation · Logical Definition · Documentary Version

**Established by** — `OCR-006` ⚠️ **NON VÉRIFIÉ**.

---

### 22. Succession

**Definition** — Succession is the relationship by which one published definition replaces another because the protocol has established a distinct normative object. The successor follows the earlier definition but does not claim to be the same object.

**Why it matters** — Succession preserves documentary continuity while acknowledging semantic evolution. It distinguishes replacement from identity preservation.

**Related concepts** — Reidentification · Logical Definition · Normative Version

**Established by** — `Relationship Records` ⚠️ **NON VÉRIFIÉ** — aucune famille de ce nom. *(Le prédicat `supersedes` — PRD-007 — existe bien dans OCR-007, mais il établit une relation, pas le substantif.)*

---

### 27. Graph Node

**Definition** — A Graph Node is the projected representation of a published concept within the Knowledge Graph. Nodes correspond only to concepts formally established by the protocol.

**Why it matters** — Nodes provide the structural elements through which concepts become navigable while remaining traceable to their establishing Records.

**Related concepts** — Concept · Graph Edge · Knowledge Graph

**Established by** — `Knowledge Graph Records` ⚠️ **NON VÉRIFIÉ** — aucune famille de ce nom.

---

### 28. Graph Edge

**Definition** — A Graph Edge is the projected representation of a published relationship between two protocol concepts. Every edge originates from a relationship explicitly established by the protocol.

**Why it matters** — Edges expose the semantic structure of the protocol while preserving the authority of the Records from which they are generated.

**Related concepts** — Relationship · Predicate · Graph Node · Projection

**Established by** — `Knowledge Graph Records` ⚠️ **NON VÉRIFIÉ**.

---

### 29. Projection Rule

**Definition** — A Projection Rule defines how published protocol information is transformed into a derived representation without altering its meaning. Projection rules govern the generation of artefacts such as the Knowledge Graph.

**Why it matters** — Projection rules ensure that independently generated representations remain deterministic and reproducible.

**Related concepts** — Projection · Knowledge Graph · Record

**Established by** — `Architecture Records` ⚠️ **NON VÉRIFIÉ** — aucune famille de ce nom.

---

### 30. Discovery Endpoint

**Definition** — A Discovery Endpoint is a published access mechanism through which implementations can retrieve protocol representations or operational facts. Endpoints expose information without establishing its meaning.

**Why it matters** — Discovery separates identity from retrieval, allowing publication infrastructures to evolve independently from protocol semantics.

**Related concepts** — Discovery · Identity Resolution · Canonical Representation

**Established by** — `Discovery Records` ⚠️ **NON VÉRIFIÉ** — aucune famille de ce nom.

---

### 31. Registry Entry

**Definition** — A Registry Entry is an individual published element within the Canonical Registry. It associates a canonical identifier with its corresponding protocol object, predicate or controlled vocabulary element.

**Why it matters** — Registry entries provide the machine-readable references required for interoperable implementations.

**Related concepts** — Canonical Registry · Canonical Identifier · Predicate

**Established by** — `Registry Records` ⚠️ **NON VÉRIFIÉ** — aucune famille de ce nom.

---

### 32. Controlled Vocabulary

**Definition** — A Controlled Vocabulary is the published collection of authorised protocol terms and identifiers recognised for interoperable use. Only published vocabulary forms part of the protocol.

**Why it matters** — Controlled vocabularies prevent semantic divergence by ensuring that independent implementations use identical identifiers for identical concepts.

**Related concepts** — Canonical Registry · Predicate · Canonical Identifier

**Established by** — `Registry Records` ⚠️ **NON VÉRIFIÉ**.

---

### 33. Resolution Chain

**Definition** — A Resolution Chain is the complete sequence of protocol mechanisms through which a canonical identifier is resolved into its current canonical representation. Each step remains traceable and reproducible.

**Why it matters** — Resolution chains ensure that identity remains stable even when publication mechanisms evolve over time.

**Related concepts** — Identity Resolution · Discovery · Canonical Representation

**Established by** — `Architecture Records` ⚠️ **NON VÉRIFIÉ**.

---

### 35. Canonical Projection

**Definition** — A Canonical Projection is a protocol-approved derived representation generated deterministically from the Canonical Corpus according to published projection rules. It introduces no additional semantics beyond those established by the Records.

**Why it matters** — Canonical projections improve discoverability while preserving complete fidelity to the published protocol.

**Related concepts** — Projection · Knowledge Graph · Canonical Corpus · Projection Rule

**Established by** — `Knowledge Graph Records` ⚠️ **NON VÉRIFIÉ**.

---

### 38. Documentary State

**Definition** — A Documentary State is the complete published state of the Canonical Corpus at a particular point in its evolution. It represents the exact collection of Records, versions and published relationships from which derived artefacts can be reproduced.

**Why it matters** — Every Knowledge Graph projection, registry export or protocol interpretation corresponds to a specific documentary state.

**Related concepts** — Canonical Corpus · Documentary Version · Projection · Provenance

**Established by** — `Architecture Records` ⚠️ **NON VÉRIFIÉ**.

---

### 39. Semantic Continuity

**Definition** — Semantic Continuity is the preservation of the logical meaning of a published definition across documentary or representational evolution. The protocol maintains semantic continuity whenever the underlying logical definition remains unchanged.

**Why it matters** — Semantic continuity allows implementations to recognise that different representations may still describe the same normative object.

**Related concepts** — Logical Definition · Reidentification · Representation Version

**Established by** — `OCR-006` ⚠️ **NON VÉRIFIÉ**.

---

### 40. Identity Continuity

**Definition** — Identity Continuity is the preservation of a published object's canonical identity throughout its documentary lifecycle. Identity continuity remains independent of storage location, representation or publication mechanism.

**Why it matters** — It ensures that systems continue to reference the same published object even when its canonical representation evolves.

**Related concepts** — Canonical Identifier · Identity Resolution · Reidentification

**Established by** — `OCR-006` ⚠️ **NON VÉRIFIÉ**.

---

### 41. Occurrence

**Definition** — An Occurrence is a concrete operational fact recorded by an implementation that instantiates one or more protocol concepts. Occurrences belong to implementations and are never part of the protocol's normative corpus.

**Why it matters** — Separating occurrences from concepts preserves the distinction between published semantics and operational data.

**Related concepts** — Instance · Concept · Discovery

**Established by** — `Architecture Records` ⚠️ **NON VÉRIFIÉ**.

---

### 43. Normative Relationship

**Definition** — A Normative Relationship is a semantic relationship formally established by a published Record. Only normative relationships may be projected into canonical protocol representations such as the Knowledge Graph.

**Why it matters** — The protocol distinguishes relationships established by publication from relationships inferred or created by implementations.

**Related concepts** — Relationship · Predicate · Knowledge Graph

**Established by** — `Relationship Records` ⚠️ **NON VÉRIFIÉ**.

---

### 44. Canonical Discovery

**Definition** — Canonical Discovery is the protocol mechanism through which implementations retrieve the current canonical representation or published occurrences associated with a canonical identifier. It exposes information without modifying identity or meaning.

**Why it matters** — Canonical Discovery separates persistent identity from evolving publication infrastructure while preserving complete traceability.

**Related concepts** — Discovery · Identity Resolution · Canonical Representation

**Established by** — `Discovery Records` ⚠️ **NON VÉRIFIÉ**.

---

### 45. Deterministic Derivation

**Definition** — Deterministic Derivation is the principle that any derived protocol information must always be reproducible from the same published facts and documentary state. Given identical inputs, conforming implementations shall produce identical derived results.

**Why it matters** — Deterministic derivation guarantees interoperability, reproducibility and auditability across independent implementations.

**Related concepts** — Published Fact · Status · Projection · Provenance

**Established by** — `OCR-006` ⚠️ **NON VÉRIFIÉ**.

---

## Récapitulatif des sources non vérifiées

Les 20 entrées citent **8 sources distinctes**, dont **7 sont des familles inventées** :

| Source citée | Occurrences | État |
|---|---:|---|
| `OCR-006` | 6 | **identifiant réel**, mais le Record **n'établit aucun de ces termes** (aucune section Terminology) — et il est en `Draft` |
| `Architecture Records` | 4 | famille inexistante |
| `Knowledge Graph Records` | 3 | famille inexistante |
| `Registry Records` | 2 | famille inexistante |
| `Relationship Records` | 2 | famille inexistante |
| `Discovery Records` | 2 | famille inexistante |
| `Corpus Governance Records` | 1 | famille inexistante |

`OCR-006` est le seul identifiant réel cité — et il ne tient pas ce qu'on lui prête. C'est
la démonstration la plus courte de pourquoi le dictionnaire a été bloqué : **une source
plausible n'est pas une source vérifiée**.

**Aucune de ces valeurs n'a été corrigée, remplacée ni supprimée.**
