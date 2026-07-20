# LOT B — Publication d'une seconde représentation canonique (`framework:wtr`) par réidentification

> **Statut : CONCEPTION SEULE.** Aucun SQL, aucun code applicatif, aucune migration
> exécutée. Référence versionnée d'une **opération irréversible** (§8). Précède
> l'implémentation ; ne l'autorise pas.
>
> **Historique**
> - **v1** — fondée sur `supersedes` (PRD-007).
> - **v2** — `supersedes` écarté ; prédicat de réidentification canonique.
> - **v3** — vocabulaire à trois niveaux ; transitivité (relations directes) ; projection
>   du graphe (c172712 non re-gravé).
> - **v4 (2026-07-19)** — l'architecte **grave l'amendement OCR-007 en intégralité** et
>   tranche : prédicat **`reidentified_as`** (inverse dérivé `was_reidentified_from`) ;
>   **granularité tranchée** (3 relations directes) ; **statuts dérivés gravés** ; **version
>   0.1 confirmée** + distinction implémentation/normative ; **principe de couche de lecture**
>   gravé. §6 élargi aux `1.0.0`. OCR-007 v1.2.0 et sa projection machine **amendés**.
> - **v5 (2026-07-19)** — l'architecte tranche **voie (b)** : `reidentified_as` **rejoint la
>   famille Resolution / Identity existante** en **PRD-306** (rang suivant du bloc 3xx) ; la
>   famille « Identity Resolution » n'est **pas** créée. **Principe de gouvernance des
>   familles** gravé (OCR-007 §9). Numéro répercuté partout (registre, inverse §4, projection
>   machine). `source_commit` de la projection mis à jour vers ce commit.
>
> **(A) Vocabulaire à trois niveaux — employé partout.**
> 1. **Définition logique** — ce que *signifie* le Framework. **Unique**, jamais dupliquée.
> 2. **Représentation canonique** — les **lignes publiées** sous un identifiant donné.
>    **Deux coexistent** (`wtf`, `wtr`) : la seconde est une **seconde représentation de la
>    MÊME définition logique**, duplication **de représentation** imposée par l'append-only,
>    **jamais** de sens.
> 3. **Identifiant canonique** — le nom protocolaire lui-même. C'est **lui seul** qui change.
>
> **(B) Transitivité.** Seules les relations **DIRECTES** sont publiées ; une relation
> déductible n'est jamais stockée. La chaîne se reconstruit à la lecture.
>
> **(C) Projection du graphe.** *« Le graphe est toujours une projection fidèle du corpus
> publié à un instant donné. Il n'anticipe jamais des faits futurs et ne réécrit jamais des
> faits passés. Toute publication append-only produit une NOUVELLE projection, sans modifier
> les projections antérieures. »* → `c172712` **n'est pas re-gravé** ; une nouvelle
> projection vient **après** publication (§7, §8).
>
> **(D) Résolution d'identité — couche de lecture (principe gravé).** *« La résolution
> canonique d'identité appartient exclusivement à la couche de lecture. Aucun mécanisme du
> WSP n'est autorisé à modifier un fait publié, directement ou indirectement, y compris lors
> d'un changement d'identifiant canonique. »* (§10.)
>
> **Prédicat — GRAVÉ (OCR-007 v1.2.0).** `reidentified_as` (Canonical Name « Reidentified
> As »), **PRD-306**, qui **rejoint la famille Resolution / Identity existante** (rang
> suivant du bloc 3xx — *pas* de famille nouvelle, principe de gouvernance des familles
> gravé en OCR-007 §9) ; inverse dérivé **`was_reidentified_from`** (vue dérivée §4
> d'OCR-007, une seule direction stockée, partage PRD-306) ; **asymétrique · antisymétrique
> · transitif · non réflexif** ; **relations directes uniquement** ; **interdit dès qu'une
> propriété sémantique évolue** — auquel cas `supersedes` (PRD-007). *(Le n° `PRD-306` et
> les champs de format non dictés sont renseignés par convention, signalés dans OCR-007 §9,
> à confirmer.)*
>
> **Ancrage** : `20260713000001/2/5.sql` ; `lib/wsp/evidenceCovered.ts` ;
> `lib/api/readPublicPassport.ts` ; `lib/dashboard/DashboardService.ts` ;
> `app/frameworks/[id]/skills/route.ts` ; `lib/seo/transitional-redirects.ts` ;
> `docs/registry/OCR-007_Canonical_Predicate_Registry.md` (v1.2.0) +
> `content/registry/ocr-007-resolution.json` ; KG `content/registry/wsp-graph.json`
> (projection `c172712`) ; 14 Records de `docs/web/registry-import/OCR-100/`.

---

## 1. Schéma de la table de réidentification

Mécanisme canonique pour **tous** les objets immuables. Relie deux **identifiants
canoniques** (niveau 3) d'une **même définition logique** (niveau 1).

| Colonne | Type | Justification |
|---|---|---|
| `id` | text, PK | La relation **est elle-même un fait immuable**. |
| `predicate` | text, `check in ('reidentified_as')` | Self-describing ; valeur **gravée** (PRD-306). |
| `prior_type` | text, `check in (…)` | Discrimine la table cible (polymorphisme). |
| `prior_id` | text | Identifiant **antérieur** (`framework:wtf`). Exposé en découverte comme `previous_identifier`. |
| `canonical_type` | text, `check in (…)` | Idem côté identité courante. |
| `canonical_id` | text | Identifiant **courant** (`framework:wtr`). Exposé en découverte comme `canonical_identifier`. |
| `recorded_at` | timestamptz, default now() | Enveloppe immuable. |
| `effective_at` | date, nullable | Date domaine, si souhaité. |

**Le prédicat ne change pas la forme de la table** : `predicate` est `text` + `check in
(…)` ; graver un prédicat = redéfinir le CHECK, pas la forme.

**Référencement polymorphe** : paire `type` + `id` (seul point commun : un id canonique
textuel) ; intégrité bornée par le chemin d'écriture `service_role` + trigger de validation
à l'INSERT. (FK par type / table par type rejetées.)

**Anti-cycle** (prédicat asymétrique/antisymétrique) : `check (prior_id <> canonical_id …)`
+ trigger anti-2-cycle + traversée récursive anti-n-cycle, **à l'INSERT** (jamais mutation).

**Unicité** : `unique (predicate, prior_type, prior_id)` → réidentifié au plus une fois →
chaîne linéaire. Reco : aussi `unique (predicate, canonical_type, canonical_id)`.

**Identité courante** = l'objet dont l'`id` **n'apparaît jamais dans `prior_id`** (tête
unique grâce à l'unicité).

**Transitivité (B)** : seuls les maillons **directs** sont stockés ; la relation déductible
A→C n'est jamais insérée. Détermine la granularité (§9).

**Trigger d'immuabilité** : `BEFORE UPDATE OR DELETE … FOR EACH ROW` +
`BEFORE TRUNCATE … FOR EACH STATEMENT` → `wsp_reject_mutation()` (générique).

---

## 2. Ce qui est publié — une seconde REPRÉSENTATION, pas une seconde définition

On **INSÈRE** une **seconde représentation canonique** (sous `wtr`) de la **même définition
logique** déjà représentée sous `wtf` :

| # | Table | Ligne |
|---|---|---|
| 1 | `wsp_frameworks` | `framework:wtr` · slug `world-trader` · « World Trader Framework » · Opus X |
| 2 | `wsp_framework_versions` | `framework:wtr@0.1` · version `0.1` · status `published` |
| 3 | `wsp_skills` | `wtr:212` · code `WTR-212` · « Intention vs Engagement » |
| 4–7 | `wsp_skill_levels` | `wtr:212#aware/applied/proficient/mastery` (rangs 1→4, bandes 2-2/3-3/4-4/5-5) |
| 8 | **table de réidentification** | `framework:wtf` `reidentified_as` `framework:wtr` |
| 9 | **table de réidentification** | `framework:wtf@0.1` `reidentified_as` `framework:wtr@0.1` |
| 10 | **table de réidentification** | `wtf:212` `reidentified_as` `wtr:212` |

**= 7 lignes de représentation + 3 lignes de réidentification = 10 INSERT** (granularité
tranchée, §9). Les **4 niveaux ne reçoivent aucune relation** (règle §9).

> **Cadrage (A)** : ces 7 lignes ne créent **aucune nouvelle définition logique** — c'est la
> **représentation canonique** de la définition existante sous un **nouvel identifiant**.
> Duplication **de représentation** (append-only), jamais de sens.

> ⚠️ **Direction (définitive)** : `prior_id = wtf`, `canonical_id = wtr`. L'inverse serait
> irréversible (§8).

- **Coordonnées `wtr:212`/`WTR-212`** : confirmées.
- **Version : `0.1` CONFIRMÉ.** Distinction gravée : **version d'implémentation** (`0.1`, le
  jalon courant réel du WTR) vs **version normative** (`1.0.0`, **réservée** à la première
  publication normative complète du protocole). `wtr` démarre à `0.1` ; **`1.0.0` ne doit
  pas être employé** avant cette publication normative (⇒ §6, inventaire version).
- **4 niveaux à l'identique** : oui.
- **INSERT bloqué ?** **Non** (garde = UPDATE/DELETE/TRUNCATE seulement ; aucune unicité ne
  s'oppose).

---

## 2·bis. Principe gravé — conservé vs renouvelé lors d'une réidentification (NORMATIF WSP)

> **Gravé par l'architecte (2026-07-20). Normatif pour TOUTE réidentification du World
> Skills Protocol, pas seulement ce chantier.**
>
> - **CONSERVÉ à l'identique** : tout ce qui exprime le contenu normatif, le comportement,
>   la portée ou la validité — date d'entrée en vigueur, définition, comportements,
>   contraintes, garanties, effets, exigences de conformité. *« Que dit cette définition ? »*
> - **RENOUVELÉ** : ce qui est propre à l'acte de réidentification — identifiant canonique,
>   métadonnées de publication de la nouvelle représentation, liens `reidentified_as`,
>   informations de continuité. *« Sous quelle identité est-elle publiée ? »*
> - **CRITÈRE** : si modifier une valeur change le sens, les effets ou les obligations de
>   la définition, elle ne peut pas être modifiée lors d'une réidentification.

**Application aux 7 lignes publiées (§2)** — chaque colonne classée :

| Catégorie | Colonnes | Traitement |
|---|---|---|
| **RENOUVELÉ** (identité + métadonnées de publication) | `id`, `framework_id`, `slug` (framework), `code` (skill), `recorded_at`, `published_at` | nouvel identifiant / littéral / `now()` |
| **CONSERVÉ** (contenu normatif) | `name`, `description`, `publisher`, `protocol_version`, `version`, `status`, **`effective_date` = 2026-07-13**, `framework_version`, `slug`+`label`+`rank`+`criteria`+`observation_min/max` (niveaux) | copié depuis `wtf` à l'identique |

**`effective_date = 2026-07-13` est GRAVÉE** : la représentation réidentifiée conserve la
date d'entrée en vigueur de l'origine. Exemple le plus net du principe — la date **domaine**
(`effective_date`, quand les règles s'appliquent) est **conservée**, tandis que les
métadonnées **système** (`published_at`/`recorded_at`, quand *cette* représentation a été
publiée) sont **renouvelées** à `now()`. Mettre `now()` sur `effective_date` signifierait une
nouvelle version en vigueur — contraire à « aucun changement sémantique ».

---

## 3. Découverte canonique — statuts dérivés GRAVÉS

**Statut DÉRIVÉ, jamais persisté** (gravé) :

| Côté | Champs dérivés (gravés) | Sens |
|---|---|---|
| `framework:wtf` (représentation historique) | `status: "reidentified"` + `canonical_identifier: framework:wtr` | Représentation antérieure d'une définition toujours vivante ; pointe vers l'identifiant courant. |
| `framework:wtr` (représentation courante) | `status: "canonical"` + `previous_identifier: framework:wtf` | Représentation canonique courante ; expose son identifiant antérieur. |

**Jamais persistés** : `status` reste `published` en base ; `reidentified`/`canonical` sont
une **surcouche dérivée** calculée à la lecture. *(L'enum `wsp_framework_versions.status` ne
connaît que `published`/`deprecated`.)*

**Dérivation** : `.or(id.eq.${id},slug.eq.${id})` résout le framework ; + lecture de la
table : `EXISTS(prior_id = framework.id)` → `canonical_identifier` + `reidentified` ;
`EXISTS(canonical_id = framework.id)` → `previous_identifier` + `canonical`.

**Comportement cible** : `/frameworks/world-trader` → `canonical` + `previous_identifier` ;
`/frameworks/wtf` → `reidentified` + `canonical_identifier` *(après retrait 301, §4)*.

⚠️ Aucune route `/frameworks/[id]` de définition n'existe (seulement `/skills`) → enrichir
ou ajouter. **`/frameworks/wtr` (id nu)** → 404 ; reco : ne pas l'ajouter.

---

## 4. Retrait de la redirection

**Supprimé** : `lib/seo/transitional-redirects.ts` (entrée `/frameworks/wtf/skills → 301`) ;
`…transitional-redirects.test.ts` ; branchement `next.config.ts` ; date du 31 octobre 2026.
**Amendé (historiques, non supprimés)** : `MIG-wtf-to-wtr-2026-07-18.md`,
`PLAN-forward-wtf-to-wtr.md` (redirection + date **caduques**).
**Conséquence** : `/frameworks/wtf/skills` **résout** vers la représentation antérieure.

---

## 5. Le seed

Le seed `20260713000001` ne déclare que `wtr` → base fraîche divergente. Pour reproduire
l'état réel post-Lot B, il doit contenir **les deux représentations + les 3 relations** :
1. `framework:wtf` publié (7 lignes).
2. `framework:wtr` publié (7 lignes, même définition logique).
3. Les **3 lignes de réidentification** (framework, version, skill), granularité §9.

`on conflict do nothing`. ⚠️ Reproduit la **couche définition**, pas les **79 Evidence**
`wtf:212` (données de production).

---

## 6. Passages de Records à réécrire *(livrable principal — je délimite, l'architecte rédige)*

### 6a. Coordonnées (`wtr:212` vs `wtf:212`)

Grille : **DÉFINITION** (Framework, Skill, Competency, Capability, Registry) → `wtr:212`
JUSTE ; **FAIT** (Evidence émise/journalisée, Immutable Fact, Trust calculé, Vérification
d'un fait réel, mapping seedé) → identifiant antérieur `wtf:212` (hash-portant, §10) → FAUX
en `wtr`.

**Couche FAIT — FAUX (→ `wtf:212`)** :

| Record | Ligne | Passage | Motif |
|---|---|---|---|
| OCR-121 | 156 | « Evidence referencing `wtr:212` is **accepted and journaled** » | fait journalisé |
| OCR-120 | 118 | `"references_framework": "wtr:212"` | référence d'Evidence |
| OCR-120 | 152 | « produces Evidence referencing `wtr:212`; Opus X **accepts it and binds it** » | fait lié au Passport |
| OCR-110 | 144 | `"framework": { "id": "wtr", "reference": "wtr:212" }` | corps d'Evidence |
| OCR-110 | 173–174 | JSON-LD `framework:wtr` + `frameworkReference: "wtr:212"`, `isImmutable:true` | fait immuable |
| OCR-110 | 198 | « emits Evidence referencing `wtr:212` … **journals the fact** » | fait démontré réel |
| OCR-114 | 161 | « An **accepted Evidence** for `wtr:212` is **written as an Immutable Fact** » | fait réalisé |
| OCR-109 | 116 | `"verified": { "coordinate": "wtr:212", "facts": ["ev_01KXM07…"] }` | fait vérifié précis |
| OCR-109 | 155 | « computed Trust for `wtr:212` … » | trust sur faits réels |
| OCR-106 | 112, 129 | `"framework_version": "wtr@1.0.0"` (×2) | trust sur faits réels |
| OCR-105 | 133 | JSON-LD `"interpretedAgainst": framework:wtr` | trust contre le framework des faits *(borderline)* |

**Couche DÉFINITION — JUSTES (garder `wtr:212`)** : OCR-115 (16,48,61,118,125,141–142,163,
191–192,215,219,235) ; OCR-116 (126,144) ; OCR-117 (24,47,63,110,125–126,143,172,178,195,
199,215) ; OCR-118 (111,127–128,144) ; OCR-119 (47,60,67,187–192,214,218).

**Borderline** : OCR-100:117 ; OCR-119:114/118–124/138–143/162/191 (mapping seedé) ;
OCR-108:116/132–133/151/207 (scope de requête).

### 6b. Version (`wtr@1.0.0` / `version: "1.0.0"` du Framework → `0.1`) — NOUVEAU

Motif commun : le Framework WTR est en **version d'implémentation `0.1`** ; `1.0.0` est
**réservé** à la première publication **normative** complète (distinction gravée, §2). Toute
assertion de la **version du Framework** à `1.0.0` est donc inexacte.

| Record | Ligne | Passage | Motif |
|---|---|---|---|
| OCR-105 | 116 | `"interpretation": { "framework": "wtr", "version": "1.0.0" }` | version Framework ≠ 0.1 |
| OCR-105 | 152 | « under `wtr` v1.0.0 » | idem |
| OCR-106 | 112 | `"framework_version": "wtr@1.0.0"` | idem |
| OCR-106 | 129 | `"underFrameworkVersion": "wtr@1.0.0"` | idem |
| OCR-106 | 146 | « under `wtr` v1.0.0 » | idem |
| OCR-107 | 122 | `"framework_version": { "id": "wtr", "version": "1.0.0" }` | idem *(Record nouveau à ce titre)* |
| OCR-108 | 117 | `"framework_version": { "id": "wtr", "version": "1.0.0" }` | idem |
| OCR-108 | 133 | `"underFrameworkVersion": "wtr@1.0.0"` | idem |
| OCR-108 | 151 | « under `wtr` v1.0.0 » | idem |
| OCR-109 | 118 | `"framework_version": "wtr@1.0.0"` | idem |
| OCR-109 | 137 | `"reportsTrustUnder": "wtr@1.0.0"` | idem |
| OCR-109 | 155 | « under `wtr` v1.0.0 » | idem |
| OCR-115 | 124 | `"version": "1.0.0"` (objet framework, coord. `wtr:212`) | idem |
| OCR-115 | 143 | `"version": "1.0.0"` (JSON-LD framework) | idem |

**⚠️ À NE PAS TOUCHER — `1.0.0` légitime (version du DOCUMENT OCR, pas du Framework)** :
- `| **Version** | 1.0.0 |` en tête de **chaque** Record (ligne 7/8) ;
- les entrées de changelog « **1.0.0** (2026-07-16) — Initial … Supersedes the OCR-xxx v0.1
  skeleton » de chaque Record.
Ce sont les versions **des documents** (schéma de versioning OCR-005), sans rapport avec la
version du Framework. Les confondre casserait le versioning documentaire.

**Borderline version** : OCR-110:140 `"protocol_version": "1.0.0"` (enveloppe **protocole**
WSP, seed défaut `1.0` — champ distinct de la version Framework) ; OCR-115:164 « publishes
`wtr` version 1.1 » (exemple **hypothétique** de future montée de version) ; OCR-100:122
`"version": "1.0.0"` (à confirmer : version protocole vs Framework).

### Lignes longues (blocs machine/résumés)
OCR-115:16/26/211/223, OCR-117:20/191/203, OCR-119:16/22/26/210/222, OCR-110:16/253,
OCR-108:199/211, OCR-109:215, OCR-116:20/203, OCR-118:204, OCR-120:212, OCR-121:216 —
coordonnée/version héritées ; extraction verbatim sur demande.

---

## 7. Knowledge Graph — une projection, jamais réécrite (principe C)

`c172712` **n'est PAS re-gravé** : photographie valide du corpus tel qu'il était (sans
`wtf`/`wtr` comme nœuds). Une **NOUVELLE projection** est produite **APRÈS** publication
(§2) et amendement OCR-007 (fait) ; elle intègre **naturellement** les nœuds
`framework:wtf`/`framework:wtr` et les arêtes `reidentified_as` — parce qu'ils existeront
alors dans le corpus. Ni re-gravure ni décision de risque : **fonctionnement normal**. Seule
dépendance : **l'ordre** (§8) — la projection vient en dernier.

---

## 8. Ordre d'exécution et réversibilité

1. **OCR-007 amendé** — `reidentified_as` gravé + projection machine régénérée (**FAIT dans
   ce commit** ; §11). Réversible (git).
2. **Schéma** — table de réidentification + triggers (DDL, non bloqué). Réversible tant que
   vide.
3. **Publication** — 7 lignes `wtr` + **3 lignes** de réidentification, **staging d'abord**,
   puis prod. **DÉFINITIF.**
4. **Code** — dérivation `status`/`canonical_identifier` ; retrait redirection (§4).
   Réversible (git).
5. **Corpus** — réécriture §6 (coordonnées **et** version) ; régénération manifest/golden/API.
   Réversible (git).
6. **Seed** — §5. Réversible (git).
7. **Graphe — EN DERNIER** : nouvelle projection du corpus publié. **Jamais avant.**
   `c172712` intact.

**Réversibilité** : les 7 lignes `wtr` + les 3 lignes de réidentification, une fois
INSÉRÉES, **ne peuvent PLUS être retirées** (UPDATE/DELETE/TRUNCATE bloqués, `service_role`
inclus). **Aucun rollback DB** : correction = **avancer** (réidentifier de nouveau). Sûreté =
**append-only + validation AVANT insertion** (répétition staging + relecture valeur par
valeur : direction §2, granularité §9). Réversibles (git) : table vide, code/corpus/seed,
OCR-007, et la nouvelle projection de graphe.

---

## 9. Granularité de la réidentification — TRANCHÉE

**Règle gravée** : *« une relation n'est publiée que pour un identifiant susceptible d'être
référencé directement par un fait immuable. »*

**Décision** : **3 relations directes** — **framework** (`framework:wtf → framework:wtr`),
**version** (`framework:wtf@0.1 → framework:wtr@0.1`), **skill** (`wtf:212 → wtr:212`). Ce
sont exactement les identifiants qu'un fait porte (`framework.id`, `framework.version`,
`demonstrates.skill_id`/`reference`, relevé sur `evidenceCovered.ts`).

**Les 4 niveaux ne reçoivent AUCUNE relation** : un fait stocke `claimed_level` en **SLUG**
(`"applied"`), jamais l'id `wtf:212#applied` — l'identifiant de niveau n'est **jamais
référencé directement** par un fait immuable, donc pas de relation (règle gravée + B :
aucune relation morte). La correspondance de niveau, si besoin, se **déduit** (skill parent).

Conforme à (A) — représentations, pas définitions — et à (B) — relations directes
uniquement, déduction pour le reste. La granularité est **définitive** (§8).

---

## 10. Résolution d'identité pour le Trust — couche de lecture (principe D)

**Principe gravé** : *« La résolution canonique d'identité appartient exclusivement à la
couche de lecture. Aucun mécanisme du WSP n'est autorisé à modifier un fait publié,
directement ou indirectement, y compris lors d'un changement d'identifiant canonique. »*

### Mesure de l'existant (aucun code)
1. **Trust sur faits inexistant** : passport public → `trust_status:'establishing'` par
   défaut, `evidence: []` ; dashboard → table d'affichage `trust_index` par `passport_id`,
   **jamais dérivée d'une coordonnée**. Le Trust **ne se calcule pas encore**.
2. **Usage littéral (aucune résolution)** : ingestion étape 8
   (`wsp_skill_levels where skill_id = wtf:212 …`, match exact) ; **préimage du hash**
   (`evidenceCovered.ts` copie `framework.id`/`skill_id` littéralement → **coordonnée
   hash-portante**) ; FK des 79 faits → `wtf:212`.
3. **Distance / contrainte** : résolution d'identité = **0 % construite**. La coordonnée
   étant **hash-portante** et l'append-only interdisant toute mutation, la résolution **ne
   peut PAS** réécrire les faits — **conforme au principe gravé D** : elle **doit** vivre
   **en lecture**, un futur module traitant `wtf:212` **comme** `wtr:212` via la table de
   réidentification, **sans jamais toucher le fait**. Cohérent avec (A) : même définition
   logique → aucun sens changé, simple ré-étiquetage canonique à la lecture.

Le Lot B **publie la représentation et les relations** ; il ne construit **pas** la
résolution (lot ultérieur, dont §10 borne le contrat).

---

## 11. Amendement d'OCR-007 — artefacts (mesuré + FAIT dans ce commit)

**Réellement touchés (dans ce commit) :**

| Artefact | Action | Statut |
|---|---|---|
| `docs/registry/OCR-007_Canonical_Predicate_Registry.md` | Version 1.1.0→**1.2.0** ; **PRD-306 `reidentified_as`** rejoint la famille **Resolution / Identity** existante (§5) ; inverse dérivé **`was_reidentified_from`** (§4) ; **principe de gouvernance des familles** gravé (§9) ; changelog + note décision. | **fait** |
| `content/registry/ocr-007-resolution.json` | 2 entrées (`reidentified_as` Domain, `was_reidentified_from` Derived) ; `_meta` : version 1.2.0, `predicate_count` 101→**103**, famille ajoutée au schéma. | **fait** |

**Mesurés NON nécessaires (correction des hypothèses v2 §11) :**
- `content/registry/external-classification.json` — **classe des ENTITÉS, pas des
  prédicats** (clés `name_aliases`/`entity`/`cascade_predicates`…) ; `cascade_predicates` ne
  liste que des prédicats effectivement utilisés dans une cascade → `reidentified_as` n'y a
  pas sa place tant qu'aucune arête n'existe. **Inchangé.**
- `content/registry/_manifest.json` / `MANIFEST-OCR.json` — **ne suivent pas OCR-007** (plage
  OCR-000..005/100..125). **Inchangés → aucun risque CRLF/empreinte ici.**
- `build/wsp001-lot0/predicate-inventory*.mjs` / `predicate-examples*.mjs` — outillage
  **Lot 0 historique** ; non rejoué (l'inventaire Lot 0 reste une photographie ; les 101
  d'origine ne changent pas). *(À rejouer seulement si l'architecte veut un inventaire
  incluant le prédicat d'amendement.)*
- **KG** (`wsp-graph.json`/`.report.json`) — **NON régénéré** (principe C, §7) : nouvelle
  projection **après** publication.

**À vérifier avant implémentation** : un test figeant l'ensemble des prédicats ou un golden
d'OCR-007 (aucun trouvé au niveau `content/registry`, mais à confirmer côté tests).

> Note traçabilité : `ocr-007-resolution.json` porte `source_commit: "6b53a2c"` — le commit
> qui a amendé la source OCR-007 (markdown v1.2.0, `reidentified_as` = PRD-306).

---

*Fin du dossier v4. Conception seule — aucune ligne applicative n'en découle sans mandat
dédié. L'amendement d'OCR-007 (registre + projection) est, lui, **appliqué** dans ce commit,
au format des prédicats existants ; les champs de format non dictés (n° PRD, signature, etc.)
sont signalés comme renseignés par convention, à confirmer par l'architecte.*
