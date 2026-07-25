`docs/registry/GRILLE-ETAPE8-conception.md` · conception (étape 4→8) · 2026-07-25 *(hash : voir commit)*

# Registre des GAP de promotion + grille étape 8 — CONCEPTION (pour revue)

> **Rien écrit dans les Records, rien construit.** Conception, suite à §0 (groundé ≠ promouvable, mesuré sur
> OCR-112). Le GAP bloquant **sort** du champ Grounding — il n'est **ni** un 5ᵉ état **ni** un qualificateur.

## 1 — Le registre de dépendances de promotion (les GAP bloquants)

**Motif :** « Conforme » et « Conforme hors GAP » ont le **même grounding** (le diff doc↔code est fait) ; ils
diffèrent par un **GAP EXTERNE** au grounding (ex. supersession non codée). Coupler les deux dans le champ
`Grounding` mêle deux concerns qui **varient indépendamment**. OCR-112 le prouve : **groundé**, mais bloqué
par un GAP qui **n'est pas un défaut de son grounding**.

- **Où il vit :** `docs/registry/GAP-PROMOTION.md` — un registre documentaire (près de `DECISIONS-LOG`,
  `DETTES-ouvertes`). **Pas un Record**, pas un champ. La grille étape 8 le **lit** (comme `promotionDebt`
  lit la table « Attribution » de `DETTES`).
- **Sa forme — une table bornée à une section `## GAP ouverts` (parsable) :**

| GAP | Records bloqués | Condition de levée | Source | État |
|---|---|---|---|---|
| **GAP-F1-01** | `OCR-112`, `OCR-114` | supersession **codée** (chantier code séparé, hors WEB-003) | rapport `OCR-GROUND-001-F1` | **ouvert** (BACKLOG CODE) |

- **Première entrée : `GAP-F1-01`** (112/114 ← supersession non codée), tirée du rapport F1.
- **Famille :** même nature que l'ordre D-021 et « cité ≥ 1 » — **un critère de la grille étape 8**, pas un
  état de champ. Un GAP se **clôt** (jamais supprimé), avec le commit qui le lève.

## 2 — La grille étape 8 : tous les critères indépendants (aucun ne se perd)

**Un Record n'est promouvable que si TOUS passent** — le grounding n'est qu'un critère (OCR-112 échoue par le
GAP, pas par le grounding) :

| # | Critère | Source / test | Exceptions gravées |
|---|---|---|---|
| 1 | **Grounding Conforme** (champ D-017) | l'attestation D-017 (étape 4) | éditorial → « non requis » (passe) ; 007/009 → cohérence doc |
| 2 | **Aucun GAP de promotion ouvert** | `GAP-PROMOTION.md` (nouveau, ci-dessus) | — |
| 3 | **Ordre D-021 respecté** (portail méta avant concepts) | l'invariant d'ordre (D-020, faisabilité `4ede7f7`) | strates {000,005}→006→{001-004}→{007-009}→concepts |
| 4 | **« cité ≥ 1 »** | `citations.test` | **OCR-123** (Phase-2), **OCR-009** (orphelin attendu → étape 8) |
| 5 | **Empreinte / sceau** | `manifest.attestation` (+ `metaRange`) | — |
| 6 | **Invariants de structure** | `recordPage` / `markdown` / `sitemap` (dérivés) | — |
| 7 | **Aucune dette ouverte** (Phase 1) | `promotionDebt` | HORS_PHASE_1 {100,114,123,006} |

*(1 = grounding ; 2 = le nouveau registre GAP ; 3–4 = ordre + citations ; 5–7 = les critères déjà attestés
— empreinte, invariants, dette. Tous **indépendants**, tous requis.)*

## 3 — Mesure : la revue éditoriale AVANT de remplacer `Review Status`

- **Lue par quoi ?** **Rien** — `grep « Review Status »` sur `lib`/`app`/`scripts` (hors tests) = **vide**.
  Champ **inerte**, comme mesuré à D-017.
- **Porte de promotion ?** **Non** — `OCR-000:47` n'exige que « agreement with the implementation
  (grounding) **and** Opus X approval ». **La revue éditoriale n'est pas une porte.** C'est une **qualité**
  (conformité `OCR-002` : registre, mots-clés, pas de marketing), vérifiée **à l'écriture**, pas un gate.
- **Distincte du grounding ?** **Oui.** `Review Status` mêle aujourd'hui **trois** valeurs : « machine-section
  diff » (= grounding), « editorial review » (= qualité OCR-002), « documentary consistency » (= 007/009,
  grounding). Le champ **`Grounding`** couvre les deux **grounding** (machine-diff + doc-consistency) ; la
  **revue éditoriale est un autre concern** que `Grounding` **ne capture pas**.
- **⇒ Constat (pas remplacement) :** la revue éditoriale est **inerte, non-gate, distincte**. Deux voies pour
  l'Architecte :
  - **(a) La déclarer inerte** → `Grounding` **remplace tout** `Review Status` ; la conformité éditoriale
    (OCR-002) reste vérifiée **à l'écriture**, son historique dans git.
  - **(b) La préserver** comme concern séparé → `Grounding` remplace la partie « diff », mais la revue
    éditoriale garde **son propre champ** (ex. `Editorial: pending/passed`), pour ne pas la perdre.
  - *Ni l'une ni l'autre n'est un gate de promotion (OCR-000:47) ; c'est une décision de **traçabilité**,
    pas de portail.*

---

**Rien écrit, rien construit. J'attends la revue : (1) le registre GAP validé (forme/emplacement) ; (2) la
grille à 7 critères complète ? ; (3) revue éditoriale — voie (a) inerte ou (b) champ propre ?**
