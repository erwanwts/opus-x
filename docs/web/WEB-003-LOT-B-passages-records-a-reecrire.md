# LOT B — Passages de Records à réécrire (liste de rédaction)

> **Document autonome.** Destiné à l'architecte pour la **rédaction** des corrections.
> Je **délimite** ; je n'écris **aucun** texte de remplacement. Chaque entrée porte :
> fichier + section, numéro de ligne, **texte actuel verbatim et complet**, catégorie,
> et en une phrase ce qui le rend inexact.
>
> Racine des Records : `docs/web/registry-import/OCR-100/`. Numéros de ligne à jour
> (Records non modifiés).
>
> **v2 (2026-07-19)** — reclassements gravés par l'architecte : A10 (OCR-105:133) déclassé
> (schéma de structure → annexe) ; C(a) (OCR-100:117) promu en A ; C(b) (OCR-119 mapping)
> vérifié conforme → annexe ; C(c) (OCR-108) adjugé (annexe, avec réserve). Règle et
> principe gravés portés en tête.

---

## RÈGLE GRAVÉE (verbatim — autorité)

> « Tout passage décrivant un fait publié ou une donnée immuable emploie les coordonnées
> réellement portées par ce fait. Tout passage décrivant une définition, une règle, une
> capacité, un mécanisme ou un comportement du protocole emploie les coordonnées
> canoniques en vigueur au moment de la lecture. »

## PRINCIPE GÉNÉRAL (verbatim)

> « Le protocole ne choisit jamais une coordonnée en fonction de la date du document ou
> de la version du corpus. Il choisit toujours la coordonnée de l'objet dont il parle. »

**Corollaire d'application (gravé)** : *exemple réel → coordonnée historique ; schéma de
structure → coordonnée canonique.*

**Portée des deux défauts :**
- **A. Coordonnées** : un passage décrivant un **fait réalisé** porte `wtr:212` alors que
  le fait réel porte `wtf:212` (coordonnée hash-portante).
- **B. Versions normatives** : un passage donne la **version du Framework** à `1.0.0` alors
  que le réel est `0.1` (version d'implémentation) — `1.0.0` réservé à la première
  publication normative complète. Défaut **distinct** de la coordonnée.

---

## A. COORDONNÉES — fait réalisé portant `wtr:212` (réel : `wtf:212`) — **10 entrées**

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
- **Catégorie** : fait réalisé (Trust rapporté sur des faits divulgués). **Double défaut** : contient aussi la version `v1.0.0` → voir **B12**.
- **Inexact** : rapporte un Trust calculé sur des faits réels divulgués — la coordonnée réelle est `wtf:212`.

### A10 · OCR-100 (World Skills Protocol) · section **Machine Interpretation** (prose) · ligne 117 — *reclassé depuis C(a)*
```
WSP artifacts are JSON objects discriminated by a `type` field carried as a sibling of the body (e.g. `type: "evidence"`). Facts reference a Framework coordinate (e.g. `wtr:212`) and are integrity-protected via JCS canonicalization. Accepted facts are stored append-only and bound to a Passport update through a uniqueness-constrained link. Trust artifacts are computed views over facts and are never authored directly.
```
- **Catégorie** : fait réalisé — **le sujet grammatical est « Facts »** (« *Facts* reference a Framework coordinate (e.g. `wtr:212`) »).
- **Inexact** : décrit **ce que les faits portent réellement** ; les faits réels portent la coordonnée historique `wtf:212`.

---

## B. VERSIONS NORMATIVES — version du Framework à `1.0.0` (réel : `0.1`) — **14 entrées**

> Distinction gravée : **version d'implémentation** = `0.1` (jalon courant réel du WTR) ;
> **version normative** = `1.0.0`, **réservée** à la première publication normative complète
> du protocole.

### B1 · OCR-105 (Trust) · **Machine Interpretation** (JSON) · ligne 116
```
    "interpretation": { "framework": "wtr", "version": "1.0.0" },
```
- **Inexact** : version du Framework WTR donnée à `1.0.0`, or le réel est `0.1`.

### B2 · OCR-105 (Trust) · **Examples** · ligne 152
```
- Trust for an Opus ID is computed from three bound facts under `wtr` v1.0.0; a verifier reproduces the computation and obtains the same result.
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1`.

### B3 · OCR-106 (Trust Status) · **Machine Interpretation** (JSON) · ligne 112
```
    "framework_version": "wtr@1.0.0",
```
- **Inexact** : version du Framework `wtr@1.0.0` ≠ `wtr@0.1`.

### B4 · OCR-106 (Trust Status) · **JSON-LD Mapping** · ligne 129
```
  "underFrameworkVersion": "wtr@1.0.0",
```
- **Inexact** : version du Framework `wtr@1.0.0` ≠ `wtr@0.1`.

### B5 · OCR-106 (Trust Status) · **Examples** · ligne 146
```
- A verifier reads a Trust Status for an Opus ID under `wtr` v1.0.0; it is the current output of the computation.
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1`.

### B6 · OCR-107 (Verification) · **Machine Interpretation** (JSON) · ligne 122
```
    "framework_version": { "id": "wtr", "version": "1.0.0" },
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1`. *(Record concerné uniquement par la version — aucune coordonnée `wtr:212`.)*

### B7 · OCR-108 (Verification Request) · **Machine Interpretation** (JSON) · ligne 117
```
    "framework_version": { "id": "wtr", "version": "1.0.0" },
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1`. *(La coordonnée/scope `wtr:212` de ce Record est traitée en annexe — adjugée conforme.)*

### B8 · OCR-108 (Verification Request) · **JSON-LD Mapping** · ligne 133
```
  "underFrameworkVersion": "wtr@1.0.0",
```
- **Inexact** : version du Framework `wtr@1.0.0` ≠ `wtr@0.1`.

### B9 · OCR-108 (Verification Request) · **Examples** · ligne 151
```
- An employer submits a Request for `wtr:212` on a candidate's Opus ID under `wtr` v1.0.0, within granted disclosure.
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1` *(le `wtr:212` de scope est en annexe, adjugé conforme)*.

### B10 · OCR-109 (Verification Response) · **Machine Interpretation** (JSON) · ligne 118
```
    "trust": { "status": "<computed>", "framework_version": "wtr@1.0.0" },
```
- **Inexact** : version du Framework `wtr@1.0.0` ≠ `wtr@0.1`.

### B11 · OCR-109 (Verification Response) · **JSON-LD Mapping** · ligne 137
```
  "reportsTrustUnder": "wtr@1.0.0",
```
- **Inexact** : version du Framework `wtr@1.0.0` ≠ `wtr@0.1`.

### B12 · OCR-109 (Verification Response) · **Examples** · ligne 155
```
- A Response confirms integrity and reports computed Trust for `wtr:212` under `wtr` v1.0.0, limited to disclosed facts, timestamped now.
```
- **Inexact** : version du Framework `1.0.0` ≠ `0.1`. **Même ligne que A9** (double défaut : coordonnée **et** version).

### B13 · OCR-115 (Framework) · **Machine Interpretation** (JSON, objet `framework`) · ligne 124
```
    "version": "1.0.0",
```
- **Inexact** : version du Framework WTR à `1.0.0` (objet `{ "id": "wtr", "version": "1.0.0", "coordinate": "wtr:212" }`) ≠ `0.1`.

### B14 · OCR-115 (Framework) · **JSON-LD Mapping** · ligne 143
```
  "version": "1.0.0",
```
- **Inexact** : version du Framework WTR à `1.0.0` (nœud `@id: urn:opusx:framework:wtr`, `name: World Trader Framework`) ≠ `0.1`.

### ⚠️ EXCLUS de B — vérifié deux fois : versions DOCUMENTAIRES (à NE PAS toucher)

Les `1.0.0` suivants sont la **version du document OCR lui-même** (versioning OCR-005),
**sans rapport** avec la version du Framework — **corrects** :
- l'en-tête `| **Version** | 1.0.0 |` (ligne 7 ou 8) de **chaque** Record ;
- l'entrée de changelog de **chaque** Record, forme `- **1.0.0** (2026-07-16) — Initial …
  Supersedes the OCR-xxx v0.1 skeleton …`.

Chaque entrée B ci-dessus a été confirmée dans un bloc machine (JSON/JSON-LD) ou un Example
décrivant la version du **Framework**, jamais l'en-tête ni le changelog du document.

---

## Annexe — passages VÉRIFIÉS CONFORMES (rien à corriger)

### An1 · OCR-105 (Trust) · **JSON-LD Mapping** · ligne 133 — *déclassé de A10*
```
  "interpretedAgainst": { "@type": "Framework", "@id": "urn:opusx:framework:wtr" },
```
- **Verdict** : **conforme, rien à corriger.** C'est un **schéma de structure** (la forme JSON-LD d'un Trust), pas un exemple d'occurrence réelle. Par le corollaire gravé (« schéma de structure → coordonnée canonique »), il porte **déjà** la coordonnée canonique `framework:wtr`. Conservé ici avec sa justification, hors inventaire A.

### An2 · OCR-119 (Framework Registry) · **Machine Interpretation** · ligne 114 puis lignes 118–124 — *ex-C(b)*
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
- **Verdict** : **conforme, rien à corriger.** Décrit un **mécanisme de résolution** (le Registry résolvant une coordonnée) — donc, par la règle gravée (« un mécanisme … du protocole emploie les coordonnées canoniques »), coordonnée **canonique** `wtr:212`. Retiré des ambigus.

### An3 · OCR-108 (Verification Request) · **Machine Interpretation** (l. 116), **JSON-LD Mapping** (l. 132), **Summary** (l. 207) — *ex-C(c), adjugé*
```
    "scope": { "coordinate": "wtr:212", "facts": ["<optional_ids>"] },
```
```
  "hasScope": "wtr:212",
```
```
A **Verification Request** is how a verifier asks a question in the World Skills Protocol: it names the subject's Opus ID, the scope (e.g. `wtr:212`), and the Framework version, and it is always bounded by the professional's consent. It initiates a Verification but can never grant itself access beyond what the professional has disclosed.
```

**Critère gravé appliqué** : *« Si la requête vérifie une définition → coordonnée canonique.
Si elle vérifie un fait publié → coordonnée réellement portée par ce fait. »*

**Que vérifie ce passage exactement ?** La **Verification Request** est l'objet qu'un
vérificateur **soumet pour poser une question** — ce n'est pas encore une vérification, c'est
la **requête** (l'acte du lecteur). Son `scope.coordinate` **nomme la Skill/compétence
interrogée** (adressage définitionnel) ; le champ `facts` est **optionnel**
(`"<optional_ids>"`), donc le cas de base est « interroger la définition `wtr:212` », pas
« affirmer la coordonnée d'un fait précis ».

**Adjudication** : **conforme, coordonnée canonique `wtr:212`.** La Request est un
**mécanisme de lecture** (la question du vérificateur) qui **désigne une définition** ; la
règle gravée (« mécanisme/comportement → canonique ») **et** le principe de couche de lecture
(la résolution d'identité vit à la lecture, le vérificateur interroge avec la coordonnée
courante) convergent vers la **coordonnée canonique**.

**⚠️ Réserve pour l'architecte (le critère est tendu, non insuffisant)** : la **Response**
appariée (OCR-109 ligne 116, = **A8**) reporte la **même** coordonnée contre un **fait réel
nommé** (`ev_01KXM07…`) — ce qui est, lui, le cas « fait publié » → historique `wtf:212`.
La Request (canonique) et la Response (historique) emploient donc le **même jeton** pour deux
rôles distincts. Si l'architecte veut que la Request **échoie la coordonnée du fait ciblé**
(quand `facts` est renseigné), alors ce passage devrait basculer en `wtf:212` — ce serait une
**reformulation** de la sémantique du champ, pas une simple correction. En l'état (scope par
définition, `facts` optionnel), **je le tiens conforme**.

---

## Récapitulatif et vérification du décompte

| Inventaire | Compte | Composition |
|---|---|---|
| **A — coordonnées** (fait réalisé → `wtf:212`) | **10** | A1–A9 (9) **+** A10 = OCR-100:117 (ex-C(a)) |
| **B — versions normatives** (`1.0.0` → `0.1`) | **14** | inchangé (sur 6 Records : OCR-105/106/107/108/109/115) |
| **Annexe — conformes (rien à corriger)** | 3 | OCR-105:133 (ex-A10) · OCR-119 mapping (ex-C(b)) · OCR-108 scope (ex-C(c), adjugé, avec réserve) |

**Vérification de votre calcul.** Résultat **10 : correct**. Précision arithmétique : la base
de A était **10** (A1–A10), **pas 11**. L'opération est donc **10 − A10 (déclassé) + C(a)
(promu) = 10**. (Le « 11 » de la formule proposée est à corriger en « 10 ».)

**C(c)** : traité (annexe An3) — adjugé **conforme (canonique)**, avec une réserve signalée
qui relèverait d'une **reformulation** par l'architecte si la sémantique du scope doit échoir
la coordonnée du fait ciblé.

Aucun texte de remplacement n'est proposé : délimitation seule.
