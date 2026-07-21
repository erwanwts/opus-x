# TERMINOLOGY QUALIFICATION REVIEW — termes employés, non déclarés

> **NON NORMATIF.** Ce document **mesure**, il ne qualifie pas. Les colonnes *Décision* et
> *Justification* sont **délibérément vides** : elles reviennent à l'architecte.

## Place dans le modèle en trois étapes

> **QUALIFICATION** → le terme appartient-il au vocabulaire normatif ?
> **ÉTABLISSEMENT** → si oui, dans quel Record est-il défini ?
> **PROJECTION** → une fois établi, dans quels artefacts dérivés apparaît-il ?
>
> « Ces trois décisions ne doivent jamais être fusionnées. »

Ce document sert **la première étape, et elle seule**. Il ne dit pas où un terme devrait
être défini, ni s'il devrait entrer au graphe.

| Document | Périmètre |
|---|---|
| [TERMINOLOGY-AUDIT](TERMINOLOGY-AUDIT.md) | concepts **déclarés** et leur état documentaire |
| [TERMINOLOGY-BACKLOG](TERMINOLOGY-BACKLOG.md) | concepts **envisagés**, absents du protocole |
| **Ce document** | termes **employés** mais non déclarés |

Ni l'audit ni le backlog ne sont modifiés par ce document.

---

## Le point de périmètre, traité avant de figer

**La question posée** : les 16 termes viennent du glossaire de l'architecte ; rien ne dit
que ce sont les seuls employés-non-déclarés du corpus. Produire un tableau de seize
reproduirait l'angle mort une couche plus bas.

**Ordre de grandeur mesuré : ~39 candidats**, pas 16. Et surtout — **les deux ensembles ne
se recouvrent presque pas : un seul terme commun** (`Status`).

### Pourquoi ils divergent : deux mesures répondent à deux questions

| | Mesure A — origine des 16 | Mesure B — balayage du corpus |
|---|---|---|
| **Critère** | occurrence du terme, **casse indifférente** | occurrence en **Title Case** uniquement |
| **Question posée** | le mot apparaît-il ? | le mot est-il employé **comme un terme** ? |
| **Exemple** | `Protocol` → 505 occurrences | `Protocol` → **non retenu** |

La mesure A compte `protocol`, `status`, `governance` en minuscules, c'est-à-dire l'anglais
courant. La mesure B ne retient que les emplois capitalisés, seul signal mécanique d'un
usage terminologique. **15 des 16 termes du glossaire ne survivent pas à la mesure B** :
dans le corpus, ils sont écrits en minuscules — ce sont des mots, pas des termes.

Les deux mesures sont conservées côte à côte. Aucune n'est retirée : **la divergence est
elle-même le résultat**, et elle relève de la qualification.

> ⚠️ Les décomptes de la section « angle mort » du **backlog** relèvent de la mesure A
> (casse indifférente). Ils ne sont **pas comparables** à ceux de la mesure B ci-dessous.
> Le backlog n'est pas modifié — la réserve est notée ici.

### Méthode de la mesure B

Balayage des 33 Records. Extraction de toute suite de 1 à 4 mots capitalisés
(`[A-Z][a-z]+`), puis **seuil de rétention : présence dans ≥ 2 Records**.

**Ce que la méthode exclut — explicitement :**

1. **Les majuscules de position** — début de phrase, de ligne, d'item de liste, après
   `.` `!` `?` `:` `;` `—`. Sans ce filtre le bruit passe de 39 à 117 candidats (`The`,
   `An`, `Initial`, `Use`…).
2. **Les gérondifs en tête d'item** (`Treating`, `Deleting`, `Storing`…) — tournures
   d'énumération, jamais des termes.
3. **Les concepts déjà déclarés** (42 du graphe) et les **5 termes du chantier** — ils
   relèvent de l'audit.
4. **Les titres de Record** (33) — ils *sont* les Records.
5. **Les pluriels** dont le singulier est un concept déclaré ou un titre (`Issuers`,
   `Frameworks`, `Immutable Facts`…).
6. **Une liste d'arrêt** de mots fonctionnels et de marqueurs de dépôt (`Opus`, `Sprint`,
   `Draft`, `Note`…).

**Limites connues, à ne pas ignorer :**

- **Appariement glouton** : une suite longue absorbe la courte. `Knowledge Graph` n'apparaît
  pas seul parce que `Knowledge Graph Relationships` l'absorbe. **`Knowledge Graph` est donc
  sous-compté par construction.**
- **Title Case seulement** : un terme écrit systématiquement en minuscules est **invisible**
  à la mesure B. C'est le prix du signal ; c'est aussi la cause de la divergence.
- **Seuil ≥ 2 Records** : un terme employé dans un seul Record est **hors périmètre**.
- **Les titres de Record sont exclus en bloc** : `Canonical Registry` n'apparaît donc pas
  en mesure B, alors que le glossaire le signale.

---

# A · Les 16 termes du glossaire de l'architecte

Mesure A — **casse indifférente**, sur les 33 Records.

| Terme | Occurrences | Décision | Justification |
|---|---|---|---|
| Protocol | 33 Records · 505 occ. | | |
| Status | 33 Records · 253 occ. | | |
| Governance | 33 Records · 169 occ. | | |
| Canonical Registry | 33 Records · 104 occ. | | |
| Concept | 31 Records · 201 occ. | | |
| Knowledge Graph | 28 Records · 60 occ. | | |
| Implementation | 11 Records · 76 occ. | | |
| Conformance | 8 Records · 21 occ. | | |
| Interoperability | 5 Records · 5 occ. | | |
| Relationship | 3 Records · 26 occ. | | |
| Discovery | 1 Record · 12 occ. | | |
| Predicate | 1 Record · 11 occ. | | |
| Published Fact | 1 Record · 2 occ. | | |
| Amendment | 1 Record · 2 occ. | | |
| Instance | 1 Record · 1 occ. | | |
| Reading Layer | 1 Record · 1 occ. | | |

---

# B · Les 39 termes relevés par balayage

Mesure B — **Title Case**, ≥ 2 Records. Les trois regroupements ci-dessous sont
**mécaniques et vérifiables**, non interprétatifs : ils constatent qu'un terme coïncide
avec une valeur d'état gravée ou avec un titre de section du corpus.

## B.1 — Coïncident avec une valeur d'état de cycle de vie (17)

Constat mécanique : le terme figure, **entre backticks**, dans une section
`## State Machine` d'au moins un Record.

| Terme | Occurrences | Décision | Justification |
|---|---|---|---|
| Normative | 21 Records · 84 occ. | | |
| Superseded | 12 Records · 22 occ. | | |
| Revoked | 8 Records · 22 occ. | | |
| Deprecated | 8 Records · 16 occ. | | |
| Suspended | 7 Records · 18 occ. | | |
| Certified | 5 Records · 30 occ. | | |
| Accepted | 4 Records · 12 occ. | | |
| Published | 4 Records · 5 occ. | | |
| Retired | 4 Records · 4 occ. | | |
| Applicant | 3 Records · 6 occ. | | |
| Submitted | 3 Records · 5 occ. | | |
| Refused | 2 Records · 3 occ. | | |
| Authenticated | 2 Records · 3 occ. | | |
| Rejected | 2 Records · 3 occ. | | |
| Active | 2 Records · 3 occ. | | |
| Current | 2 Records · 2 occ. | | |
| Stale | 2 Records · 2 occ. | | |

## B.2 — Coïncident avec un titre de section du corpus (6)

Constat mécanique : le terme est identique à un titre `##` ou `###` d'au moins un Record —
donc possiblement un **artefact d'extraction**, non un emploi terminologique.

| Terme | Occurrences | Décision | Justification |
|---|---|---|---|
| Knowledge Graph Relationships | 3 Records · 4 occ. | | |
| Version History | 2 Records · 8 occ. | | |
| Anti Patterns | 2 Records · 4 occ. | | |
| Relationships | 2 Records · 3 occ. | | |
| Protocol Rules | 2 Records · 3 occ. | | |
| Counter Examples | 2 Records · 2 occ. | | |

## B.3 — Ni valeur d'état, ni titre de section (16)

| Terme | Occurrences | Décision | Justification |
|---|---|---|---|
| Passport | 21 Records · 215 occ. | | |
| Registry | 11 Records · 52 occ. | | |
| Response | 4 Records · 75 occ. | | |
| Request | 4 Records · 62 occ. | | |
| Profile | 2 Records · 55 occ. | | |
| An Issuer | 4 Records · 7 occ. | | |
| Revocation | 5 Records · 6 occ. | | |
| Status | 3 Records · 3 occ. | | |
| Version | 3 Records · 3 occ. | | |
| Integrity | 3 Records · 3 occ. | | |
| Core | 2 Records · 3 occ. | | |
| Owner | 2 Records · 2 occ. | | |
| Informative | 2 Records · 2 occ. | | |
| Verifiable Credentials | 2 Records · 2 occ. | | |
| The World Skills Protocol | 2 Records · 2 occ. | | |
| Suspension | 2 Records · 2 occ. | | |

**Deux relevés à signaler tels quels.** `An Issuer` et `The World Skills Protocol`
incluent un article : ce sont des **artefacts d'extraction**, la méthode ne sachant pas
couper un déterminant capitalisé en tête de segment. `Passport` et `Registry` sont des
**formes courtes** de titres de Record existants — le graphe les traite déjà comme des
raccourcis (`name_aliases`), ce qui n'est pas la même chose qu'un terme employé.

---

## Récapitulatif

| | |
|---:|---|
| **16** | termes du glossaire (mesure A) |
| **39** | termes relevés par balayage (mesure B) |
| **1** | terme commun aux deux mesures — `Status`, qui figure donc dans les deux tableaux |
| **55** | lignes à qualifier, soit **54 termes distincts** |

**Aucune décision n'est prise dans ce document.** Les colonnes *Décision* et
*Justification* sont vides et le resteront jusqu'à l'arbitrage. La qualification opérée,
les termes retenus rejoindront l'étape **ÉTABLISSEMENT** ; les autres seront clos.

Documents liés : [TERMINOLOGY-AUDIT.md](TERMINOLOGY-AUDIT.md) ·
[TERMINOLOGY-BACKLOG.md](TERMINOLOGY-BACKLOG.md) ·
[CONSTAT-established-by.md](CONSTAT-established-by.md) ·
[REGLES-DECOUVERTES.md](REGLES-DECOUVERTES.md).
