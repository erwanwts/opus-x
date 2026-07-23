# DOSSIER DE PROMOTION — Cycle 1 du Canonical Corpus

> **NON NORMATIF. MESURE, PAS RECOMMANDATION.** Ce document ne recommande la promotion
> d'aucun Record. Il fournit les faits nécessaires pour rendre 33 décisions individuelles.
> Chaque Record est examiné séparément ; aucune promotion automatique, aucun traitement
> global.

**Date de mesure** : 2026-07-21 · `main` à `1022cc7` + branche `web/web-003-lot-geo-2`.
**Cycle gravé** (RD-007) : `Authoring → Review → Validation → Promotion → Publication → Indexation`.

> ## ⚠️ MISE À JOUR 2026-07-24 — partition et critères corrigés (D-005, D-008, D-009)
> *Appliquée par le commit de ce lot ; trace au [DECISIONS-LOG.md](DECISIONS-LOG.md).*
>
> Ce dossier a été rédigé le 2026-07-21 sous la partition **16·15·2** et une grille contenant le
> critère d'ancienneté. **Deux révisions et un retrait plus tard**, l'état courant est :
>
> - **Partition = 29·3·1** (D-005 : OCR-123 → Phase 2). **Phase 1 = 29** · **Phase 2 = {OCR-100,
>   OCR-114, OCR-123}** · **Phase 3 = {OCR-006}**. La source autoritaire de la partition est
>   `MESURES-frontiere-promotion-terminologie.md`.
> - **Critère « modification substantielle » (ancienneté / commits) : RETIRÉ** (D-009) — il lisait
>   une métadonnée mutable, non du contenu. La section « ⚠️ Un critère de Phase 1… » et la ligne
>   « `commits == 1` » de la grille ci-dessous sont **caduques**.
> - **Grille courante : 5 critères dérivables, tous attestés** (empreinte, manifeste, références,
>   invariants, dette — cf. `DOSSIER-SESSION-ARCHITECTE.md` §5) + les critères de jugement.
> - **Un contrôle d'intégrité EXISTE désormais** (`manifest.attestation.test.ts`) — la PARTIE II
>   ci-dessous (« aucun contrôle n'existe ») décrit l'état du 2026-07-21, corrigé depuis.
>
> **Les tableaux par phase ci-dessous portent la mesure du 2026-07-21 ; leur ASSIGNATION de phase
> est superseded par 29·3·1.** Réassignation : les 13 Records d'ancienne Phase 2 **sans dette
> ouverte** (rectifications closes) montent en **Phase 1** ; **OCR-100 et OCR-114** restent
> Phase 2 (dettes ouvertes : énumération, `alias_self_loop`) ; **OCR-123** descend de Phase 3 en
> **Phase 2** (cité 0). Seul **OCR-006** reste en Phase 3.

---

# PARTIE I — LES 33 RECORDS, RANGÉS PAR PHASE

## ⚠️ Un critère de Phase 1 ne peut être satisfait par aucun Record

Critère gravé : *« aucune modification substantielle depuis **plusieurs semaines** »*.

| Événement | Date | Ancienneté |
|---|---|---:|
| Import initial du corpus (`4d6f998`) | 2026-07-16 | **5 jours** |
| Migration `wtf → wtr` (`ddfda6f`) | 2026-07-18 | 3 jours |
| Création d'OCR-006 (`1cbc8fc`) | 2026-07-20 | 1 jour |
| Rectification éditoriale (`62027b4`) | 2026-07-20 | 1 jour |
| Amendement OCR-115 v1.1.0 (`2acdbb9`) | 2026-07-21 | 0 jour |

**Le corpus tout entier a 5 jours.** Lu strictement, le critère d'ancienneté rend la
Phase 1 **vide** — non parce que les Records seraient instables, mais parce que le corpus
est trop jeune pour qu'aucun ait pu rester immobile « plusieurs semaines ».

**Lecture opératoire retenue pour le classement ci-dessous**, à valider ou à corriger :
« aucune modification substantielle depuis l'import » = **le Record n'a jamais été modifié
depuis sa création** (un seul commit). Sous cette lecture, la Phase 1 compte 16 Records.
Sous la lecture stricte, elle en compte **0** et le Cycle 1 attend.

## Critères appliqués — mécaniquement, en cascade

Un Record qui ne satisfait pas **tous** les critères d'une phase passe à la suivante.

| Phase | Critères gravés | Traduction mécanique appliquée |
|---|---|---|
| **1** | aucune modification substantielle · aucune dette ouverte · déjà utilisé comme référence · aucune incohérence connue | `commits == 1` **et** absent de la liste des dettes **et** `cité ≥ 1` |
| **2** | amendements récents · rectifications du corpus · cohérence à vérifier | `commits > 1` |
| **3** | première revue complète | créé après l'import **ou** `cité == 0` |

« Cité » = nombre d'**autres** Records qui mentionnent son identifiant. « Dette » = les
listes fournies : les 11 de `62027b4`, l'énumération hétérogène d'OCR-100, les 2
`alias_self_loop`, OCR-115 amendé, OCR-006 jamais relu, et les 4 de la migration `wtf → wtr`.

## Répartition : ~~**16 · 15 · 2**~~ → **29 · 3 · 1** *(voir la mise à jour en tête ; les tableaux ci-dessous gardent la mesure du 07-21, l'assignation est superseded)*

### PHASE 1 — 16 Records
*Objectif gravé : « valider la procédure de promotion elle-même. Le résultat attendu n'est
pas seulement des Records promus, c'est une procédure de promotion éprouvée. »*

| Record | Commits | Créé | Dern. modif. | Cité par | Review Status |
|---|---:|---|---|---:|---|
| OCR-000 Canonical Knowledge Governance | 1 | 07-16 | 07-16 | 6 | Pending editorial review |
| OCR-001 Canonical Registry Structure | 1 | 07-16 | 07-16 | 6 | Pending editorial review |
| OCR-002 Editorial Rules | 1 | 07-16 | 07-16 | 6 | Pending editorial review |
| OCR-003 Terminology Governance | 1 | 07-16 | 07-16 | 6 | Pending editorial review |
| OCR-004 Entity Relationships | 1 | 07-16 | 07-16 | 6 | Pending editorial review |
| OCR-005 Versioning Rules | 1 | 07-16 | 07-16 | 6 | Pending editorial review |
| **OCR-101 Professional Passport** | 1 | 07-16 | 07-16 | **17** | Pending machine-section diff |
| OCR-102 Professional Identity | 1 | 07-16 | 07-16 | 6 | Pending editorial review |
| OCR-103 Professional | 1 | 07-16 | 07-16 | 6 | Pending editorial review |
| **OCR-104 Opus ID** | 1 | 07-16 | 07-16 | **14** | Pending machine-section diff |
| OCR-111 Evidence Source | 1 | 07-16 | 07-16 | 4 | Pending machine-section diff |
| OCR-112 Evidence Lifecycle | 1 | 07-16 | 07-16 | **1** | Pending machine-section diff |
| OCR-113 Evidence Integrity | 1 | 07-16 | 07-16 | 7 | Pending machine-section diff |
| OCR-122 Organization | 1 | 07-16 | 07-16 | 2 | Pending editorial review |
| OCR-124 Canonical Registry | 1 | 07-16 | 07-16 | 3 | Pending editorial review |
| OCR-125 Identity | 1 | 07-16 | 07-16 | 3 | Pending editorial review |

**Deux observations factuelles**, sans recommandation : les 6 Records de gouvernance
(OCR-000..005) sont ceux **qui définissent la procédure de promotion elle-même** — dont
OCR-005, qui en énonce les règles ; et OCR-112 n'est cité que par **1** Record, ce qui
satisfait le critère « déjà utilisé comme référence » à sa borne inférieure.

### PHASE 2 — 15 Records
*Objectif : valider le contenu.*

| Record | Commits | Dern. modif. | Cité par | Motif de rangement |
|---|---:|---|---:|---|
| **OCR-100 World Skills Protocol** | 3 | 07-20 | **26** | rectification `62027b4` · énumération hétérogène · `alias_self_loop` |
| OCR-105 Trust | 3 | 07-20 | 21 | rectification `62027b4` |
| OCR-106 Trust Status | 3 | 07-20 | 10 | rectification `62027b4` |
| OCR-107 Verification | 3 | 07-20 | 14 | rectification `62027b4` |
| OCR-108 Verification Request | 3 | 07-20 | 5 | rectification `62027b4` |
| OCR-109 Verification Response | 3 | 07-20 | 5 | rectification `62027b4` |
| **OCR-110 Evidence** | 3 | 07-20 | **23** | rectification `62027b4` |
| **OCR-114 Immutable Fact** | 3 | 07-20 | 18 | rectification `62027b4` · `alias_self_loop` |
| **OCR-115 Framework** | **4** | **07-21** | 15 | rectification `62027b4` · **amendé v1.1.0 hier** |
| OCR-116 Skill | 2 | 07-18 | 5 | migration `wtf → wtr` |
| OCR-117 Competency | 2 | 07-18 | 5 | migration `wtf → wtr` |
| OCR-118 Capability | 2 | 07-18 | 3 | migration `wtf → wtr` |
| OCR-119 Framework Registry | 2 | 07-18 | 9 | migration `wtf → wtr` |
| OCR-120 Issuer | 3 | 07-20 | 7 | rectification `62027b4` |
| OCR-121 Certified Issuer | 3 | 07-20 | 5 | rectification `62027b4` |

**OCR-115 est le seul Record modifié aujourd'hui** (v1.1.0, `2acdbb9`) et le seul en
version `1.1.0` — les 32 autres sont en `1.0.0`.

### PHASE 3 — 2 Records
*Objectif : valider la méthode. Première revue complète.*

| Record | Commits | Créé | Cité par | Motif |
|---|---:|---|---:|---|
| **OCR-006** Architectural Principles | 2 | **2026-07-20** | **0** | créé **après** l'import · jamais relu · **absent de la synthèse de grounding** · ni `Canonical Name` ni `GEO Summary` |
| **OCR-123** Professional Profile | 1 | 07-16 | **0** | **cité par aucun Record** — jamais exercé comme référence |

**OCR-123 n'était identifié dans aucune liste de dettes.** Il apparaît ici par la seule
mesure : c'est le seul Record de l'import initial que **personne ne cite**. Il n'a donc
jamais été éprouvé par une référence croisée — ce qui est exactement le critère de la
Phase 3.

## Une précondition d'OCR-005 qui s'applique aux trois phases

OCR-005 § *Status Transitions (Normative)* :

> « `Draft → Normative` — **MUST** require grounding (agreement with implementation, per
> OCR-000) and Opus X approval. »

Le grounding OCR-GROUND-001 couvre **32 Records**. **OCR-006 n'y figure pas** (0 mention) :
il a été créé après. La précondition de grounding est donc **satisfaite pour 32, non
satisfaite pour OCR-006** — indépendamment de son rangement en Phase 3.

---

# PARTIE II — L'EMPREINTE COUVRE-T-ELLE LE STATUT DOCUMENTAIRE ?

## 1 · Sur quoi le checksum est calculé — **le fichier entier**

`scripts/registry/manifest.mjs`, lignes 254-256 :

```js
const full = path.join(inputDir, filename);
const buf = readFileSync(full);
const content = buf.toString('utf8');
const checksum = createHash('sha256').update(buf).digest('hex');
```

`readFileSync(full)` lit **tout le fichier** ; `update(buf)` hache **tous ses octets**.
L'extraction de l'en-tête (`extractHeader`) intervient **après**, pour l'inventaire, et
**ne restreint pas** le périmètre haché. Aucun découpage, aucune exclusion.

`lib/registry/source.ts` ne recalcule rien : `loadRecord` sert `rec.checksum_sha256`, la
valeur du manifeste. Il n'existe donc **qu'un seul** checksum documentaire, et il porte sur
le fichier complet.

## 2 · Le statut est-il dans le périmètre haché — **oui, mécaniquement**

L'en-tête étant inclus dans les octets hachés, **le champ `Status` est dans le périmètre**.
Ce n'est pas une interprétation : c'est une conséquence directe de `update(buf)`.

Il en va de même de `Review Status`, `Version`, `Last Update` et de tous les champs du
tableau d'en-tête.

## 3 · Ce que le corpus dit de l'empreinte — **rien**

Recherche exhaustive de `checksum`, `sourceChecksum`, `fingerprint` :

- **dans les 33 Records du corpus : 0 occurrence.** Le corpus ne définit ni ne mentionne
  l'empreinte documentaire.
- **OCR-005 (Versioning Rules) : 0 occurrence.** Il gouverne les versions, les transitions
  de statut et l'interdiction des modifications silencieuses — jamais l'empreinte.
- **ENG-002 : 3 occurrences, sans rapport.** Elles portent sur `claimed_level`, décrit
  comme « a **checksum**, not a data field » — un contrôle de conformité de l'Issuer, pas
  une empreinte de document.

La seule phrase du dépôt énonçant une signification se trouve dans un **plan généré**,
`content/registry/MANIFEST-OCR.json` § `rollback_plan` :

> `"integrity_anchor": "sourceChecksum (sha256 du .md) par Record — permet de vérifier
> qu'un artefact restauré correspond à sa source."`

Elle décrit l'empreinte comme l'ancre d'un **artefact de fichier** (« qu'un artefact
restauré correspond à sa source »), non comme l'empreinte d'un contenu canonique. Mais
elle figure dans un document **généré, non normatif, et explicitement `applied: false``**.

**La signification de l'empreinte n'est établie par aucune source normative.** C'est le
fait central de cette partie.

## 4 · Conséquence mesurée d'un changement de statut

Simulation sur **copie hors dépôt** (OCR-110, aucun fichier du dépôt modifié) —
`Draft` → `Validated`, **rien d'autre** :

```
lignes modifiées : 2
   -| **Status** | Draft |
   +| **Status** | Validated |

checksum au manifeste        86b0a82bdbd3bf530131f08963bd72646fbfc30f9c094af4bdb2f67ffb779b59
checksum avant (blob LF)     86b0a82b…  concordent : OUI
checksum après               eb6c80511b05d9e6ae475fbc6f613bd81c76dd06cac23f03836cd59e0a9d0df6
a-t-il changé                OUI
octets                       27 939 → 27 943  (+4)
```

| Question | Réponse mesurée |
|---|---|
| Le checksum change-t-il ? | **Oui**, pour un changement de 4 octets dans un champ d'en-tête. |
| `_manifest.json` devient-il incohérent ? | **Oui** — son `checksum_sha256` ne correspondrait plus. |
| `MANIFEST-OCR.json` ? | **Oui**, il dérive du précédent (`sourceChecksum` repris de l'inventaire). |
| Le contrôle d'intégrité échoue-t-il ? | **Il n'y a pas de contrôle.** Voir ci-dessous. |

### ⚠️ Aucun contrôle d'intégrité n'existe ~~(état du 07-21)~~ → **CORRIGÉ depuis le 2026-07-22**

> **Un contrôle existe désormais** : `lib/registry/manifest.attestation.test.ts` rejoue le sha256
> de chaque Record et l'oppose au manifeste, à chaque `npm test`/build, prouvé par mutation. La
> divergence des 11 checksums ne pourrait plus rester invisible. Le constat ci-dessous décrit
> l'état antérieur, conservé comme trace.

Le checksum est **produit** (`manifest.mjs`) et **servi** (`api.ts`, `source.ts`), il n'était
**jamais comparé**. Aucun test ne le vérifiait ; aucun script ne le recalculait pour l'opposer
au manifeste.

**Preuve par l'histoire** : 11 checksums sur 33 sont restés **faux pendant plusieurs
jours** après la rectification `62027b4`, sans qu'aucun build, aucun test ni aucun
déploiement n'échoue. L'écart a été découvert par une mesure manuelle, pas par un garde-fou.

Conséquence pour la décision : **la promotion ne « cassera » rien de façon visible**. Le
manifeste divergera silencieusement, comme il a déjà divergé. Le coût d'un mauvais choix ne
se manifestera pas immédiatement — ce qui est un argument pour trancher maintenant, pas
plus tard.

## 5 · Précédent — **aucun**

Recherche sur **tout** l'historique du dépôt (`git rev-list --all`) :

```
| **Status** | Draft |                                        ← seule valeur ayant jamais existé
| **Review Status** | Pending editorial review |
| **Review Status** | Pending machine-section diff against production code |
```

Deux commits seulement ont touché ces champs : `4d6f998` (import initial) et `1cbc8fc`
(création d'OCR-006). **Aucun Record n'a jamais changé de statut.** `Status` n'a jamais valu
autre chose que `Draft`, et `Review Status` n'a jamais quitté ses deux valeurs « Pending ».

La première promotion serait **la première transition de statut de l'histoire du corpus**.

## 6 · Ce qu'OCR-005 dit d'un changement de statut — **il le classe sans le graduer**

§ *Change Classification (Normative)*, verbatim et complet :

> - Adding a clarification consistent with existing meaning — **MINOR**.
> - Changing a normative rule incompatibly — **MAJOR**.
> - Fixing a typo, formatting, or informative example without changing meaning — **PATCH**.
> - Promoting `Draft → Normative` — **recorded as a release with the grounding note resolved.**

Les trois premières entrées portent un niveau. **La quatrième n'en porte aucun.** La
promotion figure donc dans la classification des changements **sans être MAJOR, ni MINOR,
ni PATCH** : elle est « recorded as a release » — une formule qui n'est définie nulle part
ailleurs dans le corpus.

Le § *No Silent Edits* ne s'y applique pas : il vise les modifications de **sens normatif
publié**, et une promotion n'en modifie aucun.

**OCR-005 ne dit donc pas si la version documentaire change lors d'une promotion.** Le
corpus est muet sur ce point comme il l'est sur l'empreinte.

---

# SYNTHÈSE DES FAITS — pour la décision sur l'empreinte

1. Le checksum porte sur **le fichier entier** ; le statut y est **inclus mécaniquement**.
2. **Aucune source normative** ne dit ce que l'empreinte représente. La seule phrase
   existante est dans un plan généré et la décrit comme l'ancre d'un **artefact de
   fichier**.
3. Une promotion **change le checksum** (+4 octets suffisent) et rend les **deux
   manifestes** incohérents.
4. **Aucun contrôle d'intégrité n'existe** : l'incohérence serait silencieuse, comme elle
   l'a déjà été pendant plusieurs jours.
5. **Aucun précédent** : ce serait la première transition de statut du corpus.
6. **OCR-005 classe la promotion sans lui attribuer de niveau de version.**

Les faits sont rendus. La signification de l'empreinte — contenu canonique ou artefact
documentaire complet — n'est pas tranchée ici, et aucune procédure n'est proposée.

**Aucun fichier du dépôt n'a été modifié par cette mesure.**

---

# PARTIE III — LE STATUT EST PERSISTÉ (principe 9 enfreint) · 2026-07-24

**Constat brut, mesuré, non atténué.**

1. **`Status` est un champ persisté du Markdown** : `| **Status** | Draft |`, présent dans les
   **33/33** Records (ex. `OCR-110_Evidence.md:9`).
2. **Il est lu de ce champ, pas dérivé** : `lib/registry/recordPage.ts:115` (`fields['Status']`),
   `:143` ; `robotsFromStatus` (`:127`) en dérive le `robots`.
3. **Principe 9 (OCR-006), conséquence normative verbatim** : *« Status SHALL NOT be stored as a
   column, **field** or attribute of any published representation. »* Le corpus stocke `Status`
   comme un champ. **P9 est enfreint dans le corpus, avant toute promotion.**

**Deux questions qui REMONTENT à l'Architecte (non conçues ici) :**

- **Collision avec le principe 5.** Les *Notes* de P9 : *« Persisting a status … would additionally
  require modifying that representation, which Principle 5 forbids. »* Promouvoir en changeant le
  champ (`Draft → Normative`) est une **mutation**, interdite par P5. Le mécanisme de promotion par
  champ persisté **contredit P5**.
- **Seconde source.** Dériver le statut (comme P9 l'exige) créerait une **seconde source** à côté du
  champ. *« The two may diverge. »* **Laquelle gouverne ?** Le champ persisté ou la dérivation ?
- **Portée de P9** (à trancher aussi) : « Status » y vise-t-il le statut du **protocole** (Trust /
  Evidence, dérivé de faits) ou **aussi** le statut **documentaire** du Record (Draft/Normative) ?
  Le libellé « any published representation » est général ; le Record en est-il une ? Non résolu ici.

**Conséquence pour la Phase 1 :** son premier acte (une transition de statut) serait, en l'état, soit
une **mutation interdite par P5**, soit la reconnaissance qu'il faut **cesser de persister le statut**
et le dériver — deux directions opposées, aucune tranchée. La mesure est rendue ; rien n'est corrigé.
