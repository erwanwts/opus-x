# LOT B — Passages de Records à réécrire (liste de rédaction)

> **Document autonome.** Destiné à l'architecte pour la **rédaction** des corrections.
> Je **délimite** ; je n'écris **aucun** texte de remplacement. Chaque entrée porte :
> fichier + section, numéro de ligne, **texte actuel verbatim et complet**, catégorie,
> et en une phrase ce qui le rend inexact.
>
> Racine des Records : `docs/web/registry-import/OCR-100/`. Numéros de ligne à jour au
> commit de ce document (Records non modifiés).

---

## Règle de classification proposée — À CONFIRMER par l'architecte

- Un passage décrivant un **FAIT RÉALISÉ** (Evidence émise / acceptée / journalisée /
  vérifiée · Immutable Fact écrit · Trust calculé sur des faits réels) porte la
  **coordonnée historique `wtf:212`** — car les **79 faits réels la portent à jamais**
  (elle est **hash-portante** : la réécrire romprait leur intégrité).
- Un passage décrivant la **DÉFINITION** (le Framework, la Skill, la Competency, la
  Capability, ou la **résolution** du Registry) porte la **coordonnée courante `wtr:212`**.
- La **version normative** (`1.0.0` vs réel `0.1`) est un défaut **distinct**, traité au
  sous-inventaire **B** — indépendamment de la coordonnée.

Les passages où la lecture « fait réalisé » vs « définition » n'est pas tranchable sont
regroupés en **section AMBIGUË**, avec les deux lectures.

---

## A. COORDONNÉES — fait réalisé portant `wtr:212` (réel : `wtf:212`)

### A1 · OCR-121 (Certified Issuer) · section **Examples** · ligne 156
```
- A trading academy is certified; its Evidence referencing `wtr:212` is accepted and journaled.
```
- **Catégorie** : fait réalisé (Evidence acceptée et journalisée).
- **Inexact** : décrit une Evidence acceptée puis journalisée, or les faits réellement journalisés portent `wtf:212`.

### A2 · OCR-120 (Issuer) · section **Machine Interpretation** (JSON) · ligne 118
```
    "references_framework": "wtr:212",
```
- **Catégorie** : fait réalisé (Evidence produite par un Issuer).
- **Inexact** : modélise le fait qu'un Issuer produit ; le fait réel référence `wtf:212`.

### A3 · OCR-120 (Issuer) · section **Examples** · ligne 152
```
- A trading academy, certified as an Issuer, produces Evidence referencing `wtr:212`; Opus X accepts it and binds it to the professional's Opus ID.
```
- **Catégorie** : fait réalisé (Evidence produite, acceptée, liée au Passport).
- **Inexact** : décrit une Evidence produite/acceptée/liée — le fait réel porte `wtf:212`.

### A4 · OCR-110 (Evidence) · section **Machine Interpretation** (JSON, corps d'Evidence) · ligne 144
```
  "framework": { "id": "wtr", "reference": "wtr:212" },
```
- **Catégorie** : fait réalisé (corps d'un artefact Evidence).
- **Inexact** : c'est le corps hashé d'une Evidence — le fait réel (hash-portant) porte `wtf:212`.

### A5 · OCR-110 (Evidence) · section **JSON-LD Mapping** · lignes 173–174
```
  "referencesFramework": { "@type": "Framework", "@id": "urn:opusx:framework:wtr" },
  "frameworkReference": "wtr:212",
```
- **Catégorie** : fait réalisé (Evidence, `isImmutable: true`).
- **Inexact** : modélise un fait immuable référençant le framework ; le fait réel est en `wtf`.

### A6 · OCR-110 (Evidence) · section **Examples** · ligne 198
```
- A trading academy (Certified Issuer) observes a demonstrated risk-management competency and emits Evidence referencing `wtr:212` with `criterion_levels` for `S03.C08`, `S08.C06`, `S05.C08`, and `S02.C12`; Opus X verifies, journals the fact, and links it to the Passport.
```
- **Catégorie** : fait réalisé (LE fait démontré, émis et journalisé).
- **Inexact** : décrit l'émission et la journalisation d'un fait réel — les 79 Evidence réelles portent `wtf:212`.

### A7 · OCR-114 (Immutable Fact) · section **Examples** · ligne 161
```
- An accepted Evidence for `wtr:212` is written as an Immutable Fact and linked to one Passport update; a later correction adds a superseding fact, and the original remains, marked `superseded`.
```
- **Catégorie** : fait réalisé (Immutable Fact écrit).
- **Inexact** : décrit une Evidence acceptée écrite comme fait immuable — le fait réel porte `wtf:212`.

### A8 · OCR-109 (Verification Response) · section **Machine Interpretation** (JSON) · ligne 116
```
    "verified": { "coordinate": "wtr:212", "facts": ["ev_01KXM07GFE2GX8ZA4NJC42JDF5"] },
```
- **Catégorie** : fait réalisé (fait vérifié, identifiant précis).
- **Inexact** : associe la coordonnée à un fait vérifié nommé (`ev_01KXM07…`) — ce fait réel porte `wtf:212`.

### A9 · OCR-109 (Verification Response) · section **Examples** · ligne 155
```
- A Response confirms integrity and reports computed Trust for `wtr:212` under `wtr` v1.0.0, limited to disclosed facts, timestamped now.
```
- **Catégorie** : fait réalisé (Trust rapporté sur des faits divulgués). **Double défaut** : contient aussi la version `v1.0.0` → voir **B10**.
- **Inexact** : rapporte un Trust calculé sur des faits réels divulgués — la coordonnée réelle est `wtf:212`.

### A10 · OCR-105 (Trust) · section **JSON-LD Mapping** · ligne 133 — *cas limite*
```
  "interpretedAgainst": { "@type": "Framework", "@id": "urn:opusx:framework:wtr" },
```
- **Catégorie** : fait réalisé (Trust interprété contre le framework des faits) — **cas le moins net** : c'est l'identifiant de framework (`framework:wtr`), pas la coordonnée `:212`.
- **Inexact** : le Trust s'interprète contre le framework que **citent les faits réels** (`wtf`) ; mais une lecture « framework courant » pourrait le justifier — à trancher.

---

## B. VERSIONS NORMATIVES — version du Framework à `1.0.0` (réel : `0.1`)

> Distinction gravée : **version d'implémentation** = `0.1` (jalon courant réel du WTR) ;
> **version normative** = `1.0.0`, **réservée** à la première publication normative complète
> du protocole. Toute assertion de la **version du Framework** à `1.0.0` est donc inexacte.

### B1 · OCR-105 (Trust) · section **Machine Interpretation** (JSON) · ligne 116
```
    "interpretation": { "framework": "wtr", "version": "1.0.0" },
```
- **Inexact** : la version du Framework WTR est donnée à `1.0.0`, or le réel est `0.1`.

### B2 · OCR-105 (Trust) · section **Examples** · ligne 152
```
- Trust for an Opus ID is computed from three bound facts under `wtr` v1.0.0; a verifier reproduces the computation and obtains the same result.
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1`.

### B3 · OCR-106 (Trust Status) · section **Machine Interpretation** (JSON) · ligne 112
```
    "framework_version": "wtr@1.0.0",
```
- **Inexact** : version du Framework `wtr@1.0.0` ≠ `wtr@0.1`.

### B4 · OCR-106 (Trust Status) · section **JSON-LD Mapping** · ligne 129
```
  "underFrameworkVersion": "wtr@1.0.0",
```
- **Inexact** : version du Framework `wtr@1.0.0` ≠ `wtr@0.1`.

### B5 · OCR-106 (Trust Status) · section **Examples** · ligne 146
```
- A verifier reads a Trust Status for an Opus ID under `wtr` v1.0.0; it is the current output of the computation.
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1`.

### B6 · OCR-107 (Verification) · section **Machine Interpretation** (JSON) · ligne 122
```
    "framework_version": { "id": "wtr", "version": "1.0.0" },
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1`. *(Record concerné uniquement par la version — aucune coordonnée `wtr:212`.)*

### B7 · OCR-108 (Verification Request) · section **Machine Interpretation** (JSON) · ligne 117
```
    "framework_version": { "id": "wtr", "version": "1.0.0" },
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1`. *(La coordonnée/scope `wtr:212` de ce Record est traitée en section ambiguë.)*

### B8 · OCR-108 (Verification Request) · section **JSON-LD Mapping** · ligne 133
```
  "underFrameworkVersion": "wtr@1.0.0",
```
- **Inexact** : version du Framework `wtr@1.0.0` ≠ `wtr@0.1`.

### B9 · OCR-108 (Verification Request) · section **Examples** · ligne 151
```
- An employer submits a Request for `wtr:212` on a candidate's Opus ID under `wtr` v1.0.0, within granted disclosure.
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1` *(le `wtr:212` de scope est en section ambiguë)*.

### B10 · OCR-109 (Verification Response) · section **Machine Interpretation** (JSON) · ligne 118
```
    "trust": { "status": "<computed>", "framework_version": "wtr@1.0.0" },
```
- **Inexact** : version du Framework `wtr@1.0.0` ≠ `wtr@0.1`.

### B11 · OCR-109 (Verification Response) · section **JSON-LD Mapping** · ligne 137
```
  "reportsTrustUnder": "wtr@1.0.0",
```
- **Inexact** : version du Framework `wtr@1.0.0` ≠ `wtr@0.1`.

### B12 · OCR-109 (Verification Response) · section **Examples** · ligne 155
```
- A Response confirms integrity and reports computed Trust for `wtr:212` under `wtr` v1.0.0, limited to disclosed facts, timestamped now.
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1`. **Même ligne que A9** (double défaut : coordonnée **et** version).

### B13 · OCR-115 (Framework) · section **Machine Interpretation** (JSON, objet `framework`) · ligne 124
```
    "version": "1.0.0",
```
- **Inexact** : version du Framework WTR à `1.0.0` (objet `{ "id": "wtr", "version": "1.0.0", "coordinate": "wtr:212" }`) ≠ `0.1`.

### B14 · OCR-115 (Framework) · section **JSON-LD Mapping** · ligne 143
```
  "version": "1.0.0",
```
- **Inexact** : version du Framework WTR à `1.0.0` (nœud `@id: urn:opusx:framework:wtr`, `name: World Trader Framework`) ≠ `0.1`.

### ⚠️ EXCLUS de B — vérifié deux fois : versions DOCUMENTAIRES (à NE PAS toucher)

Les `1.0.0` suivants sont la **version du document OCR lui-même** (schéma de versioning
OCR-005), **sans rapport** avec la version du Framework. Ils sont **corrects** ; les
confondre casserait le versioning documentaire :
- l'en-tête `| **Version** | 1.0.0 |` (ligne 7 ou 8) de **chaque** Record ;
- l'entrée de changelog de **chaque** Record, forme `- **1.0.0** (2026-07-16) — Initial …
  Supersedes the OCR-xxx v0.1 skeleton …`.

Chaque entrée de B ci-dessus a été vérifiée comme étant **dans un bloc machine (JSON /
JSON-LD) ou un Example décrivant la version du FRAMEWORK**, jamais l'en-tête ni le
changelog du document.

---

## C. AMBIGUS — deux lectures possibles (à trancher par l'architecte)

### C1 · OCR-100 (World Skills Protocol) · section **Conceptual Model / Machine Interpretation** (prose) · ligne 117
```
WSP artifacts are JSON objects discriminated by a `type` field carried as a sibling of the body (e.g. `type: "evidence"`). Facts reference a Framework coordinate (e.g. `wtr:212`) and are integrity-protected via JCS canonicalization. Accepted facts are stored append-only and bound to a Passport update through a uniqueness-constrained link. Trust artifacts are computed views over facts and are never authored directly.
```
- **Lecture (a) — JUSTE (garder `wtr:212`)** : énoncé général ; « e.g. `wtr:212` » illustre la coordonnée **courante** qu'un nouveau fait citerait.
- **Lecture (b) — FAUX (→ `wtf:212`)** : « Facts reference … `wtr:212` » décrit ce que portent les **faits existants**, or les faits réels portent `wtf:212`.

### C2 · OCR-119 (Framework Registry) · section **Machine Interpretation** · ligne 114 puis lignes 118–124
```
The Registry resolves a coordinate to its criteria and defers levels to the Framework. The project mapping (`wsp_skill_mappings`) is seeded with exactly four rows to `wtr:212`, and carries no levels.
```
```
{
  "framework_id": "wtr",
  "coordinate": "wtr:212",
  "mapping": [
    { "criterion": "S03.C08", "coordinate": "wtr:212" },
    { "criterion": "S08.C06", "coordinate": "wtr:212" },
    { "criterion": "S05.C08", "coordinate": "wtr:212" },
    { "criterion": "S02.C12", "coordinate": "wtr:212" }
```
- **Lecture (a) — JUSTE (garder `wtr:212`)** : illustration de la couche **résolution/définition courante** du Registry.
- **Lecture (b) — FAUX (→ `wtf:212`)** : décrit le **mapping réel seedé** (`wsp_skill_mappings`) ; s'il pointe vers le skill réel, c'est `wtf:212`.

### C3 · OCR-108 (Verification Request) · sections **Machine Interpretation** (l. 116), **JSON-LD Mapping** (l. 132), **Summary** (l. 207) — le *scope* de requête
```
    "scope": { "coordinate": "wtr:212", "facts": ["<optional_ids>"] },
```
```
  "hasScope": "wtr:212",
```
```
A **Verification Request** is how a verifier asks a question in the World Skills Protocol: it names the subject's Opus ID, the scope (e.g. `wtr:212`), and the Framework version, and it is always bounded by the professional's consent. It initiates a Verification but can never grant itself access beyond what the professional has disclosed.
```
- **Lecture (a) — JUSTE (garder `wtr:212`)** : lecture *forward* — la requête interroge la **coordonnée courante** `wtr:212`.
- **Lecture (b) — FAUX (→ `wtf:212`)** : lecture *rétro* — la requête porte sur des **faits existants**, qui portent `wtf:212`.
- *(Rappel : la **version** `1.0.0` de ce Record — l. 117, 133, 151 — est un défaut distinct et non ambigu, listé en B7/B8/B9.)*

---

## Récapitulatif

- **A — coordonnées (fait réalisé → `wtf:212`)** : 10 entrées (dont A10 *cas limite*, A9 en double défaut avec B12).
- **B — versions normatives (`1.0.0` → `0.1`)** : 14 entrées, sur **8 Records** (OCR-105, 106, 107, 108, 109, 115). Exclusions documentaires vérifiées deux fois.
- **C — ambigus** : 3 (OCR-100 l.117 · OCR-119 l.114/118–124 · OCR-108 scope l.116/132/207).

Aucun texte de remplacement n'est proposé : délimitation seule. La **règle de
classification** (en tête) et les **cas limites/ambigus** attendent l'arbitrage de
l'architecte avant rédaction.
