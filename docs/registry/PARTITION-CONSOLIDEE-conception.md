`docs/registry/PARTITION-CONSOLIDEE-conception.md` · état consolidé (partition Phase 1) · 2026-07-25 versée en `f1add85`

# Partition consolidée après correction 006 + D-024 (112 → Phase 2) — MESURÉ

> **Rien écrit dans les Records.** Les **deux corrections sont APPLIQUÉES** (garde `promotionDebt` verte) :
> `c82f8f7` (retrait 006) · `8bb0f2b` (D-024, ajout 112). Chaque nombre ci-dessous est **tracé à sa source** —
> aucun chiffre supposé.

## 1 — Les quatre nombres, source par source

| # | Nombre | Valeur | Source (mesurée) |
|---|---|---|---|
| **Corpus total** | fichiers `OCR-\d+_*.md` du registre | **36** | `ls docs/web/registry-import/OCR-100/` = 36 · `_manifest.json` `file_count` = 36 (concordants) |
| **HORS_PHASE_1** | après les deux corrections | **4** | `promotionDebt.test.ts:24` = `{OCR-100, OCR-112, OCR-114, OCR-123}` |
| **Phase 1** | corpus − HORS_PHASE_1 | **32** | `36 − 4` — assertion `promotionDebt` verte (`toBe(32)`) |
| **007/008/009 ∈ Phase 1** | point D | **oui** | absents de `HORS_PHASE_1` → dans Phase 1 (3 fichiers présents) |

**HORS_PHASE_1 exhaustif = `{OCR-100, OCR-112, OCR-114, OCR-123}`** — Phase 2/3 :
- **OCR-100** — ombrelle (mixte G0/G1) + dette ouverte.
- **OCR-112** — **D-024** : bloqué GAP-F1-01, rejoint 114.
- **OCR-114** — bloqué GAP-F1-01/02 + dette ouverte.
- **OCR-123** — Phase 2 (D-005), exception cité≥1.

**Le swap qui garde 32 :** 006 **sort** (Phase 1), 112 **entre** (Phase 2) → HORS reste **4**, Phase 1 reste
**32**. *(Le « 31 » évoqué comptait 006 hors alors qu'il est dedans — écarté par la mesure, comme le « 008 »
de la plage l'avait été.)*

## 2 — Cohérence retrouvée : l'ordre D-021 et la partition s'accordent enfin

Après les deux corrections, l'ordre D-021 **et** la partition comptent le **même** ensemble de 32 :
`{000,005}`(2) → `006`(1) → `{001-004}`(4) → `{007,008,009}`(3) → **22 concepts** (23 − 112, sorti par D-024)
= **32**. *(Avant : l'ordre comptait 33 en incluant 006, la partition 32 en l'excluant — l'écart de 1 était
exactement 006. Il est levé.)*

## 3 — Point 3 : Phase 1 **PAS** nette de GAP — constat honnête

**006 entre sans GAP** — ce **n'est pas** un 3ᵉ 112. *(OCR-006 est méta, sans rapport de grounding, dans aucun
GAP ouvert.)* **Mais la Phase 1 n'est PAS nette de tout GAP** — après les deux corrections, **quatre** Records
restent **Phase-1 + GAP ouvert** :

| Record | GAP ouvert | Registre | Phase |
|---|---|---|---|
| **111** | GAP-F1-02 (source-FK `ON DELETE RESTRICT`) | BACKLOG CODE | 1 |
| **101** | GAP-3 pilote (lien Passport 1:1 non imposé) | BACKLOG CODE | 1 |
| **110** | GAP-3 pilote **+** GAP-2 (cardinalité 1 critère) | BACKLOG CODE + **OCR-REV** | 1 |
| **113** | GAP-F1-03 (keyed-HMAC ≠ SHA-256) | **OCR-REV** (à confirmer) | 1 |

**Chacun est le même cas que 112** (Phase-1 mais non-prêt, préparation ✗gap) → **même arbitrage** : soit le GAP
se lève **avant l'étape 8** (chantier code, ou OCR-REV pour 110/113), soit le Record **descend en Phase 2**.
**Distinct de D-024** — je remonte, je ne tranche pas. *(Le GAP-1 « exemples JSON » — OCR-REV mineur, large —
n'est pas compté ici comme bloqueur ; à qualifier séparément.)*

## 4 — Point 4 : D, F, G confirmés

- **D — 007/008/009 placés :** ✅ le D-021 **gravé** (DECISIONS-LOG ligne 37) porte
  « → `{007,008,009}` (régime, strate 2) » **après** `{001-004}`. Placement présent. *(Reste la sync des
  récitations d'aval — étape 5 ligne 651, étape 8 ligne 654 — sur la ligne 37 ; mécanique, non-décision. Avec
  D-024, l'étape 8 doit aussi **retirer 112** de sa strate concepts.)*
- **F — liste réalignée :** ✅ machine-facing **sans cœur Conforme (G1-dominant) = 11** :
  `105, 106, 107, 108, 109, 117, 118, 119, 121, 122, 123` (SYNTHÈSE §2). L'ancienne `101,104,106,107,108,109`
  était fausse (101/104 ont un cœur Conforme ; manquaient 105,117,118,119,121,122,123). Phase 1 : les **10**
  sauf 123 (Phase 2).
- **G — régime cohérence documentaire :** ✅ 007/008/009 vérifiés **doc↔tooling**, pas grounding protocole
  (doc↔code). Hors des « machine-facing à grounder ». Trois régimes de préparation distincts (protocole ·
  documentaire · éditorial).

---

**État consolidé :** corpus **36** · HORS_PHASE_1 **4** `{100,112,114,123}` · **Phase 1 = 32** (mesuré, garde
verte) · 007/008/009 **dans** Phase 1. Ordre D-021 ↔ partition **réconciliés**. **Phase 1 pas nette de GAP :
101, 110, 111, 113 restent à arbitrer** (même cas que 112). D/F/G confirmés. **Rien écrit dans les Records.
RATIF-001 intact.**
