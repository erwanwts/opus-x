# CONSTAT — champ « Established By » du dictionnaire

**Date** : 2026-07-21 · **Portée** : constat de lecture, **aucune définition rédigée**.
**Référence du graphe** : `4b39afcc3ebd` (courante) — `c172712` historique.

Le champ *Established By* doit citer le ou les Records qui **établissent** le terme, pas
ceux qui l'emploient. Même distinction que pour les principes orphelins : **un terme
mentionné n'est pas un terme défini.** Ce document dit, pour chaque terme du périmètre,
s'il existe une source d'établissement — et laquelle.

---

## Écart de périmètre à signaler

Le mandat porte sur **41** concepts `protocol_concept`. Le graphe en compte **42** depuis
l'amendement OCR-115 v1.1.0, qui déclare `Framework` comme concept. Le 42ᵉ est donc
`Framework` lui-même. Le périmètre traité ici est **42 + 5 = 47 termes**.

## Critère d'établissement retenu

Mécanique, vérifiable, sans jugement :

| Verdict | Critère |
|---|---|
| **ÉTABLI — titre** | un Record a ce terme pour titre (H1) : le Record *porte* le terme, avec sa `## Canonical Definition` |
| **ÉTABLI — Terminology** | le terme est **definiendum** d'une entrée `- **Terme** — …` dans une section `## Terminology` |
| **EMPLOYÉ SANS DÉFINITION** | le terme apparaît en prose, jamais comme definiendum |
| **ARÊTE SEULE** | le terme n'existe **que** comme étiquette de cible dans une section `## Knowledge Graph Relationships` — **zéro occurrence en prose dans tout le corpus** |

Périmètre scanné : les 33 Records de `docs/web/registry-import/OCR-100/`, plus
`docs/registry/OCR-007_Canonical_Predicate_Registry.md` pour les termes du chantier.

---

## Résultat d'ensemble

| Verdict | Termes |
|---|---:|
| ÉTABLI — titre de Record | **1** |
| ÉTABLI — entrée Terminology | **11** |
| EMPLOYÉ SANS DÉFINITION | **22** |
| ARÊTE SEULE (aucune prose) | **8** |
| **Total concepts du graphe** | **42** |
| Les 5 termes du chantier | **0 établi** |

**12 termes sur 47 ont une source d'établissement citable.** Pour les 35 autres, le champ
*Established By* n'a rien à citer — c'est le constat demandé.

---

## 1. ÉTABLI — titre de Record (1)

| Terme | Established By |
|---|---|
| Framework | **OCR-115** — Framework, `## Canonical Definition` |

## 2. ÉTABLI — entrée Terminology (11)

Le libellé verbatim est reproduit pour que l'architecte voie **sur quoi** il s'appuierait.

| Terme | Established By | Entrée verbatim |
|---|---|---|
| Coordinate | **OCR-115, OCR-117, OCR-119** § Terminology | OCR-115 : « an addressable point within a Framework, e.g. `wtr:212`. » |
| Criterion | **OCR-115, OCR-116, OCR-119** § Terminology | OCR-119 : « a granular assessable element, e.g. `S03.C08`. » |
| Evidence Link | **OCR-110, OCR-114** § Terminology | OCR-110 : « the append-only binding between an accepted Evidence and the Passport update it produced. » |
| Framework version | **OCR-119** § Terminology | « the applicable revision against which resolution occurs. » |
| Level | **OCR-115, OCR-119** § Terminology | OCR-115 : « the graded semantics of a skill, defined by the Framework, published by Opus X. » |
| Passport update | **OCR-101** § Terminology | « the append event produced by one accepted Evidence, uniquely linked to it. » |
| Projection | **OCR-123** § Terminology | « a derived view, not a store. » |
| Provenance | **OCR-110, OCR-111** § Terminology | OCR-110 : « the verifiable record of who produced the Evidence, when, and under what authorization. » |
| Consent | **OCR-101** § Terminology | « the professional's disclosure decisions, expressed as facts. » |
| Disclosure | **OCR-101** § Terminology | « what is shown from the Passport, governed by consent. » |
| Learning journey | **OCR-120** § Terminology | « the pedagogical/observational process the Issuer owns. » |

**Point de vigilance** : cinq de ces termes ont **plusieurs** entrées Terminology, dont les
formulations diffèrent (`Coordinate` : trois ; `Criterion` : trois ; `Level`, `Provenance`,
`Evidence Link` : deux). *Established By* citerait donc plusieurs Records, et l'architecte
devra trancher **laquelle des formulations** fait foi — ou constater qu'elles concordent.

## 3. ARÊTE SEULE — aucune prose dans tout le corpus (8)

Ces termes n'existent **nulle part** hors de la section Knowledge Graph d'un seul Record.
Aucun texte ne les emploie, aucun ne les définit : ils sont nés comme cible d'un `is_a`.

| Terme | Unique occurrence |
|---|---|
| Abstract Identity Concept | OCR-125 § KG — `is_a` → Abstract Identity Concept |
| Applied Competence Cluster | OCR-117 § KG — `is_a` → Applied Competence Cluster |
| Atomic Competence Unit | OCR-116 § KG — `is_a` → Atomic Competence Unit |
| Broad Competence Capacity | OCR-118 § KG — `is_a` → Broad Competence Capacity |
| Cryptographic Property | OCR-113 § KG — `is_a` → Cryptographic Property |
| Derived State Value | OCR-106 § KG — `is_a` → Derived State Value |
| Framework publication of levels | OCR-110 § KG — `depends_on` → Framework publication of levels |
| Reference Model | OCR-115 § KG — `is_a` → Reference Model |

Pour ceux-là, *Established By* serait vide, et *Definition* serait à écrire **ex nihilo**.

## 4. EMPLOYÉ SANS DÉFINITION (22)

Le terme apparaît en prose mais n'est **definiendum** d'aucune entrée.

Answer · Computation · Derived State · Entity · Framework publication · Identifier ·
Identity Surface · Index · Inspection Act · OCR · Presentation View · Process · Query ·
Record · Resolution Layer · Revocation fact · Standard · State Sequence · Subject-Owner ·
append-only fact store · consent facts · verifiable professional truth

**Réserve de méthode, à ne pas surinterpréter.** Le décompte d'occurrences est
**littéral** : il ne distingue pas l'emploi du concept de l'emploi courant du mot anglais.
`Answer` (49 occurrences), `Computation` (60), `Entity` (41), `Record` (75), `Standard`
(32), `Process`, `Index`, `Query`, `OCR` (374) sont massivement des emplois **génériques**,
pas des références au concept. Le volume ne mesure donc pas la maturité du terme — il ne
prouve rien, ni dans un sens ni dans l'autre. Un tri terme à terme reste à faire, et il
relève d'un jugement éditorial, pas d'un script.

À l'inverse, certains sont manifestement des concepts du protocole sans porteur :
`Identity Surface` (2 occ.), `State Sequence` (1), `Inspection Act` (1),
`verifiable professional truth` (1), `Subject-Owner` (2), `Derived State` (2).

---

## 5. Les 5 termes du chantier — OCR-006 les **suppose**, il ne les définit pas

**Question posée** : OCR-006 les DÉFINIT-il, ou les suppose-t-il ?
**Réponse** : il les suppose. **OCR-006 n'a aucune section `## Terminology`** — sa
structure est Introduction, puis huit Principes en *Canonical Statement · Motivation ·
Normative Consequences · Notes*, puis Conclusion. Aucune entrée de dictionnaire.

Ce que fait OCR-006 : il **prescrit le comportement** de ces objets et **contraint** ce
qu'on peut leur faire. Ce qu'il ne fait pas : dire **ce qu'ils sont**.

| Terme | Ce qu'OCR-006 en dit | Verdict |
|---|---|---|
| **Logical Definition** | Principe 1, Canonical Statement : « The definition is the normative object. […] A logical definition is never multiplied by the number of representations expressing it. » | **Supposé.** Une **propriété** est énoncée (non-multiplication), jamais le genre. Le texte ne dit pas ce qu'*est* une définition logique. |
| **Canonical Representation** | Principe 1, Canonical Statement : « A canonical representation is one of the published expressions of that definition. » | **Le seul cas limite.** C'est une **prédication définitionnelle** (« X is a Y ») : genre = *published expression*, différence = *of that definition*. Pas une entrée de dictionnaire, mais citable. |
| **Canonical Identifier** | Principe 5 : « Changing the canonical identifier of a published definition… » · Principe 7 : « Only properties proper to the act of publication — the canonical identifier, … — MAY differ. » | **Supposé.** N'apparaît jamais qu'en position d'objet qu'on change ou qui diffère. Jamais défini. |
| **Identity Resolution** | Principe 4 (titre) : « Identity Resolution Belongs Exclusively to the Reading Layer » · Consequence : « Identity resolution SHALL be performed at read time only. » | **Supposé.** Le texte dit **où** elle a lieu et **quand**, jamais **ce qu'elle est**. La Motivation décrit deux placements possibles, en présupposant l'objet. |
| **Reidentification** | Principe 5 : « Reidentification SHALL be performed by publishing a new canonical representation, never by modifying an existing one. » · Principe 7 : « Reidentification shall alter no property expressing the meaning, behaviour, scope or validity of the definition. » | **Supposé.** Deux principes entiers prescrivent sa **méthode** et ses **limites** — ce qui la contraint fortement sans jamais l'énoncer. |

### La source la plus proche pour « Reidentification » n'est pas un Record du corpus

`docs/registry/OCR-007_Canonical_Predicate_Registry.md` § 5, PRD-306, définit le
**prédicat** :

> « Indicates that a published definition has been assigned a new canonical identifier
> without any change to its semantic meaning, normative behavior, structure, or
> constraints. »

C'est la seule définition disponible — mais elle porte sur **la relation
`reidentified_as`**, pas sur le **substantif** *Reidentification*. Citer OCR-007 en
*Established By* d'un terme du dictionnaire reviendrait à établir un nom par la définition
d'un prédicat. C'est une décision, pas un constat : elle revient à l'architecte.

### Réserve de statut

OCR-006 est en **Draft**, *Review Status : Pending editorial review*. Même le seul cas
limite (`Canonical Representation`) s'appuierait donc sur un Record non encore endossé.

---

## Ce que ce constat implique pour la rédaction des 46 entrées

- **12 entrées** peuvent renseigner *Established By* immédiatement — dont **5** exigeront
  d'arbitrer entre plusieurs formulations concurrentes.
- **35 entrées** n'ont **aucune source à citer**. Sur ces 35, **8** n'ont même pas une
  phrase de prose à laquelle se raccrocher.
- Les **5 termes du chantier** sont dans ce cas : OCR-006 les emploie abondamment et les
  contraint normativement, mais n'en établit aucun. Un dictionnaire les définissant
  créerait leur définition **au moment même** où il prétend la citer.
