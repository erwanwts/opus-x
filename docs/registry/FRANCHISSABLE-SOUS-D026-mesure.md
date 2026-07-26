`docs/registry/FRANCHISSABLE-SOUS-D026-mesure.md` · mesure (sous-ensemble étape 8 sous D-026) · 2026-07-26 versé en `bee0e58`

# Sous-ensemble franchissable de l'étape 8 sous D-026 — MESURE EN EXTENSION

> **Résultat majeur : le blocage porte sur 19 Records, pas 4** (18 machine-facing G1/G3 **+ OCR-009**
> doc↔tooling). Sous D-026 (`OCR-000:49` prime), **tout** désaccord doc↔code **ou doc↔tooling** — GAP nommé
> **ou** G1 « code incomplet » **ou** mécanisme décrit non implémenté — interdit la promotion. Les 4 GAP nommés
> (101/110/111/113) sont un **sous-ensemble**. **Périmètre ferme de la 1ʳᵉ promotion = 11 nouveaux Records.**
> **Rien écrit dans les Records.**

**Source des verdicts :** `OCR-GROUND-001-SYNTHESE` §2 (répartition G0/G1) × la partition Phase 1 (`{100,112,114,123}`
hors). Sortie machine (`node`), pas de prose interprétative.

## Les trois groupes (Phase 1 = 32)

### ✅ FRANCHISSABLES maintenant — aucun désaccord doc↔code (G0) = 11

`OCR-000 OCR-001 OCR-002 OCR-003 OCR-004 OCR-005` (méta gouvernance, G0-en-process)
`OCR-103 OCR-104 OCR-120 OCR-124` (concepts pleinement G0)
`OCR-006` (méta/architectural — **hors du périmètre « machine-facing » de `OCR-000:49`**, aucun diff doc↔code à faire)

- **dont déjà ratifiés en 0b** : `OCR-000`, `OCR-005` (Normative par fait, RATIF-001).
- **+ `OCR-007` et `OCR-008`** rejoignent après le contrôle doc↔tooling ci-dessous (CONFORMES).
- ⇒ **NOUVELLES promotions réellement franchissables = 11** : `001 002 003 004 006 007 008 103 104 120 124`.

### ✅⛔ CONTRÔLE doc↔tooling des régime-Records 007/008/009 — FAIT (2026-07-26)

Le contrôle est exécuté et tranché par la mesure (plus de « pending »). En extension :

| Record | Ce que dit le doc (Règle normative) | Ce que fait le tooling | Verdict |
|---|---|---|---|
| **007** Documentary Integrity | seal SHA-256 par Record · toute modif régénère le manifeste · attestation recalcule **et nomme** le Record · plage dérivée d'OCR-001 | `_manifest.json` porte `checksum_sha256` par Record ; `manifest.attestation.test.ts` recalcule `createHash('sha256')`, compare, nomme (l.61/75/79) ; `metaRange.test.ts` (plage↔OCR-001) | **CONFORME** → franchissable |
| **008** Document Transmission | tout doc transmis porte, en 1re ligne, chemin + hash de commit | vérifié : les docs transmis portent `` `path` · … versé en `hash` `` en L1 (pratique **conforme** ; discipline éditoriale, pas un outil — **aucune contradiction**) | **CONFORME** → franchissable |
| **009** Approval Form | statut « Normative » **dérivé** d'un fait d'approbation, **jamais authored** ; un Record ne se promeut pas par un champ | le champ `Status` est **authored** sur chaque Record et **lu en direct** par 5 lecteurs (`recordPage:115/143`, `geo.ts:294`, manifeste `lifecycle_status`, `robotsFromStatus`) ; `RATIF-001` **n'est pas lu** pour dériver le statut ; **le résolveur n'existe pas** (D-013 « résolveur inexistant » ; D-023 fenêtre active ; étape 6 non lancée) | **EN DÉSACCORD** → **bloqué** |

**Désaccord nommé (009) :** `OCR-009` **Approval Rule clause 4** (« status Normative SHALL be derived from the
presence of an approval fact, **never authored directly** ») **vs** tooling (statut **authored + lu en direct**,
`RATIF-001` ignoré, **résolveur absent**). C'est **exactement la fenêtre D-023**. OCR-009 décrit le mécanisme
d'approbation que le tooling n'implémente pas encore ; le lever = **construire le résolveur (étape 6)**. *(Note :
promouvoir OCR-009 exigerait le mécanisme qu'il décrit — qui n'existe pas ; c'est un désaccord doc↔tooling, pas
un « pending ».)*

⇒ **007 et 008 rejoignent les franchissables ; 009 rejoint les bloqués.**

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
| **Phase 1 SANS désaccord** (franchissable) | **13** *(dont `000`/`005` ratifiés → **11 nouvelles**)* | **oui** |
| **Phase 1 AVEC désaccord** (G1/G3 + doc↔tooling) | **19** | **NON** |

**13 + 19 = 32 = Phase 1. Plus aucun « pending ».** Franchissables = 11 (G0/méta) **+ 007 + 008** ; bloqués = 18
(machine-facing) **+ 009** (doc↔tooling, résolveur absent).

**⇒ PÉRIMÈTRE FERME de la première promotion = 11 nouveaux Records** (`001 002 003 004 006 007 008 103 104 120
124`), + les 2 déjà ratifiés. Plus de ±3.

## Conséquence pour la partition et l'étape 8

- Le **lot réellement promouvable maintenant** n'est **ni** « 32 » **ni** « 28 » : c'est **13** (11 nouvelles +
  2 ratifiées) — **ferme**, le contrôle doc↔tooling est fait (007/008 dedans, 009 dehors).
- Les **19 bloqués** ne sont **pas** en Phase 2 (D-025 : un désaccord ne renvoie pas en Phase 2). Ils **restent
  en Phase 1**, **non-franchissables** tant que le désaccord n'est pas résolu (code écrit, OCR reformulé, **ou
  résolveur construit** pour 009). La partition Phase 1 = 32 **inchangée** ; c'est le **sous-ensemble
  franchissable** qui est petit.
- **La « préparation » est une porte réelle et large** : sous D-026, être Phase 1 ne suffit pas ; il faut
  **aucun désaccord doc↔code/tooling**. Aujourd'hui **13/32** le satisfont (dont 2 déjà ratifiés).

---

**Mesuré, non tranché.** Le fait dur pour l'Architecte : **D-026 bloque 19 Records, pas 4** — les 14 « autres »
machine-facing (G1-dominant + gap partiel) **+ OCR-009** (doc↔tooling : dérivation de statut non implémentée,
résolveur absent), tous sous la **même règle** (`OCR-000:49`). **Périmètre ferme de la première promotion = 11
nouveaux Records** (`001 002 003 004 006 007 008 103 104 120 124`), + les 2 ratifiés. **Rien écrit dans les
Records, aucun artefact de promotion, RATIF-001 intact.**
