# WEB-003 — Périmètre du dictionnaire des concepts (voie (a))

> **Source primaire tranchée : le Knowledge Graph.** Liste des nœuds `node_type:
> protocol_concept` de `content/registry/wsp-graph.json` (projection gelée `c172712`),
> exposés par `/api/concepts` (`lib/registry/api.ts` → `conceptList()`).
>
> **Traçabilité, aucune reconstitution.** Chaque entrée provient du graphe ; les
> Record(s) d'origine sont les Records dont une arête touche le nœud
> (`recordsForNode`, motif `^OCR-\d+$`).
>
> **Aucune définition.** Ce document délimite le **périmètre** (terme · identifiant ·
> origine), pas le sens. Les concepts n'ont **pas** de définition dans le corpus V1
> (`has_definition: false` dans l'API).
>
> **Identifiant** : le slug exposé par l'API ; l'id du nœud dans le KG est `ext:<slug>`.

## Les 41 concepts (KG, projection `c172712`)

| # | Terme | Identifiant (slug) | Record(s) d'origine |
|---|---|---|---|
| 1 | Abstract Identity Concept | `abstract-identity-concept` | OCR-125 |
| 2 | Answer | `answer` | OCR-109 |
| 3 | append-only fact store | `append-only-fact-store` | OCR-100 |
| 4 | Applied Competence Cluster | `applied-competence-cluster` | OCR-117 |
| 5 | Atomic Competence Unit | `atomic-competence-unit` | OCR-116 |
| 6 | Broad Competence Capacity | `broad-competence-capacity` | OCR-118 |
| 7 | Computation | `computation` | OCR-105 |
| 8 | consent | `consent` | OCR-108, OCR-123 |
| 9 | consent facts | `consent-facts` | OCR-101 |
| 10 | Coordinate | `coordinate` | OCR-119 |
| 11 | Criterion | `criterion` | OCR-119 |
| 12 | Cryptographic Property | `cryptographic-property` | OCR-113 |
| 13 | Derived State | `derived-state` | OCR-105 |
| 14 | Derived State Value | `derived-state-value` | OCR-106 |
| 15 | disclosure | `disclosure` | OCR-123 |
| 16 | Entity | `entity` | OCR-122 |
| 17 | Evidence Link | `evidence-link` | OCR-110 |
| 18 | Framework publication | `framework-publication` | OCR-100 |
| 19 | Framework publication of levels | `framework-publication-of-levels` | OCR-110 |
| 20 | Framework version | `framework-version` | OCR-115 |
| 21 | Identifier | `identifier` | OCR-104 |
| 22 | Identity Surface | `identity-surface` | OCR-101 |
| 23 | Index | `index` | OCR-119 |
| 24 | Inspection Act | `inspection-act` | OCR-107 |
| 25 | learning journey | `learning-journey` | OCR-120 |
| 26 | Level | `level` | OCR-115 |
| 27 | OCR | `ocr` | OCR-124 |
| 28 | Passport update | `passport-update` | OCR-101 |
| 29 | Presentation View | `presentation-view` | OCR-123 |
| 30 | Process | `process` | OCR-112 |
| 31 | Projection | `projection` | OCR-123 |
| 32 | Provenance | `provenance` | OCR-111 |
| 33 | Query | `query` | OCR-108 |
| 34 | Record | `record` | OCR-114 |
| 35 | Reference Model | `reference-model` | OCR-115 |
| 36 | Resolution Layer | `resolution-layer` | OCR-119 |
| 37 | Revocation fact | `revocation-fact` | OCR-110 |
| 38 | Standard | `standard` | OCR-124 |
| 39 | State Sequence | `state-sequence` | OCR-112 |
| 40 | Subject-Owner | `subject-owner` | OCR-103 |
| 41 | verifiable professional truth | `verifiable-professional-truth` | OCR-100 |

**Total : 41.**

## À ajouter — concepts issus des arbitrages récents, ABSENTS du graphe gelé

> Ces termes ont été introduits par les décisions de gouvernance postérieures à la
> projection `c172712` (Lot B). Ils **ne figurent pas** parmi les 41 nœuds ci-dessus.
> Listés ici comme **« à ajouter, non encore projetés »** — **sans définition**. Ils
> entreront dans le dictionnaire quand une nouvelle projection du graphe sera produite
> après publication (principe de projection C).

| Terme (à ajouter) | Identifiant (proposé, à graver) | Origine |
|---|---|---|
| définition logique | *(non gravé)* | décision Lot B (vocabulaire à trois niveaux) |
| représentation canonique | *(non gravé)* | décision Lot B (vocabulaire à trois niveaux) |
| identifiant canonique | *(non gravé)* | décision Lot B (vocabulaire à trois niveaux) |
| résolution d'identité | *(non gravé)* | décision Lot B (couche de lecture) |
| réidentification | *(voisin : prédicat `reidentified_as`, PRD-306, OCR-007)* | décision Lot B (prédicat de réidentification) |

**Note** : `reidentified_as` existe **comme prédicat** (OCR-007 §5, PRD-306), pas comme
concept/terme du dictionnaire ; « réidentification » (le concept nominal) reste à graver
si l'architecte veut l'y inscrire. Les quatre autres n'ont **aucune** trace dans le corpus
actuel.

---

*Périmètre traçable : 41 concepts du KG (source primaire, voie (a)) + 5 termes de
gouvernance à ajouter (non encore projetés). Aucune définition n'est fournie — délimitation
du périmètre seule.*
