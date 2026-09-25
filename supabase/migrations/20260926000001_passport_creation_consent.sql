-- =====================================================================
-- Opus X — Sprint 2 — O-B : CONSENTEMENT DE CRÉATION DU PASSEPORT (D-054)
-- =====================================================================
-- Décision D-054 : un acte de consentement EXPLICITE « créer/relier mon
-- Passeport », enregistré AVANT l'émission dans le flux d'activation. Le sujet
-- DÉCIDE de créer, puis le Passeport naît.
--
-- ⚠️ TROIS systèmes de consentement, VOLONTAIREMENT DISTINCTS — ne pas confondre :
--   1. public.consents          → consentement PRODUIT (CGU/confidentialité, Sprint 1).
--   2. public.wsp_consent_events → autorisation d'ÉMISSION par Issuer (Sprint 2 O2a).
--   3. public.passport_creation_consents (CE FICHIER) → l'acte fondateur : le
--      sujet consent à ce que SON Passeport EXISTE. Ni juridique, ni per-Issuer :
--      l'existence même de l'objet. C'est l'autorisation de issue_passport.
--
-- OÙ « AVANT l'émission » : la DÉCISION voyage dans les métadonnées de signup
-- (auth.users.raw_user_meta_data), donc enregistrée AVANT la confirmation et
-- AVANT toute émission. Elle est MATÉRIALISÉE ici par issue_passport, écrite
-- AVANT l'insertion du Passport (étape 1b, avant l'étape 2). Même transport et
-- même matérialisation que terms/privacy (Sprint 1, V2), mais dans un store dédié.
--
-- Idempotent : create table if not exists, create or replace function,
-- on conflict do nothing. Rejouable sans effet de bord. STAGING d'abord.
-- =====================================================================

-- ---------------------------------------------------------------------
-- La table dédiée. `decision` : 'create' aujourd'hui ; 'link' réservé à
-- O-E (créer OU lier, D-056) — le champ est là pour ne pas re-migrer.
-- Unicité (profile_id, decision, version) : idempotence d'un retry, sans
-- interdire un futur fait 'link' distinct du 'create'.
-- ---------------------------------------------------------------------
create table if not exists public.passport_creation_consents (
  id             uuid        primary key default gen_random_uuid(),
  profile_id     uuid        not null references public.profiles(id) on delete cascade,
  decision       text        not null default 'create'
                 check (decision in ('create', 'link')),
  granted        boolean     not null,
  version        text        not null,
  effective_date date        not null,
  granted_at     timestamptz not null default now(),
  unique (profile_id, decision, version)
);

comment on table public.passport_creation_consents is
  'Acte fondateur (D-054) : le sujet consent à l''EXISTENCE de son Passeport. Système DÉDIÉ, distinct de public.consents (produit) et de wsp_consent_events (émission par Issuer). Décision captée avant l''émission (métadonnées de signup), matérialisée par issue_passport avant l''insertion du Passport.';
comment on column public.passport_creation_consents.decision is
  '''create'' (fonder) — ''link'' réservé à O-E (créer OU lier, D-056).';

-- ---------------------------------------------------------------------
-- RLS — parité avec public.consents : le propriétaire lit les siens ;
-- écriture uniquement via issue_passport (security definer). anon : rien.
-- ---------------------------------------------------------------------
alter table public.passport_creation_consents enable row level security;

drop policy if exists "passport_creation_consents_select_owner" on public.passport_creation_consents;
create policy "passport_creation_consents_select_owner"
  on public.passport_creation_consents
  for select
  to authenticated
  using (profile_id = (select auth.uid()));

-- Aucune policy DML client : la ligne n'est écrite que par issue_passport.
revoke all on public.passport_creation_consents from anon;

-- ---------------------------------------------------------------------
-- issue_passport — RE-DÉFINITION avec l'étape 1b (le create/replace
-- préserve les grants existants). Corps VERBATIM de l'émission + le seul
-- ajout : la matérialisation du consentement de création, AVANT le Passport.
-- ---------------------------------------------------------------------
create or replace function public.issue_passport(
  p_user_id uuid,
  p_meta    jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_full_name   text;
  v_locale      text;
  v_passport_id uuid;
  v_consent     jsonb;
begin
  v_full_name := nullif(btrim(coalesce(p_meta ->> 'full_name', '')), '');
  v_locale    := coalesce(nullif(p_meta ->> 'locale', ''), 'fr');

  -- ── 1. Le profil ────────────────────────────────────────────────────
  -- L'opus_id n'est généré QUE s'il n'existe pas déjà : l'identité canonique
  -- est permanente, gravée une seule fois, jamais régénérée par un retry.
  insert into public.profiles (id, opus_id, full_name, locale)
  values (p_user_id, public.generate_opus_id(), v_full_name, v_locale)
  on conflict (id) do nothing;

  -- ── 1b. Le consentement de CRÉATION (D-054) — AVANT le Passeport ─────
  -- Système dédié (passport_creation_consents). La décision « créer/relier »
  -- voyage dans p_meta -> 'passport_creation' (métadonnées de signup, donc
  -- ANTÉRIEURE à l'émission). Matérialisée ici, avant l'insertion du Passport :
  -- le Passeport ne naît qu'après que le consentement fondateur est inscrit.
  -- Idempotent (on conflict do nothing).
  if jsonb_typeof(p_meta -> 'passport_creation') = 'object' then
    insert into public.passport_creation_consents
      (profile_id, decision, granted, version, effective_date, granted_at)
    values (
      p_user_id,
      coalesce(nullif(p_meta #>> '{passport_creation,decision}', ''), 'create'),
      coalesce((p_meta #>> '{passport_creation,granted}')::boolean, false),
      coalesce(nullif(p_meta #>> '{passport_creation,version}', ''), public.consent_default_version()),
      coalesce(nullif(p_meta #>> '{passport_creation,effective_date}', '')::date, public.consent_default_effective_date()),
      now()
    )
    on conflict (profile_id, decision, version) do nothing;
  end if;

  -- ── 2. Le Passport (ÉMIS) ───────────────────────────────────────────
  -- Le handle n'est généré que si aucun Passport n'existe pour ce profil.
  if not exists (select 1 from public.passports where profile_id = p_user_id) then
    begin
      insert into public.passports (profile_id, handle, lifecycle_stage, issued_at)
      values (
        p_user_id,
        public.generate_unique_handle(v_full_name),
        'identity_established',   -- Étape 1 du cycle de vie. Jamais « created ».
        now()                      -- Date d'ÉMISSION.
      )
      on conflict (profile_id) do nothing;   -- Course concurrente : un seul gagne.
    exception
      when unique_violation then
        -- Collision de handle sous concurrence extrême : on retente une fois.
        insert into public.passports (profile_id, handle, lifecycle_stage, issued_at)
        values (p_user_id, public.generate_unique_handle(v_full_name),
                'identity_established', now())
        on conflict (profile_id) do nothing;
    end;
  end if;

  select id into v_passport_id
  from public.passports
  where profile_id = p_user_id;

  -- ── 3. Le Trust Index (baseline) ────────────────────────────────────
  -- score = NULL, state = 'establishing'. JAMAIS un 0/100 (§5.5).
  if v_passport_id is not null then
    insert into public.trust_index (passport_id, score, state)
    values (v_passport_id, null, 'establishing')
    on conflict (passport_id) do nothing;
  end if;

  -- ── 4. Les consentements (V2) ───────────────────────────────────────
  -- Transportés depuis les métadonnées de signup, journalisés idempotemment
  -- (index unique sur profile_id + type + version → un retry ne duplique rien).
  if jsonb_typeof(p_meta -> 'consents') = 'array' then
    for v_consent in select * from jsonb_array_elements(p_meta -> 'consents')
    loop
      insert into public.consents (profile_id, type, granted, version, granted_at)
      values (
        p_user_id,
        v_consent ->> 'type',
        coalesce((v_consent ->> 'granted')::boolean, false),
        coalesce(nullif(v_consent ->> 'version', ''), public.consent_default_version()),
        now()
      )
      on conflict (profile_id, type, version) do nothing;
    end loop;
  end if;
end;
$$;

comment on function public.issue_passport(uuid, jsonb) is
  'ÉMISSION du Passport : atomique et idempotente. Écritures : profil + consentement de création (D-054, avant le Passport) + passport + trust_index + consentements produit. Un retry n''émet JAMAIS deux Passports.';

-- ════════════════════════════════════════════════════════
-- POST-MIGRATION VERIFICATIONS
-- ════════════════════════════════════════════════════════
-- 1. Table présente + distincte des deux autres systèmes :
--    select count(*) from information_schema.tables
--     where table_schema='public' and table_name='passport_creation_consents';  → 1
-- 2. RLS active :
--    select relrowsecurity from pg_class where relname='passport_creation_consents';  → t
-- 3. L'émission écrit bien la ligne dédiée (via le test d'intégration O-B, staging).
