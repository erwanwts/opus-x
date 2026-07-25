`docs/registry/GRILLE-DEUX-FAMILLES-conception.md` · conception (grille étape 8, révision) · 2026-07-25 *(hash : voir commit)*

# La grille en DEUX FAMILLES + cohérence des 36 revue + GAP lié aux phases — CONCEPTION (pour arbitrage)

> **Rien écrit dans les Records, rien construit.** Révision de [[COHERENCE-INTER-CRITERES-36-conception]] sous la
> distinction **préparation / phase**. Aucun critère changé — **rangés**. Les fausses contradictions tombent ;
> les vraies se reclassent.

## 0 — La distinction qui range tout

Deux familles orthogonales. Un Record peut être **PRÊT et HORS PHASE**, sans contradiction :

| Famille | Question | Critères | Propriété de… |
|---|---|---|---|
| **PRÉPARATION** | « Ce Record est-il **prêt** ? » | grounding (C1) · GAP (C2) · cité≥1 (C4) · empreinte (C5) · invariants (C6) · **dette-ouverte** | …du **Record** |
| **PHASE** | « Ce Record est-il dans le **lot promu maintenant** ? » | **appartenance de phase** (ex-`HORS_PHASE_1`) · ordre D-021 | …du **lot** |

La grille étape 8 promeut un Record ssi : **PRÊT** (toute la préparation passe) **ET** **phase == lot courant**.
La fausse contradiction 114 venait de croiser une réponse de préparation (« pas prêt : GAP ») avec une réponse
de phase (« Phase 2 ») comme si elles s'excluaient. Elles se **cumulent**.

## 1 — Phase de OCR-112 : MESURÉE = Phase 1 (le cas urgent)

`HORS_PHASE_1 = {006, 100, 114, 123}` — **112 n'y figure pas → 112 est Phase 1**, et placé **S4** de l'ordre
D-021. Donc :

- **préparation :** **PAS prêt** — GAP-F1-01 (supersession absente) ouvert.
- **phase :** **lot courant** (Phase 1).

⇒ **112 est dans le lot qu'on promeut à l'étape 8, mais non promouvable.** Ce n'est pas une explication de
phase (comme 114) — c'est un **obstacle réel au lot courant**. **DÉCISION À REMONTER (non tranchée) :**
- **(i)** lever GAP-F1-01 **avant** l'étape 8 — coder la supersession (chantier code séparé, hors WEB-003) ; **ou**
- **(ii)** **descendre 112 en Phase 2** (rejoindre 114, dont c'est déjà la raison d'être).

*(Note : 112 et 114 partagent GAP-F1-01 ; les traiter différemment — 112 Phase 1, 114 Phase 2 — est
précisément l'incohérence C. La lever, c'est mettre 112 et 114 dans la même phase, OU assumer que 112 est prêt
autrement que 114. À trancher.)*

## 2 — GAP-PROMOTION lié aux phases (registre révisé)

Le registre porte désormais la **phase du Record bloqué**, pour que GAP et table des phases pointent le même
fait :

**`## GAP ouverts`**

| GAP | Records bloqués (phase) | Condition de levée | Source | État |
|---|---|---|---|---|
| **GAP-F1-01** | `OCR-112` **(Phase 1 — voir §1)** · `OCR-114` **(Phase 2)** | supersession codée | rapport F1 | ouvert (BACKLOG CODE) |
| **GAP-F1-02** | `OCR-111` **(Phase 1)** · `OCR-114` **(Phase 2)** | `ON DELETE RESTRICT` vers `mission_*` codé | rapport F1 | ouvert (BACKLOG CODE) |

Et **réciproquement**, dans la table des phases : **114 (Phase 2)** porte la mention *« bloqueurs : GAP-F1-01,
GAP-F1-02 »* — la phase **explicitée par** ses GAP. *(La levée d'un GAP redevient un pré-requis de promotion,
que le Record soit Phase 1 — bloqué maintenant — ou Phase 2 — bloqué à son tour.)*

*(GAP-F1-03 (113) est OCR-REV, pas BACKLOG CODE : il ne va pas ici mais au registre OCR-REV — un défaut d'OCR,
pas un manque d'implémentation. À distinguer dans la population initiale du registre.)*

## 3 — Les 36 rangés en deux familles (table revue)

**PRÉPARATION** (prêt ?) : **P** = prêt · **✗gap/✗dette/✗G1?** = pas prêt, motif. **PHASE** : **1** / **2** /
*ombrelle*. Empreinte + invariants = **P** partout (uniformes, colonne omise).

| OCR | C1 grounding | C2 GAP | C4 cité | dette | → **PRÉPA** | phase | ordre |
|---|---|---|---|---|---|---|---|
| 000 001 002 003 004 005 | G0 | — | cité | — | **P** | 1 | S1/S3 |
| 103 104 120 124 | G0 | — | cité | — | **P** | 1 | S4 |
| 102 115 116 125 | G0+G1 | — (GAP-1 mineur) | cité | — | **P** *(si G1 promouvable — E)* | 1 | S4 |
| **105 106 107 108 109 119** | **G1** | — | cité | — | **✗G1 ?** *(E)* | 1 | S4 |
| **117 118 121 122** | **G1** (+G4) | — | cité | — | **✗G1 ?** *(E)* | 1 | S4 |
| 101 | G0+G1 | GAP-3 pilote | cité | — | **✗gap** | 1 | S4 |
| 110 | G0+G3/G1 | GAP-2 (G3→REV) | cité | — | **✗gap** (defect OCR) | 1 | S4 |
| 111 | G0+G1 | **GAP-F1-02** | cité | — | **✗gap** | **1** | S4 |
| **112** | G0+G1 | **GAP-F1-01** | cité | — | **✗gap** | **1 ⚠** | S4 |
| 113 | G0+G3-cand | GAP-F1-03 (REV) | cité | — | **✗gap** (à confirmer) | 1 | S4 |
| **006** | *non grouné* | — | cité | — | **P ?** | **HORS ⚠B** | **S2** |
| **007 008 009** | *non grouné* | — | cité / 009 exc. | — | *cohér. doc requise* | **1 ⚠D** | **absent** |
| **100** | mixte | — | cité | **✗dette** | **✗dette** | 2 | *ombrelle* |
| **114** | G0+G1 | GAP-F1-01/02 | cité | **✗dette** | **✗gap+dette** | **2** | absent |
| **123** | G1 | — | exc. | — | **✗G1 ?** | 2 | absent |

## 4 — A → G reclassés sous la distinction

| # | Statut | Nature |
|---|---|---|
| **A** (114) | **DISSOUT** | préparation (✗gap) **+** phase (2) se **cumulent** — le GAP *explique* la Phase 2. Pas de contradiction. |
| **C** (GAP-F1-01 sur 112·114) | **DISSOUT** | un même GAP (préparation) touche deux Records de phases différentes. Légitime. Ne survit que l'urgence **112** (§1). |
| **G** (« 32 » collision) | **EXPLIQUÉ** | grounding-32 = population de **préparation** ({000-005,100-125}) ; Phase-1-32 = population de **phase**. Familles différentes ⇒ ensembles différents. **Résidu réel :** la préparation (grounding) doit **couvrir les membres de la phase** — 007/008/009 sont en Phase 1 mais **non grounés** (trou de préparation, pas de phase). |
| **B** (006) | **RÉEL — intra-PHASE** | `HORS_PHASE_1` **et** ordre D-021 sont **tous deux** des critères de phase, et ils **se contredisent** sur 006 (exclu vs promu S2). Deux instruments de phase désaccordés — à réconcilier. |
| **D** (007/008/009) | **RÉEL — intra-PHASE** | Phase 1 **et** ordre D-021, tous deux phase : l'ordre **omet** 3 membres de Phase 1. Ordre incomplet. |
| **E** (G1 promouvable ?) | **RÉEL — intra-PRÉPARATION** | définit le **seuil de prêt** du critère grounding. Aucun contenu de phase. Le plus profond : ~11 concepts G1 en dépendent. |
| **F** (liste « 6 à grounder ») | **RÉEL — intra-PRÉPARATION** | donnée de grounding provisoire fausse vs mesuré (104=G0, 101=G0+G1, 105 omis). |

**Bilan.** La distinction **dissout A et C** (les deux portaient sur 114/le GAP), **explique G**, et **range le
reste** : **B, D** = deux critères de *phase* qui se contredisent (006 ; 007/008/009) ; **E, F** = définition/
donnée d'un critère de *préparation* (seuil G1 ; liste grounding). Aucune fausse contradiction ne subsiste ;
**le seul cas opérationnel urgent est 112** (Phase 1 + pas prêt).

---

**Rien écrit, rien construit.** Restent à trancher, désormais bien rangés : **112** (§1 : lever le GAP ou
descendre en Phase 2) · **B** (006 : phase vs ordre) · **D** (placer 007/008/009 dans l'ordre) · **E** (un G1
est-il prêt ?) · **F** (réaligner la donnée grounding) · **G** (grounder 007/008/009). RATIF-001 intact.
