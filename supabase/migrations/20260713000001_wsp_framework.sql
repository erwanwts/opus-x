-- =====================================================================
-- Opus X — Sprint 2 — LOT O0 : PUBLIER LE FRAMEWORK
-- Source d'autorité : SPRINT-002 v1.2 §7 (Lot O0), §5.3, Annexe A,
--                     projeté sur ENG-001 §6 (zone SEMANTICS).
--
-- « Sans lui, la chaîne n'a pas de langage commun. Un Issuer ne peut pas
--   référencer une Skill qui n'existe nulle part. »
--
-- Opus X publie le World Trader Framework. Les Skills deviennent des objets
-- canoniques, identifiables, versionnés — découvrables par N'IMPORTE QUEL
-- Issuer, sans configuration spécifique (D9).
--
-- ZONE SÉMANTIQUE (ENG-001 §3, §6) : définitions AUTORÉES et VERSIONNÉES.
-- Ni des faits, ni des interprétations : les définitions référencées.
--
-- PRÉSERVATION PERMANENTE (WSP-001 §6.3, §3.6 ; FRAMEWORK-003 §9) :
--   une version de Framework n'est JAMAIS supprimée ni altérée — garanti
--   PAR LA BASE (trigger de rejet), pas par convention. Un fait enregistré
--   sous une version reste interprétable à perpétuité.
--
-- ─────────────────────────────────────────────────────────────────────
-- NOTE D'ARCHITECTURE — nommage `wsp_*` (décision d'ingénierie, ENG-001 §11).
--   Le Sprint 1 occupe déjà `public.frameworks`, `public.skills`,
--   `public.evidence` avec une sémantique INCOMPATIBLE (tables d'affichage,
--   portées par un passport). « Rien de ce qui a été prouvé ne doit être
--   cassé » : on n'y touche pas. ENG-001 §11 place explicitement « les noms
--   exacts de tables/colonnes » dans la latitude d'ingénierie. On isole donc
--   la zone protocolaire du Sprint 2 sous le préfixe `wsp_` — préfixe NEUTRE
--   (World Skills Protocol), jamais le nom d'un Issuer (W7), et cohérent avec
--   la convention de la spec elle-même (`wsp_skill_mappings`, §Lot C2).
-- ─────────────────────────────────────────────────────────────────────
-- =====================================================================

-- ---------------------------------------------------------------------
-- Garde d'immuabilité RÉUTILISABLE — rejette toute mutation au niveau SGBD.
-- Posée ici (zone sémantique) et réutilisée par le fact store (Lot O1, W2).
-- Fonctionne même contre le service_role : c'est une garantie STRUCTURELLE,
-- pas un simple retrait de grant (qui ne borne pas le propriétaire).
-- ---------------------------------------------------------------------
create or replace function public.wsp_reject_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception
    'WSP_APPEND_ONLY: % interdit sur %. Les définitions publiées et les faits sont immuables (WSP-001 §14.3 ; FRAMEWORK-003 §9). Une correction est un NOUVEAU fait/une nouvelle version.',
    tg_op, tg_table_name
    using errcode = 'restrict_violation';
end;
$$;

comment on function public.wsp_reject_mutation() is
  'Garde d''immuabilité : lève une exception sur UPDATE/DELETE. Append-only garanti par la base, pas par convention.';

-- =====================================================================
-- wsp_frameworks — identité d'un Framework professionnel publié (ENG-001 §6)
-- =====================================================================
create table if not exists public.wsp_frameworks (
  id               text        primary key,            -- identifiant canonique : 'framework:wtr'
  slug             text        not null unique,         -- clé de découverte URL : 'world-trader'
  name             text        not null,                -- 'World Trader Framework'
  description      text,
  publisher        text        not null,                -- PUBLIÉ PAR OPUS X (§5.3), jamais par l'Issuer
  protocol_version text        not null default '1.0',  -- enveloppe (SCHEMA-001 §6.4)
  recorded_at      timestamptz not null default now()   -- enveloppe, immuable
);

comment on table public.wsp_frameworks is
  'Zone SÉMANTIQUE (ENG-001 §6) : un Framework professionnel publié par Opus X. Découvrable par tout Issuer (D9). id = identifiant canonique protocolaire.';
comment on column public.wsp_frameworks.publisher is
  'Publié par Opus X. La correspondance des niveaux appartient au Framework, jamais à l''Issuer (§5.3).';

-- =====================================================================
-- wsp_framework_versions — chaque version, PRÉSERVÉE À PERPÉTUITÉ
-- =====================================================================
create table if not exists public.wsp_framework_versions (
  id           text        primary key,                 -- 'framework:wtr@0.1'
  framework_id text        not null references public.wsp_frameworks(id),
  version      text        not null,                     -- '0.1'
  status       text        not null default 'published'
               check (status in ('published', 'deprecated')),
  published_at timestamptz not null default now(),
  recorded_at  timestamptz not null default now(),
  unique (framework_id, version)
);

comment on table public.wsp_framework_versions is
  'Chaque version d''un Framework, préservée en permanence (WSP-001 §6.3 ; FRAMEWORK-003 §9). Jamais supprimée ni altérée — un fait sous une version reste interprétable à perpétuité.';

-- effective_date (ENG-002 v0.2 §9.2) — la date d'ENTRÉE EN VIGUEUR des règles de
-- cette version. Concept DOMAINE, distinct de published_at (horodatage système,
-- default now() au seed) : on ne le duplique pas, on ajoute une colonne dédiée.
--
-- La table est append-only ET déjà seedée : un UPDATE de backfill serait bloqué
-- par wsp_reject_mutation. Mais ADD COLUMN est du DDL — il ne déclenche PAS les
-- triggers DML (UPDATE/DELETE), et un DEFAULT constant en PG11+ est purement
-- métadonnée (aucune réécriture de table). La ligne v0.1 déjà seedée reçoit donc
-- la valeur par défaut. `if not exists` rend l'ajout idempotent.
alter table public.wsp_framework_versions
  add column if not exists effective_date date not null default '2026-07-13';

comment on column public.wsp_framework_versions.effective_date is
  'ENG-002 §9.2 — date d''entrée en vigueur des règles de cette version (domaine), distincte de published_at (horodatage système).';

-- =====================================================================
-- wsp_skills — une capacité nommable définie DANS une version de Framework
-- =====================================================================
create table if not exists public.wsp_skills (
  id                text        primary key,             -- identifiant canonique : 'wtr:212'
  framework_id      text        not null references public.wsp_frameworks(id),
  framework_version text        not null,                 -- la version qui lui donne son sens
  code              text        not null,                 -- 'WTR-212' (étiquette humaine)
  name              text        not null,                 -- 'Intention vs Engagement'
  description       text,
  recorded_at       timestamptz not null default now(),
  foreign key (framework_id, framework_version)
    references public.wsp_framework_versions(framework_id, version),
  unique (framework_id, framework_version, code)
);

comment on table public.wsp_skills is
  'Une Skill : capacité nommable définie dans une version de Framework (WSP-001 §7). id = identifiant canonique stable, référencé par les Evidence.';
comment on column public.wsp_skills.framework_version is
  'La version exacte qui donne son sens à la Skill. Un fait référence toujours (framework, version), jamais un framework « flottant » (WSP-001 §3.6).';

-- =====================================================================
-- wsp_skill_levels — niveaux de compétence (CONTENU DU FRAMEWORK, §5.3, P1)
--   Les 4 niveaux (Aware / Applied / Proficient / Mastery), versionnés avec
--   le Framework. Chaque niveau porte AUSSI sa bande d'observation (0–5) :
--   c'est la « correspondance des niveaux » du §5.3 — publiée par Opus X,
--   JAMAIS décidée par l'Issuer. 0–1 = aucun niveau (rien n'est démontré).
-- =====================================================================
create table if not exists public.wsp_skill_levels (
  id                text        primary key,             -- 'wtr:212#applied'
  skill_id          text        not null references public.wsp_skills(id),
  framework_version text        not null,
  slug              text        not null,                 -- 'applied' (= claimed_level du payload)
  label             text        not null,                 -- 'Applied'
  rank              integer     not null,                 -- ordre : 1..4
  criteria          text,                                 -- ce que le niveau signifie
  observation_min   integer     not null,                 -- bande d'observation basse (§5.3)
  observation_max   integer     not null,                 -- bande d'observation haute (§5.3)
  recorded_at       timestamptz not null default now(),
  unique (skill_id, framework_version, slug),
  unique (skill_id, framework_version, rank)
);

comment on table public.wsp_skill_levels is
  'Niveaux de compétence d''une Skill — CONTENU DU FRAMEWORK (WSP-001 §7.3), versionné avec lui. Inclut la correspondance observation(0–5) → niveau (§5.3, P1), publiée par Opus X. Le protocole ne définit pas lui-même ce qu''un niveau signifie.';
comment on column public.wsp_skill_levels.observation_min is
  'Correspondance des niveaux (§5.3 / P1) : bande d''observation Issuer (0–5) que ce niveau interprète. 0–1 n''a aucun niveau (rien n''est démontré).';

-- ---------------------------------------------------------------------
-- Index de découverte
-- ---------------------------------------------------------------------
create index if not exists wsp_skills_framework_idx
  on public.wsp_skills(framework_id, framework_version);
create index if not exists wsp_skill_levels_skill_idx
  on public.wsp_skill_levels(skill_id, framework_version);

-- =====================================================================
-- IMMUABILITÉ STRUCTURELLE — la zone sémantique est APPEND-ONLY.
-- Publier = INSERT. Une évolution est une NOUVELLE version, jamais une
-- mutation. UPDATE/DELETE échouent au niveau SGBD (DoD Lot O0).
-- =====================================================================
drop trigger if exists wsp_frameworks_no_mutation on public.wsp_frameworks;
create trigger wsp_frameworks_no_mutation
  before update or delete on public.wsp_frameworks
  for each row execute function public.wsp_reject_mutation();

drop trigger if exists wsp_framework_versions_no_mutation on public.wsp_framework_versions;
create trigger wsp_framework_versions_no_mutation
  before update or delete on public.wsp_framework_versions
  for each row execute function public.wsp_reject_mutation();

drop trigger if exists wsp_skills_no_mutation on public.wsp_skills;
create trigger wsp_skills_no_mutation
  before update or delete on public.wsp_skills
  for each row execute function public.wsp_reject_mutation();

drop trigger if exists wsp_skill_levels_no_mutation on public.wsp_skill_levels;
create trigger wsp_skill_levels_no_mutation
  before update or delete on public.wsp_skill_levels
  for each row execute function public.wsp_reject_mutation();

-- =====================================================================
-- RLS — les définitions publiées sont du savoir PUBLIC.
--   Un Issuer (ou n'importe qui) DÉCOUVRE les Skills sans configuration
--   spécifique (D9) : lecture ouverte. Aucune écriture client (append-only
--   + garde ci-dessus + aucun grant d'écriture).
-- =====================================================================
alter table public.wsp_frameworks         enable row level security;
alter table public.wsp_framework_versions enable row level security;
alter table public.wsp_skills             enable row level security;
alter table public.wsp_skill_levels       enable row level security;

drop policy if exists "wsp_frameworks_read_all" on public.wsp_frameworks;
create policy "wsp_frameworks_read_all"
  on public.wsp_frameworks for select to anon, authenticated using (true);

drop policy if exists "wsp_framework_versions_read_all" on public.wsp_framework_versions;
create policy "wsp_framework_versions_read_all"
  on public.wsp_framework_versions for select to anon, authenticated using (true);

drop policy if exists "wsp_skills_read_all" on public.wsp_skills;
create policy "wsp_skills_read_all"
  on public.wsp_skills for select to anon, authenticated using (true);

drop policy if exists "wsp_skill_levels_read_all" on public.wsp_skill_levels;
create policy "wsp_skill_levels_read_all"
  on public.wsp_skill_levels for select to anon, authenticated using (true);

-- Lecture seule pour les rôles clients : le chemin d'écriture est la migration
-- (publication par Opus X). Aucune écriture depuis anon/authenticated.
revoke insert, update, delete on public.wsp_frameworks         from anon, authenticated;
revoke insert, update, delete on public.wsp_framework_versions from anon, authenticated;
revoke insert, update, delete on public.wsp_skills             from anon, authenticated;
revoke insert, update, delete on public.wsp_skill_levels       from anon, authenticated;

grant select on public.wsp_frameworks         to anon, authenticated;
grant select on public.wsp_framework_versions to anon, authenticated;
grant select on public.wsp_skills             to anon, authenticated;
grant select on public.wsp_skill_levels       to anon, authenticated;

-- =====================================================================
-- SEED — World Trader Framework v0.1 · WTR-212 · 4 niveaux
-- Discipline (Lot O0) : UNE SEULE Skill. Le WTR complet viendra plus tard.
-- Idempotent (on conflict do nothing) — re-jouable sans doublon.
-- =====================================================================
insert into public.wsp_frameworks (id, slug, name, description, publisher)
values (
  'framework:wtr',
  'world-trader',
  'World Trader Framework',
  'Le Framework de référence du World Skills Protocol pour la compétence de trading professionnel. Publié par Opus X.',
  'Opus X'
)
on conflict (id) do nothing;

insert into public.wsp_framework_versions (id, framework_id, version, status)
values ('framework:wtr@0.1', 'framework:wtr', '0.1', 'published')
on conflict (id) do nothing;

insert into public.wsp_skills (id, framework_id, framework_version, code, name, description)
values (
  'wtr:212',
  'framework:wtr',
  '0.1',
  'WTR-212',
  'Intention vs Engagement',
  'La capacité conceptuelle et durable à distinguer une intention planifiée d''un engagement effectif — attestable par le jugement d''un coach sur une capacité observée (D5).'
)
on conflict (id) do nothing;

-- Les 4 niveaux + leur bande d'observation (§5.3 / P1) :
--   0–1 → aucun niveau (rien n'est démontré) · 2 → Aware · 3 → Applied
--   4 → Proficient · 5 → Mastery.
insert into public.wsp_skill_levels
  (id, skill_id, framework_version, slug, label, rank, criteria, observation_min, observation_max)
values
  ('wtr:212#aware',      'wtr:212', '0.1', 'aware',      'Aware',      1,
   'Conscience de la distinction entre intention et engagement.', 2, 2),
  ('wtr:212#applied',    'wtr:212', '0.1', 'applied',    'Applied',    2,
   'Application observable de la distinction dans l''exécution.',  3, 3),
  ('wtr:212#proficient', 'wtr:212', '0.1', 'proficient', 'Proficient', 3,
   'Maîtrise régulière et fiable de la distinction.',             4, 4),
  ('wtr:212#mastery',    'wtr:212', '0.1', 'mastery',    'Mastery',    4,
   'Maîtrise experte, transmissible.',                            5, 5)
on conflict (id) do nothing;
