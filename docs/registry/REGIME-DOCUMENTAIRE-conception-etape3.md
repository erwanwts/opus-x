`docs/registry/REGIME-DOCUMENTAIRE-conception-etape3.md` · conception (étape 3) · 2026-07-25 versée en `2ceea99`

# Le régime documentaire — CONCEPTION des trois Records (étape 3, pour revue)

> **Aucun Record rédigé.** Ceci est la **conception** de `OCR-007`/`OCR-008`/`OCR-009` (fentes réservées à
> l'étape 2), à réviser avant écriture. Chaque Record **consolide** une matière **déjà présente** dans le
> chantier — il n'invente pas. Le **lieu `founding/`** est **décrit**, jamais créé ni gouverné comme Record.

---

## OCR-007 — Documentary Integrity (`documentary-integrity`)

- **Concept / déficit comblé :** l'intégrité du **corpus documentaire** — le sceau `sha256` de chaque `.md`
  dans le manifeste. Aucun Record ne le couvre aujourd'hui (1ᵉʳ des 3 déficits).
- **La règle (normative) :** le manifeste **scelle** chaque `.md` par son `sha256` ; **toute modification
  d'un Record régénère le manifeste** (sceau + plage) ; une **attestation** vérifie que chaque sceau
  correspond au contenu ; la **plage méta est déclarée par OCR-001, dont le manifeste dérive** (« OCR-001
  fait foi », étape 2).
- **Matière existante à consolider (déjà prouvée) :** `manifest.attestation.test` (sceau par Record, prouvé
  par mutation) · `metaRange.test` (cohérence plage↔manifeste + autorité OCR-001, étape 2) · l'**incident
  des 24h40** (rectification du 20 juil., manifeste non régénéré → 11 sceaux périmés jusqu'à `1c9ffa3`).
- **⚠️ Frontière DURE à porter (sinon on recrée la confusion P9/statut) :**
  **`OCR-113` gouverne l'intégrité des PAYLOADS Evidence** (protocole : JCS/RFC 8785 + HMAC, constant-time).
  **`OCR-007` gouverne l'intégrité DOCUMENTAIRE** (les `.md` du corpus : `sha256` du manifeste). **Deux
  objets distincts** — le Record doit énoncer la frontière **en toutes lettres**, comme la clause de portée
  d'OCR-006 sépare protocole et documentaire.
- **Machine-facing ?** Il décrit du **code réel** (`manifest.mjs`, l'attestation). *(voir Transversal.)*

---

## OCR-008 — Document Transmission (`document-transmission`)

- **Concept / déficit comblé :** la **transmission** d'un document — la discipline « chemin + hash de
  commit », aujourd'hui **convention de session hors Record** (2ᵉ déficit).
- **La règle (normative) :** **tout document transmis porte, en tête, son chemin complet + le hash du commit**
  qui l'inscrit. La transmission d'un artefact **sans** sa provenance vérifiable est non conforme.
- **Matière existante à consolider :** la **dette de provenance** (chantier `[GRAVÉ]`) · l'**incident du
  document périmé transmis deux fois** (ma faute : un `SCHEMA-GEO`/dossier transmis stale, produisant une
  **corroboration fausse** — proposition (5), corroboration sans indépendance) · la discipline « 1ʳᵉ ligne =
  chemin + hash » déjà appliquée à tous les documents versés du chantier.
- **⚠️ Frontière :** **`OCR-002:51`** couvre la **provenance des CITATIONS** (« Unattributed or invented
  facts, quotes, or citations — prohibited ») — *à l'intérieur* d'un Record. **`OCR-008`** couvre la
  **transmission de DOCUMENTS** (l'acte de faire circuler un artefact avec sa provenance). Citation ≠
  transmission — le Record dit la frontière.
- **Machine-facing ?** **Non** — c'est une **discipline humaine/process**, aucun « moteur de transmission »
  n'existe. **Éditorial.** *(voir Transversal.)*

---

## OCR-009 — Approval Form (`approval-form`) — + la description du lieu `founding/`

- **Concept / déficit comblé :** la **forme de l'acte d'approbation** Opus X. `OCR-000:47` exige
  l'approbation ; **sa forme n'est définie nulle part** (3ᵉ déficit).
- **La règle (normative) :** l'approbation `Draft → Normative` prend la forme d'un **fait de statut signé
  Opus X** (`authority`). **D-016** a tranché : l'**artefact `PROMO` EST l'approbation** (voie ordinaire).
- **Les DEUX voies — OCR-009 décrit les deux, une seule est normative-ordinaire :**
  1. **`PROMO` (ordinaire)** — un fait par Record promu, `authority` = approbation Opus X, **présuppose le
     grounding** (D-017). **Voie normative** qu'OCR-009 grave.
  2. **`RATIF` (fondateur)** — l'approbation **hors processus ordinaire** (D-019/D-020), signée Opus X,
     vivant dans `founding/` (**pas un OCR**). OCR-009 la **décrit**, ne la **gouverne** pas.
- **Recommandation de placement du lieu :** **dans OCR-009**, car `RATIF` **est** une forme d'approbation
  (la fondatrice) — les deux voies restent dans un même Record (« comment un Record devient autoritatif »),
  cohérent avec D-020 (« deux natures, une lecture »).
- **⚠️ Section `founding/` = DESCRIPTIVE (informative), non gouvernante :** `founding/` tire son autorité de
  la **signature** (`OCR-000:35`), **pas** d'un statut Normative. Un Record qui **gouvernerait** `founding/`
  le rendrait **dépendant de sa propre ratification** = re-circularité. Donc OCR-009 **décrit** `founding/`,
  `RATIF-001` et la voie fondatrice **en section informative**, en **renvoyant à `OCR-000:35`** pour
  l'autorité — il n'énonce **aucune** obligation *sur* `founding/`. *(La voie PROMO, elle, est normative.)*
- **Machine-facing ?** Il décrit des **schémas d'artefacts** (`PROMO` front-matter, `RATIF.schema.json`) et
  leurs gardes (`foundingLieu.test`). **Machine-facing partiel.** *(voir Transversal.)*

---

## Transversal — à trancher pour les trois

### En-tête (cohérence avec OCR-000…005)
| Champ | Valeur |
|---|---|
| Version · Status | **`1.0.0` · `Draft`** (D-018 : édition en place jusqu'à promotion) |
| Owner | `Opus X — Canonical Registry` |
| Kind | **`Meta — Governance`** (comme 000–005 ; **pas** de `Layer`) |
| Normative / Informative | Normative (règles) · Informative (rationale, FAQ, **la description de `founding/` pour 009**) |
| Structure | adaptée aux sections de gouvernance (`OCR-001:57` l'autorise pour les méta) |

### Machine-facing vs éditorial (décide le traitement à l'étape 5/8)
- **Convention méta actuelle :** OCR-000…005 sont **tous** `Pending editorial review` — car `OCR-000:51`
  (grounding) vise le comportement **du protocole**, que les Records **méta/gouvernance** ne décrivent pas.
- **Donc, par défaut : les trois sont ÉDITORIAUX.**
- **⚠️ Mais OCR-007 et OCR-009 décrivent du CODE réel** (`manifest.mjs` ; les schémas `PROMO`/`RATIF` + leurs
  gardes). Leurs énoncés normatifs **doivent correspondre** à ce code — c'est une **cohérence doc↔code
  DOCUMENTAIRE**, distincte du **grounding protocole** (`OCR-000:51`). **Recommandation :** les trois en
  **revue éditoriale**, **plus** pour 007 et 009 un **contrôle de cohérence doc↔code documentaire** (diff
  contre le tooling). Cela **précise la note de l'étape 4** : le champ D-017 doit distinguer *grounding
  protocole* (non requis pour les méta) de *cohérence documentaire* (requise pour 007/009). **À trancher.**

### Conséquence à signaler (ordre + compte)
Créer `007/008/009` porte le corpus de **33 à 36** Records et la population à promouvoir de **29 à 32**.
**L'ordre D-021 devra les placer** : `{000,005}` → `006` → `{001,002,003,004}` → **`{007,008,009}` (régime
méta)** → 23 concepts. **Constat — à graver quand les Records existeront (étape 8), pas ici.**

---

**Rien rédigé. J'attends la revue — surtout : placement du lieu dans OCR-009 (validé ?), et le statut
machine-facing/éditorial de 007/009 (cohérence documentaire = nouveau sous-genre ou éditorial simple ?).**
