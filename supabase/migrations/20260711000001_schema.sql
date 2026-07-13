-- =====================================================================
-- Opus X — Sprint 1 — LOT 2 : Schéma Supabase
-- Source d'autorité : opus-x-sprint-1.md (Révision Finale, figée) §3.3
-- Aucun seed (notamment Frameworks — Décision 2).
-- Vocabulaire verrouillé : le Passport est ÉMIS (issued_at), jamais "créé".
-- =====================================================================

-- ---------------------------------------------------------------------
-- profiles — le professionnel (1:1 avec auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  opus_id     text        not null unique,          -- opx_ + ULID (§5.1) — identité canonique permanente
  full_name   text,                                 -- saisi à l'établissement
  headline    text,                                 -- intitulé pro (éditable au Dashboard)
  avatar_url  text,
  locale      text        not null default 'fr',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table  public.profiles is 'Le professionnel. 1:1 avec auth.users. Identité établie, jamais "créée".';
comment on column public.profiles.opus_id is 'Identité canonique permanente : opx_ + ULID (Crockford base32). Opaque, non énumérable, gravée à l''émission.';

-- ---------------------------------------------------------------------
-- passports — le Professional Passport (1:1 avec profiles, ÉMIS)
-- ---------------------------------------------------------------------
create table if not exists public.passports (
  id              uuid        primary key default gen_random_uuid(),
  profile_id      uuid        not null unique references public.profiles(id) on delete cascade,
  handle          text        not null unique,      -- slug d'URL publique (§5.2), changeable
  visibility      text        not null default 'private'
                  check (visibility in ('private', 'unlisted', 'public')),
  lifecycle_stage text        not null default 'identity_established'
                  check (lifecycle_stage in (
                    'identity_established',   -- 1 — état du Sprint 1
                    'receiving_evidence',     -- 2
                    'skills_emerging',        -- 3
                    'trust_established',      -- 4
                    'passport_verified',      -- 5
                    'trusted_professional',   -- 6
                    'authority'               -- 7
                  )),
  status          text        not null default 'active',   -- statut technique
  issued_at       timestamptz not null default now(),      -- DATE D'ÉMISSION (product-facing)
  updated_at      timestamptz not null default now()
);

comment on table  public.passports is 'Le Professional Passport : actif officiel ÉMIS par Opus X, détenu par le professionnel. Objet vivant, privé par défaut.';
comment on column public.passports.lifecycle_stage is 'Cycle de vie (Décision 3) — 7 étapes canoniques. Figé à identity_established en Sprint 1.';
comment on column public.passports.issued_at is 'Date d''ÉMISSION du Passport (jamais "création").';
comment on column public.passports.handle is 'Adresse publique lisible et changeable. Découplée de l''opus_id (identité canonique).';

-- ---------------------------------------------------------------------
-- trust_index — métrique interne du Trust Status (1:1 passport)
-- (Trust Index = terme INTERNE ; l'UI dit "Trust Status")
-- ---------------------------------------------------------------------
create table if not exists public.trust_index (
  passport_id uuid        primary key references public.passports(id) on delete cascade,
  score       numeric,                              -- NULL tant que non établi (§5.5) — jamais 0/100
  state       text        not null default 'establishing'
              check (state in ('establishing', 'emerging', 'established')),
  computed_at timestamptz
);

comment on table  public.trust_index is 'Métrique interne alimentant le Trust Status. score = NULL tant que non établi : un Passport vide se sent "prêt", jamais "raté" (§5.5).';

-- ---------------------------------------------------------------------
-- skills — entrées du Skills Status (vide en Sprint 1)
-- ---------------------------------------------------------------------
create table if not exists public.skills (
  id             uuid        primary key default gen_random_uuid(),
  passport_id    uuid        not null references public.passports(id) on delete cascade,
  name           text        not null,
  level          text,
  verified       boolean     not null default false,
  evidence_count integer     not null default 0,
  framework_id   uuid,                              -- FK future (stub non contraint en Sprint 1)
  created_at     timestamptz not null default now()
);

create index if not exists skills_passport_id_idx on public.skills(passport_id);

-- ---------------------------------------------------------------------
-- evidence — les preuves (vide ; alimentée plus tard par les partenaires)
-- ---------------------------------------------------------------------
create table if not exists public.evidence (
  id                uuid        primary key default gen_random_uuid(),
  passport_id       uuid        not null references public.passports(id) on delete cascade,
  source_partner_id uuid,                           -- FK future
  type              text        not null,
  title             text        not null,
  description       text,
  status            text        not null default 'pending',
  verified          boolean     not null default false,
  issued_at         timestamptz,
  payload           jsonb,
  created_at        timestamptz not null default now()
);

create index if not exists evidence_passport_id_idx on public.evidence(passport_id);

comment on column public.evidence.payload is 'Jamais exposé publiquement (§5.3 — hors whitelist).';

-- ---------------------------------------------------------------------
-- consents — journal de consentement (RGPD, §5.4)
-- ---------------------------------------------------------------------
create table if not exists public.consents (
  id         uuid        primary key default gen_random_uuid(),
  profile_id uuid        not null references public.profiles(id) on delete cascade,
  type       text        not null
             check (type in ('terms', 'privacy', 'partner_ingestion', 'public_share')),
  granted    boolean     not null,
  version    text        not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  ip         text,
  user_agent text
);

create index if not exists consents_profile_id_idx on public.consents(profile_id);

-- Idempotence du journal (V2) : un consentement par (profil, type, version).
create unique index if not exists consents_profile_type_version_uidx
  on public.consents(profile_id, type, version);

comment on table public.consents is 'Journal de consentement RGPD : explicite, granulaire, journalisé, révocable (§5.4). Idempotent (V2).';

-- =====================================================================
-- TABLES STUB FUTUR — créées pour la cohérence du modèle.
-- NI SEEDÉES, NI SURFACÉES en Sprint 1 (Décision 2 : Frameworks reportés).
-- =====================================================================

create table if not exists public.frameworks (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        not null unique,
  name        text        not null,
  description text,
  publisher   text,
  created_at  timestamptz not null default now()
);

comment on table public.frameworks is 'STUB — reporté (Décision 2). Aucun seed, aucune surface UI en Sprint 1.';

create table if not exists public.passport_frameworks (
  passport_id  uuid        not null references public.passports(id) on delete cascade,
  framework_id uuid        not null references public.frameworks(id) on delete cascade,
  adopted_at   timestamptz not null default now(),
  primary key (passport_id, framework_id)
);

comment on table public.passport_frameworks is 'STUB — reporté (Décision 2).';

create table if not exists public.partners (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  status     text        not null default 'pending',
  created_at timestamptz not null default now()
);

comment on table public.partners is 'STUB — futurs émetteurs d''Evidence. Non surfacé en Sprint 1.';

-- ---------------------------------------------------------------------
-- updated_at : maintenu automatiquement
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists passports_touch_updated_at on public.passports;
create trigger passports_touch_updated_at
  before update on public.passports
  for each row execute function public.touch_updated_at();
