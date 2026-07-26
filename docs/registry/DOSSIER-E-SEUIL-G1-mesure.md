`docs/registry/DOSSIER-E-SEUIL-G1-mesure.md` · dossier mesuré (E, pour l'Architecte) · 2026-07-26 *(hash : voir commit)*

# Dossier E — le seuil de « prêt » d'un G1 : MESURE BRUTE (pas de proposition de seuil)

> **Je mesure, je ne tranche pas.** E reste la décision de l'Architecte. Aucun seuil proposé. **Rien écrit dans
> les Records, aucun artefact de promotion, RATIF-001 intact.**

## 1 — La définition opérante d'un G1 : EXTRA-CORPUS, et en tension avec le corpus ratifié

**« G1 » n'existe pas dans le corpus normatif.** Mesuré : les `.md` des 36 Records ne contiennent **jamais**
`G0`–`G4`, « grounding level », « Backlog Code », « planifié » (le grep n'a touché que des `.pdf` binaires).
La gradation G0–G4 vit **uniquement** dans les rapports de grounding `docs/web/OCR-GROUND-001-*` — une
**classification d'audit « rétro-appliquée »**, pas un concept du protocole.

**Définition d'audit (source : `OCR-GROUND-001-rapport-F1`:15) :**
> « **G1** — **Implémentation en retard** (protocole = cible, code incomplet) → **BACKLOG CODE**. »
Ce qui le sépare des voisins (même source, :14-18) : **G0** = conforme ; **G2** = code conforme mais à
améliorer ; **G3** = le **protocole** est ambigu/incohérent (OCR-REV) ; **G4** = gouvernance non tranchée.
Principe fondateur du rapport (F1:8) : *« un concept peut être **Normative ET non encore implémenté**, à
condition que ce soit explicitement indiqué et classé Backlog Code »* (+ badge « planifié » au rendu, F1:21).

**Le corpus, lui, ne connaît que le BINAIRE grounded / pas-grounded — et il est RATIFIÉ (OCR-000, RATIF-001).**
`OCR-000:42-43` : *« Draft — authored but **not yet grounded**; not authoritative » · « Normative — **grounded
(agrees with implementation)** and approved; authoritative »*. Et surtout **`OCR-000:49` « The Grounding Rule
(Normative) »**, verbatim :
> - « An OCR that **contradicts the implementation MUST NOT be Normative**. »
> - « Where documentation and implementation **disagree**, the disagreement **MUST be resolved** (by correcting
>   whichever is wrong) **before promotion**; the Registry **MUST NOT paper over it**. »

**⇒ La tension, mesurée (c'est le cœur de E) :** un G1 = « code incomplet » = **doc et implémentation en
désaccord**. `OCR-000:49` (Normative, **ratifié**) dit que **tout désaccord MUST être résolu avant promotion**
et qu'on **NE PAPERISE PAS** (« MUST NOT paper over it »). Le **badge « planifié »** de l'audit **EST**
exactement un « paper over ». Les deux règles **ne peuvent pas coexister** : le corpus ratifié **bloque** un G1
de la Normative ; la règle d'or de l'audit (prose **extra-corpus**) l'**autorise** avec un badge. **E tranche
laquelle gouverne.** *(La définition normative est donc **explicite** — OCR-000:49 ; c'est la règle d'or de
l'audit qui la contredit, et elle n'a aucun rang normatif.)*

## 2 — Les états OBSERVABLES d'un G1 vers l'étape 8 (mesurable aujourd'hui, pas souhaité)

| Signal | Mesurable aujourd'hui ? | Pour les 4 |
|---|---|---|
| Empreinte / sceau (`manifest.attestation`) | ✅ **test vert** | passe |
| « cité ≥ 1 » (`citations`) | ✅ **test vert** | passe |
| Aucune dette Phase 1 (`promotionDebt`) | ✅ **test vert** | passe |
| Invariants de structure / projection (`recordPage`, `markdown`) | ✅ **test vert** | passe |
| **Verdict de grounding (G-level)** | ❌ **PROSE** (rapports OCR-GROUND-001, jugé à la main) — aucun test | G1 (prose) |
| **État du GAP (ouvert/clos)** | ❌ **PROSE** + registre `GAP-PROMOTION` **conçu, non construit** | ouvert (prose) |
| Champ `Status` | ⚠️ Draft, **inerte** (mesuré D-023) | Draft |

**⇒ Fait dur :** par la **suite de tests actuelle, les quatre sont « prêts »** — tout est vert. Ce qui les
bloque (grounding G1 + GAP ouvert) **n'est adossé à aucun test** : il vit en **prose** dans les rapports. Le
seul instrument machine du blocage — le registre `GAP-PROMOTION` — est **conçu, pas construit**. Donc
aujourd'hui « ce G1 est-il prêt ? » n'a **pas de réponse testable** sur la dimension qui compte ; la machine
dit *prêt*, la prose dit *non*.

## 3 — Où tombent les quatre, et ce qui manque EXACTEMENT

| Record | GAP | Registre | Ce qui manque exactement |
|---|---|---|---|
| **101** Passport | GAP-3 (lien 1:1 non imposé) | **BACKLOG CODE** | **Code absent** : `passport_update_id UNIQUE` + projection reliant l'affichage Sprint-1 au fact-store Sprint-2 (imposer le 1:1). Rien à corriger dans le Record. |
| **110** Evidence | GAP-2 (cardinalité) **+** GAP-3 | **OCR-REV** + BACKLOG CODE | **Record à corriger** : OCR-110 dit « MAY reference multiple criteria » + exemple à 4, le code impose **exactement 1** → **contradiction** doc↔code (à reformuler, `OCR-110-REV-01`). **+ code** : lien Passport. |
| **111** Evidence Source | GAP-F1-02 (source-FK) | **BACKLOG CODE** | **Code absent** : `ON DELETE RESTRICT` vers les tables `mission_*` (intégrité référentielle source). Rien à corriger dans le Record. |
| **113** Evidence Integrity | GAP-F1-03 (HMAC) | **OCR-REV à CONFIRMER** | **Nature non tranchée** : soit **Record à corriger** (OCR-113 conflate intégrité SHA-256/JCS et auth-transport HMAC → reformuler), soit « cible implémentée autrement » → alors BACKLOG CODE. À trancher (propreté doc, plus un bloqueur de partition — D-025). |

**Deux natures distinctes de « pas prêt » :** **101, 111** = *code en retard* (le Record est juste, le code
rattrape) ; **110, 113** = *Record faux/ambigu* (le texte lui-même doit changer). `OCR-000:49` les traite
**pareil** (« correcting whichever is wrong »), mais l'instrument diffère : coder vs amender l'OCR.

## 4 — Précédent : AUCUN. C'est la première fois.

Mesuré : **les 36 Records sont `lifecycle_status: Draft`** (manifeste, 36/36) · **aucun artefact `PROMO`**
(série vide) · **étape 8 non lancée** · `RATIF-001` ne déclare Normative que **`{OCR-000, OCR-005}`** — des
méta de gouvernance, **G0-en-process, sans GAP de grounding**.

**⇒ Aucun Record n'a jamais franchi l'étape 8. Aucun G1 n'a jamais été promu avec un GAP ouvert — parce
qu'aucun Record n'a jamais été promu tout court.** Il n'existe **pas de précédent** : E se pose pour la
**première fois**, l'espace de décision n'est contraint par aucun cas antérieur. Le seul « fait Normative »
existant ({000,005} par RATIF) est **hors du sujet** (méta, sans grounding G1).

---

**Résumé pour l'Architecte :** (1) « G1 » est **extra-corpus** ; la règle **normative ratifiée** `OCR-000:49`
dit « désaccord doc↔code résolu **avant** promotion, **ne pas paperiser** » — la règle d'or de l'audit (badge)
la **contredit** sans rang normatif. (2) La suite dit les 4 **prêts** ; le blocage est **en prose**, non
testé. (3) 101/111 = *code en retard* · 110/113 = *Record à corriger*. (4) **Aucun précédent** — première
fois. **Aucun seuil proposé — c'est votre décision.**
