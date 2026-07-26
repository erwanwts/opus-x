`docs/registry/FRANCHISSABLE-SOUS-D026-mesure.md` · mesure (sous-ensemble étape 8 sous D-026) · 2026-07-26 *(hash : voir commit)*

# Sous-ensemble franchissable de l'étape 8 sous D-026 — MESURE EN EXTENSION

> **Résultat majeur : le blocage porte sur 18 Records, pas 4.** Sous D-026 (`OCR-000:49` prime), **tout**
> désaccord doc↔code — GAP nommé **ou** G1 « code incomplet » — interdit la promotion. Les 4 GAP nommés
> (101/110/111/113) sont un **sous-ensemble** des 18 bloqués. **Rien écrit dans les Records.**

**Source des verdicts :** `OCR-GROUND-001-SYNTHESE` §2 (répartition G0/G1) × la partition Phase 1 (`{100,112,114,123}`
hors). Sortie machine (`node`), pas de prose interprétative.

## Les trois groupes (Phase 1 = 32)

### ✅ FRANCHISSABLES maintenant — aucun désaccord doc↔code (G0) = 11

`OCR-000 OCR-001 OCR-002 OCR-003 OCR-004 OCR-005` (méta gouvernance, G0-en-process)
`OCR-103 OCR-104 OCR-120 OCR-124` (concepts pleinement G0)
`OCR-006` (méta/architectural — **hors du périmètre « machine-facing » de `OCR-000:49`**, aucun diff doc↔code à faire)

- **dont déjà ratifiés en 0b** : `OCR-000`, `OCR-005` (Normative par fait, RATIF-001).
- ⇒ **NOUVELLES promotions réellement franchissables = 9** : `001 002 003 004 006 103 104 120 124`.

### ⏳ CHECK EN ATTENTE — pas un GAP, mais diff non fait = 3

`OCR-007 OCR-008 OCR-009` — régime **cohérence documentaire** (doc↔tooling). Le contrôle **n'a pas encore été
exécuté** (Records écrits à l'étape 3). Ce **n'est pas** un GAP trouvé ; c'est un **diff à faire avant**
promotion (`OCR-000:49` : « MUST be diffed… before promotion »). Franchissables **une fois le contrôle passé**.

### ⛔ BLOQUÉS — désaccord doc↔code ouvert (G1 ou G3) = 18

`OCR-101 OCR-102 OCR-105 OCR-106 OCR-107 OCR-108 OCR-109 OCR-110 OCR-111 OCR-113 OCR-115 OCR-116 OCR-117 OCR-118 OCR-119 OCR-121 OCR-122 OCR-125`

| Sous-groupe | Records | Compte |
|---|---|---|
| **GAP nommés** (les 4 attendus) | `101, 110, 111, 113` | 4 |
| **AUTRES bloqués** — G1/G3 **sans** GAP-N, mais code incomplet (doc↔code en désaccord) | `102, 105, 106, 107, 108, 109, 115, 116, 117, 118, 119, 121, 122, 125` | **14** |

**⇒ Il y en avait bien d'autres.** Les 14 « autres » sont les Records **G1-dominant** (moteur/endpoint/entité
absents : Trust 105/106, Verification 107/108/109, Framework Registry 119, Competency/Capability 117/118,
Certified Issuer 121, Organization 122) **et** les G0-à-gap-partiel (102 projection, 115/116 registry/taxonomie,
125 instanciation org). Aucun n'a de « GAP-N » étiqueté, mais chacun est un **désaccord doc↔code** que
`OCR-000:49` interdit de promouvoir.

## Les deux comptes demandés

| Groupe | Compte | Franchit l'étape 8 sous D-026 ? |
|---|---|---|
| **Phase 1 SANS gap** (G0) | **11** *(dont 2 déjà ratifiés → 9 nouvelles)* | **oui** |
| **Phase 1 AVEC gap** (G1/G3) | **18** | **NON** |
| *(check doc↔tooling en attente)* | *3* | *après contrôle* |

**11 + 18 + 3 = 32 = Phase 1** (mesuré, `TOTAL … = 32`).

## Conséquence pour la partition et l'étape 8

- Le **lot réellement promouvable maintenant** n'est pas « 32 » ni « 28 » : c'est **≤ 11** (9 nouvelles + les
  2 ratifiées), **+ 3** si le contrôle doc↔tooling des régime-Records passe.
- Les **18 bloqués** ne sont **pas** en Phase 2 (D-025 : un GAP ne renvoie pas en Phase 2). Ils **restent en
  Phase 1**, **non-franchissables** tant que leur désaccord doc↔code n'est pas résolu (code écrit **ou** OCR
  reformulé). La partition Phase 1 = 32 **inchangée** ; c'est le **sous-ensemble franchissable** qui est petit.
- **La « préparation » redevient une porte réelle et large** : sous D-026, être Phase 1 ne suffit pas ; il faut
  **grounding sans gap**. Aujourd'hui seuls ~11/32 le satisfont.

---

**Mesuré, non tranché.** Le fait dur pour l'Architecte : **D-026 bloque 18 Records, pas 4** — les 14 « autres »
(G1-dominant + gap partiel) sont bloqués par la **même règle** (`OCR-000:49`), sans qu'un GAP-N les ait
étiquetés. **Rien écrit dans les Records, aucun artefact de promotion, RATIF-001 intact.**
