# LOT B — Publication d'une seconde représentation canonique (`framework:wtr`) par réidentification

> **Statut : CONCEPTION SEULE.** Aucun SQL, aucun code, aucune migration, aucune
> exécution. Ce document est la **référence versionnée d'une opération irréversible**
> (§8 : une publication append-only ne se retire pas). Il précède l'implémentation ;
> il ne l'autorise pas. L'implémentation partira d'une branche neuve depuis `main`,
> sur mandat dédié.
>
> **Historique**
> - **v1 (2026-07-19)** — conception fondée sur `supersedes` (PRD-007).
> - **v2 (2026-07-19)** — `supersedes` **écarté** ; prédicat NOUVEAU de **réidentification
>   canonique** (nom en attente d'OCR-007). Ajout §10 (Trust) et §11 (artefacts OCR-007).
> - **v3 (2026-07-19)** — précisions architecte : **(A)** vocabulaire à trois niveaux
>   (définition logique / représentation canonique / identifiant canonique) ; **(B)**
>   **transitivité** — seules les relations DIRECTES sont publiées ; **(C)** principe de
>   **projection du graphe** — `c172712` n'est PAS re-gravé, une nouvelle projection est
>   produite APRÈS publication. Ordre d'exécution corrigé (§8 : gravure du graphe en
>   dernier). Nom de travail du prédicat aligné sur `reidentified_as`.
>
> **(A) Vocabulaire à trois niveaux — À EMPLOYER dans tout le dossier.**
> 1. **Définition logique** — ce que *signifie* le Framework (la Skill « Intention vs
>    Engagement », ses 4 niveaux, ses bandes). **Unique.** Elle ne se duplique jamais.
> 2. **Représentation canonique** — les **lignes publiées** sous un identifiant donné.
>    **Deux coexistent** : celle sous `wtf` et celle sous `wtr`. La seconde n'est **PAS une
>    seconde définition** — c'est une **seconde représentation canonique de la MÊME
>    définition logique**, **duplication de représentation imposée par l'append-only**
>    (on ne peut pas muter l'identifiant, donc on republie), **jamais duplication de sens**.
> 3. **Identifiant canonique** — le nom protocolaire lui-même (`framework:wtf`,
>    `framework:wtr`, `wtf:212`, `wtr:212`). C'est **lui seul** qui change ; la
>    réidentification relie deux identifiants d'une même définition logique.
>
> **(B) Transitivité.** Seules les relations **DIRECTES** (élémentaires) sont publiées. Une
> relation **déductible** n'est **jamais** stockée. La base ne contient que les faits
> élémentaires ; la chaîne se **reconstruit** à la lecture.
>
> **Prédicat — NOM EN ATTENTE DE GRAVURE OCR-007.** Nom de travail employé ici :
> **`reidentified_as`** (formulation provisoire de l'architecte), lu **antérieur →
> courant** : « `framework:wtf` `reidentified_as` `framework:wtr` ». À remplacer par le
> terme et la **famille** que gravera OCR-007 (`supersedes` était *Temporal* ; la
> réidentification relève d'une famille **Identité/Équivalence** — rien de chronologique
> n'est asserté — arbitrage architecte).
>
> **Décisions gravées par l'architecte** : table de réidentification append-only, mécanisme
> canonique pour TOUS les objets immuables du protocole ; le statut n'est **jamais stocké**
> sur la représentation, il se **DÉRIVE** de l'existence d'une relation ; plusieurs relations
> possibles dans le temps, chaîne reconstructible (relations directes seulement — B) ;
> `framework:wtr` prend le slug `world-trader`, `framework:wtf` conserve `wtf` ; aucune
> redirection permanente, chaque identité a son adresse propre ; la découverte canonique
> indique laquelle est courante ; les deux représentations portent la **même définition
> logique**, le Trust ne fait qu'une **résolution d'identité** ; le graphe est une
> **projection fidèle du corpus publié à un instant donné** (C, voir §7).
>
> **Ancrage** : `supabase/migrations/20260713000001_wsp_framework.sql` &
> `…0002_wsp_fact_store.sql` & `…0005_wsp_ingestion.sql` ; `lib/wsp/evidenceCovered.ts` ;
> `lib/api/readPublicPassport.ts` ; `lib/dashboard/DashboardService.ts` ;
> `app/frameworks/[id]/skills/route.ts` ; `lib/seo/transitional-redirects.ts` ;
> `docs/registry/OCR-007_Canonical_Predicate_Registry.md` +
> `content/registry/ocr-007-resolution.json` ; KG `content/registry/wsp-graph.json`
> (projection `c172712`) ; 14 Records de `docs/web/registry-import/OCR-100/`.

---

## 1. Schéma de la table de réidentification

Mécanisme canonique pour **tous** les objets immuables. Elle relie deux **identifiants
canoniques** (niveau 3 du vocabulaire A) d'une **même définition logique** (niveau 1). Forme
proposée (décrite, non écrite en SQL) :

| Colonne | Type | Justification |
|---|---|---|
| `id` | text, PK | La relation **est elle-même un fait immuable** : identité propre, citable, jamais recalculée. |
| `predicate` | text, `check in ('reidentified_as')` | Rend la table **self-describing** et extensible sans changer sa forme. **Valeur en attente d'OCR-007** (nom de travail `reidentified_as`). |
| `prior_type` | text, `check in (…)` | Discrimine la table cible (`framework`, `framework_version`, `skill`, `skill_level`, …). Clé du polymorphisme. |
| `prior_id` | text | Identifiant canonique **antérieur** (`framework:wtf`). |
| `canonical_type` | text, `check in (…)` | Idem côté identité courante. |
| `canonical_id` | text | Identifiant canonique **courant** (`framework:wtr`). |
| `recorded_at` | timestamptz, default now() | Enveloppe système immuable. |
| `effective_at` | date, nullable | Date **domaine** de la réidentification, si souhaité. |

### Le prédicat change-t-il la forme de la table ? — **Non**
`predicate` est de type **`text`** : il accepte n'importe quelle chaîne ; seule la
**contrainte `check in (…)`** restreint les valeurs. Graver un prédicat = **redéfinir le
CHECK**, un **changement de définition de contrainte**, **pas** un changement de forme
(aucune colonne ajoutée/retirée, aucun type modifié). C'est pourquoi `predicate` est une
**colonne first-class self-describing** : la table absorbe un nouveau prédicat sans se
déformer.

### Référencer des objets de types différents sans FK unique
Une FK pointe vers **une** table ; les cibles vivent dans `wsp_frameworks`,
`wsp_framework_versions`, `wsp_skills`… — pas de FK unique possible.
- **(a) paire `type` + `id` polymorphe** — seul point commun : **un id canonique textuel**.
  **Recommandé.** Coût : intégrité non garantie par le SGBD, bornée par le chemin
  d'écriture contrôlé (`service_role`) + **trigger de validation à l'INSERT**.
- (b) colonnes FK par type / (c) une table par type — **rejetées** (explosion, contredit
  « sert TOUS les objets »).

### Chaîne circulaire (A → B → A)
Prédicat **asymétrique** (antérieur ≠ courant), imposé **structurellement à l'INSERT** :
`check (prior_id <> canonical_id …)` (self-loop) ; trigger anti-2-cycle ; **traversée
récursive** anti-n-cycle (refuse l'INSERT, jamais de mutation).

### Deux identités courantes concurrentes pour une même antérieure
**`unique (predicate, prior_type, prior_id)`** → réidentifiée **au plus une fois** → chaîne
**linéaire**, identité courante calculable. Reco : **aussi** `unique (predicate,
canonical_type, canonical_id)` (pas de fusion), sauf volonté contraire.

### « Identité courante » = l'objet qu'aucune ligne ne désigne comme antérieur
La tête est l'objet dont l'`id` **n'apparaît jamais dans `prior_id`** ; unicité sur
`prior_id` → pas de fourche → tête **unique**.

### Transitivité (B) — seules les relations directes sont stockées
La table ne contient que des maillons **directs** (A→B, B→C). La relation **déductible**
A→C **n'est jamais insérée** : elle se **reconstruit** en suivant les maillons. Corollaire
pour §9 : la question de granularité porte sur **quels maillons directs publier**, pas sur
un quelconque stockage de la clôture transitive.

### Trigger d'immuabilité sur cette table
**Oui, indispensable.** `BEFORE UPDATE OR DELETE … FOR EACH ROW` +
`BEFORE TRUNCATE … FOR EACH STATEMENT` → `wsp_reject_mutation()` (générique, réutilisable).
Sans elle, on pourrait **réécrire l'histoire** en éditant une ligne.

---

## 2. Ce qui est publié — une seconde REPRÉSENTATION, pas une seconde définition

On **INSÈRE** une **seconde représentation canonique** (sous `wtr`) de la **même définition
logique** déjà représentée sous `wtf` — miroir exact du seed déjà édité, appliqué au vivant
qui n'a que `wtf` :

| # | Table | Ligne |
|---|---|---|
| 1 | `wsp_frameworks` | `framework:wtr` · slug `world-trader` · « World Trader Framework » · publisher Opus X |
| 2 | `wsp_framework_versions` | `framework:wtr@0.1` · version `0.1` · status `published` |
| 3 | `wsp_skills` | `wtr:212` · code `WTR-212` · « Intention vs Engagement » |
| 4–7 | `wsp_skill_levels` | `wtr:212#aware/applied/proficient/mastery` (rangs 1→4, bandes 2-2 / 3-3 / 4-4 / 5-5) |
| 8 | **table de réidentification** | **`framework:wtf` `reidentified_as` `framework:wtr`** — `prior_id = framework:wtf`, `canonical_id = framework:wtr` |

**= 7 lignes de représentation + 1 ligne de réidentification = 8 INSERT** (granularité §9).

> **Cadrage (A)** : ces 7 lignes ne créent **aucune nouvelle définition logique**. Elles
> sont la **représentation canonique** de la définition existante sous un **nouvel
> identifiant**. La duplication est **de représentation** (contrainte append-only : on ne
> mute pas un identifiant publié), **jamais de sens**.

> ⚠️ **Direction (définitive)** : identité **courante** = `framework:wtr` (`canonical_id`),
> **antérieure** = `framework:wtf` (`prior_id`). L'inverse serait irréversible (§8).

- **Coordonnées `wtr:212` / `WTR-212`** : confirmées (corpus + seed).
- **Version** : seed = **`0.1`** ; `wtr` démarre à `0.1`, miroir de `wtf@0.1`. ⚠️ le corpus
  écrit `wtr@1.0.0` (§6, note version) — reco `0.1`, décision architecte.
- **4 niveaux à l'identique** : oui.
- **INSERT bloqué ?** **Non** — la garde ne couvre que UPDATE/DELETE/TRUNCATE, et aucune
  unicité ne s'oppose (PK/slug/uniques distincts de la lignée `wtf`).

---

## 3. Découverte canonique

**Statut DÉRIVÉ, jamais stocké.** Sous réidentification, `wtf` n'est **ni superseded ni
deprecated** : c'est la **même définition logique** sous une **représentation antérieure**.
**Valeurs proposées (NORMATIVES — jeton à graver par l'architecte)** :

| Côté | Champ dérivé proposé | Sens |
|---|---|---|
| `framework:wtf` (antérieur) | `identity_status: reidentified` + `canonical_id: framework:wtr` | Représentation antérieure d'une définition toujours vivante ; pointe vers l'identifiant courant. |
| `framework:wtr` (courant) | `identity_status: canonical` + `prior_id: framework:wtf` | Représentation canonique courante ; expose son identifiant antérieur. |

Les deux restent `published` au niveau version ; `identity_status` est une **surcouche
dérivée**, pas un remplacement de statut. *(L'enum `wsp_framework_versions.status` ne connaît
que `published`/`deprecated` — rien n'est stocké, tout se calcule.)*

**Dérivation dans la requête :** `.or(id.eq.${id},slug.eq.${id})` résout le framework ;
on **ajoute une lecture** de la table : `EXISTS(prior_id = framework.id)` → `canonical_id`
+ `reidentified` ; `EXISTS(canonical_id = framework.id)` → `prior_id` + `canonical`.

**Comportement cible :**
- `/frameworks/world-trader` → `framework:wtr`, `identity_status: canonical`,
  `prior_id: framework:wtf`.
- `/frameworks/wtf` → `framework:wtf`, `identity_status: reidentified`,
  `canonical_id: framework:wtr` *(après retrait de la 301 — §4)*.

⚠️ Aucune route `/frameworks/[id]` de *définition* n'existe (seulement `/skills`) → enrichir
`/skills` **ou** ajouter une route. Décision d'implémentation. **`/frameworks/wtr` (id nu)**
→ 404 aujourd'hui ; reco : ne pas l'ajouter (nuance : les Evidence portent `framework.id =
"wtr"` — alias possible si symétrie voulue).

---

## 4. Retrait de la redirection

**Supprimé :** `lib/seo/transitional-redirects.ts` (l'entrée `/frameworks/wtf/skills → 301`,
fichier retirable) ; `lib/seo/transitional-redirects.test.ts` ; le branchement dans
`next.config.ts` ; la **date gravée du 31 octobre 2026**.

**Amendé (PAS supprimé — historiques) :** `docs/migration/MIG-wtf-to-wtr-2026-07-18.md`
(section « Redirection transitoire » + date **caduques**) ; `PLAN-forward-wtf-to-wtr.md`.

**Conséquence** : `/frameworks/wtf/skills` cesse de rediriger et **résout** vers la
représentation sous l'identifiant antérieur — « chaque identité a son adresse propre »,
« wtf reste consultable ».

---

## 5. Le seed

Le seed `20260713000001` ne déclare **que `wtr`** → base fraîche = `wtr` seul. Pour
**reproduire l'état réel post-Lot B**, il doit contenir les **deux représentations
canoniques + la relation** :
1. **`framework:wtf` publié** — ses 7 lignes.
2. **`framework:wtr` publié** — ses 7 lignes (même définition logique, identifiant `wtr`).
3. **La ligne de réidentification** `framework:wtf` `reidentified_as` `framework:wtr`, à la
   **granularité retenue en §9**.

Tout en `on conflict do nothing`. ⚠️ Le seed reproduit la **couche définition** (les deux
représentations + la relation), **pas la couche faits** : les **79 Evidence** `wtf:212` sont
des données de production, jamais seedées.

---

## 6. Passages de Records à réécrire *(livrable principal — je délimite, l'architecte rédige)*

### La grille de tri
- **Couche DÉFINITION** (Framework, Skill, Competency, Capability, résolution du Registry)
  → la **représentation courante** est `wtr:212` → **JUSTE, garder `wtr`.**
- **Couche FAIT** (Evidence émise/journalisée, Immutable Fact, Trust calculé, Vérification
  d'un fait réel, mapping seedé) → les faits réels portent l'**identifiant antérieur
  `wtf:212`** (hash-portant, §10) → **FAUX en `wtr`.**

> **Note (A)** : `wtf:212` et `wtr:212` désignent la **même définition logique** ; ce qui
> diffère est l'**identifiant** stocké dans le fait. Un fait réel ne « devient » jamais
> `wtr:212` — il est **résolu** vers l'identifiant courant à la lecture (§10).

### Couche FAIT — passages proposés **FAUX** (→ `wtf:212`)

| Record | Ligne | Passage (verbatim abrégé) | Pourquoi faux |
|---|---|---|---|
| **OCR-121** Certified Issuer | 156 | « its Evidence referencing `wtr:212` is **accepted and journaled** » | Fait réalisé → journalisé en `wtf:212`. |
| **OCR-120** Issuer | 118 | JSON `"references_framework": "wtr:212"` | Référence d'Evidence produite. |
| **OCR-120** Issuer | 152 | « produces Evidence referencing `wtr:212`; Opus X **accepts it and binds it** » | Fait réalisé, lié au Passport. |
| **OCR-110** Evidence | 144 | JSON `"framework": { "id": "wtr", "reference": "wtr:212" }` | Corps d'une **Evidence** (artefact-fait). |
| **OCR-110** Evidence | 173–174 | JSON-LD `framework:wtr` + `"frameworkReference": "wtr:212"`, `isImmutable:true` | Modélise un **fait immuable**. |
| **OCR-110** Evidence | 198 | « emits Evidence referencing `wtr:212` … **journals the fact** … » | **LE** fait démontré réel. |
| **OCR-114** Immutable Fact | 161 | « An **accepted Evidence** for `wtr:212` is **written as an Immutable Fact** … » | Fait réalisé. |
| **OCR-109** Verif. Response | 116 | JSON `"verified": { "coordinate": "wtr:212", "facts": ["ev_01KXM07…"] }` | Fait **vérifié précis**. |
| **OCR-109** Verif. Response | 155 | « reports computed Trust for `wtr:212` … » | Trust sur faits réels. |
| **OCR-106** Trust Status | 112, 129 | `"framework_version": "wtr@1.0.0"` (×2) | Trust sur faits réels (+ version). |
| **OCR-105** Trust | 133 | JSON-LD `"interpretedAgainst": framework:wtr` | Trust interprété contre le framework des faits. *(borderline)* |

### Couche DÉFINITION — passages proposés **JUSTES** (→ garder `wtr:212`)

| Record | Lignes | Nature |
|---|---|---|
| **OCR-115** Framework | 16, 48, 61, 118, 125, 141–142, 163, 191–192, 215, 219, 235 | Le Framework lui-même — `framework:wtr` **est** la représentation courante. |
| **OCR-116** Skill | 126, 144 | Skill défini par `framework:wtr`. |
| **OCR-117** Competency | 24, 47, 63, 110, 125–126, 143, 172, 178, 195, 199, 215 | Compétence **définie**, adressée par `wtr:212`. |
| **OCR-118** Capability | 111, 127–128, 144 | Capability composant `wtr:212`. |
| **OCR-119** Framework Registry | 47, 60, 67, 187–192, 214, 218 | Couche de **résolution** courante. |

### Trois zones **BORDERLINE** — à trancher
- **OCR-100:117** — « Facts reference a Framework coordinate (e.g. `wtr:212`) » : générale,
  mais parle de faits.
- **OCR-119:114, 118–124, 138–143, 162, 191** — **mapping projet seedé** « four rows to
  `wtr:212` » : si `wsp_skill_mappings` réel → `wtf:212` (FAUX) ; si illustration → JUSTE.
- **OCR-108** (116, 132–133, 151, 207) — **scope de requête** `wtr:212`/`wtr@1.0.0` :
  forward ou rétro ?

### Note transverse — **la version**
Corpus `wtr@1.0.0` / `"1.0.0"` (OCR-106, 108, 109, 115) vs base + seed **`0.1`**. Seconde
inexactitude, orthogonale à la coordonnée — à décider.

### Lignes longues non dépliées (blocs machine / résumés)
OCR-115:16/26/211/223, OCR-117:20/191/203, OCR-119:16/22/26/210/222, OCR-110:16/253,
OCR-108:199/211, OCR-109:215, OCR-116:20/203, OCR-118:204, OCR-120:212, OCR-121:216 —
même coordonnée, classification héritée. Extraction verbatim sur demande.

---

## 7. Knowledge Graph — une projection, jamais réécrite

**Principe gravé (C)** : *« Le graphe est toujours une projection fidèle du corpus publié à
un instant donné. Il n'anticipe jamais des faits futurs et ne réécrit jamais des faits
passés. Toute publication append-only produit une NOUVELLE projection, sans modifier les
projections antérieures. »*

**Conséquences (rectifient v2) :**
- **`c172712` n'est PAS re-gravé.** Il reste une **photographie valide** du corpus **tel
  qu'il était** — sans `wtf`/`wtr` comme nœuds, avec `supersedes` réflexif seulement. On n'y
  touche pas : le réécrire violerait le principe (« ne réécrit jamais des faits passés »).
- **Une NOUVELLE projection est produite APRÈS la publication** (§2) et l'amendement
  d'OCR-007 (§11). Elle intègre **naturellement** : les deux nœuds `framework:wtf` /
  `framework:wtr` et l'arête `reidentified_as` entre eux — **parce qu'ils existent alors
  dans le corpus publié**, pas par anticipation.
- Ce n'est donc **ni une re-gravure ni une décision de risque** : c'est le **fonctionnement
  normal** du graphe. La seule dépendance est l'**ordre** (§8) : la projection ne peut être
  fidèle que si elle est régénérée **après** que la publication et le prédicat existent.
- La première arête `reidentified_as` non-réflexive apparaîtra dans cette nouvelle
  projection — précédent attendu, non un forçage du graphe gelé.

---

## 8. Ordre d'exécution et réversibilité

**Ordre proposé — la gravure du graphe vient en DERNIER (C) :**
1. **Amender OCR-007** — graver le prédicat `reidentified_as` + régénérer sa projection
   machine / classification (§11). Réversible (git).
2. **Schéma** — table de réidentification + triggers d'immuabilité (DDL, non bloqué).
   Réversible tant que **vide** (DROP).
3. **Publication** — 7 lignes `wtr` + la ligne de réidentification, **staging d'abord**,
   **puis** prod. **DÉFINITIF** (voir plus bas).
4. **Code** — dérivation `identity_status`/`canonical_id` dans la découverte ; retrait
   redirection + test + branchement (§4). Réversible (git).
5. **Corpus** — réécriture §6 ; régénération manifest/golden/API. Réversible (git).
6. **Seed** — mise à jour §5. Réversible (git).
7. **Graphe — EN DERNIER** : régénérer une **nouvelle projection** du corpus désormais
   publié (nœuds `wtf`/`wtr` + arête `reidentified_as`). **Jamais avant** la publication :
   une projection n'anticipe pas. `c172712` **reste intact**.

**Réversibilité — dit franchement :**
- Les **7 lignes `wtr`** et la **ligne de réidentification**, une fois INSÉRÉES, **ne
  peuvent PLUS être retirées** (UPDATE/DELETE/TRUNCATE bloqués, `service_role` inclus).
  **Publier est DÉFINITIF.**
- Un **INSERT erroné n'est PAS rattrapable par suppression** : la seule correction
  append-only est d'**avancer** (réidentifier de nouveau vers un objet correct).
- **Aucun rollback DB.** La sûreté vient de **l'append-only + validation AVANT insertion** :
  **répétition exhaustive sur staging** + **relecture valeur par valeur** — direction (§2)
  et granularité (§9), toutes deux définitives.
- Réversibles (git) : table vide (étape 2), code/corpus/seed/OCR-007, et **la nouvelle
  projection de graphe** (régénérable ; l'ancienne `c172712` demeure de toute façon).

---

## 9. Granularité de la réidentification *(normatif — je ne tranche pas)*

**Sous réidentification + transitivité (B).** La question n'est plus « est-ce approprié de
réidentifier un sous-objet ? » (la réidentification est exacte : même définition logique,
identifiant nouveau) mais **« quels maillons DIRECTS publier »**, sachant que **la base ne
stocke aucune relation déductible** (B) et que **les représentations, pas les définitions,
sont dupliquées** (A).

**Ce qu'un fait détient réellement** (`evidenceCovered.ts` / payload) : `framework.id`
(`wtf`), `framework.version` (`0.1`), `demonstrates.skill_id` / `reference` (`wtf:212`) —
**le niveau est un SLUG** (`claimed_level: "applied"`), **jamais** l'id `wtf:212#applied`
(interne).

### Scénario A — 1 maillon direct (framework)
`framework:wtf reidentified_as framework:wtr` seulement.
- Interroger `framework:wtf` → `canonical_id` ✅. Interroger `wtf:212` → **aucune** ligne
  directe ; la correspondance `wtf:212 → wtr:212` est **déduite** (framework parent + même
  coordonnée). **Compatible B** *si* cette déduction est jugée fiable (règle de dérivation,
  non stockée).

### Scénario B — un maillon par identifiant changé (7)
- Lookup direct partout, mais **4 maillons portent des ids que les faits ne citent jamais**
  (les niveaux) → 4 relations **définitives sans valeur consommateur**. Tension avec (B) :
  publier des maillons dont personne ne déréférence l'identifiant.

### Scénario C — les identifiants réellement détenus (3 : framework, version, skill)
`framework:wtf→wtr`, `framework:wtf@0.1→wtr@0.1`, `wtf:212→wtr:212`.
- Chaque identifiant **qu'un fait ou une requête porte** se résout **directement**, sans
  déduction fragile par nom, **sans** maillon mort. **Le plus cohérent avec (A)+(B)** : on
  publie les maillons directs exactement là où un identifiant est déréférencé, et on laisse
  la clôture transitive se déduire.

### Ce que voit un consommateur qui interroge `wtf:212`

| | Interroger `framework:wtf` | Interroger `wtf:212` | Résolution coordonnée |
|---|---|---|---|
| **A** (1) | `canonical_id` ✅ | **déduite** (parent + nom) | implicite |
| **C** (3) | ✅ | `canonical_id: wtr:212` ✅ | **directe** |
| **B** (7) | ✅ | ✅ partout | directe (+ 4 maillons morts) |

**Décision normative réservée à l'architecte.** La granularité est **définitive** (§8).
Lecture (non contraignante) : (A)+(B) orientent vers **C** — maillons directs pour les
identifiants déréférencés, déduction pour le reste.

---

## 10. Résolution d'identité pour le Trust *(mesure, aucun code)*

L'architecte pose : `wtf:212` et `wtr:212` portent **la même définition logique**, le Trust
ne fait qu'une **résolution d'identité**. **Que fait le code AUJOURD'HUI ?**

### 1. Le Trust sur les faits n'existe pas encore
- **Passport public** (`readPublicPassport.ts`) : `trust_status` = **valeur par défaut**
  (`'establishing'`), `evidence: []`, `skills_status: 'empty'` — **rien n'est calculé** depuis
  les faits.
- **Dashboard** (`DashboardService.ts`) : `readTrustStatus` lit une table **d'affichage
  Sprint-1 `trust_index`** par `passport_id` — **découplée** du fact store, **jamais dérivée
  d'une coordonnée**.
- **Conclusion** : aucun calcul de Trust sur coordonnées. Le Trust ne se calcule ni sur la
  coordonnée littérale, ni par résolution — **il ne se calcule pas encore du tout**.

### 2. Là où la coordonnée EST utilisée, c'est LITTÉRAL (aucune résolution)
- **Ingestion, étape 8** (`20260713000005`) : `wsp_skill_levels where skill_id = v_skill and
  framework_version = v_fwver` — **match exact** ; un fait `wtf:212` ne résout que contre
  `wtf:212`.
- **Préimage du hash** (`evidenceCovered.ts`) : `framework.id` et `demonstrates.skill_id`
  **copiés littéralement** dans l'objet haché → **la coordonnée est PORTÉE PAR LE HASH** ;
  la réécrire romprait `canonical_hash` et l'idempotence.
- **FK des 79 faits** : `…demonstrates_skill.skill_id → wsp_skills(id)` pointe littéralement
  vers `wtf:212`.

### 3. Distance entre l'existant et le comportement gravé
- **Résolution d'identité TOTALEMENT ABSENTE** ; la coordonnée agit **littéralement**
  partout. L'écart n'est pas « faire résoudre le Trust » — c'est **« il n'existe ni Trust ni
  résolution »**.
- **Contrainte dure** : la coordonnée étant **hash-portante**, la résolution **ne peut PAS**
  réécrire les faits (casse le hash + append-only l'interdit). Elle **doit** vivre **à la
  lecture / interprétation** : un futur module rencontrant `wtf:212` consulte la table de
  réidentification et le traite **comme** l'identifiant courant `wtr:212` — sans jamais
  toucher le fait. C'est exactement une **résolution d'identité** au sens de l'architecte,
  au-dessus d'un fait **immuable et hash-scellé**.
- **Cohérent avec (A)** : puisque les deux identifiants portent la **même définition
  logique**, résoudre `wtf:212 → wtr:212` ne change **aucun sens** — c'est un simple
  changement d'étiquette canonique à la lecture.
- **Mesure nette** : Trust-sur-faits = **0 % construit** ; résolution d'identité = **0 %
  construite**. Le prédicat est l'**intrant d'une couche d'interprétation encore
  inexistante**, à brancher **en lecture seule**. Le Lot B **publie la représentation et la
  relation** ; il ne construit **pas** la résolution (lot ultérieur, dont §10 borne le
  contrat).

---

## 11. Artefacts touchés par l'amendement d'OCR-007 *(ajout d'un prédicat)*

Graver `reidentified_as` dans OCR-007 touche, en cascade :

| Artefact | Nature du toucher | Confiance |
|---|---|---|
| `docs/registry/OCR-007_Canonical_Predicate_Registry.md` | **La gravure** (source) : entrée `PRD-xxx`, famille, inverse, symétrie. | certain |
| `content/registry/ocr-007-resolution.json` | **Projection machine** régénérée : `build-graph.mjs` lit `resolutionDoc.predicates`. | certain |
| `content/registry/external-classification.json` | Si le prédicat requiert une **famille/catégorie** ou un **alias** (famille Identité/Équivalence). | probable |
| `content/registry/_manifest.json` + `MANIFEST-OCR.json` | **Checksums** des fichiers modifiés (source + projections). | certain |
| `build/wsp001-lot0/predicate-inventory.mjs` → `.md` ; `predicate-examples.mjs` → `.md` ; `build-csv.mjs` | Outillage énumérant les prédicats, à rejouer. | probable |
| Tests figeant l'**ensemble des prédicats** / un **golden OCR-007** | Égalité stricte sur la liste/le checksum casserait à l'ajout. | **à vérifier** |

**Le KG n'est PAS dans cette liste au titre d'une re-gravure (C).** `content/registry/
wsp-graph.json` / `.report.json` **`c172712` restent intacts**. Une **nouvelle projection**
sera générée en **dernier** (§8, étape 7), **après** la publication et l'amendement — elle
intégrera les nœuds `wtf`/`wtr` et l'arête `reidentified_as` **parce qu'ils existeront alors
dans le corpus**. Ce n'est pas un artefact « touché par l'amendement », c'est une projection
**neuve** produite par le flux normal.

**Chemin de l'amendement OCR-007 (avant toute projection de graphe)** : OCR-007 source →
`ocr-007-resolution.json` → `external-classification.json` (si famille/alias) → manifest.

---

*Fin du dossier v3. Conception seule — aucune ligne à exécuter ne découle de ce document
sans un mandat d'implémentation dédié. Deux dénominations restent réservées à l'architecte :
le **nom + la famille du prédicat** (OCR-007, nom de travail `reidentified_as`) et le
**jeton d'`identity_status`** (§3).*
