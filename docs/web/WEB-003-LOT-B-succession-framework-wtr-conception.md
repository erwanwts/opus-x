# LOT B — Publication de `framework:wtr` par succession de versions

> **Statut : CONCEPTION SEULE.** Aucun SQL, aucun code, aucune migration, aucune
> exécution. Ce document est la **référence versionnée d'une opération irréversible**
> (§8 : une publication append-only ne se retire pas). Il précède l'implémentation ;
> il ne l'autorise pas. L'implémentation partira d'une branche neuve depuis `main`,
> sur mandat dédié.
>
> **Décisions gravées par l'architecte (1 à 4)** : table de succession append-only ;
> le statut `superseded` n'est JAMAIS stocké sur la définition, il se DÉRIVE de
> l'existence d'une relation de succession ; plusieurs successions possibles dans le
> temps, chaîne reconstructible ; cette table devient le mécanisme canonique de
> succession pour TOUS les objets immuables du protocole ; `framework:wtr` prend le
> slug `world-trader`, `framework:wtf` conserve `wtf` ; aucune redirection permanente
> entre les deux, chaque version a son adresse propre ; la découverte canonique indique
> laquelle est courante ; le prédicat est `supersedes` (PRD-007, famille Temporal,
> inverse `superseded_by`).
>
> **Ancrage** : schéma `supabase/migrations/20260713000001_wsp_framework.sql` &
> `…0002_wsp_fact_store.sql` ; route `app/frameworks/[id]/skills/route.ts` ;
> `lib/seo/transitional-redirects.ts` ; registre `docs/registry/OCR-007_Canonical_Predicate_Registry.md` ;
> KG gravé `content/registry/wsp-graph.json` (baseline `c172712`) ; 14 Records de
> `docs/web/registry-import/OCR-100/`.

---

## 1. Schéma de la table de succession

Mécanisme canonique pour **tous** les objets immuables. Forme proposée (décrite, non
écrite en SQL) :

| Colonne | Type | Justification |
|---|---|---|
| `id` | text, PK | La succession **est elle-même un fait immuable** : identité propre, citable, jamais recalculée. |
| `predicate` | text, `check in ('supersedes')` | Rend la table **self-describing** et extensible aux futurs prédicats temporels, sans changer sa forme. Verrouillé à PRD-007 aujourd'hui. |
| `predecessor_type` | text, `check in (…)` | Discrimine la table cible (`framework`, `framework_version`, `skill`, `skill_level`, …). Clé du polymorphisme. |
| `predecessor_id` | text | Identifiant canonique de l'objet **remplacé** (`framework:wtf`). |
| `successor_type` | text, `check in (…)` | Idem côté remplaçant. |
| `successor_id` | text | Identifiant canonique du **remplaçant** (`framework:wtr`). |
| `recorded_at` | timestamptz, default now() | Enveloppe système immuable. |
| `effective_at` | date, nullable | Date **domaine** de la succession (distincte de l'horodatage système), si l'architecte veut dater la bascule. |

### Référencer des objets de types différents sans FK unique
Une FK PostgreSQL pointe vers **une** table. Ici les cibles vivent dans `wsp_frameworks`,
`wsp_framework_versions`, `wsp_skills`… — aucune FK unique n'est possible.

- **(a) paire `type` + `id` polymorphe** — le seul point commun de tous ces objets est
  qu'ils portent **un id canonique textuel**. `type` nomme la table, `id` le referent.
  **Recommandé.** Coût assumé : **l'intégrité référentielle n'est pas garantie par le
  SGBD** (pas de FK). Elle est bornée autrement : la table n'est écrite que par le chemin
  contrôlé (migration/ingestion `service_role`), et un **trigger de validation à
  l'INSERT** peut vérifier que `predecessor_id` existe dans la table nommée par
  `predecessor_type`.
- (b) colonnes FK nullable par type (`fk_framework_id`, `fk_skill_id`…) — **rejetée** :
  explose à chaque nouveau type, contredit « sert TOUS les objets ».
- (c) une table de succession par type — **rejetée** : même raison.

### Chaîne circulaire (A supersedes B supersedes A)
`supersedes` est **asymmetric** (PRD-007) — le contrat l'interdit, mais le contrat ne
s'applique pas tout seul. La table doit l'imposer **structurellement, à l'INSERT** (jamais
par mutation) :
- **self-loop** : `check (predecessor_id <> successor_id or predecessor_type <> successor_type)`.
- **2-cycle** : trigger BEFORE INSERT qui rejette `(A→B)` si `(B→A)` existe déjà.
- **n-cycle** (A→B→C→A) : le même trigger fait une **traversée récursive** (reachability)
  — refuse l'INSERT si `successor` atteint déjà `predecessor` en remontant la chaîne.
  Append-only compatible : on **refuse la ligne**, on ne corrige jamais après coup.

### Deux successeurs concurrents pour un même prédécesseur
**Contrainte `unique (predicate, predecessor_type, predecessor_id)`** → un objet est
remplacé **au plus une fois**. C'est ce qui rend la chaîne **linéaire** et « version
courante » calculable. (« Plusieurs successions dans le temps » = plusieurs *maillons*
A→B→C, pas plusieurs successeurs d'un même nœud.) Je recommande **aussi**
`unique (predicate, successor_type, successor_id)` pour interdire qu'un même objet
remplace deux prédécesseurs (pas de fusion de lignées), sauf si l'architecte veut
autoriser les fusions.

### « Version courante » = l'objet qu'aucune ligne ne désigne comme prédécesseur
**Confirmé, avec une précision.** Dans une lignée, la tête est l'objet dont l'`id`
**n'apparaît jamais dans `predecessor_id`**. L'unicité sur `predecessor_id` garantit
l'absence de fourche → la tête est **unique**. On la trouve en partant de n'importe quel
membre et en suivant les maillons `successor` jusqu'au nœud absent de `predecessor_id`.
(Symétriquement, l'**origine** est l'objet absent de `successor_id`.)

### Trigger d'immuabilité sur cette table
**Oui, indispensable.** Elle est append-only par vocation ; la garde doit l'y
**contraindre structurellement**, exactement comme les 8 tables `wsp_` :
- `BEFORE UPDATE OR DELETE … FOR EACH ROW` → `wsp_reject_mutation()`
- `BEFORE TRUNCATE … FOR EACH STATEMENT` → `wsp_reject_mutation()`

La fonction est **générique** (elle ne lit que `tg_op`/`tg_table_name`, ni `NEW` ni
`OLD`) — réutilisable telle quelle. Sans cette garde, on pourrait **réécrire l'histoire**
en éditant une ligne de succession : la faille exacte que l'append-only ferme partout
ailleurs.

---

## 2. Ce qui est publié

Pour que `framework:wtr` existe, on **INSÈRE** (miroir exact du seed déjà édité, appliqué
au vivant qui n'a que `wtf`) :

| # | Table | Ligne |
|---|---|---|
| 1 | `wsp_frameworks` | `framework:wtr` · slug `world-trader` · « World Trader Framework » · publisher Opus X |
| 2 | `wsp_framework_versions` | `framework:wtr@0.1` · version `0.1` · status `published` |
| 3 | `wsp_skills` | `wtr:212` · code `WTR-212` · « Intention vs Engagement » |
| 4–7 | `wsp_skill_levels` | `wtr:212#aware/applied/proficient/mastery` (rangs 1→4, bandes 2-2 / 3-3 / 4-4 / 5-5) |
| 8 | **table de succession** | **`framework:wtr` supersedes `framework:wtf`** — predecessor `framework:wtf`, successor `framework:wtr`, predicate `supersedes` |

**= 7 lignes de publication + 1 ligne de succession = 8 INSERT.**

> ⚠️ **Direction de la succession (critique, car définitive)** : le successeur est
> **`framework:wtr`**, le prédécesseur est **`framework:wtf`**. Donc
> `successor_id = framework:wtr`, `predecessor_id = framework:wtf`. Insérer l'inverse
> serait irréversible (§8) : `wtr` deviendrait faussement l'objet remplacé, et la
> découverte présenterait `wtf` comme courant.

- **Coordonnées `wtr:212` / `WTR-212`** : **confirmées** depuis le corpus migré ET le seed
  (identiques).
- **Version** : le seed dit **`0.1`**. Comme `framework:wtr` est une **identité nouvelle**
  (pas une nouvelle version de `wtf` — deux `framework_id` distincts reliés par
  `supersedes`), sa ligne de versions démarre à `0.1`, miroir de `wtf@0.1`.
  ⚠️ **À trancher** : le corpus des Records écrit `wtr@1.0.0` (voir §6, note version) —
  divergence à réconcilier ; ma reco est `0.1` (fidélité au réel), c'est ta décision.
- **4 niveaux reconduits à l'identique** : oui — mêmes slugs, labels, rangs, bandes.
- **INSERT bloqué par quoi que ce soit ?** **Non.** La garde ne couvre que
  UPDATE/DELETE/TRUNCATE. Et **aucune contrainte d'unicité ne s'y oppose** : PK
  (`framework:wtr` ≠ `framework:wtf`), slug unique (`world-trader` ≠ `wtf`),
  `unique(framework_id, version)`, `unique(framework_id, framework_version, code)`, PK
  skills/levels — toutes distinctes de la lignée `wtf`. La publication coexiste sans
  collision.

---

## 3. Découverte canonique

**Champs ajoutés à la réponse :**
- `status` — **dérivé**, jamais stocké : `superseded` si l'`id` du framework apparaît
  comme `predecessor_id` dans une ligne de succession, sinon son statut de version
  (`published`). *(Rappel : l'enum `wsp_framework_versions.status` ne connaît que
  `published`/`deprecated` — `superseded` n'existe PAS en base et ne doit pas y être
  ajouté ; il se calcule.)*
- `supersedes` — pour `wtr` : l'objet qu'il remplace (`framework:wtf`).
- `superseded_by` — pour `wtf` : l'objet qui le remplace (`framework:wtr`).

**Comment le statut se dérive dans la requête :** la résolution actuelle
`.or(id.eq.${id},slug.eq.${id})` **résout toujours correctement** le framework (les deux
slugs `wtf`/`world-trader` et les deux ids sont distincts). Il faut **ajouter une lecture**
de la table de succession : `EXISTS(predecessor_id = framework.id)` → `superseded_by` +
statut dérivé ; `EXISTS(successor_id = framework.id)` → `supersedes`. La sélection
« version publiée la plus récente » reste correcte : `wtf` et `wtr` étant deux
`framework_id` séparés, chacun résout sa propre version sans interférence.

**Comportement cible :**
- `/frameworks/world-trader` → `framework:wtr`, définition **courante**,
  `supersedes: framework:wtf`.
- `/frameworks/wtf` → `framework:wtf`, définition **historique**, statut dérivé
  `superseded`, `superseded_by: framework:wtr`. *(Possible seulement après retrait de la
  301 — §4.)*

⚠️ **Écart d'implémentation à signaler** : il n'existe aujourd'hui **aucune route
`/frameworks/[id]` de *définition*** — seulement `/frameworks/[id]/skills`. Le comportement
« définition + statut + relation » demande **soit** d'enrichir la réponse de `/skills`,
**soit** d'ajouter une route de définition. Décision d'implémentation (pas maintenant).

**`/frameworks/wtr` (l'id nu) doit-il résoudre ?** Aujourd'hui **non** : `wtr` n'est ni
l'id canonique (`framework:wtr`) ni le slug (`world-trader`) → 404. **Ma reco : ne pas
l'ajouter** (adressage précis : un id canonique, un slug, pas de troisième porte).
**Nuance à trancher** : dans les Evidence, `framework.id` vaut le short-id nu **`wtr`**
(ex. `"framework": { "id": "wtr", "reference": "wtr:212" }`). Si tu veux la symétrie
fait↔découverte, il faudrait un alias `wtr → framework:wtr`. Je ne tranche pas.

---

## 4. Retrait de la redirection

**Disparaît (supprimé) :**
- `lib/seo/transitional-redirects.ts` — l'entrée
  `/frameworks/wtf/skills → 301 → /frameworks/world-trader/skills` (le tableau devient
  vide ; le fichier peut être retiré entièrement).
- `lib/seo/transitional-redirects.test.ts` — le test associé.
- Le **branchement dans `next.config.ts`** qui projette `transitionalRedirects` dans
  `redirects()`.
- La **date gravée du 31 octobre 2026** : sans redirection, plus de date de retrait.

**Amendé (PAS supprimé — documents historiques) :**
- `docs/migration/MIG-wtf-to-wtr-2026-07-18.md` — la section « Redirection transitoire »
  et la date deviennent **caduques** (déjà partiellement signalé) : à marquer caduc,
  l'historique reste.
- `docs/migration/PLAN-forward-wtf-to-wtr.md` — idem (déjà caduc-marqué).

**Conséquence conforme à la doctrine** : `/frameworks/wtf/skills` cesse de rediriger et se
met à **résoudre** vers la définition historique de `wtf` — « chaque version a son adresse
propre », « aucune redirection permanente », « wtf reste consultable ».

---

## 5. Le seed

Aujourd'hui le seed `20260713000001` ne déclare **que `wtr`** → une base fraîche a `wtr`
publié **seul**, sans `wtf`, sans succession. La production a l'inverse (`wtf` seul, avant
Lot B) et, après Lot B, `wtf` + `wtr` + succession.

Pour qu'une base fraîche **reproduise l'état réel post-Lot B**, le seed doit contenir **la
couche définition complète** :
1. **`framework:wtf` publié** — ses 7 lignes (framework + version `wtf@0.1` + skill
   `wtf:212` + 4 niveaux `wtf:212#…`).
2. **`framework:wtr` publié** — ses 7 lignes (identiques en `wtr`).
3. **La ligne de succession** `framework:wtf` superseded_by `framework:wtr`
   (predecessor `framework:wtf`, successor `framework:wtr`).

Tout en `on conflict do nothing` (INSERT idempotents, aucune mutation → cohérent
append-only).

⚠️ **Limite honnête** : le seed reproduit la **couche définition** (frameworks +
succession), **pas la couche faits** — les **79 Evidence** `wtf:212` sont des **données de
production**, jamais seedées. Une base fraîche aura la bonne structure de succession, mais
pas les 79 faits. C'est correct : le seed publie des définitions, il n'invente pas de faits.

---

## 6. Passages de Records à réécrire *(livrable principal — je délimite, l'architecte rédige)*

### La grille de tri (proposée)
Le corpus a été renommé `wtf→wtr` en bloc (commit `ddfda6f`). La ligne de partage suit **la
propre séparation du WSP entre zone FAITS et zone SÉMANTIQUE** :

- **Couche DÉFINITION** (Framework, Skill, Competency, Capability, résolution du Registry)
  → la coordonnée **courante** est bien `wtr:212` → **JUSTE, garder `wtr`.**
- **Couche FAIT** (Evidence émise/acceptée/journalisée, Immutable Fact, Trust calculé,
  Vérification d'un fait réel, mapping projet seedé) → les faits réels portent **`wtf:212`
  à jamais** → **FAUX, doit refléter `wtf`.**

### Couche FAIT — passages proposés **FAUX** (→ `wtf:212`)

| Record | Ligne | Passage (verbatim abrégé) | Pourquoi faux |
|---|---|---|---|
| **OCR-121** Certified Issuer | 156 | « its Evidence referencing `wtr:212` is **accepted and journaled** » | Fait réalisé → journalisé en `wtf:212`. |
| **OCR-120** Issuer | 118 | JSON `"references_framework": "wtr:212"` | Référence d'Evidence produite. |
| **OCR-120** Issuer | 152 | « produces Evidence referencing `wtr:212`; Opus X **accepts it and binds it** » | Fait réalisé, lié au Passport. |
| **OCR-110** Evidence | 144 | JSON `"framework": { "id": "wtr", "reference": "wtr:212" }` | Corps d'une **Evidence** (artefact-fait). |
| **OCR-110** Evidence | 173–174 | JSON-LD `framework:wtr` + `"frameworkReference": "wtr:212"`, `isImmutable:true` | Modélise un **fait immuable**. |
| **OCR-110** Evidence | 198 | « emits Evidence referencing `wtr:212` … **journals the fact**, links it to the Passport » | **LE** fait démontré réel. |
| **OCR-114** Immutable Fact | 161 | « An **accepted Evidence** for `wtr:212` is **written as an Immutable Fact** and linked to one Passport update » | Fait réalisé. |
| **OCR-109** Verif. Response | 116 | JSON `"verified": { "coordinate": "wtr:212", "facts": ["ev_01KXM07…"] }` | Fait **vérifié précis**. |
| **OCR-109** Verif. Response | 155 | « reports computed Trust for `wtr:212` … limited to disclosed facts » | Trust sur faits réels. |
| **OCR-106** Trust Status | 112, 129 | `"framework_version": "wtr@1.0.0"`, `"underFrameworkVersion": "wtr@1.0.0"` | Trust calculé sur faits réels (+ version, voir note). |
| **OCR-105** Trust | 133 | JSON-LD `"interpretedAgainst": framework:wtr` | Trust interprété contre le framework des faits (`wtf`). *(borderline)* |

### Couche DÉFINITION — passages proposés **JUSTES** (→ garder `wtr:212`)

| Record | Lignes | Nature |
|---|---|---|
| **OCR-115** Framework | 16, 48, 61, 118, 125, 141–142, 163, 191–192, 215, 219, 235 | Le Framework lui-même, adressé par `wtr:212` — `framework:wtr` **est** le framework courant. |
| **OCR-116** Skill | 126, 144 | Skill défini par `framework:wtr`, clusterisé sous `wtr:212`. |
| **OCR-117** Competency | 24, 47, 63, 110, 125–126, 143, 172, 178, 195, 199, 215 | Compétence **définie**, adressée par `wtr:212`. |
| **OCR-118** Capability | 111, 127–128, 144 | Capability composant la compétence `wtr:212` (définition). |
| **OCR-119** Framework Registry | 47, 60, 67, 187–192, 214, 218 | Couche de **résolution** d'une coordonnée courante. |

### Trois zones **BORDERLINE** — à trancher explicitement
- **OCR-100:117** — « Facts reference a Framework coordinate (e.g. `wtr:212`) » :
  définition générale *mais* parle de faits. Juste si lu comme « la coordonnée qu'un
  nouveau fait citerait » ; faux si lu comme les faits existants.
- **OCR-119:114, 118–124, 138–143, 162, 191** — le **mapping projet seedé** « exactly four
  rows to `wtr:212` » : si ces rows décrivent le `wsp_skill_mappings` **réel**, elles
  pointent vers le skill réel (`wtf:212`) → FAUX ; si c'est une illustration de la couche
  définition courante → JUSTE.
- **OCR-108** Verification Request (116, 132–133, 151, 207) — un **scope de requête**
  `wtr:212` / `wtr@1.0.0` : forward (on demande à vérifier la coordonnée courante) ou rétro
  (on vérifie des faits réels en `wtf`) ?

### Note transverse (indépendante de wtf/wtr) — **la version**
Le corpus écrit `wtr@1.0.0` / `version: "1.0.0"` (OCR-106, OCR-108, OCR-109, OCR-115) alors
que la base **et** le seed disent **`0.1`**. C'est une **seconde inexactitude**, orthogonale
à la coordonnée. Hors périmètre strict de la succession, mais elle rend ces passages
inexacts — à décider si Lot B la réconcilie.

### Lignes longues non dépliées (blocs machine / résumés)
Chaque Record a des lignes « machine summary » / TL;DR trop longues pour l'extrait (ex.
OCR-115:16/26/211/223, OCR-117:20/191/203, OCR-119:16/22/26/210/222, OCR-110:16/253,
OCR-108:199/211, OCR-109:215, OCR-116:20/203, OCR-118:204, OCR-120:212, OCR-121:216). Elles
reportent la **même coordonnée** et **héritent de la classification de leur Record**.
Extraction verbatim une par une disponible sur demande.

---

## 7. Knowledge Graph

État actuel : `supersedes` (PRD-007) n'existe dans le KG qu'en **réflexif** — self-loops sur
*Evidence* (OCR-110), *Immutable Fact*, *Framework version*. **Ni `wtf` ni `wtr` ne sont
des nœuds** (KG à 0 wtf / 0 wtr, découplé).

Une arête réelle `framework:wtr` **supersedes** `framework:wtf` serait **la première
succession non-réflexive entre deux entités réelles** du graphe — un précédent sur la façon
dont la succession s'inscrit dans le KG.

**Ce que ça coûte (je ne décide pas) :**
- Il faut d'abord **créer deux nœuds entité** (`framework:wtf`, `framework:wtr`) — ils
  n'existent pas — **puis** l'arête `supersedes`.
- Le KG est **gelé sous `c172712`** (gravure). Le régénérer (`build-graph`) change le
  hash/baseline → **re-gravure**, donc **décision architecte**.
- Régénération + re-vérification du graphe (`wsp-graph.json` + `.report.json`), et adoption
  d'un **précédent** (la succession devient un motif du KG, plus seulement réflexif).

Recommandation : décider si le KG doit modéler la succession de la **couche définition**. Si
oui, re-gravure assumée ; si non, le KG reste sur son invariant réflexif et la succession
vit uniquement en base + découverte.

---

## 8. Ordre d'exécution et réversibilité

**Ordre proposé :**
1. **Schéma** — table de succession + ses triggers d'immuabilité (DDL, **non bloqué**).
   Réversible tant qu'elle est **vide** (DROP possible).
2. **Publication** — les 7 lignes `wtr` + la ligne de succession, **staging d'abord**
   (répétition complète), **puis** prod.
3. **Code** — dérivation `status`/`supersedes` dans la découverte ; retrait redirection +
   test + branchement (§4). Réversible (`git revert`).
4. **Corpus** — réécriture des passages §6 ; régénération manifest/golden/API concernés.
   Réversible (git).
5. **KG** — *seulement si l'architecte tranche §7* : re-gravure.
6. **Seed** — mise à jour §5. Réversible (git).

**Réversibilité — le point délicat, dit franchement :**
- Les **7 lignes de publication `wtr`** et la **ligne de succession**, une fois INSÉRÉES,
  **ne peuvent PLUS être retirées** : UPDATE/DELETE/TRUNCATE bloqués **au niveau SGBD,
  `service_role` inclus**. **Publier `framework:wtr` est DÉFINITIF.**
- Un **INSERT erroné n'est PAS rattrapable par suppression.** La seule correction
  append-only est d'**avancer** : publier une nouvelle version/succession qui remplace
  l'objet erroné (ex. `wtr'` supersedes `wtr`). On ne fait jamais « comme si ça n'avait pas
  existé ».
- **Il n'y a donc AUCUN rollback DB** — contrairement à l'ancienne migration de mutation
  (qui avait un inverse… lui-même bloqué). La sûreté ne vient pas d'un retour arrière :
  elle vient de **l'append-only + la validation AVANT insertion**.
- **Conséquence directe sur la validation** : puisque c'est définitif, la prod ne s'écrit
  qu'après une **répétition exhaustive sur staging** (insertion → vérification
  découverte/dérivation/statut → contrôle KG si retenu) **et** une **relecture valeur par
  valeur** des lignes — en particulier la **direction** de la succession (§2). Le filet
  n'est pas en aval, il est **en amont**.
- Seule la **table vide** (étape 1) et les changements **code/corpus/seed** (git) sont
  réversibles. Dès qu'une ligne de succession est publiée, la table devient **permanente**
  (la dropper effacerait un fait publié — contraire à la doctrine).

---

## 9. Granularité de la succession *(normatif — je ne tranche pas)*

La conception §1–§8 ne pose qu'**UNE** ligne de succession, au **niveau framework**
(`framework:wtr` supersedes `framework:wtf`). Or **7 objets** sont publiés en double :
la définition (`framework:*`), la version (`*@0.1`), la skill (`*:212`), et **4 niveaux**
(`*:212#aware/applied/proficient/mastery`). Faut-il une succession pour chacun ? La question
est normative : elle décide de ce qu'un consommateur **voit** en interrogeant un objet `wtf`.

### Scénario A — 1 maillon (framework seul)
Une seule ligne : `framework:wtr` supersedes `framework:wtf`.

- **Consommateur qui interroge `framework:wtf`** : trouve directement `superseded_by:
  framework:wtr`. Statut dérivé `superseded`. ✅ explicite.
- **Consommateur qui interroge `wtf:212` (la skill)** : **aucune ligne** n'a
  `predecessor_id = wtf:212`. La succession n'est visible qu'en **remontant au parent**
  (`wtf:212` → `framework:wtf` → `superseded_by framework:wtr`). Le « skill courant
  équivalent » (`wtr:212`) n'est **pas un fait enregistré** : il faut l'**inférer par
  correspondance de nom** (212 ↔ 212) — convention, pas assertion.
- **Découverte** : la dérivation du statut au niveau skill/niveau devient **transitive**
  (skill → framework). La correspondance `wtf:212 → wtr:212` reste **implicite**.
- **Bilan** : minimal, une seule vérité (la succession du framework), un seul INSERT
  définitif. Mais la couche fait ne peut pas répondre « quelle est la coordonnée courante
  équivalente à `wtf:212` ? » — elle répond seulement « le framework est superseded ».

### Scénario B — un maillon par objet publié (7 maillons)
Sept lignes : `framework:wtr`⊃`framework:wtf`, `framework:wtr@0.1`⊃`framework:wtf@0.1`,
`wtr:212`⊃`wtf:212`, et chacun des 4 `wtr:212#niveau`⊃`wtf:212#niveau`.

- **Consommateur qui interroge `wtf:212`** : trouve directement `superseded_by: wtr:212`.
  La correspondance devient un **fait enregistré**, pas une convention de nommage. Idem pour
  chaque niveau.
- **Découverte** : lookup **direct** à toute granularité, sans inférence transitive ni
  correspondance par nom.
- **Bilan** : 7 lignes irréversibles au lieu d'1 — engagement append-only bien plus lourd,
  **toutes définitives** ; redondance (le maillon framework implique déjà le reste) ; risque
  de **chaîne partielle/incohérente** si un maillon est erroné (et non corrigeable). Si §7
  est retenu, ce sont aussi **7 arêtes** de KG au lieu d'1.

### Tension sémantique à arbitrer
`supersedes` au niveau skill/niveau **affirme que l'ancien objet est remplacé**. Mais
`wtf:212` et `wtr:212` sont **byte-identiques** hors préfixe d'id (même nom, mêmes critères,
mêmes bandes), et `wtf:212` **reste interprétable à jamais** pour les 79 faits qui le citent.
Dire « `wtr:212` supersedes `wtf:212` » risque de **suggérer que `wtf:212` est retiré**, alors
qu'il reste valide et vivant pour ces faits. Est-ce une **succession** (l'ancien est
remplacé) ou une **re-publication d'identité** (le même objet re-listé sous un nouvel id de
framework) ? C'est le cœur normatif.

### Voie intermédiaire (à considérer, non recommandée par défaut)
**framework + skill uniquement** (2 maillons), en sautant version et niveaux : donne la
correspondance de coordonnée explicite (`wtf:212 → wtr:212`) **sans** sur-engager sur les 4
niveaux ni la version. Compromis entre « le framework suffit » (A) et « tout est tracé » (B).

### Ce que ça change pour la découverte — synthèse

| | Interroger `framework:wtf` | Interroger `wtf:212` | Coordonnée courante équivalente |
|---|---|---|---|
| **A** (1 maillon) | `superseded_by: framework:wtr` ✅ | superseded **par transitivité** (via parent) | **implicite** (nom) |
| **Intermédiaire** (2) | ✅ | `superseded_by: wtr:212` ✅ | **explicite** |
| **B** (7 maillons) | ✅ | ✅ à toute granularité | **explicite partout** |

**Décision normative réservée à l'architecte.** Elle doit précéder la publication : la
granularité choisie est, elle aussi, **définitive** (§8) — on ne retire pas un maillon
publié.

---

*Fin du dossier. Conception seule — aucune ligne à exécuter ne découle de ce document sans
un mandat d'implémentation dédié.*
