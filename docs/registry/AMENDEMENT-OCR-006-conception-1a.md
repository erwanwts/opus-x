`docs/registry/AMENDEMENT-OCR-006-conception-1a.md` · conception (étape 1a) · versée en `d6bbf6e` (2026-07-25)

# Amendement OCR-006 → v2.0.0 — CONCEPTION (étape 1a, pour revue)

> **Aucune écriture dans OCR-006.** Ce document est la **conception** de l'amendement, à réviser avant toute
> écriture (étape 1b). Il **obéit** aux Records qu'il grave : versioning `OCR-005`, cycle `OCR-000`,
> éditorial `OCR-002`. Décidé et non rediscuté : **D-014** (principes = protocole), **D-011** (P9 ≠ statut
> documentaire), **header `:13`** (informatif = aucune obligation), **la mesure** (8 passages ; 3 normatifs
> C=`:250`/E=`:216`/G=`:139`, 5 informatifs A/B/D/F/H).

## 1 — La clause de portée (normative)

**Insertion :** une **nouvelle section normative `## Scope (Normative)`**, placée **après l'Introduction**
(après l'actuel §29, avant `# I. Fundamental Concepts`). Niveau H2, au même rang que les grands blocs.
Motif : la portée doit avoir **force** (header `:13` — seules les sections normatives obligent) ; les
énoncés de portée actuels (§27 Introduction, §293 Conclusion) sont **informatifs**. Une section normative
dédiée est le seul porteur d'une restriction de portée opposable.

**Libellé proposé :**

> ## Scope (Normative)
> These principles govern the **protocol** — its logical definitions, immutable facts, identities, canonical
> representations and their evolution. They **SHALL NOT** be read as governing the **documentary corpus** —
> the OCR Records as authored artefacts — whose authoring, structure, editorial register, terminology,
> relationships, versioning, status, promotion and integrity are governed by the Canonical Knowledge
> Governance Records (**OCR-000 through OCR-005**). Where the wording of a principle could be read to reach a
> documentary artefact, it **SHALL** be read as reaching only the protocol object it names; the documentary
> counterpart is governed by the Records named above, not by this Record.

Elle **défère** au régime documentaire **existant** (OCR-000…005) — elle n'en invente aucun.

**Elle régit C et G — avant / après (le texte de C et G ne change pas ; la clause borne leur lecture) :**

**C — P9, `:250` (normatif) :**
- *Avant* : « Status SHALL NOT be stored as a column, field or attribute of **any published
  representation**. »
- *Après la clause* : « any published representation » se lit **« any published *protocol* representation »**.
  Le champ `Status` (`Draft`/`Normative`) de l'**en-tête d'un Record** est un **artefact documentaire**,
  gouverné par `OCR-000`/`OCR-005` (qui l'**exigent**) → **hors P9**. Le texte de C est **inchangé** ;
  la clause le borne. *(= D-011, généralisée.)*

**G — P5, `:139` (normatif) :**
- *Avant* : « **A published representation is never modified.** A new canonical representation is added and
  related to the previous one. Both remain published. »
- *Après la clause* : « A published representation » = **représentation *protocole***. Un Record `.md`
  (documentaire) **peut** être amendé — non par édition silencieuse, mais par **versioning** (`OCR-005:46`).
  La rectification du 20 juillet (11 Records édités) **n'est donc pas** une violation de P5 : les Records
  sont documentaires, régis par OCR-005. Texte de G **inchangé** ; la clause le borne.

## 2 — Le traitement de E (P8) — acte propre, la clause ne l'absorbe pas

P8 **nomme** le versioning documentaire ; une clause « le documentaire est hors » **contredirait** son
texte. E exige un **acte normatif propre** : **garder P8** (l'indépendance des trois couches EST une règle
de lecture protocole — ne pas inférer la version de la norme depuis celle du Record) et **déférer le
mécanisme documentaire à OCR-005**.

**P8 Canonical Statement `:216` — INCHANGÉ** (nommer les trois couches est correct ; leur indépendance est
le propos) :
> « Documentary versioning, normative versioning and representation versioning are independent. … None shall
> be deduced from the others. »

**Ajout — une Normative Consequence de renvoi** (à la suite des consequences `:226-229`) :
> * The **mechanism** of the documentary versioning layer — how a Record's version is assigned, incremented
>   and recorded — is governed by **OCR-005 (Versioning Rules)**, not by this principle. This principle
>   governs only the requirement that the three layers remain **independent** and that no layer's version be
>   **inferred** from another's.

Avant : P8 impose « each versioning layer SHALL be identified explicitly » — obligation qui **atteint le
Record documentaire**. Après : l'obligation documentaire (champ `Version`, `Version History`) **retourne à
son foyer** `OCR-005:35` (qui l'exige déjà — **aucune perte**) ; P8 ne garde que la **non-inférence**
inter-couches, protocole. *(F `:220`, la motivation « a Record carries a version », devient alors une simple
illustration correcte — voir point 3.)*

## 3 — Les 5 informatifs (A, B, D, F, H) : **aligner A/B, laisser D/F/H**

Aucun n'oblige (header `:13`) — l'amendement n'est **pas tenu** de les toucher. Tri motivé, **pas par
réflexe** :

| Passage | Décision | Motif |
|---|---|---|
| **A** `:27` « the **entire corpus** is subject » | **ALIGNER** | C'est un **cadrage de portée** qui **contredit frontalement** la nouvelle clause normative. Un informatif qui contredit un normatif **induit en erreur** — `OCR-002:44` « ambiguity MUST be resolved ». Non-touché = incohérence lisible dès l'Introduction. |
| **B** `:293` « the corpus, **including this Record**, is subject » | **ALIGNER** | Même motif, plus fort (auto-inclusion). Cadrage de la Conclusion, à rendre cohérent avec la clause. |
| **D** `:256` (note P9, invoque P5) | **LAISSER** | Local, non-cadrage. Sous la clause, P5 vise le protocole → la note se lit juste. Toucher = churn inutile (OCR-005 : ne changer que ce qui change de sens). |
| **F** `:220` (motiv. P8, « a Record carries a version ») | **LAISSER** | Sous le renvoi P8→OCR-005 (point 2), c'est une **illustration correcte** (le Record a bien une version, gouvernée par OCR-005). |
| **H** `:210` (note P7, « any property ») | **LAISSER** | « any property » d'une définition **protocole** — juste sous la clause. Local, informatif. |

**Alignement proposé (A/B), registre informatif conservé :**
- A *avant* : « Its scope is the set of architectural constraints to which the **entire corpus** is subject. »
  → A *après* : « Its scope is the set of architectural constraints to which the **protocol** is subject; the
  documentary corpus is governed by OCR-000 through OCR-005 (see **Scope**). »
- B *avant* : « They state the constraints to which the **corpus, including this Record,** is subject. »
  → B *après* : « They state the constraints to which the **protocol** is subject; this Record, as a
  documentary artefact, is itself governed by OCR-000 through OCR-005. »

## 4 — La version : MAJOR confirmé, **avec un constat sur le prédécesseur Draft**

- **Incompatible → MAJOR, confirmé.** `OCR-005:32` « MAJOR — a change to normative meaning that is **not
  backward-compatible** ». Le retrait de portée **renverse** une obligation documentaire : *avant*, C
  interdisait le champ `Status` documentaire ; *après*, `OCR-005` l'**exige**. Un système conforme à
  « pas de champ Status » tombe sous une règle **opposée** → **non rétrocompatible** → **MAJOR**, pas MINOR.
- **⚠️ Constat à trancher — le prédécesseur est un Draft, pas un Normative.** OCR-006 est **`Status: Draft`,
  v1.0.0** (jamais promu). Or le modèle de supersession d'`OCR-005:40/55` (« Normative → Superseded ; prior
  version preserved ») **présuppose un prédécesseur Normative**. Il n'y en a pas. Donc :
  - La bascule `v1.0.0 → v2.0.0` **marque** le changement incompatible (fidèle à la classification OCR-005),
    et **Version History** consigne les deux ;
  - mais « v1 **superseded** et préservé » s'applique **faiblement** : v1.0.0 était un **Draft**, préservé
    comme Draft initial en Version History, **non** comme un Normative supersédé. On ne supersède pas ce qui
    n'a jamais été Normative.
  - **Alternative possible** (à votre arbitrage) : rester en **v1.x Draft** (révision de Draft, `OCR-005` ne
    scelle que le *published normative meaning*), et n'atteindre v2.0.0/Normative qu'à la promotion. **Je ne
    tranche pas** — c'est une décision de gouvernance sur la numérotation d'un Draft amendé.

## 5 — Grounding & approbation de l'amendement lui-même

- **OCR-006 n'a AUCUNE section machine-facing.** Lecture intégrale : Introduction, principes (Canonical
  Statement / Motivation / Normative Consequences / Notes), Conclusion, Version History. **Pas** de
  `JSON-LD`, `Machine Interpretation`, wire formats. Son `Review Status` = **« Pending editorial review »**
  (piste éditoriale, pas machine).
- **Donc `OCR-000:51` (grounding = diff des sections machine-facing) NE S'APPLIQUE PAS.** La v2.0.0 **n'exige
  pas** de diff doc↔code. Sa promotion à Normative exige **revue éditoriale + approbation Opus X**
  (`OCR-000:47`, `OCR-005:39`) — cohérent avec son `Review Status`.

## 6 — §295 (et §291) : « SHALL » informatif → **corriger, puisque la Conclusion est déjà touchée**

- `§295` et `§291` vivent dans **`## Conclusion` (informative)** mais emploient **« SHALL »** → **misuse**
  `OCR-002:38` (« informative passages MUST NOT imply normativity »).
- L'alignement de **B** touche déjà la Conclusion → **corriger le misuse au même passage** est cohérent, à
  coût marginal nul. **Proposition :** reformuler `§291`/`§295` en **registre informatif**, en **renvoyant à
  la source normative réelle** — la discipline « changement = nouvelle version, jamais par précédence » est
  déjà **normative** dans `OCR-005:46` / `OCR-000:59`. Exemple :
  - §295 *avant* : « the inconsistency **SHALL** be resolved through the … amendment process rather than by
    interpretative precedence. »
  - §295 *après* (informatif) : « an inconsistency **is** resolved through the normative amendment process
    (OCR-005), never by interpretative precedence — this Record claims no precedence over another. »
- *(Rappel de portée : la substance de §295 — « pas de précédence, on amende » — n'est PAS ce qui rend
  D-011/D-014 opposables ; c'est `P10:279` (normatif) + `OCR-005`. Corriger le misuse ne change donc rien à
  la séquence.)*

## Récapitulatif des touches (étape 1b, sur approbation)

| Cible | Type | Nature |
|---|---|---|
| Nouvelle `## Scope (Normative)` | **ajout normatif** | régit C et G |
| P8 — Normative Consequence de renvoi vers OCR-005 | **ajout normatif** | acte propre sur E |
| A (§27), B (§293) | **édition informative** | cohérence de cadrage |
| §291, §295 | **édition informative** | corrige le misuse OCR-002:38 |
| En-tête `Version` + `Version History` | **métadonnée** | v2.0.0 (constat point 4) |
| C `:250`, G `:139`, D, F, H | **inchangés** | bornés/lus par la clause |

**Rien écrit dans OCR-006. En attente de revue avant l'étape 1b.**
