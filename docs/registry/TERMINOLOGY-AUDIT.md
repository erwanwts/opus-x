# TERMINOLOGY AUDIT — contrôle permanent de la cohérence terminologique

> **NON NORMATIF.** Document de travail et de maintenance. Il n'établit aucun terme, ne
> définit rien, ne crée aucune obligation. Il **constate** l'état documentaire des
> concepts que le protocole possède aujourd'hui, et rien d'autre.

**Artefact permanent, à consulter et à mettre à jour après chaque nouveau Record**, après
chaque amendement d'une section `## Terminology`, et après chaque régénération du graphe.
Ce n'est pas un livrable de chantier : c'est le contrôle qui empêche qu'un terme soit
employé, puis référencé, puis tenu pour acquis sans avoir jamais été établi.

**Critère fondateur (gravé)** :

> « Un concept du protocole n'existe que s'il est établi par le corpus. Une relation peut
> référencer un concept existant. Une relation ne crée jamais un concept. »

**Périmètre** : les concepts mesurés dans le corpus et le graphe — **42 lignes**.
Le nombre n'est pas fixé : il y a autant de lignes que le protocole possède réellement de
concepts après revue. Un terme envisagé mais non introduit **n'a pas sa place ici** ;
il relève du backlog.

**Dernière mesure** : 2026-07-21 · graphe `4b39afcc3ebd` · corpus de 33 Records.

---

## Légende

| État | Signification |
|---|---|
| **Defined** | une entrée `## Terminology` l'établit, dans un Record **endossé** |
| **Pending** | établi par le corpus, mais dans un Record en **`Draft`** — l'établissement existe, il n'est pas endossé |
| **Used** | employé en prose, **definiendum** d'aucune entrée |
| **Edge-only** | n'existe que comme cible d'une relation — **zéro** occurrence en prose dans tout le corpus |

**La colonne `Source` ne contient que des identifiants réels du corpus.** Jamais une
famille, jamais une catégorie, jamais un renvoi vague. **Si aucun Record n'établit le
terme, la case est vide.** C'est la règle qui a bloqué le dictionnaire : un champ de
provenance qu'on remplit par commodité ne prouve plus rien.

**`Defined` est vide aujourd'hui — et c'est un résultat, pas un oubli.** Les **33 Records
du corpus sont en `Draft`**, sans exception. Tout terme établi l'est donc dans un Record
non endossé, et relève de `Pending`. `Defined` est l'**état cible** : chaque Record qui
quittera `Draft` y fera basculer ses termes, sans autre travail que la revue.

**Casse des termes** : elle suit le **definiendum de l'entrée qui établit le terme** quand
il en existe une (`Consent`, `Disclosure`, `Learning journey`, `Passport update`,
`Framework version`), sinon l'étiquette du nœud du graphe. Le graphe conserve la casse de
la première occurrence rencontrée, qui n'est pas toujours celle de la définition.

Les candidats proposés en `Action Required` pour l'état `Used` sont **mécaniques** : c'est
le Record dont la section `## Knowledge Graph Relationships` nomme le terme — donc celui
qui en a besoin. Ce sont des **candidats**, pas des attributions : l'arbitrage éditorial
reste entier.

---

## Pending — 12 termes

Établis par le corpus, en attente d'endossement.

| Term | Documentary State | Source | Action Required |
|---|---|---|---|
| Consent | Pending | OCR-101 (Draft) | Validate OCR-101 |
| Coordinate | Pending | OCR-115, OCR-117, OCR-119 (Draft) | Validate OCR-115, OCR-117, OCR-119 |
| Criterion | Pending | OCR-115, OCR-116, OCR-119 (Draft) | Validate OCR-115, OCR-116, OCR-119 |
| Disclosure | Pending | OCR-101 (Draft) | Validate OCR-101 |
| Evidence Link | Pending | OCR-110, OCR-114 (Draft) | Validate OCR-110, OCR-114 |
| Framework | Pending | OCR-115 (Draft) | Validate OCR-115 |
| Framework version | Pending | OCR-119 (Draft) | Validate OCR-119 |
| Learning journey | Pending | OCR-120 (Draft) | Validate OCR-120 |
| Level | Pending | OCR-115, OCR-119 (Draft) | Validate OCR-115, OCR-119 |
| Passport update | Pending | OCR-101 (Draft) | Validate OCR-101 |
| Projection | Pending | OCR-123 (Draft) | Validate OCR-123 |
| Provenance | Pending | OCR-110, OCR-111 (Draft) | Validate OCR-110, OCR-111 |

**Cinq termes ont plusieurs sources aux formulations divergentes** — `Coordinate` (3),
`Criterion` (3), `Level`, `Provenance`, `Evidence Link` (2 chacun). La validation devra
trancher laquelle fait foi, ou constater qu'elles concordent. `Framework` est le seul
établi par le **titre et la `## Canonical Definition`** de son Record, non par une entrée
de Terminology.

## Used — 22 termes

Employés en prose, jamais définis. Aucune source : la case est vide.

| Term | Documentary State | Source | Action Required |
|---|---|---|---|
| Answer | Used | | Add definition to OCR-109 |
| Computation | Used | | Add definition to OCR-105 |
| Derived State | Used | | Add definition to OCR-105 |
| Entity | Used | | Add definition to OCR-122 |
| Framework publication | Used | | Add definition to OCR-100 |
| Identifier | Used | | Add definition to OCR-104 |
| Identity Surface | Used | | Add definition to OCR-101 |
| Index | Used | | Add definition to OCR-119 |
| Inspection Act | Used | | Add definition to OCR-107 |
| OCR | Used | | Add definition to OCR-124 |
| Presentation View | Used | | Add definition to OCR-123 |
| Process | Used | | Add definition to OCR-112 |
| Query | Used | | Add definition to OCR-108 |
| Record | Used | | Add definition to OCR-114 |
| Resolution Layer | Used | | Add definition to OCR-119 |
| Revocation fact | Used | | Add definition to OCR-110 |
| Standard | Used | | Add definition to OCR-124 |
| State Sequence | Used | | Add definition to OCR-112 |
| Subject-Owner | Used | | Add definition to OCR-103 |
| append-only fact store | Used | | Add definition to OCR-100 |
| consent facts | Used | | Add definition to OCR-101 |
| verifiable professional truth | Used | | Add definition to OCR-100 |

**Réserve de méthode à ne pas surinterpréter.** Le repérage de l'emploi est **littéral** :
il ne distingue pas l'emploi du **concept** de l'emploi courant du **mot anglais**.
`Answer`, `Computation`, `Entity`, `Record`, `Standard`, `Process`, `Index`, `Query` et
`OCR` sont massivement génériques dans le corpus. Le volume d'occurrences ne mesure donc
pas la maturité d'un terme et ne prouve rien. Le tri terme à terme relève d'un jugement
éditorial, pas d'un script : il n'est pas fait ici.

## Edge-only — 8 termes

**Une relation ne crée jamais un concept.** Ces huit termes n'existent nulle part dans le
corpus hors d'une unique ligne de section Knowledge Graph. Aucun texte ne les emploie,
aucun ne les établit : ce sont des relations qui référencent un concept **inexistant**.

La question n'est pas « faut-il les définir ? » mais **« le protocole a-t-il réellement
besoin de chacun d'eux ? »**. C'est une question d'architecture, pas de rédaction.

| Term | Documentary State | Source | Action Required |
|---|---|---|---|
| Abstract Identity Concept | Edge-only | | Decide: establish in a Record, or remove from graph |
| Applied Competence Cluster | Edge-only | | Decide: establish in a Record, or remove from graph |
| Atomic Competence Unit | Edge-only | | Decide: establish in a Record, or remove from graph |
| Broad Competence Capacity | Edge-only | | Decide: establish in a Record, or remove from graph |
| Cryptographic Property | Edge-only | | Decide: establish in a Record, or remove from graph |
| Derived State Value | Edge-only | | Decide: establish in a Record, or remove from graph |
| Framework publication of levels | Edge-only | | Decide: establish in a Record, or remove from graph |
| Reference Model | Edge-only | | Decide: establish in a Record, or remove from graph |

### Provenance des huit relations concernées

La relation exacte à examiner, pour que la décision se prenne sur pièce. Ce n'est pas une
source d'établissement — d'où la case `Source` vide ci-dessus.

| Term | Relation à examiner |
|---|---|
| Abstract Identity Concept | OCR-125 § KG — `is_a` → Abstract Identity Concept |
| Applied Competence Cluster | OCR-117 § KG — `is_a` → Applied Competence Cluster |
| Atomic Competence Unit | OCR-116 § KG — `is_a` → Atomic Competence Unit |
| Broad Competence Capacity | OCR-118 § KG — `is_a` → Broad Competence Capacity |
| Cryptographic Property | OCR-113 § KG — `is_a` → Cryptographic Property |
| Derived State Value | OCR-106 § KG — `is_a` → Derived State Value |
| Framework publication of levels | OCR-110 § KG — `depends_on` → Framework publication of levels |
| Reference Model | OCR-115 § KG — `is_a` → Reference Model |

Sept des huit sont des `is_a` : chacun affirme la **nature** d'un Record par un genre que
le corpus n'a jamais posé. Supprimer la relation revient à retirer au Record sa
déclaration de genre — ce n'est donc pas une décision sans conséquence.

---

## Comment maintenir ce document

1. **Après tout nouveau Record ou tout amendement d'une `## Terminology`** — reprendre la
   mesure : un terme peut passer de `Used` à `Pending`, ou apparaître en `Edge-only` si le
   Record introduit une relation vers un concept non établi.
2. **Après toute régénération du graphe** — mettre à jour la référence en tête et vérifier
   qu'aucun `Edge-only` n'est apparu. Un nouvel `Edge-only` est un **signal** : une
   relation vient de référencer un concept que le corpus ne possède pas.
3. **Après tout endossement d'un Record** (sortie de `Draft`) — ses termes passent de
   `Pending` à `Defined`, et leur `Action Required` devient `None`. Retirer la mention
   `(Draft)` de la colonne `Source`.
4. **Ne jamais remplir `Source` par commodité.** Une case vide est une information ; un
   identifiant approximatif est une régression.

## Ce que ce document n'est pas

- **Pas un dictionnaire.** Il ne contient aucune définition et n'en engendrera aucune.
- **Pas normatif.** Aucune de ses lignes ne crée, ne modifie ni ne restreint une
  obligation.
- **Pas un inventaire des termes envisagés.** Les concepts non encore introduits dans le
  corpus relèvent du **TERMINOLOGY BACKLOG**, document distinct.

Documents liés : [CONSTAT-established-by.md](CONSTAT-established-by.md) (la mesure dont
cet audit dérive) · [DETTES-ouvertes.md](DETTES-ouvertes.md).
