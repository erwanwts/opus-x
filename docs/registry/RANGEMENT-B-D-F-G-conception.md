`docs/registry/RANGEMENT-B-D-F-G-conception.md` · conception (grille étape 8, rangement mesuré) · 2026-07-25 *(hash : voir commit)*

# B mesuré · D placé · F réaligné · G confirmé — CONSTATS BRUTS (pour arbitrage)

> **Rien écrit dans les Records, rien construit.** Suite du tri préparation/phase
> ([[GRILLE-DEUX-FAMILLES-conception]]). **112 attend D-024** (non appliqué). **E différée** (inscrite ouverte).

## B — OCR-006 : le critère mal réglé est **HORS_PHASE_1** (chronologie)

Les deux instruments de phase et leurs dates :

| Instrument | Commit · date | Dit de 006 |
|---|---|---|
| **HORS_PHASE_1** (partition D-005) | **`48be4cd`** · **2026-07-24** | 006 **hors Phase 1** *(classé « Phase 3, jamais relu, cité par 0 » — avant amendement)* |
| **Ordre D-021** (ligne 37) | **`bfc888a`** · étape 1 (**après** `48be4cd`) | 006 **promu 2ᵉ** *(amendé, portée protocole → pivot)* |

**Mesure :** `48be4cd` **précède** `bfc888a`. La partition porte la classification **Phase-3 de 006
*avant* son amendement** ; D-021 (postérieur) l'**amende et le promeut 2ᵉ**. La partition **n'a pas été mise
à jour** quand 006 est devenu pivot. **Le mal-réglé est `HORS_PHASE_1`.**

**Confirmation interne à D-021 :** sa propre ligne le montre — l'**ordre** compte **33** Records (inclut 006),
la queue dit **« promotion 29→32 »** (32 = `promotionDebt`, **exclut** 006). L'écart = **exactement 006**.

**⇒ Constat : 006 est Phase 1** (promu 2ᵉ, D-021, `OCR-000:47` : « amender **puis promouvoir** »). Le retirer
de `HORS_PHASE_1` **change la partition** (32 → 33 avant D-024) — **matière D-005, donc décision.** *(Note :
006 n'a **aucune dette ouverte** — sa présence dans `HORS_PHASE_1` est **inerte** pour le critère dette ; elle
ne fausse que la **sémantique de phase**.)* **Je rends ; l'Architecte tranche.**

## D — OCR-007/008/009 : **DÉJÀ placés** (auto-correction de ma table)

**Le D-021 gravé (ligne 37, texte exact) place déjà les trois :**

> « `{OCR-000, OCR-005}` → `OCR-006` → `{001, 002, 003, 004}` → **`{007, 008, 009}` (régime, strate 2)** →
> 23 concepts »

C'est **exactement** le placement demandé (strate méta, après {001-004}). **Rien à étendre.** Mon flag « D »
(007/008/009 non placés) venait d'un **D-021 périmé** — le résumé de compaction récitait
« {000,005}→006→{001-004}→23 concepts » **sans la strate régime**. Je le corrige : **l'ordre canonique est
complet.**

**⚠️ Reste une incohérence INTERNE au DECISIONS-LOG** (à synchroniser, pas une décision) : la **ligne 37**
(D-021) porte l'ordre **complet** (avec {007,008,009}, « 29→32 »), mais la **ligne 654 (étape 8)** et la
**ligne 651 (étape 5)** portent des listes **périmées** (« les 29 », ordre **sans** {007,008,009} ; « grounder
les 6 : 101,104,106,107,108,109 »). Les récitations d'aval n'ont pas suivi la ligne canonique. **À aligner sur
la ligne 37.**

## F — la liste « 6 machine-facing non groundés » : FAUSSE, et le cadre est obsolète

**Deux constats :**

**(1) Le cadre « à grounder » est périmé.** Les **32** Records ont **déjà** leur rapport (OCR-GROUND-001,
SYNTHÈSE @`b3aec9e`). Aucun n'est « non grouné ». La bonne catégorie n'est plus « à grounder » mais
**« G1-dominant » (Normative, cœur conforme **absent**, implémentation à venir — badge « planifié »)**.

**(2) La liste `101,104,106,107,108,109` est fausse** (SYNTHÈSE §2, mesure réelle) :

| Ancienne liste | Verdict mesuré | Statut |
|---|---|---|
| 101 | **G0 + G1** (émis/ownership **G0**) — cœur conforme | ✗ **à retirer** |
| 104 | **G0 plein** (Opus ID réel) | ✗ **à retirer** |
| 106, 107, 108, 109 | **G1 dominant** | ✓ corrects |

**Manquants** (G1-dominant, absents de l'ancienne liste) : **105, 117, 118, 119, 121, 122, 123**.

**⇒ Liste réalignée — machine-facing sans cœur Conforme (G1-dominant) = 11 :**
`105, 106, 107, 108, 109, 117, 118, 119, 121, 122, 123`.
*(Phase 1 : les 10 sauf **123** — Phase 2. **112** n'y est **pas** : il a un cœur Conforme, il est bloqué par
un **GAP**, pas par absence de cœur — préparation ≠ même motif.)*

## G — OCR-007/008/009 : régime **COHÉRENCE DOCUMENTAIRE**, pas grounding protocole — CONFIRMÉ

- **Ce qu'ils gouvernent :** la couche **documentaire** (intégrité, transmission, approbation) — **pas** le
  protocole. Leur vérification est un contrôle **doc↔tooling** (l'outil produit-il bien le checksum / le
  chemin+hash / la forme d'approbation décrite ?), **jamais** un diff **doc↔code** protocolaire.
- **⇒ Ils ne sont PAS dans la population « machine-facing à grounder »** (ni dans les 11 de F). Ils ont leur
  **propre régime** : `cohérence documentaire requise` (état 2 du champ D-017). Confirmé.
- **Conséquence G (couverture) :** le désalignement « 32 grounding ≠ 32 Phase-1 » se **referme** — 007/008/009
  n'ont pas à être grounés au sens protocole ; leur « prêt » est le contrôle doc↔tooling. Le grounding
  protocole couvre {100-125} ; le régime doc couvre {007,008,009} ; les éditoriaux {000-005} sont G0-en-process.
  **Chaque famille a son instrument de préparation** — plus de trou, juste **trois régimes distincts**.

## E — différée (inscrite ouverte)

Le **seuil de « prêt » d'un G1** (un Record Normative-mais-non-implémenté est-il promouvable avec badge, ou
bloqué ?) est une **question de préparation, non urgente** — rien n'est promu avant l'étape 8. **Inscrite
ouverte** au DECISIONS-LOG (à traiter **avant** l'étape 8). Elle conditionne le sort des **11** Records de F.

---

**Bilan du tri :** **B** → `HORS_PHASE_1` mal réglé (006 est Phase 1 ; retrait = décision D-005). **D** → déjà
placés (ma table était périmée ; sync interne du log requise). **F** → liste réalignée à **11** G1-dominant
(cadre « à grounder » obsolète). **G** → trois régimes de préparation distincts, plus de trou. **E** → ouverte,
avant étape 8. **112** → attend **D-024** (Phase 1 reste 32 d'ici là). **Rien écrit dans les Records. RATIF-001
intact.**
