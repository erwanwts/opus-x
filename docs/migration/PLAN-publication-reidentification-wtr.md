# PLAN — Publication de la représentation canonique `wtr` par réidentification

> **⚠️ OPÉRATION IRRÉVERSIBLE. Ne rien lancer sans mandat.** Publier = INSERT append-only :
> **aucun DELETE, aucun UPDATE, même en `service_role`** (garde `wsp_reject_mutation`). Une
> ligne insérée de travers **reste dans l'histoire pour toujours**. Toute la sûreté est en
> **amont** — les blocs RELECTURE avant chaque insertion, à vérifier valeur par valeur.
>
> **Canal** : Supabase SQL Editor. **Cible de ce plan : PRÉPRODUCTION (staging) d'abord.**
> Chaque bloc est lancé par l'humain ; la sortie est renvoyée avant le bloc suivant.
>
> **DDL non bloqué** : `CREATE TABLE`/`CREATE TRIGGER` sont du DDL — la garde
> (`before update or delete` / `before truncate`, DML) ne s'y applique pas. Les `INSERT`
> non plus. Aucun contournement nécessaire.
>
> **Design de référence** : `docs/web/WEB-003-LOT-B-succession-framework-wtr-conception.md`
> (v4, §2·bis). Prédicat `reidentified_as` (OCR-007 PRD-306). Granularité gravée : **3
> relations directes** (framework, version, skill) — **les niveaux n'en reçoivent aucune**.
>
> **Principe gravé conservé/renouvelé (§2·bis du dossier)** : le contenu normatif est
> **conservé** (copié de `wtf`), l'identité et les métadonnées de publication sont
> **renouvelées**. En particulier **`effective_date = 2026-07-13` est GRAVÉE** (conservée de
> l'origine) ; `published_at`/`recorded_at` sont renouvelées à `now()`. Revue des 7 lignes
> du bloc 3 : **conforme** au critère (aucune valeur mal classée).
>
> **Note de gouvernance (architecte) — 2 occurrences `1.0.0` hors périmètre.**
> `OCR-100:122` (`{"protocol":"wsp","version":"1.0.0"}`) et `OCR-110:140`
> (`protocol_version`) sont des **versions du PROTOCOLE WSP**, pas du Framework. L'architecte
> **refuse de déduire une règle par analogie** : **trois cycles de vie indépendants**
> — documentaire (OCR-005), Framework (0.1), protocole WSP. Ces deux lignes **restent
> intactes** jusqu'à une décision sur le **versionnement du WSP**, chantier distinct. Elles
> ne relèvent PAS de cette publication.

---

## Confirmation de conception — le chaînage transitif reste possible

Question : dans une chaîne `A → B → C`, `B` est **à la fois** `prior` (dans `B→C`) et
`canonical` (dans `A→B`). Les deux contraintes le permettent-elles ? **Oui.**

- `wsp_reid_one_successor  = unique (predicate, prior_type, prior_id)` — interdit **deux
  successeurs pour un même prédécesseur** (fork côté successeur). Dans la chaîne : `prior_id`
  vaut `A` (ligne A→B) puis `B` (ligne B→C) — **deux prédécesseurs distincts**, aucune
  violation.
- `wsp_reid_one_predecessor = unique (predicate, canonical_type, canonical_id)` — interdit
  **deux prédécesseurs pour un même successeur** (fork côté prédécesseur). Dans la chaîne :
  `canonical_id` vaut `B` (ligne A→B) puis `C` (ligne B→C) — **deux successeurs distincts**,
  aucune violation.

`B` apparaît **une seule fois comme `prior_id`** et **une seule fois comme `canonical_id`** :
chacune des deux contraintes (portant sur une colonne différente) est satisfaite. Les
contraintes **imposent la linéarité** (aucune fourche) tout en **autorisant le chaînage
transitif** — exactement le comportement gravé (chaîne reconstructible, §1 du dossier). Le
`check` anti-auto-boucle (`prior_id <> canonical_id`) ne gêne pas non plus : chaque maillon a
un `prior` et un `canonical` distincts. *(Seul un cycle `A→B→C→A` serait à empêcher — rôle du
trigger anti-cycle récursif, différé, hors de cette publication acyclique.)*

---

## Séquence PROD-REHEARSAL (staging)

Réversibilité : **aucune**. Les seules sauvegardes sont la photographie JSON (bloc 0) et le
principe append-only. Un INSERT erroné n'est **pas** rattrapable — on n'avance que si la
RELECTURE est exacte. ⚠️ La répétition **consomme** le staging : après le bloc 5, staging
porte `wtr` **définitivement** ; re-tester exigerait une restauration du staging à un
snapshot antérieur.

---

### PROD-REHEARSAL-0 — Sauvegarde + inspection d'état préalable

**0a — l'état doit refléter la prod (wtf publié, wtr absent, table de succession absente).**
```sql
select
  (select count(*) from public.wsp_frameworks where id = 'framework:wtf')                 as wtf_framework,
  (select count(*) from public.wsp_frameworks where id = 'framework:wtr')                 as wtr_framework,
  (select count(*) from public.wsp_skills     where id = 'wtf:212')                        as wtf_skill,
  (select count(*) from public.wsp_skills     where id = 'wtr:212')                        as wtr_skill,
  (select count(*) from public.wsp_skill_levels where skill_id = 'wtf:212')                as wtf_levels,
  (select count(*) from public.wsp_evidence_demonstrates_skill where skill_id = 'wtf:212') as evidence_wtf_212,
  to_regclass('public.wsp_reidentifications')                                              as reid_table;
```
- **Attendu** : `wtf_framework=1`, `wtr_framework=0`, `wtf_skill=1`, `wtr_skill=0`,
  `wtf_levels=4`, `evidence_wtf_212=79`, `reid_table=NULL`.
- **Écart → STOP** : si `wtr_framework>0` (staging a déjà `wtr` — seed édité ? non conforme
  à la prod) ; si `evidence_wtf_212 ≠ 79` (staging ≠ prod) ; si `reid_table` non NULL (table
  déjà présente). Ne pas continuer tant que staging ne reflète pas la prod.

**0b — photographie JSON des tables concernées (à sauvegarder HORS dépôt).**
```sql
select jsonb_build_object(
  'frameworks',                  (select jsonb_agg(to_jsonb(f)) from public.wsp_frameworks f),
  'framework_versions',          (select jsonb_agg(to_jsonb(v)) from public.wsp_framework_versions v),
  'skills',                      (select jsonb_agg(to_jsonb(s)) from public.wsp_skills s),
  'skill_levels',                (select jsonb_agg(to_jsonb(l)) from public.wsp_skill_levels l),
  'evidence_demonstrates_skill', (select jsonb_agg(to_jsonb(e)) from public.wsp_evidence_demonstrates_skill e)
) as backup;
```
- **Attendu** : un objet JSON non vide. **Copier la sortie dans un fichier hors dépôt**
  (comme STAGING-0), horodaté.
- **Écart → STOP** : sortie vide ou table manquante.

---

### PROD-REHEARSAL-0c — Vérification des valeurs copiées telles quelles (point architecte)

> `framework_version` est copié **sans transformation** (blocs 2/3). **Preuve schéma** :
> `wsp_skills.framework_version` référence `wsp_framework_versions(framework_id, version)`
> — donc la **version NUE `'0.1'`**, jamais l'id `framework:wtf@0.1` ; le seed confirme
> `'0.1'`. La copie est correcte (le rattachement à `wtr` vient du `framework_id` littéral).
> Ce bloc **le confirme en live** et **scanne toute colonne copiée** pour un `wtf` résiduel.

```sql
-- (a) framework_version EXACT (attendu '0.1', jamais 'framework:wtf@0.1')
select 'wsp_skills' as tbl, id, framework_version from public.wsp_skills where id = 'wtf:212'
union all
select 'wsp_skill_levels', id, framework_version from public.wsp_skill_levels where skill_id = 'wtf:212'
order by 1, 2;

-- (b) toute colonne COPIÉE telle quelle contenant 'wtf' — RÉSULTAT VIDE attendu
select * from (
  select 'wsp_frameworks.name'                as col, (name ilike '%wtf%')                   as has_wtf from public.wsp_frameworks where id = 'framework:wtf'
  union all select 'wsp_frameworks.description',      (coalesce(description,'') ilike '%wtf%')          from public.wsp_frameworks where id = 'framework:wtf'
  union all select 'wsp_frameworks.publisher',        (publisher ilike '%wtf%')                         from public.wsp_frameworks where id = 'framework:wtf'
  union all select 'wsp_frameworks.protocol_version', (protocol_version ilike '%wtf%')                  from public.wsp_frameworks where id = 'framework:wtf'
  union all select 'wsp_framework_versions.version',  (version ilike '%wtf%')                           from public.wsp_framework_versions where id = 'framework:wtf@0.1'
  union all select 'wsp_framework_versions.status',   (status ilike '%wtf%')                            from public.wsp_framework_versions where id = 'framework:wtf@0.1'
  union all select 'wsp_skills.framework_version',    (framework_version ilike '%wtf%')                 from public.wsp_skills where id = 'wtf:212'
  union all select 'wsp_skills.name',                 (coalesce(name,'') ilike '%wtf%')                 from public.wsp_skills where id = 'wtf:212'
  union all select 'wsp_skills.description',          (coalesce(description,'') ilike '%wtf%')          from public.wsp_skills where id = 'wtf:212'
  union all select 'wsp_skill_levels.framework_version', (framework_version ilike '%wtf%')              from public.wsp_skill_levels where skill_id = 'wtf:212'
  union all select 'wsp_skill_levels.slug',           (slug ilike '%wtf%')                              from public.wsp_skill_levels where skill_id = 'wtf:212'
  union all select 'wsp_skill_levels.label',          (label ilike '%wtf%')                             from public.wsp_skill_levels where skill_id = 'wtf:212'
  union all select 'wsp_skill_levels.criteria',       (coalesce(criteria,'') ilike '%wtf%')             from public.wsp_skill_levels where skill_id = 'wtf:212'
) t where has_wtf;
```
- **Attendu** : (a) `framework_version = '0.1'` pour la skill **et** les 4 niveaux (5 lignes) ;
  (b) **résultat VIDE** — aucune colonne copiée ne contient `wtf`.
- **Écart → STOP + corriger le plan** :
  - (a) si `framework_version = 'framework:wtf@0.1'` (ou tout suffixe `wtf`) → ajouter
    `replace(framework_version,'wtf','wtr')` aux blocs 2 et 3 ;
  - (b) toute ligne renvoyée = une colonne copiée incorpore `wtf` → la transformer aussi.
  - **Ne rien insérer tant qu'un écart subsiste.**
- *(Colonnes non textuelles — `rank`, `observation_min/max`, `effective_date`, `recorded_at`
  — exclues du scan : elles ne peuvent pas contenir `wtf`. Colonnes transformées — `id`,
  `skill_id`, `code` — hors scan, déjà en `wtr`.)*

---

### PROD-REHEARSAL-1 — Création de la table + contraintes + trigger d'immuabilité (DDL)

```sql
create table if not exists public.wsp_reidentifications (
  id             text        primary key,
  predicate      text        not null default 'reidentified_as'
                             check (predicate = 'reidentified_as'),
  prior_type     text        not null
                             check (prior_type     in ('framework','framework_version','skill','skill_level')),
  prior_id       text        not null,
  canonical_type text        not null
                             check (canonical_type in ('framework','framework_version','skill','skill_level')),
  canonical_id   text        not null,
  recorded_at    timestamptz not null default now(),
  effective_at   date,
  constraint wsp_reid_no_self        check (prior_id <> canonical_id or prior_type <> canonical_type),
  constraint wsp_reid_one_successor  unique (predicate, prior_type, prior_id),
  constraint wsp_reid_one_predecessor unique (predicate, canonical_type, canonical_id)
);

comment on table public.wsp_reidentifications is
  'Réidentification canonique append-only (predicat reidentified_as, OCR-007 PRD-306). Relie deux identifiants d''une meme definition logique. prior = identifiant anterieur, canonical = identifiant courant. Statut jamais stocke : derive de l''existence d''une ligne.';

-- Immuabilité structurelle : réutilise la garde existante wsp_reject_mutation().
drop trigger if exists wsp_reidentifications_no_mutation on public.wsp_reidentifications;
create trigger wsp_reidentifications_no_mutation
  before update or delete on public.wsp_reidentifications
  for each row execute function public.wsp_reject_mutation();

drop trigger if exists wsp_reidentifications_no_truncate on public.wsp_reidentifications;
create trigger wsp_reidentifications_no_truncate
  before truncate on public.wsp_reidentifications
  for each statement execute function public.wsp_reject_mutation();

-- RLS : savoir public en lecture, aucune écriture client (chemin d'écriture = migration).
alter table public.wsp_reidentifications enable row level security;
drop policy if exists "wsp_reidentifications_read_all" on public.wsp_reidentifications;
create policy "wsp_reidentifications_read_all"
  on public.wsp_reidentifications for select to anon, authenticated using (true);
revoke insert, update, delete on public.wsp_reidentifications from anon, authenticated;
grant select on public.wsp_reidentifications to anon, authenticated;
```
- **Attendu** : table créée, 2 triggers, RLS activée, **0 ligne**.
- **Écart → STOP** : toute erreur DDL. Ne pas passer aux INSERT.
- **Note (à trancher par l'architecte)** : le **trigger anti-cycle récursif** (dossier §1,
  n-cycle) n'est **pas** inclus ici — inutile pour cette publication **acyclique** (3
  relations toutes `wtf → wtr`). Les contraintes `check`+`unique` empêchent auto-boucle,
  fourche et successeur dupliqué. ⚠️ Un **2-cycle** (`wtr → wtf` inséré plus tard) resterait
  possible : le trigger anti-cycle **doit être ajouté avant tout chaînage/insertion inverse
  futur**. Hors périmètre de cette première publication.

---

### PROD-REHEARSAL-2 — RELECTURE de la publication `wtr` (AVANT insertion)

> Affiche exactement les 7 lignes qui seront insérées, **dérivées de `wtf`** (donc
> définition garantie identique, seuls id/slug/code changent). Vérification valeur par
> valeur.

```sql
-- Framework (1)
select 'framework:wtr' as id, 'world-trader' as slug, name, description, publisher, protocol_version
from public.wsp_frameworks where id = 'framework:wtf';

-- Version (1)
select 'framework:wtr@0.1' as id, 'framework:wtr' as framework_id, version, status, effective_date
from public.wsp_framework_versions where id = 'framework:wtf@0.1';

-- Skill (1)
select replace(id,'wtf','wtr') as id, 'framework:wtr' as framework_id, framework_version,
       replace(code,'WTF','WTR') as code, name, description
from public.wsp_skills where id = 'wtf:212';

-- Niveaux (4)
select replace(id,'wtf','wtr') as id, replace(skill_id,'wtf','wtr') as skill_id, framework_version,
       slug, label, rank, criteria, observation_min, observation_max
from public.wsp_skill_levels where skill_id = 'wtf:212' order by rank;
```
- **Attendu** : `framework:wtr` / slug `world-trader` / name **World Trader Framework** ;
  `framework:wtr@0.1` / version **0.1** / status **published** ; `wtr:212` / code **WTR-212**
  / name **Intention vs Engagement** ; 4 niveaux `wtr:212#aware/applied/proficient/mastery`,
  rangs **1→4**, bandes d'observation **2-2 / 3-3 / 4-4 / 5-5**, mêmes `criteria` que `wtf`.
- **Écart → STOP** : toute valeur inattendue (nom, description, bande, rang). Ne pas insérer.

---

### PROD-REHEARSAL-3 — INSERT de la publication `wtr` (7 lignes)

> Ordre imposé par les FK : framework → version → skill → niveaux.

```sql
insert into public.wsp_frameworks (id, slug, name, description, publisher, protocol_version)
select 'framework:wtr', 'world-trader', name, description, publisher, protocol_version
from public.wsp_frameworks where id = 'framework:wtf';

insert into public.wsp_framework_versions (id, framework_id, version, status, effective_date)
select 'framework:wtr@0.1', 'framework:wtr', version, status, effective_date
from public.wsp_framework_versions where id = 'framework:wtf@0.1';

insert into public.wsp_skills (id, framework_id, framework_version, code, name, description)
select replace(id,'wtf','wtr'), 'framework:wtr', framework_version, replace(code,'WTF','WTR'), name, description
from public.wsp_skills where id = 'wtf:212';

insert into public.wsp_skill_levels
  (id, skill_id, framework_version, slug, label, rank, criteria, observation_min, observation_max)
select replace(id,'wtf','wtr'), replace(skill_id,'wtf','wtr'), framework_version,
       slug, label, rank, criteria, observation_min, observation_max
from public.wsp_skill_levels where skill_id = 'wtf:212';
```
- **Attendu** : `INSERT 0 1` · `INSERT 0 1` · `INSERT 0 1` · `INSERT 0 4` (7 lignes).
- **Écart → STOP** : violation d'unicité ou de FK (⇒ `wtr` existe déjà partiellement, ou
  état divergent). Rien à annuler — append-only ; investiguer avant tout autre bloc.

---

### PROD-REHEARSAL-4 — RELECTURE des 3 relations `reidentified_as` (AVANT insertion, DIRECTION)

> ⚠️ **Relecture de direction obligatoire.** `prior_id` = identifiant **ANTÉRIEUR** (`wtf`),
> `canonical_id` = identifiant **COURANT** (`wtr`). **Inverser serait irréversible.**
> **Aucune relation de niveau** (règle gravée : uniquement framework, version, skill).

```sql
select * from (values
  ('reid:framework:wtf',     'reidentified_as', 'framework',         'framework:wtf',     'framework',         'framework:wtr'),
  ('reid:framework:wtf@0.1', 'reidentified_as', 'framework_version', 'framework:wtf@0.1', 'framework_version', 'framework:wtr@0.1'),
  ('reid:wtf:212',           'reidentified_as', 'skill',             'wtf:212',           'skill',             'wtr:212')
) as t(id, predicate, prior_type, prior_id, canonical_type, canonical_id);
```
- **Attendu** : 3 lignes ; **chaque `prior_id` commence par `…wtf…`**, **chaque `canonical_id`
  par `…wtr…`** ; 0 relation de niveau (`#aware/#applied/…` absents).
- **Écart → STOP** : si un `prior_id` contient `wtr` ou un `canonical_id` contient `wtf`
  → **direction inversée**, ne pas insérer. Si une ligne de niveau apparaît → retirer.

---

### PROD-REHEARSAL-5 — INSERT des 3 relations

```sql
insert into public.wsp_reidentifications (id, predicate, prior_type, prior_id, canonical_type, canonical_id)
values
  ('reid:framework:wtf',     'reidentified_as', 'framework',         'framework:wtf',     'framework',         'framework:wtr'),
  ('reid:framework:wtf@0.1', 'reidentified_as', 'framework_version', 'framework:wtf@0.1', 'framework_version', 'framework:wtr@0.1'),
  ('reid:wtf:212',           'reidentified_as', 'skill',             'wtf:212',           'skill',             'wtr:212');
```
- **Attendu** : `INSERT 0 3`.
- **Écart → STOP** : violation `wsp_reid_one_successor` / `wsp_reid_one_predecessor` / `check`
  ⇒ direction ou doublon ; investiguer (rien à annuler).

---

### PROD-REHEARSAL-6 — Contrôles post-publication

```sql
-- 1) les 2 représentations coexistent
select id, slug from public.wsp_frameworks where id in ('framework:wtf','framework:wtr') order by id;

-- 2) les 3 relations, bonne direction
select prior_type, prior_id, canonical_id from public.wsp_reidentifications order by prior_id;

-- 3) le statut dérivé se calcule (jamais stocké)
select f.id,
  case
    when exists (select 1 from public.wsp_reidentifications r
                 where r.prior_type='framework' and r.prior_id=f.id)         then 'reidentified'
    when exists (select 1 from public.wsp_reidentifications r
                 where r.canonical_type='framework' and r.canonical_id=f.id) then 'canonical'
    else 'published'
  end as identity_status,
  (select r.canonical_id from public.wsp_reidentifications r
     where r.prior_type='framework' and r.prior_id=f.id)         as canonical_identifier,
  (select r.prior_id from public.wsp_reidentifications r
     where r.canonical_type='framework' and r.canonical_id=f.id) as previous_identifier
from public.wsp_frameworks f
where f.id in ('framework:wtf','framework:wtr') order by f.id;

-- 4) les 79 Evidence intactes, toujours wtf:212 (aucun fait n'a bougé)
select
  (select count(*) from public.wsp_evidence_demonstrates_skill where skill_id = 'wtf:212') as evidence_wtf_212,
  (select count(*) from public.wsp_evidence_demonstrates_skill where skill_id = 'wtr:212') as evidence_wtr_212;
```
- **Attendu** :
  1. **2 lignes** : `framework:wtf`/`wtf` et `framework:wtr`/`world-trader`.
  2. **3 lignes**, toutes `prior_id` en `wtf…` → `canonical_id` en `wtr…`.
  3. `framework:wtf` → `identity_status = reidentified`, `canonical_identifier = framework:wtr` ;
     `framework:wtr` → `identity_status = canonical`, `previous_identifier = framework:wtf`.
  4. `evidence_wtf_212 = 79`, `evidence_wtr_212 = 0`.
- **Écart → STOP** : toute déviation. Rappel : **aucun rollback** — un écart signifie qu'une
  ligne définitive est fausse ; la parade est la RELECTURE en amont, pas une correction aval.

---

## Après une répétition staging réussie

- Les **mêmes blocs** s'appliquent à la **production**, précédés d'un **nouveau bloc 0**
  (backup + inspection prod) et d'une **relecture valeur par valeur** indépendante.
- La production est **définitive dès le bloc 5**. Ne l'exécuter que sur **mandat dédié**,
  après validation explicite de la sortie de chaque bloc staging.
- Le staging, lui, porte désormais `wtr` en permanence : pour re-répéter, restaurer un
  snapshot antérieur au bloc 3.

---

## Séquence PRODUCTION (PROD-0 à PROD-6)

Structurellement **identique** à PROD-REHEARSAL, sur la base **production**, mêmes relectures
avant chaque insertion. À exécuter **uniquement sur mandat dédié**, après la répétition
staging validée (2026-07-20). **Rehearsal staging : OK** (7 lignes + 3 relations, garde
prouvée par `recorded_at` figé au `2026-07-13T15:00:56.264…`).

**Divergences staging ↔ prod — à vérifier au bloc PROD-0, ne rien supposer :**
1. **Valeurs des 7 lignes de départ** : elles existent sur prod, mais leurs valeurs
   (`name`/`description`/`criteria`/`effective_date`) viennent de la **prod** — la publication
   les copie (`insert … select … from wtf`). ⇒ **re-relire PROD-2 à neuf**, ne pas se fier aux
   valeurs staging.
2. **Compte d'Evidence** : **peut NE PAS être 79.** Prod est le système vivant — d'autres faits
   ont pu être journalisés depuis le snapshot staging. ⇒ PROD-0 **capture** le compte prod `N` ;
   **PROD-6 vérifie qu'il est INCHANGÉ** (toujours `N`, et `wtr:212 = 0`). **Ne jamais hardcoder
   79 en prod.**
3. **`framework:wtr` absent** : si présent → publication déjà faite / seed frais appliqué → STOP.
4. **Fonction garde `wsp_reject_mutation` présente** (PROD-1 en dépend) ; **table
   `wsp_reidentifications` absente** (PROD-1 la crée).
5. **`framework_version = '0.1'` nue** : re-vérifier via PROD-0c (scan `wtf`).
6. **`effective_date` de prod's wtf = 2026-07-13** (gravé §2·bis) : le confirmer à PROD-2 ; si
   prod diffère → STOP + arbitrage.
7. **`recorded_at` de wtf** aura une valeur **différente** de staging (prod seedé à un autre
   instant) : la preuve d'intactness PROD-6 utilise la valeur **capturée à PROD-0**.

**Correspondance des blocs** : **PROD-0b/0c, PROD-1, PROD-2 (2a–2d), PROD-3, PROD-4, PROD-5**
sont **mot pour mot** les blocs PROD-REHEARSAL correspondants. **PROD-0a** est étendu (compte
version + `wtr` skill + `evidence_wtr` + présence de la fonction garde ; capture `N`). **PROD-6**
est identique **sauf** le contrôle Evidence : attendu `evidence_wtf = N` (capturé au PROD-0, pas
79) et `evidence_wtr = 0`.

**Deux chantiers de CODE en attente APRÈS publication (dossier §3 et §4, non oubliés) :**
la **découverte canonique** doit exposer le statut dérivé (§3) ; la **redirection transitoire**
`/frameworks/wtf/skills → 301` doit être retirée pour que `/frameworks/wtf` redevienne
consultable avec son statut `reidentified` (§4). Sur mandat dédié.
