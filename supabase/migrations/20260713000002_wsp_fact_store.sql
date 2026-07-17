-- =====================================================================
-- Opus X — Sprint 2 — LOT O1 : LE FACT STORE D'EVIDENCE
-- Append-only PAR CONSTRUCTION.
-- Autorités : SPRINT-002 v1.2 §7 (Lot O1), W2/W3/W4/W5/W7 ·
--             ENG-001 §5, §10 · ENG-002 §3, §4, §6.1, §6.2, §7, §10, §11.
--
-- « Le Registre enregistre ; il ne calcule jamais » (WSP-001 §13.3).
-- Une correction est un NOUVEAU fait. Une révocation est un NOUVEAU fait.
-- Jamais une mutation, jamais un DELETE (W2).
--
-- ZONE FAITS (ENG-001 §3 · ENG-002 §3.1) — préfixe `wsp_` :
--   wsp_issuers · wsp_evidence · wsp_evidence_demonstrates_skill ·
--   wsp_fact_revocations.
--
-- La garde d'immuabilité `public.wsp_reject_mutation()` est définie au Lot O0
-- (migration 20260713000001) et RÉUTILISÉE ici sur les quatre tables :
-- UPDATE/DELETE échouent au niveau SGBD, service_role INCLUS.
-- =====================================================================

-- ---------------------------------------------------------------------
-- current_opus_id() — l'ancre sujet du lecteur (ENG-002 §4).
-- security definer : lit profiles par auth.uid() en contournant la RLS, et ne
-- renvoie QUE l'opus_id de l'appelant. Base des policies « le sujet lit ses
-- propres faits » sans récursion de RLS.
-- ---------------------------------------------------------------------
create or replace function public.current_opus_id()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select opus_id from public.profiles where id = (select auth.uid())
$$;

comment on function public.current_opus_id() is
  'Ancre sujet (ENG-002 §4) : renvoie l''opus_id de l''appelant (auth.uid()). Base RLS « le sujet lit ses propres faits ».';

revoke all on function public.current_opus_id() from public, anon;
grant execute on function public.current_opus_id() to authenticated;

-- =====================================================================
-- wsp_issuers — l'entité REDEVABLE qui produit des preuves (ARCH-001 §4).
--   TABLE NEUVE — jamais un renommage de `partners` (notion Sprint 1).
--   Un Issuer ne calcule jamais la confiance, ne l'auto-attribue jamais (D1).
--   Multi-Issuer PAR CONCEPTION (D9) : aucun nom d'Issuer ici (W7).
-- =====================================================================
create table if not exists public.wsp_issuers (
  id                  text        primary key,          -- identifiant protocole : 'issuer:<slug>'
  display_name        text        not null,
  status              text        not null default 'active'
                      check (status in ('active', 'suspended')),
  hmac_key_ref        text,                             -- RÉFÉRENCE de la clé HMAC (jamais le secret en clair)
  accountable_contact text,                             -- contact redevable (ARCH-001 §4)
  recorded_at         timestamptz not null default now()
);

comment on table public.wsp_issuers is
  'Zone FAITS : un Issuer, entité redevable qui produit des preuves (ARCH-001 §4). Ne calcule ni n''auto-attribue jamais la confiance (D1). Table neuve, jamais partners.';
comment on column public.wsp_issuers.hmac_key_ref is
  'RÉFÉRENCE vers le secret HMAC (nom de secret / clé), jamais le secret lui-même. Résolu côté serveur à l''ingestion (Lot O2).';

-- =====================================================================
-- wsp_evidence — un fait daté, attribuable, vérifiable (ENG-002 §6.1).
--   Porte l'objet haché (vérifiabilité perpétuelle §11). AUCUNE colonne
--   calculée, AUCUN score, AUCUN indice (W3). L'identité d'émission
--   (issuer_id, issuer_evidence_id) est DISTINCTE de l'intégrité (hash) (§7).
-- =====================================================================
create table if not exists public.wsp_evidence (
  -- Identifiant protocole du fait, assigné par Opus X à l'ingestion
  -- (ajouté par Opus X → EXCLU du hash, ENG-002 §6.2).
  id                         text        primary key
                             default ('ev_' || public.generate_ulid()),

  -- Identité d'émission (ENG-002 §7) — l'Issuer et SON identifiant du fait.
  issuer_id                  text        not null references public.wsp_issuers(id),
  issuer_evidence_id         text        not null,

  -- Ancre sujet (ENG-002 §4) : l'identité protocolaire du professionnel.
  subject_id                 text        not null references public.profiles(opus_id),

  -- Sémantique épinglée (ENG-002 §6.1, §11) : (framework, version) exacte.
  framework_id               text        not null,
  framework_version          text        not null,

  -- L'attestateur redevable (ENG-002 §6.1).
  attested_by_actor_id       text        not null,
  attested_by_role           text        not null,

  -- Déclaration vs attestation tierce (ENG-002 §10) — NOT NULL, explicite.
  -- Toujours false au Sprint 2 ; la colonne existe car l'ajouter demain à une
  -- table append-only serait impossible proprement.
  is_declaration             boolean     not null,

  -- Provenance (W4 STRUCTUREL) : lien dur vers la preuve fondatrice. NOT NULL.
  provenance_kind            text        not null,
  provenance_id              text        not null,

  -- L'observation, dans le vocabulaire de l'Issuer (jamais un niveau WSP, D6).
  observation                jsonb       not null,

  -- Enveloppe de vérifiabilité (ENG-002 §5.1, §11) — retenue à perpétuité.
  schema_version             text        not null,
  canonicalization_algorithm text        not null,
  hash_algorithm             text        not null,
  canonical_hash             text        not null,

  -- Temporel (ENG-002 §6.1).
  occurred_at                timestamptz not null,
  attested_at                timestamptz not null,

  -- Ajouté par Opus X à l'ingestion (§6.2) — immuable, posé à l'insert.
  recorded_at                timestamptz not null default now(),

  -- IDENTITÉ D'ÉMISSION (ENG-002 §7) — clé d'idempotence. Distincte du hash :
  -- deux attestations distinctes peuvent légitimement partager le même contenu.
  unique (issuer_id, issuer_evidence_id),

  -- La (framework, version) doit exister ET être épinglée (semantics zone).
  foreign key (framework_id, framework_version)
    references public.wsp_framework_versions(framework_id, version),

  -- Garde de forme minimale de l'observation (la cohérence fine est en O2, §9).
  constraint wsp_evidence_observation_shape check (
    jsonb_typeof(observation -> 'criteria') = 'array'
    and jsonb_typeof(observation -> 'criterion_levels') = 'object'
  )
);

comment on table public.wsp_evidence is
  'Zone FAITS : une Evidence — fait daté, attribuable, vérifiable (ENG-002 §6.1). Append-only. Aucune colonne calculée (W3). Identité d''émission ≠ intégrité de contenu (§7).';
comment on column public.wsp_evidence.canonical_hash is
  'Intégrité de CONTENU (SHA-256 hex minuscule de JCS(objet haché), ENG-002 §5.1). Distinct de l''identité d''émission (issuer_id, issuer_evidence_id). Recalculé et vérifié par Opus X à l''ingestion (§8.1), jamais fait confiance tel quel.';
comment on column public.wsp_evidence.is_declaration is
  'Déclaration (true) vs attestation tierce (false). NOT NULL (ENG-002 §10). Toujours false au Sprint 2.';

create index if not exists wsp_evidence_subject_idx on public.wsp_evidence(subject_id);
create index if not exists wsp_evidence_issuer_idx  on public.wsp_evidence(issuer_id);

-- =====================================================================
-- wsp_evidence_demonstrates_skill — la relation « démontre » (ENG-001 §5).
--   Table séparée : une Evidence peut démontrer PLUSIEURS Skills.
--   claimed_level = le niveau REVENDIQUÉ par l'Issuer (un CLAIM, un fait —
--   jamais le niveau du Passport, qui est une interprétation d'Opus X, D6).
--
--   INTÉGRITÉ PAR CONSTRUCTION (W2) : le niveau revendiqué DOIT être un niveau
--   PUBLIÉ de cette Skill À CETTE version du Framework — FK composite vers
--   wsp_skill_levels. Un claimed_level inexistant (« grandmaster »), ou d'une
--   autre version, est rejeté par la BASE (service_role inclus) — jamais une
--   garde applicative. framework_version doit égaler celle de l'Evidence
--   parente (trigger de cohérence ci-dessous) : une démonstration cite
--   toujours la version du fait qui la porte.
-- =====================================================================
create table if not exists public.wsp_evidence_demonstrates_skill (
  evidence_id       text        not null references public.wsp_evidence(id),
  skill_id          text        not null references public.wsp_skills(id),
  framework_version text        not null,                -- = celle de l'Evidence parente (trigger)
  claimed_level     text        not null,                -- slug du niveau revendiqué ('applied')
  recorded_at       timestamptz not null default now(),
  primary key (evidence_id, skill_id),
  -- Le niveau revendiqué existe, PAR CONSTRUCTION, à cette version du Framework.
  foreign key (skill_id, framework_version, claimed_level)
    references public.wsp_skill_levels(skill_id, framework_version, slug)
);

comment on table public.wsp_evidence_demonstrates_skill is
  'Relation « démontre » (ENG-001 §5) : une Evidence → une ou plusieurs Skills, à un niveau REVENDIQUÉ et PUBLIÉ (FK vers wsp_skill_levels). Le claimed_level est un fait (le claim de l''Issuer), jamais le niveau interprété du Passport (D6). framework_version = celle du fait parent.';

create index if not exists wsp_evidence_demonstrates_skill_skill_idx
  on public.wsp_evidence_demonstrates_skill(skill_id);

-- Cohérence de version : la ligne « démontre » cite exactement la version du
-- Framework portée par l'Evidence parente. Une divergence serait immuable.
create or replace function public.wsp_eds_check_version()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_parent_version text;
begin
  select framework_version into v_parent_version
  from public.wsp_evidence
  where id = new.evidence_id;

  if v_parent_version is null then
    raise exception 'WSP_EDS: Evidence % introuvable pour la démonstration.', new.evidence_id
      using errcode = 'foreign_key_violation';
  end if;

  if new.framework_version is distinct from v_parent_version then
    raise exception
      'WSP_EDS: framework_version (%) incohérente avec l''Evidence parente (%). Une démonstration cite la version du fait qui la porte.',
      new.framework_version, v_parent_version
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

comment on function public.wsp_eds_check_version() is
  'Cohérence de version (Lot O1) : la ligne démontre cite exactement la version du Framework de l''Evidence parente. Rejet base sinon.';

drop trigger if exists wsp_eds_version_coherence on public.wsp_evidence_demonstrates_skill;
create trigger wsp_eds_version_coherence
  before insert on public.wsp_evidence_demonstrates_skill
  for each row execute function public.wsp_eds_check_version();

-- =====================================================================
-- wsp_fact_revocations — une révocation est un FAIT NOUVEAU (W2).
--   Jamais une mutation, jamais un DELETE de l'Evidence révoquée.
--   Le fait révoqué demeure ; son statut « révoqué » se LIT via l'existence
--   d'une révocation qui le référence (ENG-001 §5, fact_revocations).
--
--   IDENTITÉ D'ÉMISSION (ENG-002 §7) — une révocation EST un fait, donc elle
--   porte SA propre identité d'émission : (issuer_id, issuer_revocation_id)
--   UNIQUE. Une révocation relivrée par l'outbox (retry réseau, chaîne #7)
--   est ainsi idempotente — jamais deux faits de révocation permanents.
--   issuer_id la rattache à un Issuer enregistré ; revoked_by reste l'acteur
--   HUMAIN redevable (les deux ne se recouvrent pas).
--
--   VOIE 1 (recréation) — RETIRÉE le 2026-07-17 (R4, palier 0 du déploiement
--   prod). Ce fichier portait `drop table if exists ... cascade` avant le
--   create, pour être rejouable pendant la correction d'O1. Le fichier posait
--   lui-même la date de péremption de cette voie : « INTERDITE dès le premier
--   fait journalisé ». Un rejeu aurait DÉTRUIT des faits de révocation dans un
--   magasin append-only — en contournant précisément l'immuabilité que ce
--   fichier installe.
--
--   Le `drop` était aussi ce qui rendait le `create` rejouable : les deux ont
--   donc été fusionnés en `create table if not exists`. Idempotent SANS être
--   destructif, comme les autres tables du dépôt.
--
--   ⚠️ Contrepartie assumée : `if not exists` ne CORRIGE pas une table dont la
--      forme aurait divergé — il la laisse telle quelle, en silence. Une
--      évolution de structure passera par une migration dédiée, jamais par un
--      rejeu de ce fichier.
-- =====================================================================
create table if not exists public.wsp_fact_revocations (
  id                   text        primary key
                       default ('rev_' || public.generate_ulid()),
  revokes_evidence_id  text        not null references public.wsp_evidence(id),
  -- Identité d'émission de la révocation (ENG-002 §7).
  issuer_id            text        not null references public.wsp_issuers(id),
  issuer_revocation_id text        not null,
  reason               text        not null,            -- motif OBLIGATOIRE
  revoked_by           text        not null,            -- acteur HUMAIN redevable (≠ issuer_id)
  occurred_at          timestamptz not null,
  recorded_at          timestamptz not null default now(),
  canonical_hash       text        not null,
  unique (issuer_id, issuer_revocation_id)
);

comment on table public.wsp_fact_revocations is
  'Une révocation est un NOUVEAU fait (W2), jamais une mutation ni un DELETE. Porte sa propre identité d''émission (issuer_id, issuer_revocation_id) UNIQUE (ENG-002 §7) : une relivraison est idempotente. revoked_by = acteur humain redevable, distinct de issuer_id.';

create index if not exists wsp_fact_revocations_evidence_idx
  on public.wsp_fact_revocations(revokes_evidence_id);

-- =====================================================================
-- APPEND-ONLY STRUCTUREL (W2) — UPDATE/DELETE échouent au niveau SGBD,
-- service_role INCLUS. Réutilise la garde du Lot O0.
-- =====================================================================
drop trigger if exists wsp_issuers_no_mutation on public.wsp_issuers;
create trigger wsp_issuers_no_mutation
  before update or delete on public.wsp_issuers
  for each row execute function public.wsp_reject_mutation();

drop trigger if exists wsp_evidence_no_mutation on public.wsp_evidence;
create trigger wsp_evidence_no_mutation
  before update or delete on public.wsp_evidence
  for each row execute function public.wsp_reject_mutation();

drop trigger if exists wsp_evidence_demonstrates_skill_no_mutation on public.wsp_evidence_demonstrates_skill;
create trigger wsp_evidence_demonstrates_skill_no_mutation
  before update or delete on public.wsp_evidence_demonstrates_skill
  for each row execute function public.wsp_reject_mutation();

drop trigger if exists wsp_fact_revocations_no_mutation on public.wsp_fact_revocations;
create trigger wsp_fact_revocations_no_mutation
  before update or delete on public.wsp_fact_revocations
  for each row execute function public.wsp_reject_mutation();

-- =====================================================================
-- GARDE TRUNCATE (STATEMENT-level) — l'append-only fermait UPDATE/DELETE mais
-- laissait TRUNCATE OUVERT : un TRUNCATE effacerait des faits (ou une version
-- de Framework, rendant ININTERPRÉTABLES tous les faits qui la citent —
-- WSP-001 §3.6). On ferme la faille sur les 8 tables wsp_ (sémantique O0 +
-- faits O1). Les 3 tables d'interprétation (O3/O4) recevront la garde à leur
-- création — elles n'existent pas encore.
--
-- `wsp_reject_mutation()` est RÉUTILISABLE en contexte STATEMENT : elle
-- n'accède ni à NEW ni à OLD ; elle lit tg_op (= 'TRUNCATE') et tg_table_name,
-- tous deux valides pour un trigger statement-level. Aucune fonction sœur.
-- (Ces 4 gardes portent sur des tables d'O0 : posées ici pour livrer le
--  correctif en une seule réapplication, celle d'O1.)
-- =====================================================================
-- Sémantique (O0)
drop trigger if exists wsp_frameworks_no_truncate on public.wsp_frameworks;
create trigger wsp_frameworks_no_truncate
  before truncate on public.wsp_frameworks
  for each statement execute function public.wsp_reject_mutation();

drop trigger if exists wsp_framework_versions_no_truncate on public.wsp_framework_versions;
create trigger wsp_framework_versions_no_truncate
  before truncate on public.wsp_framework_versions
  for each statement execute function public.wsp_reject_mutation();

drop trigger if exists wsp_skills_no_truncate on public.wsp_skills;
create trigger wsp_skills_no_truncate
  before truncate on public.wsp_skills
  for each statement execute function public.wsp_reject_mutation();

drop trigger if exists wsp_skill_levels_no_truncate on public.wsp_skill_levels;
create trigger wsp_skill_levels_no_truncate
  before truncate on public.wsp_skill_levels
  for each statement execute function public.wsp_reject_mutation();

-- Faits (O1)
drop trigger if exists wsp_issuers_no_truncate on public.wsp_issuers;
create trigger wsp_issuers_no_truncate
  before truncate on public.wsp_issuers
  for each statement execute function public.wsp_reject_mutation();

drop trigger if exists wsp_evidence_no_truncate on public.wsp_evidence;
create trigger wsp_evidence_no_truncate
  before truncate on public.wsp_evidence
  for each statement execute function public.wsp_reject_mutation();

drop trigger if exists wsp_evidence_demonstrates_skill_no_truncate on public.wsp_evidence_demonstrates_skill;
create trigger wsp_evidence_demonstrates_skill_no_truncate
  before truncate on public.wsp_evidence_demonstrates_skill
  for each statement execute function public.wsp_reject_mutation();

drop trigger if exists wsp_fact_revocations_no_truncate on public.wsp_fact_revocations;
create trigger wsp_fact_revocations_no_truncate
  before truncate on public.wsp_fact_revocations
  for each statement execute function public.wsp_reject_mutation();

-- =====================================================================
-- RLS — le sujet lit ses propres faits ; aucun Issuer ne lit ceux d'un autre ;
-- aucun chemin d'écriture direct au fact store (W5, ENG-001 §10).
--   • anon : AUCUN accès (le fact store n'est jamais public).
--   • authenticated : SELECT restreint au sujet (via profiles.opus_id).
--   • INSERT/UPDATE/DELETE : aucune policy → seul le service_role écrit
--     (chemin d'ingestion vérifié, Lot O2). L'append-only bloque en plus
--     tout UPDATE/DELETE, service_role inclus.
-- =====================================================================
alter table public.wsp_issuers                     enable row level security;
alter table public.wsp_evidence                    enable row level security;
alter table public.wsp_evidence_demonstrates_skill enable row level security;
alter table public.wsp_fact_revocations            enable row level security;

-- wsp_evidence : le sujet lit SES faits.
drop policy if exists "wsp_evidence_select_subject" on public.wsp_evidence;
create policy "wsp_evidence_select_subject"
  on public.wsp_evidence for select to authenticated
  using (subject_id = public.current_opus_id());

-- wsp_evidence_demonstrates_skill : lisible si l'Evidence parente est au sujet.
drop policy if exists "wsp_eds_select_subject" on public.wsp_evidence_demonstrates_skill;
create policy "wsp_eds_select_subject"
  on public.wsp_evidence_demonstrates_skill for select to authenticated
  using (
    exists (
      select 1 from public.wsp_evidence e
      where e.id = wsp_evidence_demonstrates_skill.evidence_id
        and e.subject_id = public.current_opus_id()
    )
  );

-- wsp_fact_revocations : le sujet du fait révoqué lit la révocation.
drop policy if exists "wsp_fact_revocations_select_subject" on public.wsp_fact_revocations;
create policy "wsp_fact_revocations_select_subject"
  on public.wsp_fact_revocations for select to authenticated
  using (
    exists (
      select 1 from public.wsp_evidence e
      where e.id = wsp_fact_revocations.revokes_evidence_id
        and e.subject_id = public.current_opus_id()
    )
  );

-- wsp_issuers : entités redevables — identité publique lisible (display_name,
-- status). Le hmac_key_ref et le contact restent SERVEUR (grant par colonnes).
drop policy if exists "wsp_issuers_read_identity" on public.wsp_issuers;
create policy "wsp_issuers_read_identity"
  on public.wsp_issuers for select to authenticated using (true);

-- Grants — least privilege.
revoke all on public.wsp_issuers                     from anon, authenticated;
revoke all on public.wsp_evidence                    from anon, authenticated;
revoke all on public.wsp_evidence_demonstrates_skill from anon, authenticated;
revoke all on public.wsp_fact_revocations            from anon, authenticated;

-- Le sujet lit ses faits (la RLS restreint les lignes ; anon n'a rien).
grant select on public.wsp_evidence                    to authenticated;
grant select on public.wsp_evidence_demonstrates_skill to authenticated;
grant select on public.wsp_fact_revocations            to authenticated;

-- L'identité d'un Issuer est lisible ; le secret HMAC et le contact ne le
-- sont PAS (grant limité aux colonnes d'identité publique).
grant select (id, display_name, status) on public.wsp_issuers to authenticated;

-- Aucun seed d'Issuer ici (W7 : aucun nom d'Issuer dans les seeds). Les Issuers
-- sont enregistrés hors de cette migration (données), jamais en dur dans le code.
