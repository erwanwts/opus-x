`docs/registry/COHERENCE-INTER-CRITERES-36-conception.md` · conception (grille étape 8) · 2026-07-25 versée en `01e13a1`

# Cohérence inter-critères des 36 Records + garde du registre GAP — CONCEPTION (pour arbitrage)

> **Rien écrit dans les Records, rien construit.** Passe de vérification demandée avant d'écrire le champ
> Grounding. Je **montre** les contradictions ; **je ne corrige pas** — l'Architecte tranche.

## 1 — La garde du registre GAP (conçue)

Un test `lib/registry/gapPromotion.test.ts` (à écrire) assère, en lisant `docs/registry/GAP-PROMOTION.md` :

- **(a) table parsable** — même exigence qu'à Q2 pour les dettes : section bornée `## GAP ouverts`, lignes
  `|`-délimitées, ≥ 5 colonnes ; sinon **throw** (la section introuvable = échec bruyant, comme `promotionDebt`).
- **(b) tout Record bloqué référence un OCR existant** — chaque `OCR-\d+` de la colonne « Records bloqués »
  doit appartenir au corpus (`readdirSync(OCR-100)` / manifeste). Un id fantôme → échec.
- **(c) parité état↔commit** — un GAP **clos** porte un **hash de levée** (`/[0-9a-f]{7,40}/`) ; un GAP
  **ouvert** n'en porte **pas**. L'un sans l'autre → échec.
- **Prouvé par mutation :** (b) un Record bloqué inexistant (`OCR-999`) → échec ; (c) un GAP clos sans commit
  → échec. Deux sous-tests dédiés, comme la garde `recordPage:132`.

## 2 — Tableau de cohérence : les 36 Records × 7 critères

**Critères 5 (empreinte/sceau) et 6 (invariants de structure) passent UNIFORMÉMENT** sur les 36 (checksum
présent au manifeste, invariants structurels tenus) — ils ne discriminent aucun Record, omis de la grille.
Restent les 5 critères discriminants. Légende : **C1** grounding (verdict SYNTHÈSE mesuré) · **C2** GAP de
promotion (F1 + pilote) · **C3** ordre D-021 · **C4** cité≥1 · **C7** partition/dette.

| OCR | C1 grounding | C2 GAP | C3 ordre D-021 | C4 | C7 partition | ⚠ |
|---|---|---|---|---|---|---|
| 000 | G0 (ratifié) | — | **S1** | cité | Phase-1 | — |
| 001 | G0 | — | S3 | cité | Phase-1 | — |
| 002 | G0 | — | S3 | cité | Phase-1 | — |
| 003 | G0 | — | S3 | cité | Phase-1 | — |
| 004 | G0 | — | S3 | cité | Phase-1 | — |
| 005 | G0 (ratifié) | — | **S1** | cité | Phase-1 | — |
| **006** | *non grouné* (amendé) | — | **S2 (promu)** | cité | **HORS Phase-1** | **B** |
| **007** | *non grouné* (cohér. doc) | — | **NON PLACÉ** | cité | Phase-1 | **D** |
| **008** | *non grouné* (transmission) | — | **NON PLACÉ** | cité | Phase-1 | **D** |
| **009** | *non grouné* (cohér. doc) | — | **NON PLACÉ** | **EXCEPTION** (orphelin attendu) | Phase-1 | **D** |
| **100** | Mixte G0/G1 | — | non placé (ombrelle) | cité | **HORS** + **dette ouverte** | *déféré cohérent* |
| 101 | G0 + G1 | GAP-3 pilote | S4 | cité | Phase-1 | *pilote* |
| 102 | G0 + G1 | — | S4 | cité | Phase-1 | — |
| 103 | G0 | — | S4 | cité | Phase-1 | — |
| 104 | **G0 (plein)** | — | S4 | cité | Phase-1 | **F** |
| **105** | **G1** (moteur absent) | — | S4 | cité | Phase-1 | **E** |
| **106** | **G1** | — | S4 | cité | Phase-1 | **E** |
| **107** | **G1** | — | S4 | cité | Phase-1 | **E** |
| **108** | **G1** | — | S4 | cité | Phase-1 | **E** |
| **109** | **G1** | — | S4 | cité | Phase-1 | **E** |
| 110 | G0-core + G3/G1 | **GAP-2 (G3→REV)** + GAP-3 | S4 | cité | Phase-1 | *bloqué (defect OCR)* |
| 111 | G0 + G1 | **GAP-F1-02** (verdict « non promouvable ») | S4 | cité | Phase-1 | *bloqué* |
| **112** | G0 + G1 | **GAP-F1-01** (non-promouvable gravé) + GAP-3 | S4 | cité | Phase-1 | **C** |
| 113 | G0 + G3-cand. | **GAP-F1-03** (OCR-REV à confirmer) | S4 | cité | Phase-1 | *G3 en attente* |
| **114** | G0 + G1 | **GAP-F1-01 + GAP-F1-02** | **NON PLACÉ** | cité | **HORS** + **dette ouverte** | **A, C** |
| 115 | G0 + G1 | (GAP-1 exemples, REV mineur) | S4 | cité | Phase-1 | — |
| 116 | G0 + G1 | (GAP-1) | S4 | cité | Phase-1 | — |
| **117** | **G1** + G4 (entité?) | — | S4 | cité | Phase-1 | **E** + G4 |
| **118** | **G1** + G4 | — | S4 | cité | Phase-1 | **E** + G4 |
| **119** | **G1** | — | S4 | cité | Phase-1 | **E** |
| 120 | G0 | — | S4 | cité | Phase-1 | — |
| **121** | **G1** + G0 | — | S4 | cité | Phase-1 | **E** |
| **122** | **G1** + G0 + G4 | — | S4 | cité | Phase-1 | **E** + G4 |
| **123** | **G1** | — | non placé | **EXCEPTION** | **HORS** | *déféré cohérent* |
| 124 | G0 | — | S4 | cité | Phase-1 | — |
| 125 | G0 + G1 | — | S4 | cité | Phase-1 | — |

*(S1 {000,005} · S2 {006} · S3 {001-004} · S4 = 23 concepts = OCR-100..125 **moins** {100,114,123}.)*

## 3 — Les contradictions mesurées (A → G) — À TRANCHER, non corrigées

**A · OCR-114 — exclu par C7, bloqué par C2 (le cas que tu signales — CONFIRMÉ).**
114 est **HORS Phase-1** (C7 : hors partition, dette ouverte tolérée) **et** sujet de **GAP-F1-01 + GAP-F1-02**
(C2, qui bloque une *promotion*). Si 114 n'est pas dans la population promue, le GAP qui bloque sa promotion
est **sans objet**. Soit 114 **est** candidat (→ l'exclusion C7 est fausse), soit il ne l'est pas (→ le blocage
C2 sur 114 est décoratif).

**B · OCR-006 — exclu par C7, promu par C3 (même forme, sens inverse).**
006 est **HORS Phase-1** (C7) **mais** placé **stratum 2 de l'ordre D-021** (C3 : « {000,005} → **006** →
{001-004} »). D-021 le **promeut** ; la partition l'**exclut**. 006 est-il promu ou non ?

**C · GAP-F1-01 traite ses deux sujets par deux critères différents.**
Le **même** GAP-F1-01 bloque {112, 114}. **112** est Phase-1 (bloqué *en place* par C2) ; **114** est
hors-Phase-1 (déféré *par partition* C7). Une seule cause, deux mécanismes d'exclusion — la partition et le
registre GAP **ne s'accordent pas** sur le traitement de GAP-F1-01.

**D · OCR-007/008/009 — Phase-1 mais absents de l'ordre D-021.**
Les 3 Records du régime sont **Phase-1** (C7, comptés dans les 32) mais **non placés** dans les strates D-021
(qui listent {000,005}→006→{001-004}→23 concepts = 30 Records). Ils sont dans la population promue **sans slot
d'ordre**. *(Ils logent logiquement dans la bande méta, mais l'ordre ne les nomme pas — arbitrage.)*

**E · La règle d'or grounding vs l'état « non fait » — le point le plus profond (≈ 11 Records).**
La SYNTHÈSE et chaque rapport gravent : *« un concept peut être **Normative ET non encore implémenté**
(Backlog) »* — un **G1** est promouvable **avec un badge « planifié »**, le protocole est la cible, le code
rattrape. **Mais** : (i) GAP-F1-01 grave 112/114 (des G1) **non-promouvables** ; (ii) la conception du champ
Grounding (étape 4) pose un état *« protocole requis — non fait → NE PEUT PAS être Normative »*. Les trois ne
coexistent pas : **un G1 est-il promouvable-avec-badge, ou bloqué ?** Si promouvable, pourquoi 112/114
seuls sont non-promouvables ? Si bloqué, les **11 concepts G1** (105,106,107,108,109,117,118,119,121,122,123)
et la philosophie du badge tombent. *(Lecture plausible : ce qui bloque n'est pas « G1 » mais « le mécanisme
CENTRAL décrit est absent » — 112/114 décrivent une transition qui n'existe pas, alors que 105 a son cœur
« Evidence≠Trust » réel. Défendable mais **non encodé** — c'est l'arbitrage de C1.)*

**F · La liste « 6 à grounder » (étape 4) ne correspond pas au grounding mesuré.**
La conception étape 4 nommait « les 6 : 101,104,106,107,108,109 » en *« protocole requis — non fait »*. Or la
SYNTHÈSE mesure **104 = G0 plein** (déjà conforme), **101 = G0+G1**, et **omet 105** (un G1). Et elle grounde
**000–005 en G0-en-process** (grounés), là où la conception les disait *« éditorial — non requis »*. Les états
provisoires du champ **divergent du grounding réel** — à réconcilier avant écriture.

**G · « 32 » est une collision de deux partitions différentes.**
Le grounding couvre **32 Records = {000–005, 100–125}**. La Phase-1 promue = **32 = tout sauf {006,100,114,123}**.
Ces deux « 32 » ne sont **pas le même ensemble** (recouvrement = 28) : le grounding inclut {006,100,114,123}
(hors-Phase-1) et **exclut {007,008,009}** (Phase-1). Donc **C1 n'a aucun verdict pour 007/008/009** (qu'il faut
promouvoir) et **a des verdicts pour {100,114,123,006}** (qu'on ne promeut pas maintenant). Couverture grounding
et besoin de promotion **désalignés aux bords**.

### Ce qui est cohérent (pour cadrer le bruit)
- **Déférés propres :** **100** et **123** sont *uniformément* hors : hors-Phase-1 (C7), non placés (C3),
  123 en exception cité≥1 (C4). Aucune contradiction — Phase-2 assumée.
- **Bloqués propres :** **110** (defect OCR G3 → OCR-110-REV-01), **111** (GAP-F1-02), **112** (GAP-F1-01),
  **113** (G3 à confirmer) : Phase-1 + GAP ouvert = *non promouvables pour l'instant*, exactement ce que la
  grille doit produire. Le critère 2 fonctionne — ce sont A/B/C/D/E/F/G qui achoppent.

## 4 — Revue éditoriale : VOIE (a) confirmée

**Voie (a) — remplacement total.** Le champ **Grounding remplace TOUT `Review Status`**. **Pas** de champ
`Editorial` séparé : ce serait une **seconde source morte** à côté d'un Grounding actif — la mort qu'on refuse.
La conformité éditoriale (OCR-002) reste vérifiée **à l'écriture** (revue humaine), historique dans **git**.

**À inscrire (DECISIONS-LOG) :** *« Si la conformité éditoriale doit devenir un gate un jour, ce sera une
décision explicite avec son instrument — pas `Review Status` ressuscité. »*

---

**Rien écrit, rien construit. J'attends tes arbitrages sur A→G avant d'écrire le champ Grounding.** Les plus
structurants : **E** (un G1 est-il promouvable ?), **A/B/C** (partition vs GAP vs ordre pour 006/112/114),
**G** (réaligner la couverture grounding sur 007/008/009).
