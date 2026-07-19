# PLAN — Application de la migration forward `wtf → wtr`

**Migration** : `supabase/migrations/20260718000001_wtf_to_wtr.sql` (forward)
**Rollback** : `supabase/migrations/20260718000002_wtr_to_wtf_rollback.sql` (inverse — annexe)
**Canal gravé** : **SQL Editor du dashboard Supabase** (chemin manuel éprouvé le 2026-07-17 ;
pas de CLI, pas de `supabase db push` — la prod n'a pas de `schema_migrations`).
**Statut** : PRÉPARATION. Rien n'est appliqué. Backup + application = mandat distinct.

---

## État vérifié (2026-07-19, lecture seule, staging `bnzahwzuwoxjrxpqsjhp`)

- Staging **non divergé** = même état que prod : `framework:wtf` / slug `wtf` / `wtf:212` /
  code `WTF-212` / 4 niveaux `wtf:212#…`. Le test de rollback y sera **représentatif**.
- `wsp_evidence_demonstrates_skill` staging = **79 lignes**, toutes `skill_id like 'wtf:%'`.
- Volume total migré (staging) : **1 framework + 1 version + 1 skill + 4 niveaux + 79
  evidence = 86 lignes**. **⚠️ Le compte prod est inconnu** (aucun accès) — à relever au
  moment venu (probablement plus petit : ~2 passports).

---

## Credentials — qui fait quoi

| Action | Canal / accès requis | Qui |
|---|---|---|
| **Contrôles read-only** (SELECT) staging | API REST + `SUPABASE_SERVICE_ROLE_KEY` de `.env.test.local` | **Claude** peut |
| **Backup** staging (`pg_dump`) | mot de passe DB (Dashboard → Settings → Database) | vous, ou vous me fournissez la chaîne |
| **Migration DDL** staging (drop/recreate FK) | **SQL Editor** dashboard, ou `psql` + chaîne DB | vous (dashboard), ou moi si vous fournissez la chaîne |
| **Tout sur PRODUCTION** (backup, DDL, checks) | credentials prod — **Claude n'y a AUCUN accès** | **vous seul** |

> La migration est du **DDL** (`alter table … drop/add constraint`) : l'API REST (PostgREST)
> ne l'exécute pas. Elle passe **obligatoirement** par le SQL Editor (dashboard) ou `psql`.
> L'API REST (accès Claude via `.env.test.local`) ne sert qu'aux **contrôles SELECT**.

---

## 1 · Sauvegarde préalable (par base, AVANT toute application)

```bash
# Chaîne : Dashboard → Settings → Database → Connection string (URI, connexion directe 5432)
pg_dump "postgresql://postgres:[PWD]@db.[REF].supabase.co:5432/postgres" \
  -Fc \
  -t public.wsp_frameworks -t public.wsp_framework_versions \
  -t public.wsp_skills -t public.wsp_skill_levels \
  -t public.wsp_evidence_demonstrates_skill \
  -f wtf-backup-[staging|prod]-$(date +%Y%m%d-%H%M).dump
```
- **Où** : fichier local `.dump` (format custom), rangé hors dépôt.
- **Vérifier exploitable** (sans restaurer) : `pg_restore --list wtf-backup-….dump`
  → doit lister les 5 tables + données. (Fort : restaurer dans une base scratch, `count(*)`.)
- **Filet** : snapshot Supabase (Dashboard → Database → Backups). Noter l'horodatage.

---

## 2 · Application — STAGING puis PRODUCTION

**Ordre absolu : staging validé de bout en bout AVANT de toucher la prod.**

### 2.A — STAGING (mandat distinct)
1. Backup staging (§1).
2. Dashboard **staging** → SQL Editor → coller **tout** `20260718000001_wtf_to_wtr.sql` → **Run** (`begin…commit`, atomique).
3. Contrôles §3 sur staging.
4. **Test du rollback sur staging (§6) — obligatoire avant prod.**

### 2.B — PRODUCTION (vous seul, après staging vert)
Voir les **blocs prod copier-coller** (§7).

---

## 3 · Contrôles post-migration (PREUVE du succès)

SQL Editor de la base migrée :

```sql
-- a) id + slug
select id, slug from public.wsp_frameworks;
--     attendu : framework:wtr | world-trader

-- b) version / skill / niveaux
select id, framework_id from public.wsp_framework_versions;   -- framework:wtr@0.1 | framework:wtr
select id, framework_id, code from public.wsp_skills;         -- wtr:212 | framework:wtr | WTR-212
select id, skill_id from public.wsp_skill_levels order by id; -- wtr:212#… (4) | skill_id wtr:212

-- c) 0 résidu wtf
select
  (select count(*) from public.wsp_frameworks where id like '%wtf%' or slug='wtf')
+ (select count(*) from public.wsp_framework_versions where framework_id like '%wtf%')
+ (select count(*) from public.wsp_skills where framework_id like '%wtf%' or id like 'wtf:%' or code like 'WTF-%')
+ (select count(*) from public.wsp_skill_levels where skill_id like 'wtf:%')
+ (select count(*) from public.wsp_evidence_demonstrates_skill where skill_id like 'wtf:%')
  as residus_wtf;                                             -- attendu : 0

-- d) 6 FK recréées ET validées
select conrelid::regclass as tbl, conname, convalidated
from pg_constraint where contype='f'
  and conrelid::regclass::text in ('public.wsp_framework_versions','public.wsp_skills',
      'public.wsp_skill_levels','public.wsp_evidence_demonstrates_skill');
--     attendu : 6 lignes, convalidated=true partout

-- e) résolution route (ce que /frameworks/world-trader/skills interroge)
select id, slug, name from public.wsp_frameworks where id='world-trader' or slug='world-trader';
--     attendu : 1 ligne
```
**Check HTTP (prod uniquement, après migration prod)** :
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://opusx.world/frameworks/world-trader/skills
#     attendu : 200   (aujourd'hui : 404)
```
*(Staging : pas d'app publique pointée sur la base staging → la preuve est le contrôle (e).)*

---

## 4 · Rollback

- **Pendant la transaction** : toute erreur → `rollback` **automatique**. Aucun état partiel.
- **Après COMMIT, si un contrôle échoue** :
  1. **Migration inverse** (préférée) — coller `20260718000002_wtr_to_wtf_rollback.sql` dans
     le SQL Editor → Run. Puis contrôles de retour (§6, étape « après rollback »).
  2. **Restauration backup** (filet ultime) :
     ```bash
     pg_restore --clean --if-exists --no-owner -d "postgresql://…[base]…" wtf-backup-….dump
     ```

---

## 5 · Indisponibilité pendant l'exécution

- `drop`/`recreate` FK → **ACCESS EXCLUSIVE** sur les 5 tables ; `UPDATE` → row locks.
  Lectures/écritures sur `wsp_frameworks/versions/skills/skill_levels/evidence_demonstrates_skill`
  **bloquées** le temps de la transaction.
- **Durée** : 86 lignes (staging) → **< 1 s**. Prod probablement moins. **Pas de downtime perceptible.**
- **Périmètre** : seulement la découverte de Framework (`/frameworks/[id]/skills`) et une
  éventuelle ingestion patientent < 1 s. **GEO, Homepage, API canonique (statiques) : intacts.**

---

## 6 · Séquence de test du rollback sur STAGING (obligatoire avant prod)

*« Un rollback jamais exécuté n'est pas un rollback. »* À exécuter d'un bloc sur staging :

1. **Backup** staging (§1).
2. **Forward** : `20260718000001_wtf_to_wtr.sql` → Run.
3. **Contrôles** §3 → attendu : wtr/world-trader partout, 6 FK convalidated, résidus_wtf=0.
4. **Rollback** : `20260718000002_wtr_to_wtf_rollback.sql` → Run.
5. **Contrôles de retour à l'état initial** :
   ```sql
   select id, slug from public.wsp_frameworks;                 -- framework:wtf | wtf
   select id, framework_id, code from public.wsp_skills;       -- wtf:212 | framework:wtf | WTF-212
   select count(*) from public.wsp_frameworks where id like '%wtr%' or slug='world-trader';  -- 0
   select count(*) from pg_constraint where contype='f' and convalidated
     and conrelid::regclass::text in ('public.wsp_framework_versions','public.wsp_skills',
         'public.wsp_skill_levels','public.wsp_evidence_demonstrates_skill');                -- 6
   ```
   → **retour exact à wtf/wtf, 6 FK convalidated, 0 résidu wtr**.
6. **Forward à nouveau** : `20260718000001` → Run.
7. **Contrôles** §3 → re-attendu : wtr/world-trader, 6 FK, 0 résidu wtf.

Si l'une des étapes 3/5/7 dévie → **STOP**, ne pas toucher la prod, rapporter l'écart.

---

## 7 · Blocs PRODUCTION — copier-coller dans l'ordre (vous seul)

> À n'exécuter qu'**après** la validation complète de la séquence staging (§6).
> Chaque bloc : action → résultat attendu. En cas d'écart → STOP.

**PROD-0 — Backup** (terminal, chaîne prod depuis le dashboard prod) :
```bash
pg_dump "postgresql://postgres:[PWD_PROD]@db.[REF_PROD].supabase.co:5432/postgres" -Fc \
  -t public.wsp_frameworks -t public.wsp_framework_versions -t public.wsp_skills \
  -t public.wsp_skill_levels -t public.wsp_evidence_demonstrates_skill \
  -f wtf-backup-prod-$(date +%Y%m%d-%H%M).dump
pg_restore --list wtf-backup-prod-*.dump | head
```
→ *attendu* : le dump liste les 5 tables. **Compter les lignes evidence prod** :
```sql
select count(*) from public.wsp_evidence_demonstrates_skill where skill_id like 'wtf:%';
```
→ *attendu* : un petit entier (note-le ; conditionne le verrou).

**PROD-1 — Migration forward** (SQL Editor prod) : coller **tout** `20260718000001_wtf_to_wtr.sql` → Run.
→ *attendu* : « Success. No rows returned » (transaction commitée, pas d'erreur).

**PROD-2 — Contrôles** (SQL Editor prod) : coller le bloc §3 (a→e).
→ *attendu* : framework:wtr / world-trader / wtr:212 / WTR-212 · résidus_wtf = **0** · **6 FK convalidated** · résolution route = 1 ligne.

**PROD-3 — Check HTTP live** (terminal) :
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://opusx.world/frameworks/world-trader/skills   # 200
curl -sI https://opusx.world/frameworks/wtf/skills | grep -i '^location'                       # -> /frameworks/world-trader/skills (301)
```
→ *attendu* : **200** sur world-trader ; l'ancien slug redirige toujours (301) et aboutit désormais sur une ressource servie.

**En cas d'échec d'un contrôle** : §4 — coller `20260718000002_wtr_to_wtf_rollback.sql` (retour immédiat), ou restaurer `wtf-backup-prod-*.dump`.

---

## Annexe — migration inverse

Voir `supabase/migrations/20260718000002_wtr_to_wtf_rollback.sql` (symétrique au forward :
drop FK dynamique → UPDATE `wtr→wtf` → recreate 6 FK, transactionnel). Committée, **non appliquée**.
