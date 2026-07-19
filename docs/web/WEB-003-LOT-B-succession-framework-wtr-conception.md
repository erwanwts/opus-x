# LOT B — Publication de `framework:wtr` par réidentification canonique

> **Statut : CONCEPTION SEULE.** Aucun SQL, aucun code, aucune migration, aucune
> exécution. Ce document est la **référence versionnée d'une opération irréversible**
> (§8 : une publication append-only ne se retire pas). Il précède l'implémentation ;
> il ne l'autorise pas. L'implémentation partira d'une branche neuve depuis `main`,
> sur mandat dédié.
>
> **Historique**
> - **v1 (2026-07-19)** — conception fondée sur `supersedes` (PRD-007).
> - **v2 (2026-07-19)** — l'architecte **écarte `supersedes`** et grave un **prédicat
>   NOUVEAU de réidentification canonique** : les deux définitions sont
>   **substantiellement identiques**, seule **l'identité canonique** change. Ce n'est pas
>   une succession (rien n'est remplacé/retiré), c'est un **changement de nom canonique**.
>   Le dossier est révisé de bout en bout ; ajout de §10 (résolution d'identité pour le
>   Trust) et §11 (artefacts touchés par l'amendement d'OCR-007).
>
> **Prédicat — NOM EN ATTENTE DE GRAVURE OCR-007.** Faute du nom canonique, ce document
> emploie le **nom de travail `reidentifies`** (inverse `reidentified_by`) —
> **provisoire**, à remplacer par le terme que gravera OCR-007. Direction : la ligne
> affirme que l'identité **antérieure** (`framework:wtf`) est **canoniquement
> réidentifiée comme** l'identité **courante** (`framework:wtr`). La **famille** du
> prédicat est elle aussi à graver : `supersedes` était *Temporal* ; la réidentification
> relève plutôt d'une famille **Identité/Équivalence** (rien de chronologique n'est
> asserté) — arbitrage architecte.
>
> **Décisions gravées par l'architecte** : table de réidentification append-only, mécanisme
> canonique pour TOUS les objets immuables du protocole ; le statut n'est **jamais stocké**
> sur la définition, il se **DÉRIVE** de l'existence d'une relation de réidentification ;
> plusieurs relations possibles dans le temps, chaîne reconstructible ; `framework:wtr`
> prend le slug `world-trader`, `framework:wtf` conserve `wtf` ; aucune redirection
> permanente, chaque identité a son adresse propre ; la découverte canonique indique
> laquelle est courante ; les deux définitions sont substantiellement identiques, le Trust
> ne fait qu'une **résolution d'identité**.
>
> **Ancrage** : schéma `supabase/migrations/20260713000001_wsp_framework.sql` &
> `…0002_wsp_fact_store.sql` & `…0005_wsp_ingestion.sql` ; `lib/wsp/evidenceCovered.ts` ;
> `lib/api/readPublicPassport.ts` ; `lib/dashboard/DashboardService.ts` ;
> route `app/frameworks/[id]/skills/route.ts` ; `lib/seo/transitional-redirects.ts` ;
> registre `docs/registry/OCR-007_Canonical_Predicate_Registry.md` + projection
> `content/registry/ocr-007-resolution.json` ; KG gravé `content/registry/wsp-graph.json`
> (baseline `c172712`) ; 14 Records de `docs/web/registry-import/OCR-100/`.

---

## 1. Schéma de la table de réidentification

Mécanisme canonique pour **tous** les objets immuables. Forme proposée (décrite, non
écrite en SQL) :

| Colonne | Type | Justification |
|---|---|---|
| `id` | text, PK | La relation **est elle-même un fait immuable** : identité propre, citable, jamais recalculée. |
| `predicate` | text, `check in (⟨reidentifies⟩)` | Rend la table **self-describing** et extensible sans changer sa forme. **Valeur en attente d'OCR-007** (nom de travail `reidentifies`). |
| `prior_type` | text, `check in (…)` | Discrimine la table cible (`framework`, `framework_version`, `skill`, `skill_level`, …). Clé du polymorphisme. |
| `prior_id` | text | Identifiant canonique de l'identité **antérieure** (`framework:wtf`). |
| `canonical_type` | text, `check in (…)` | Idem côté identité courante. |
| `canonical_id` | text | Identifiant canonique de l'identité **courante** (`framework:wtr`). |
| `recorded_at` | timestamptz, default now() | Enveloppe système immuable. |
| `effective_at` | date, nullable | Date **domaine** de la réidentification (distincte de l'horodatage système), si souhaité. |

> **Note v2** : les colonnes `prior_*` / `canonical_*` remplacent les `predecessor_*` /
> `successor_*` de v1 — même **forme** (deux paires type+id polymorphes), vocabulaire
> ajusté à la réidentification (« antérieur / courant » plutôt que « prédécesseur /
> successeur », qui suggérait une succession).

### Le prédicat change-t-il la forme de la table ? — **Non (point 1 vérifié)**
La colonne `predicate` est de type **`text`** : elle accepte **n'importe quelle chaîne**.
Seule la **contrainte `check in (…)`** restreint les valeurs admises. Graver un prédicat
nouveau = **redéfinir la liste du CHECK** (`check in ('reidentifies')` au lieu de
`'supersedes'`), ce qui est un **changement de définition de contrainte**, **pas** un
changement de forme (aucune colonne ajoutée/retirée, aucun type modifié, aucune migration
de données). C'est **précisément** pourquoi `predicate` a été posé en §1 comme **colonne
first-class self-describing** : la table absorbe un nouveau prédicat sans se déformer.
*(La table n'étant pas encore créée, le point est trivial ici — mais l'invariant tient
aussi pour tout prédicat futur.)*

### Référencer des objets de types différents sans FK unique
Une FK PostgreSQL pointe vers **une** table ; les cibles vivent dans `wsp_frameworks`,
`wsp_framework_versions`, `wsp_skills`… — aucune FK unique possible.

- **(a) paire `type` + `id` polymorphe** — le seul point commun de tous ces objets est
  qu'ils portent **un id canonique textuel**. `type` nomme la table, `id` le referent.
  **Recommandé.** Coût assumé : **intégrité référentielle non garantie par le SGBD** ;
  bornée par le chemin d'écriture contrôlé (`service_role`) + un **trigger de validation à
  l'INSERT** vérifiant que `prior_id` existe dans la table nommée par `prior_type`.
- (b) colonnes FK nullable par type — **rejetée** : explose à chaque type, contredit
  « sert TOUS les objets ».
- (c) une table par type — **rejetée** : même raison.

### Chaîne circulaire (A → B → A)
Le prédicat de réidentification est **asymétrique** (une identité antérieure ≠ courante).
La table doit l'imposer **structurellement, à l'INSERT** (jamais par mutation) :
- **self-loop** : `check (prior_id <> canonical_id or prior_type <> canonical_type)`.
- **2-cycle** : trigger BEFORE INSERT rejetant `(A→B)` si `(B→A)` existe.
- **n-cycle** : traversée **récursive** (reachability) — refuse l'INSERT si `canonical`
  atteint déjà `prior` en remontant la chaîne. Append-only : on **refuse la ligne**.

### Deux identités courantes concurrentes pour une même antérieure
**Contrainte `unique (predicate, prior_type, prior_id)`** → une identité antérieure est
réidentifiée **au plus une fois**. C'est ce qui rend la chaîne **linéaire** et « identité
courante » calculable. Je recommande **aussi** `unique (predicate, canonical_type,
canonical_id)` (une identité courante ne réidentifie qu'une antérieure — pas de fusion),
sauf volonté explicite de fusions.

### « Identité courante » = l'objet qu'aucune ligne ne désigne comme antérieur
**Confirmé, avec précision.** Dans une lignée, la tête est l'objet dont l'`id`
**n'apparaît jamais dans `prior_id`**. L'unicité sur `prior_id` garantit l'absence de
fourche → tête **unique**. On la trouve en suivant les maillons `canonical` jusqu'au nœud
absent de `prior_id`. (L'**origine** est l'objet absent de `canonical_id`.)

### Trigger d'immuabilité sur cette table
**Oui, indispensable.** Append-only par vocation ; la garde doit l'y **contraindre
structurellement**, comme les 8 tables `wsp_` :
- `BEFORE UPDATE OR DELETE … FOR EACH ROW` → `wsp_reject_mutation()`
- `BEFORE TRUNCATE … FOR EACH STATEMENT` → `wsp_reject_mutation()`

Fonction **générique** (ne lit que `tg_op`/`tg_table_name`) — réutilisable telle quelle.
Sans elle, on pourrait **réécrire l'histoire** en éditant une ligne de réidentification.

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
| 8 | **table de réidentification** | **`framework:wtf` `reidentifies` → `framework:wtr`** — `prior_id = framework:wtf`, `canonical_id = framework:wtr`, `predicate = ⟨reidentifies⟩` |

**= 7 lignes de publication + 1 ligne de réidentification = 8 INSERT** (granularité §9).

> ⚠️ **Direction (critique, car définitive)** : l'identité **courante** est
> **`framework:wtr`** (`canonical_id`), l'**antérieure** est **`framework:wtf`**
> (`prior_id`). Insérer l'inverse serait irréversible (§8) : `wtr` deviendrait faussement
> l'identité périmée, et la découverte présenterait `wtf` comme courante.

- **Coordonnées `wtr:212` / `WTR-212`** : **confirmées** (corpus migré + seed identiques).
- **Version** : le seed dit **`0.1`** ; `framework:wtr` démarre sa ligne de versions à
  `0.1`, miroir de `wtf@0.1`. ⚠️ **À trancher** : le corpus écrit `wtr@1.0.0` (§6, note
  version). Reco : `0.1` (fidélité au réel), décision architecte.
- **4 niveaux reconduits à l'identique** : oui.
- **INSERT bloqué ?** **Non.** La garde ne couvre que UPDATE/DELETE/TRUNCATE, et **aucune
  contrainte d'unicité ne s'y oppose** (PK, slug, uniques toutes distinctes de la lignée
  `wtf`). La publication coexiste sans collision.

---

## 3. Découverte canonique

**Champs ajoutés à la réponse (statut DÉRIVÉ, jamais stocké — point 2) :**

Sous réidentification, `wtf` n'est **ni superseded ni deprecated** : c'est la **même
définition logique** sous une **identité antérieure**. Le statut dérivé ne peut donc plus
être `superseded`. **Valeurs proposées (NORMATIVES — nom à graver par l'architecte, comme
le prédicat)** :

| Côté | Champ dérivé proposé | Sens |
|---|---|---|
| `framework:wtf` (antérieur) | `identity_status: reidentified` + `canonical_id: framework:wtr` | Identité antérieure d'une définition toujours vivante ; pointe vers l'identité courante. |
| `framework:wtr` (courant) | `identity_status: canonical` + `prior_id: framework:wtf` | Identité canonique courante ; expose son identité antérieure. |

Les deux restent `published` au niveau version : `identity_status` est une **surcouche
dérivée**, pas un remplacement du statut de version. *(Rappel : l'enum
`wsp_framework_versions.status` ne connaît que `published`/`deprecated` — aucune valeur
`superseded`/`reidentified` n'est stockée ; tout se calcule.)*

**Comment ça se dérive dans la requête :** la résolution `.or(id.eq.${id},slug.eq.${id})`
résout toujours correctement le framework (ids/slugs distincts). On **ajoute une lecture**
de la table de réidentification : `EXISTS(prior_id = framework.id)` → `canonical_id` +
`identity_status = reidentified` ; `EXISTS(canonical_id = framework.id)` → `prior_id` +
`identity_status = canonical`.

**Comportement cible :**
- `/frameworks/world-trader` → `framework:wtr`, `identity_status: canonical`,
  `prior_id: framework:wtf`.
- `/frameworks/wtf` → `framework:wtf`, `identity_status: reidentified`,
  `canonical_id: framework:wtr` *(après retrait de la 301 — §4)*.

⚠️ **Écart d'implémentation** : aucune route `/frameworks/[id]` de *définition* n'existe —
seulement `/frameworks/[id]/skills`. Enrichir cette réponse **ou** ajouter une route de
définition. Décision d'implémentation (pas maintenant).

**`/frameworks/wtr` (id nu) doit-il résoudre ?** Aujourd'hui **non** (`wtr` ≠ id canonique
`framework:wtr`, ≠ slug `world-trader`) → 404. Reco : ne pas l'ajouter. Nuance : les
Evidence portent `framework.id = "wtr"` (short-id nu) → si symétrie fait↔découverte voulue,
alias `wtr → framework:wtr`. Non tranché.

---

## 4. Retrait de la redirection

**Disparaît (supprimé) :**
- `lib/seo/transitional-redirects.ts` — l'entrée `/frameworks/wtf/skills → 301 →
  /frameworks/world-trader/skills` (fichier retirable).
- `lib/seo/transitional-redirects.test.ts` — le test associé.
- Le **branchement dans `next.config.ts`** (`transitionalRedirects` → `redirects()`).
- La **date gravée du 31 octobre 2026** : plus de redirection, plus de date.

**Amendé (PAS supprimé — documents historiques) :**
- `docs/migration/MIG-wtf-to-wtr-2026-07-18.md` — section « Redirection transitoire » +
  date **caduques** (déjà signalé) : marquer caduc, l'historique reste.
- `docs/migration/PLAN-forward-wtf-to-wtr.md` — idem.

**Conséquence conforme** : `/frameworks/wtf/skills` cesse de rediriger et **résout** vers
la définition sous l'identité antérieure — « chaque identité a son adresse propre »,
« aucune redirection permanente », « wtf reste consultable ».

---

## 5. Le seed

Le seed `20260713000001` ne déclare **que `wtr`** → base fraîche = `wtr` seul, sans `wtf`,
sans réidentification. Pour **reproduire l'état réel post-Lot B**, le seed doit contenir la
**couche définition complète** :
1. **`framework:wtf` publié** — ses 7 lignes (framework + `wtf@0.1` + `wtf:212` + 4 niveaux).
2. **`framework:wtr` publié** — ses 7 lignes (identiques en `wtr`).
3. **La ligne de réidentification** `framework:wtf` → `framework:wtr`
   (`prior_id = framework:wtf`, `canonical_id = framework:wtr`), à la **granularité retenue
   en §9**.

Tout en `on conflict do nothing` (INSERT idempotents, cohérent append-only).

⚠️ **Limite honnête** : le seed reproduit la **couche définition** (frameworks +
réidentification), **pas la couche faits** — les **79 Evidence** `wtf:212` sont des données
de production, jamais seedées.

---

## 6. Passages de Records à réécrire *(livrable principal — je délimite, l'architecte rédige)*

### La grille de tri (proposée)
Le corpus a été renommé `wtf→wtr` en bloc (`ddfda6f`). La ligne de partage suit **la propre
séparation du WSP entre zone FAITS et zone SÉMANTIQUE** :

- **Couche DÉFINITION** (Framework, Skill, Competency, Capability, résolution du Registry)
  → la coordonnée **courante** est `wtr:212` → **JUSTE, garder `wtr`.**
- **Couche FAIT** (Evidence émise/acceptée/journalisée, Immutable Fact, Trust calculé,
  Vérification d'un fait réel, mapping projet seedé) → les faits réels portent **`wtf:212`
  à jamais** → **FAUX, doit refléter `wtf`.**

> **Note v2** : sous réidentification, `wtf:212` et `wtr:212` désignent **la même définition
> logique**. Un passage couche-DÉFINITION reste donc juste en `wtr`. Un passage couche-FAIT
> reste faux non parce que le sens diffère, mais parce que **l'identité littérale stockée
> dans le fait est `wtf:212`** (hash-portante, §10) — un fait réel ne « devient » jamais
> `wtr:212`, il est **résolu** vers l'identité courante à la lecture.

### Couche FAIT — passages proposés **FAUX** (→ `wtf:212`)

| Record | Ligne | Passage (verbatim abrégé) | Pourquoi faux |
|---|---|---|---|
| **OCR-121** Certified Issuer | 156 | « its Evidence referencing `wtr:212` is **accepted and journaled** » | Fait réalisé → journalisé en `wtf:212`. |
| **OCR-120** Issuer | 118 | JSON `"references_framework": "wtr:212"` | Référence d'Evidence produite. |
| **OCR-120** Issuer | 152 | « produces Evidence referencing `wtr:212`; Opus X **accepts it and binds it** » | Fait réalisé, lié au Passport. |
| **OCR-110** Evidence | 144 | JSON `"framework": { "id": "wtr", "reference": "wtr:212" }` | Corps d'une **Evidence** (artefact-fait). |
| **OCR-110** Evidence | 173–174 | JSON-LD `framework:wtr` + `"frameworkReference": "wtr:212"`, `isImmutable:true` | Modélise un **fait immuable**. |
| **OCR-110** Evidence | 198 | « emits Evidence referencing `wtr:212` … **journals the fact**, links it to the Passport » | **LE** fait démontré réel. |
| **OCR-114** Immutable Fact | 161 | « An **accepted Evidence** for `wtr:212` is **written as an Immutable Fact** … » | Fait réalisé. |
| **OCR-109** Verif. Response | 116 | JSON `"verified": { "coordinate": "wtr:212", "facts": ["ev_01KXM07…"] }` | Fait **vérifié précis**. |
| **OCR-109** Verif. Response | 155 | « reports computed Trust for `wtr:212` … limited to disclosed facts » | Trust sur faits réels. |
| **OCR-106** Trust Status | 112, 129 | `"framework_version": "wtr@1.0.0"`, `"underFrameworkVersion": "wtr@1.0.0"` | Trust calculé sur faits réels (+ version). |
| **OCR-105** Trust | 133 | JSON-LD `"interpretedAgainst": framework:wtr` | Trust interprété contre le framework des faits (`wtf`). *(borderline)* |

### Couche DÉFINITION — passages proposés **JUSTES** (→ garder `wtr:212`)

| Record | Lignes | Nature |
|---|---|---|
| **OCR-115** Framework | 16, 48, 61, 118, 125, 141–142, 163, 191–192, 215, 219, 235 | Le Framework lui-même — `framework:wtr` **est** le framework courant. |
| **OCR-116** Skill | 126, 144 | Skill défini par `framework:wtr`, clusterisé sous `wtr:212`. |
| **OCR-117** Competency | 24, 47, 63, 110, 125–126, 143, 172, 178, 195, 199, 215 | Compétence **définie**, adressée par `wtr:212`. |
| **OCR-118** Capability | 111, 127–128, 144 | Capability composant la compétence `wtr:212`. |
| **OCR-119** Framework Registry | 47, 60, 67, 187–192, 214, 218 | Couche de **résolution** d'une coordonnée courante. |

### Trois zones **BORDERLINE** — à trancher
- **OCR-100:117** — « Facts reference a Framework coordinate (e.g. `wtr:212`) » : générale
  mais parle de faits.
- **OCR-119:114, 118–124, 138–143, 162, 191** — le **mapping projet seedé** « four rows to
  `wtr:212` » : si `wsp_skill_mappings` réel → `wtf:212` (FAUX) ; si illustration → JUSTE.
- **OCR-108** (116, 132–133, 151, 207) — **scope de requête** `wtr:212` / `wtr@1.0.0` :
  forward (coordonnée courante) ou rétro (faits réels en `wtf`) ?

### Note transverse — **la version**
Le corpus écrit `wtr@1.0.0` / `version: "1.0.0"` (OCR-106, 108, 109, 115) alors que base +
seed disent **`0.1`**. Seconde inexactitude, orthogonale à la coordonnée — à décider si
Lot B la réconcilie.

### Lignes longues non dépliées (blocs machine / résumés)
OCR-115:16/26/211/223, OCR-117:20/191/203, OCR-119:16/22/26/210/222, OCR-110:16/253,
OCR-108:199/211, OCR-109:215, OCR-116:20/203, OCR-118:204, OCR-120:212, OCR-121:216 —
même coordonnée, classification héritée de leur Record. Extraction verbatim sur demande.

---

## 7. Knowledge Graph

État actuel : `supersedes` (PRD-007) n'existe dans le KG qu'en **réflexif** (self-loops sur
Evidence, Immutable Fact, Framework version). **Ni `wtf` ni `wtr` ne sont des nœuds** (KG à
0 wtf / 0 wtr).

Sous réidentification, l'arête cible serait `framework:wtf` `reidentifies` → `framework:wtr`
— **un prédicat qui n'existe pas encore dans le KG** (voir §11 : il faut d'abord que la
projection machine et la classification le connaissent). Ce serait **la première arête
réelle** de ce prédicat entre deux entités.

**Ce que ça coûte (je ne décide pas) :**
- Créer d'abord **deux nœuds entité** (`framework:wtf`, `framework:wtr`) — inexistants —
  **puis** l'arête.
- KG **gelé sous `c172712`** → régénérer = **re-gravure** (décision architecte).
- Régénération + re-vérification (`wsp-graph.json` + `.report.json`), adoption d'un
  **précédent** : la réidentification devient un motif du KG.

Recommandation : décider si le KG doit modéler la réidentification de la couche définition.

---

## 8. Ordre d'exécution et réversibilité

**Ordre proposé :**
1. **Amender OCR-007** — graver le prédicat + régénérer sa projection/classification (§11).
   Réversible (git) tant que le KG n'est pas re-gravé.
2. **Schéma** — table de réidentification + triggers d'immuabilité (DDL, **non bloqué**).
   Réversible tant que **vide** (DROP possible).
3. **Publication** — 7 lignes `wtr` + la ligne de réidentification, **staging d'abord**,
   **puis** prod.
4. **Code** — dérivation `identity_status`/`canonical_id` dans la découverte ; retrait
   redirection + test + branchement (§4). Réversible (`git revert`).
5. **Corpus** — réécriture §6 ; régénération manifest/golden/API. Réversible (git).
6. **KG** — *si l'architecte tranche §7* : re-gravure.
7. **Seed** — mise à jour §5. Réversible (git).

**Réversibilité — dit franchement :**
- Les **7 lignes `wtr`** et la **ligne de réidentification**, une fois INSÉRÉES, **ne
  peuvent PLUS être retirées** : UPDATE/DELETE/TRUNCATE bloqués **au niveau SGBD,
  `service_role` inclus**. **Publier `framework:wtr` est DÉFINITIF.**
- Un **INSERT erroné n'est PAS rattrapable par suppression.** La seule correction
  append-only est d'**avancer** (réidentifier de nouveau vers un objet correct). Jamais
  « comme si ça n'avait pas existé ».
- **Aucun rollback DB.** La sûreté vient de **l'append-only + validation AVANT insertion**.
- **Conséquence** : la prod ne s'écrit qu'après **répétition exhaustive sur staging** et
  **relecture valeur par valeur** — en particulier la **direction** (§2) et la
  **granularité** (§9), toutes deux définitives.
- Seuls la **table vide** (étape 2) et les changements **code/corpus/seed/OCR-007** (git)
  sont réversibles. Une ligne de réidentification publiée rend la table **permanente**.

---

## 9. Granularité de la réidentification *(normatif — je ne tranche pas)*

**Ce que la réidentification change par rapport à v1.** En v1 (`supersedes`), j'avais posé
une **tension sémantique** : réidentifier chaque sous-objet aurait *sur-affirmé* qu'il est
« remplacé/retiré », alors que `wtf:212` reste vivant. **La réidentification dissout cette
tension** : dire « `wtf:212` est réidentifié comme `wtr:212` » est exactement juste — même
définition, nouvelle identité, **aucune** implication de retrait. La question n'est donc
plus « est-ce approprié ? » mais **« à quelle granularité les consommateurs détiennent-ils
des identifiants à résoudre ? »**

**Ce qu'un fait détient réellement** (relevé sur `evidenceCovered.ts` / le payload) :
`framework.id` (`wtf`), `framework.version` (`0.1`), `demonstrates.skill_id` (`wtf:212`),
la `reference` (`wtf:212`) — **mais le niveau est stocké en SLUG** (`claimed_level:
"applied"`), **jamais** l'id de niveau `wtf:212#applied`. Les 4 ids de niveau sont
**internes**, hors des faits.

### Scénario A — 1 maillon (framework)
Une ligne : `framework:wtf` → `framework:wtr`.
- Interroger `framework:wtf` → `canonical_id: framework:wtr` ✅.
- Interroger `wtf:212` → **aucune** ligne `prior_id = wtf:212` : la résolution doit
  **remonter** au framework parent, et la correspondance `wtf:212 → wtr:212` reste
  **implicite** (convention de nommage).

### Scénario B — un maillon par identifiant changé (7 maillons)
`framework`, `version`, `skill`, **4 niveaux**.
- Toute granularité résout en **lookup direct**.
- Mais **4 des 7 maillons** (les niveaux) portent des ids que **les faits ne citent
  jamais** → 4 relations définitives **sans valeur consommateur**, et 4 arêtes KG en plus
  si §7 retenu.

### Scénario C (informé réidentification) — les identifiants réellement détenus (3 maillons)
`framework:wtf→wtr`, `framework:wtf@0.1→wtr@0.1`, `wtf:212→wtr:212`.
- Chaque identifiant **qu'un fait ou une requête porte** se résout **directement**, sans
  inférence par nom, **sans** maillon mort sur les niveaux.
- **C'est le compromis que la réidentification rend naturel** : on réidentifie exactement
  ce qui est déréférencé.

### Ce que voit un consommateur qui interroge `wtf:212`

| | Interroger `framework:wtf` | Interroger `wtf:212` | Résolution coordonnée |
|---|---|---|---|
| **A** (1) | `canonical_id: framework:wtr` ✅ | via parent (transitif) | **implicite** (nom) |
| **C** (3) | ✅ | `canonical_id: wtr:212` ✅ | **explicite** |
| **B** (7) | ✅ | ✅ à toute granularité | **explicite partout** (+ 4 maillons morts) |

**Décision normative réservée à l'architecte.** La granularité est **définitive** (§8) : on
ne retire pas un maillon publié. Ma lecture (non contraignante) : la réidentification pousse
vers **C** — réidentifier tout identifiant déréférencé, rien de plus.

---

## 10. Résolution d'identité pour le Trust *(mesure, aucun code)*

L'architecte pose : `wtf:212` et `wtr:212` désignent **la même définition logique**, et le
Trust ne fait qu'une **résolution d'identité**. Question : **que fait le code
AUJOURD'HUI ?** Mesure sur l'existant.

### 1. Le Trust sur les faits n'existe pas encore
- **Passport public** (`lib/api/readPublicPassport.ts`) : `trust_status` est une **valeur
  par défaut** (`'establishing'`), `evidence: []`, `skills_status: 'empty'` — **rien n'est
  calculé** depuis les faits (la vue `public_passport_view` ne les porte pas en Sprint 1).
- **Dashboard** (`lib/dashboard/DashboardService.ts`) : `readTrustStatus` lit une table
  **d'affichage Sprint-1 `trust_index`** par `passport_id` (`state`/`score`) — **découplée**
  du fact store `wsp_evidence`, **jamais dérivée d'une coordonnée**.
- **Conclusion** : il n'y a **aucun calcul de Trust sur coordonnées**. Donc, littéralement,
  le Trust ne « se calcule » ni sur la coordonnée littérale, ni par résolution — **il ne se
  calcule pas du tout**.

### 2. Là où la coordonnée EST utilisée, c'est LITTÉRAL (aucune résolution d'identité)
- **Ingestion, étape 8** (`20260713000005`, cohérence Framework §10) :
  `select slug from wsp_skill_levels where skill_id = v_skill and framework_version =
  v_fwver …` — **match exact** sur `wtf:212` + version citée. Un fait `wtf:212` ne résout
  que contre des lignes `wtf:212`.
- **Préimage du hash** (`lib/wsp/evidenceCovered.ts`) : `framework.id` et
  `demonstrates.skill_id` sont **copiés littéralement** dans l'objet haché (§6.1). **La
  coordonnée est donc PORTÉE PAR LE HASH** : réécrire `wtf:212 → wtr:212` dans un fait
  existant **changerait son `canonical_hash`** → romprait l'intégrité et l'idempotence.
- **FK des 79 faits** : `wsp_evidence_demonstrates_skill.skill_id → wsp_skills(id)` (+ FK
  composite vers `wsp_skill_levels`) pointent **littéralement** vers `wtf:212`.

### 3. Distance entre l'existant et le comportement gravé
- La **résolution d'identité est TOTALEMENT ABSENTE** : partout où la coordonnée agit, elle
  agit **littéralement**. L'écart n'est donc pas « faire résoudre le Trust au lieu de
  littéral » — c'est **« il n'existe encore ni Trust, ni résolution »**.
- **Contrainte dure, non négociable** : la coordonnée étant **hash-portante**, la résolution
  d'identité **ne peut PAS** procéder en réécrivant les faits (cela casse le hash, et
  l'append-only l'interdit de toute façon). Elle **doit** vivre **à la lecture /
  interprétation** : un futur module Trust/vérification, en rencontrant `wtf:212`, consulte
  la table de réidentification et le traite **comme** l'identité courante `wtr:212` — sans
  jamais toucher le fait stocké.
- **Ingestion** : inchangée pour l'existant (`wtf:212` résout contre `wtf:212`, toujours
  présent ; un futur fait `wtr:212` résoudra contre `wtr:212`, publié en §2). Si un jour on
  veut **accepter indifféremment** l'une ou l'autre identité et les **traiter comme
  équivalentes**, c'est l'ingestion **et** le Trust qui consulteront la réidentification —
  **travail futur, non présent**.
- **Mesure nette** : Trust-sur-faits = **0 % construit** ; résolution d'identité = **0 %
  construite** ; le prédicat de réidentification est un **intrant d'une couche
  d'interprétation encore inexistante**, à brancher **en lecture seule** au-dessus de faits
  **immuables et hash-scellés**. Le Lot B **publie l'identité et la relation** ; il ne
  construit **pas** la résolution — celle-ci est un lot ultérieur dont §10 borne le contrat.

---

## 11. Artefacts touchés par l'amendement d'OCR-007 *(ajout d'un prédicat)*

Graver le prédicat de réidentification dans OCR-007 touche, en cascade :

| Artefact | Nature du toucher | Confiance |
|---|---|---|
| `docs/registry/OCR-007_Canonical_Predicate_Registry.md` | **La gravure elle-même** (source de vérité) : nouvelle entrée `PRD-xxx`, famille, inverse, symétrie. | certain |
| `content/registry/ocr-007-resolution.json` | **Projection machine** régénérée : `build-graph.mjs` lit `resolutionDoc.predicates` — le prédicat doit y figurer sinon le moteur l'ignore. | certain |
| `content/registry/external-classification.json` | Si le prédicat requiert une **famille/catégorie** ou un **alias** de label (le moteur mappe labels→catégories). Un prédicat de famille nouvelle (Identité/Équivalence) impose une entrée. | probable |
| `content/registry/wsp-graph.json` + `.report.json` | **Re-gravure** du KG dès que le prédicat participe au graphe (et *a fortiori* si l'arête `wtf→wtr` est ajoutée, §7). Régénérer depuis une résolution/classification modifiée change la **baseline `c172712`** → décision architecte. | certain si §7 retenu ; sinon à vérifier |
| `content/registry/_manifest.json` + `MANIFEST-OCR.json` | **Checksums** des fichiers modifiés (OCR-007 source + projections) → régénération manifest. | certain |
| `build/wsp001-lot0/predicate-inventory.mjs` → `predicate-inventory.md` ; `predicate-examples.mjs` → `predicate-examples.md` ; `build-csv.mjs` | Outillage qui **énumère les prédicats** : à rejouer si l'inventaire/les exemples doivent refléter le nouveau. | probable |
| Tests figeant l'**ensemble des prédicats** ou le **checksum d'OCR-007** | Un test d'égalité stricte sur le nombre/liste de prédicats ou sur un golden d'OCR-007 casserait à l'ajout. | **à vérifier** avant implémentation |

**Chemin minimal** (sans re-graver le KG) : OCR-007 (source) → `ocr-007-resolution.json` →
`external-classification.json` (si famille/alias) → manifest. **Chemin complet** (si le KG
modélise la réidentification, §7) : + `wsp-graph.json`/`.report.json` re-gravés + baseline
architecte.

---

*Fin du dossier v2. Conception seule — aucune ligne à exécuter ne découle de ce document
sans un mandat d'implémentation dédié. Deux dénominations restent réservées à l'architecte :
le **nom du prédicat** (et sa famille) dans OCR-007, et le **jeton d'`identity_status`** (§3).*
