# Inventaire des principes orphelins — préalable à l'Index Normatif

> **Livrable d'inventaire. Aucune rédaction normative.** Ce document **constate** ; il ne
> formule, ne corrige et ne normalise rien. Chaque formulation citée l'est **verbatim**,
> avec sa provenance explicite.

## Règle gravée par l'architecte (verbatim)

> « Aucun principe normatif ne peut avoir pour unique source une conversation, un compte
> rendu de chantier ou un échange de conception. Une conversation peut découvrir un
> problème, proposer une solution, justifier une décision. Mais elle ne constitue jamais
> une source normative durable. Le protocole n'est modifiable que par ses propres
> artefacts. »

**Conséquence** : l'Index Normatif est **reporté**. Le chantier de **normalisation des
principes orphelins** le précède. *L'autorité précède l'indexation.*

## Avertissement de provenance — à lire avant le tableau

Les 9 principes ci-dessous ont été énoncés par l'architecte **dans des échanges de
conception**. Leurs formulations ont été **transcrites** dans des documents de travail
(`docs/web/WEB-003-LOT-B-*`, `docs/migration/PLAN-*`) dont l'en-tête porte lui-même
« **Statut : CONCEPTION SEULE** ». **Ces documents ne sont pas des Records** et ne sont pas
normatifs. Au sens de la règle gravée, **la transcription d'un échange dans un document de
travail ne crée pas de source normative** : elle déplace la conversation, elle ne
l'institue pas.

En conséquence, la colonne « Source actuelle » ne cite **que des Records** (ou OCR-007,
seul registre `Approved / Normative`). Un principe dont la seule trace est un document de
travail est compté **orphelin**.

---

## Tableau d'inventaire

| # | Principe | Formulation canonique (verbatim) | Source actuelle | État |
|---|---|---|---|---|
| 1 | définition logique / représentation canonique | *échange — hors artefact* | — | **orphelin** |
| 2 | fait immuable / mécanisme de lecture | *échange — hors artefact* | OCR-100 §Machine Interpretation l.117 · OCR-105 §Canonical Definition l.22, 26 · OCR-114 §Canonical Definition l.26 | **partiellement porté** |
| 3 | résolution d'identité exclusivement en couche de lecture | *échange — hors artefact* | — | **orphelin** |
| 4 | réidentification par ajout pur | *échange — hors artefact* | OCR-114 §Canonical Definition l.26 · OCR-005 §Motivation l.27, §Summary l.105 | **partiellement porté** |
| 5 | conservation des propriétés normatives lors d'une réidentification | *échange — hors artefact* | — | **orphelin** |
| 6 | séparation des trois niveaux de versionnement | *échange — hors artefact* | OCR-005 §Scope l.23 (niveau documentaire seul) | **partiellement porté** |
| 7 | publication des seules relations référençables par un fait | *échange — hors artefact* | — | **orphelin** |
| 8 | statut dérivé, jamais stocké | *échange — hors artefact* | OCR-105 §Canonical Definition l.22, 26 · OCR-106 §Canonical Definition l.22, 26 · OCR-100 l.117 | **partiellement porté** |
| 9 | séparation entre identité et adresse de découverte | *échange — hors artefact* | — | **orphelin** |

**Aucun principe n'est « couvert ».** 5 orphelins · 4 partiellement portés · **0 couvert**.

---

## Détail par principe

### 1 — Distinction définition logique / représentation canonique → **ORPHELIN**

**Formulation de l'architecte (échange, PAS un artefact) :**
> « la **définition logique** (ce que signifie le Framework) — unique ; la **représentation
> canonique** (les lignes publiées sous un identifiant donné) — deux coexistent, wtf et
> wtr ; l'**identifiant canonique** lui-même. »
> « Les 7 lignes ne sont PAS une seconde définition : ce sont une seconde REPRÉSENTATION
> CANONIQUE de la même définition logique. Duplication de représentation imposée par
> l'append-only, pas duplication de sens. »

**Corpus** : `0` Record contient « représentation canonique ». OCR-115 (Framework) traite du
Framework, de ses versions et coordonnées, mais **ne distingue jamais** le sens de sa
représentation publiée sous un identifiant. **Aucune source normative.**

### 2 — Distinction fait immuable / mécanisme de lecture → **PARTIELLEMENT PORTÉ**

**Formulation de l'architecte (échange, PAS un artefact) :**
> « Tout passage décrivant un fait publié ou une donnée immuable emploie les coordonnées
> réellement portées par ce fait. Tout passage décrivant une définition, une règle, une
> capacité, un mécanisme ou un comportement du protocole emploie les coordonnées canoniques
> en vigueur au moment de la lecture. »

**Ce que le corpus porte déjà** (l'idée, non la formulation) :
- **OCR-100 l.117** : « Trust artifacts are computed views over facts and are never authored directly. »
- **OCR-105 l.22** : « *Evidence Is Produced. Trust Is Verified.* […] Trust is never asserted, never typed in […] it is derived » ; **l.26** : « computed, not asserted ».
- **OCR-114 l.26** : le fait est immuable, « enforced by the database, not by application discipline ».

**Ce qui manque** : le corpus sépare **fait produit** et **calcul de confiance**. Il ne
formule **nulle part** la distinction en termes de **mécanisme de lecture**, ni la règle de
choix de coordonnée qui en découle.

### 3 — Résolution d'identité exclusivement en couche de lecture → **ORPHELIN**

**Formulation de l'architecte (échange, PAS un artefact) :**
> « La résolution canonique d'identité appartient exclusivement à la couche de lecture.
> Aucun mécanisme du WSP n'est autorisé à modifier un fait publié, directement ou
> indirectement, y compris lors d'un changement d'identifiant canonique. »

**Corpus** : `0` Record contient « couche de lecture ». OCR-119 est bien une « resolution
layer », mais pour la **résolution d'une coordonnée vers ses critères** — jamais pour la
**résolution d'identité**. **Aucune source normative.**

### 4 — Réidentification par ajout pur → **PARTIELLEMENT PORTÉ**

**Formulation de l'architecte (échange, PAS un artefact) :**
> « Une définition publiée est immuable. Si son identité canonique doit évoluer sans
> modification de sa définition, la seule opération autorisée est une réidentification. »

**Ce que le corpus porte déjà** (la discipline d'ajout, non la réidentification) :
- **OCR-114 l.26** : « Corrections do not edit facts — they add superseding facts;
  withdrawals do not delete facts — they add revocation facts. »
- **OCR-005 l.27** et **l.105** : « correct by adding a new version, never by editing the past ».

**Ce qui manque** : `0` Record ne contient « réidentif- ». La correction **par ajout** est
gravée pour les **faits** et les **versions** ; **jamais pour l'identité canonique**.

### 5 — Conservation des propriétés normatives lors d'une réidentification → **ORPHELIN**

**Formulation de l'architecte (échange, PAS un artefact) :**
> « **CONSERVÉ à l'identique** : tout ce qui exprime le contenu normatif, le comportement,
> la portée ou la validité — date d'entrée en vigueur, définition, comportements,
> contraintes, garanties, effets, exigences de conformité. *« Que dit cette définition ? »*
> **RENOUVELÉ** : ce qui est propre à l'acte de réidentification — identifiant canonique,
> métadonnées de publication de la nouvelle représentation, liens `reidentified_as`,
> informations de continuité. *« Sous quelle identité est-elle publiée ? »*
> **CRITÈRE** : si modifier une valeur change le sens, les effets ou les obligations de la
> définition, elle ne peut pas être modifiée lors d'une réidentification. »

**Corpus** : la réidentification étant absente, la règle de conservation qui l'accompagne
l'est aussi. **Aucune source normative.**

### 6 — Séparation des trois niveaux de versionnement → **PARTIELLEMENT PORTÉ**

**Formulation de l'architecte (échange, PAS un artefact) :**
> « trois cycles de vie indépendants (documentaire, Framework, protocole) » — l'architecte
> « refuse de déduire une règle par analogie ».
> Et, sur le niveau Framework : « la distinction gravée entre version d'implémentation et
> version normative — `1.0.0` est réservé à la première publication normative complète du
> protocole ».

**Ce que le corpus porte déjà** (un seul des trois niveaux) :
- **OCR-005 l.23** : « This document governs versioning **of OCRs** […] It does not define
  concepts, structure (OCR-001), editorial register (OCR-002), terminology (OCR-003), or
  relationships (OCR-004). » → OCR-005 couvre **exclusivement le niveau documentaire**.
- Le niveau **Framework** apparaît dans OCR-115 (versions du Framework) ; le niveau
  **protocole** dans OCR-100 (`protocol_version`).

**Ce qui manque** : les trois niveaux **coexistent** dans le corpus mais leur **séparation
n'est énoncée nulle part** comme règle. Aucun Record n'interdit de raisonner par analogie
d'un niveau à l'autre.

### 7 — Publication des seules relations référençables par un fait → **ORPHELIN**

**Formulation de l'architecte (échange, PAS un artefact) :**
> « une relation n'est publiée que pour un identifiant susceptible d'être référencé
> directement par un fait immuable »

**Corpus** : **OCR-004** (Entity Relationships) est le porteur naturel — il fixe le
vocabulaire des prédicats et les invariants du graphe (**l.19**, **l.50** cohérence
bidirectionnelle, **l.64** conformité). Mais il **ne dit rien** sur la **granularité de
publication** des relations. **Aucune source normative.**

### 8 — Statut dérivé, jamais stocké → **PARTIELLEMENT PORTÉ**

**Formulation de l'architecte (échange, PAS un artefact) :**
> « le statut […] n'est JAMAIS stocké sur la définition, il se DÉRIVE de l'existence d'une
> relation »
> « représentation historique → status `reidentified` + `canonical_identifier` ;
> représentation courante → status `canonical` + `previous_identifier`. Jamais persistés. »

**Ce que le corpus porte déjà** (pour le Trust, non pour l'identité) :
- **OCR-106 l.22** : « never typed in, never set by an Issuer, and **never stored as an
  authored opinion** » ; **l.26** : « reproducible, recomputable, **never authored** […] not
  a stored opinion ».
- **OCR-105 l.22 / l.26** : Trust « derived », « computed, not asserted ».
- **OCR-100 l.117** : « computed views over facts and are never authored directly ».

**Ce qui manque** : le principe est gravé **pour le Trust Status uniquement**. Il n'est
**jamais généralisé** à un statut d'identité, ni énoncé comme règle transverse.

### 9 — Séparation entre identité et adresse de découverte → **ORPHELIN**

**Formulation de l'architecte (échange, PAS un artefact)** — ⚠️ *fragment* :
> « chaque version a son adresse propre » · « aucune redirection permanente ne subsiste »

> **⚠️ Signalement d'attribution.** Je n'ai **pas** de formulation de l'architecte énonçant
> la *séparation entre identité et adresse de découverte* comme telle. Les deux fragments
> ci-dessus sont les seuls énoncés par lui. Le développement (« l'id nu ne résout pas »,
> « deux portes, pas trois », identité ≠ adresse) est une **formulation de l'exécutant**,
> inscrite dans un commentaire de code — **elle n'a aucune valeur normative** et ne doit pas
> être prise pour une parole d'architecte.

**Corpus** : OCR-115 porte le « Framework ID », OCR-119 la résolution des coordonnées ;
**aucun Record** ne traite d'une **adresse de découverte** ni de sa séparation d'avec
l'identité. **Aucune source normative.**

---

## Synthèse

| État | Nombre | Principes |
|---|---|---|
| **couvert** | **0** | — |
| **partiellement porté** | **4** | 2, 4, 6, 8 |
| **orphelin** | **5** | 1, 3, 5, 7, 9 |

Les 4 « partiellement portés » le sont **par analogie de domaine** : le corpus grave la
discipline pour les **faits** (OCR-114), les **versions documentaires** (OCR-005) et le
**Trust** (OCR-105/106) — jamais pour l'**identité canonique**. Aucune extension n'est
déductible : l'architecte a précisément refusé le raisonnement par analogie entre niveaux
(principe 6).

---

## Espace des identifiants — état observé

### Records existants (32), par numéro croissant

| N° | Titre | Emplacement | Statut |
|---|---|---|---|
| OCR-000 | Canonical Knowledge Governance | `registry-import/OCR-100/` | Draft |
| OCR-001 | Canonical Registry Structure | `registry-import/OCR-100/` | Draft |
| OCR-002 | Editorial Rules | `registry-import/OCR-100/` | Draft |
| OCR-003 | Terminology Governance | `registry-import/OCR-100/` | Draft |
| OCR-004 | Entity Relationships | `registry-import/OCR-100/` | Draft |
| OCR-005 | Versioning Rules | `registry-import/OCR-100/` | Draft |
| **OCR-007** | **Canonical Predicate Registry** | **`docs/registry/`** | **Approved / Normative** |
| OCR-100 | World Skills Protocol | `registry-import/OCR-100/` | Draft |
| OCR-101 | Professional Passport | `registry-import/OCR-100/` | Draft |
| OCR-102 | Professional Identity | `registry-import/OCR-100/` | Draft |
| OCR-103 | Professional | `registry-import/OCR-100/` | Draft |
| OCR-104 | Opus ID | `registry-import/OCR-100/` | Draft |
| OCR-105 | Trust | `registry-import/OCR-100/` | Draft |
| OCR-106 | Trust Status | `registry-import/OCR-100/` | Draft |
| OCR-107 | Verification | `registry-import/OCR-100/` | Draft |
| OCR-108 | Verification Request | `registry-import/OCR-100/` | Draft |
| OCR-109 | Verification Response | `registry-import/OCR-100/` | Draft |
| OCR-110 | Evidence | `registry-import/OCR-100/` | Draft |
| OCR-111 | Evidence Source | `registry-import/OCR-100/` | Draft |
| OCR-112 | Evidence Lifecycle | `registry-import/OCR-100/` | Draft |
| OCR-113 | Evidence Integrity | `registry-import/OCR-100/` | Draft |
| OCR-114 | Immutable Fact | `registry-import/OCR-100/` | Draft |
| OCR-115 | Framework | `registry-import/OCR-100/` | Draft |
| OCR-116 | Skill | `registry-import/OCR-100/` | Draft |
| OCR-117 | Competency | `registry-import/OCR-100/` | Draft |
| OCR-118 | Capability | `registry-import/OCR-100/` | Draft |
| OCR-119 | Framework Registry | `registry-import/OCR-100/` | Draft |
| OCR-120 | Issuer | `registry-import/OCR-100/` | Draft |
| OCR-121 | Certified Issuer | `registry-import/OCR-100/` | Draft |
| OCR-122 | Organization | `registry-import/OCR-100/` | Draft |
| OCR-123 | Professional Profile | `registry-import/OCR-100/` | Draft |
| OCR-124 | Canonical Registry | `registry-import/OCR-100/` | Draft |
| OCR-125 | Identity | `registry-import/OCR-100/` | Draft |

*(32 fichiers dans `registry-import/OCR-100/` + OCR-007 dans `docs/registry/` = 33 documents.)*

### Trous dans la série

- **OCR-006** — **libre** (seul rang libre avant les réservations).
- **OCR-008 → OCR-012** — **RÉSERVÉS** par OCR-007 §0 : états → OCR-008, contraintes/négations
  → OCR-009, types → OCR-010, inférence → OCR-011, cardinalités → OCR-012.
- **OCR-013 → OCR-099** — **libres** (87 rangs).
- Série **OCR-100 → OCR-125** : **continue, sans trou**.

> ⚠️ Le rang **OCR-007 n'est PAS un trou** : il est occupé par le Canonical Predicate
> Registry, qui vit dans `docs/registry/` et non dans le dossier d'import des Records. Un
> balayage du seul dossier d'import le ferait apparaître à tort comme disponible.

### Records existants qui pourraient accueillir certains principes — **observation, pas décision**

| Record | Pourquoi il est adjacent | Principes concernés |
|---|---|---|
| **OCR-000** Canonical Knowledge Governance | gouverne la connaissance canonique et son autorité ; porterait naturellement la règle « aucune conversation n'est source normative » | règle gravée elle-même |
| **OCR-004** Entity Relationships | fixe le vocabulaire des relations et les invariants du graphe (l.19, 50, 64) | **7** |
| **OCR-005** Versioning Rules | couvre déjà le niveau documentaire (l.23) et la correction par ajout (l.27) | **4**, **6** |
| **OCR-114** Immutable Fact | grave l'append-only et la correction par ajout (l.26) | **2**, **4** |
| **OCR-105 / OCR-106** Trust / Trust Status | gravent « dérivé, jamais stocké » pour le Trust (l.22, 26) | **8** |
| **OCR-115** Framework | porte l'identité et le versionnement du Framework | **1**, **9** |
| **OCR-100** World Skills Protocol | racine du protocole ; porte déjà la séparation fait/calcul (l.117) | **2**, **3** |

**Aucune de ces adjacences n'est une recommandation.** Elles indiquent seulement où le
corpus parle **déjà** d'un sujet voisin. Le choix — étendre un Record existant ou en créer
un nouveau (OCR-006 étant le seul rang libre avant les réservations) — appartient à
l'architecte.

---

## Annexe — champs de convention d'OCR-007 (PRD-306), pour la revue finale

Lors de l'amendement d'OCR-007 (`reidentified_as`), l'architecte a **dicté** : `name`,
Canonical Name, `family`, `canonical_inverse`, symétrie/antisymétrie, transitivité,
non-réflexivité, persistance des relations directes, exclusion normative (→ `supersedes`),
`semantic_contract` **verbatim**, domaine, portée.

Les champs suivants **n'ont pas été dictés** : ils ont été renseignés **par convention**,
alignés sur les prédicats existants, et sont marqués « à confirmer » dans OCR-007 §9.

### Dans `docs/registry/OCR-007_Canonical_Predicate_Registry.md` (entrée PRD-306)

| Champ | Valeur retenue | Convention d'alignement |
|---|---|---|
| `predicate_id` | **PRD-306** | rang suivant du bloc 3xx (301 `resolves` · 302 `identifies` · 303 `inspects` · 304 `queries` · 305 `maps`) |
| `relationship_type` | `Identity` | le type reflète la famille (cf. PRD-007 → `Temporal`, PRD-001 → `Taxonomic`) |
| `ontology_domain` | `domain` | §5 Domain Predicates (les primitives portent `primitive`) |
| `signature` | `{source:[published definition], target:[published definition]}` — *pending type registry (OCR-010)* | forme de PRD-007 + mention « pending type registry » commune à toutes les entrées ; types tirés du **domaine dicté** |
| `obligation` | `Optional` | **100 %** des prédicats existants |
| `constraints_ref` | `[OCR-009:inv-append-only]` | PRD-007 `supersedes` et PRD-004 `produces` |
| `stability` | `Core` | PRD-001 → PRD-008 (canonicals actifs) |
| `semantic_stability` | `Fixed` | canonicals gravés (≠ `Evolving` du §7) |
| `introduced_in` | `OCR-007 v1.2 (amendement Lot B)` | auto-référence : **aucun Record** ne l'introduit |
| `governed_by` | `[OCR-004, OCR-007]` | **100 %** des prédicats existants |
| `used_by` | `0 occurrence` | PRD-009 `extends` (prédicat sans occurrence) |

### Dans `content/registry/ocr-007-resolution.json` (projection machine, 2 entrées)

| Champ | `reidentified_as` | `was_reidentified_from` | Convention d'alignement |
|---|---|---|---|
| `status` | `Domain` | `Derived` | §5 Domain Predicates / §4 Inverses dérivés |
| `direction` | `forward` | `inverse` | couple `supersedes` / `superseded_by` |
| `flip_edge` | `false` | `true` | idem |
| `emit_edge` | `true` | `true` | toutes les entrées non-`Rejected` |
| `target_registry` | `null` | `null` | toutes les entrées non-`Rejected` |
| `predicate_id` | `PRD-306` | `PRD-306` | l'inverse dérivé partage le PRD de son canonical (cf. `superseded_by` → PRD-007) |

**Total : 11 champs de convention dans le registre + 6 dans la projection.** Aucun n'a été
dicté ; tous sont dérivés d'un précédent existant. Le seul où il a fallu **créer** plutôt
qu'incrémenter est `predicate_id` — et il a été ramené au bloc 3xx existant sur décision de
l'architecte (voie (b)), sans création de famille.
