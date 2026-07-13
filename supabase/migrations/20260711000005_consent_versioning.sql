-- =====================================================================
-- Opus X — Sprint 1 — LOT 4 (b) : AMENDEMENT CONSENTEMENT
--
-- AMENDEMENT À LA SPEC FIGÉE §3.3 / §5.4 — décidé par l'architecte projet.
-- (Consigné comme amendement, non comme écart : l'architecte est l'autorité
--  au-dessus de la spec ; l'IA n'improvise aucune décision produit.)
--
-- DÉCISION : chaque consentement journalise DEUX informations distinctes.
--   • version        (ex. 'v1.0.0')       → référence documentaire précise,
--                                            pour notre gestion de versions.
--   • effective_date (ex. '2026-07-11')   → date d'entrée en vigueur,
--                                            pour la traçabilité juridique.
--
-- RÈGLE : une version n'est JAMAIS réutilisée. Toute modification du texte
-- entraîne une nouvelle version (v1.0.1 / v1.1.0 / v2.0.0…) ET une nouvelle
-- date d'entrée en vigueur.
--
-- Aucune valeur composite : on maîtrise le schéma, donc deux colonnes propres
-- (requêtables séparément — « qui a consenti sous un texte en vigueur avant
--  telle date ? » doit rester une requête, pas un parsing de chaîne).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. La colonne de date d'entrée en vigueur
-- ---------------------------------------------------------------------
alter table public.consents
  add column if not exists effective_date date;

comment on column public.consents.version is
  'Référence documentaire du texte consenti (ex. v1.0.0). Jamais réutilisée.';
comment on column public.consents.effective_date is
  'Date d''entrée en vigueur du texte consenti (ex. 2026-07-11). Traçabilité juridique / RGPD.';

-- Garde-fou de format : versionnement sémantique préfixé v (v1.0.0, v1.0.1, v2.0.0…).
alter table public.consents
  drop constraint if exists consents_version_format_chk;
alter table public.consents
  add constraint consents_version_format_chk
  check (version ~ '^v[0-9]+\.[0-9]+\.[0-9]+$');

-- L'idempotence (V2) reste garantie par l'index unique (profile_id, type, version)
-- posé au Lot 2 : une version n'étant jamais réutilisée, elle identifie sans
-- ambiguïté le texte consenti. La date d'entrée en vigueur l'accompagne.

-- ---------------------------------------------------------------------
-- 2. Les valeurs en vigueur au lancement (source de vérité unique)
--    ⚠️ À incrémenter à CHAQUE révision d'un texte juridique.
-- ---------------------------------------------------------------------
create or replace function public.consent_default_version()
returns text
language sql
immutable
set search_path = ''
as $$ select 'v1.0.0'::text $$;

create or replace function public.consent_default_effective_date()
returns date
language sql
immutable
set search_path = ''
as $$ select '2026-07-11'::date $$;

comment on function public.consent_default_version() is
  'Version des documents juridiques en vigueur. Filet de sécurité : le client DOIT transmettre la version. Jamais réutilisée.';
comment on function public.consent_default_effective_date() is
  'Date d''entrée en vigueur des documents juridiques. Change à chaque nouvelle version.';

-- ---------------------------------------------------------------------
-- 3. L'émission journalise désormais les DEUX informations
--
-- Contrat de métadonnées au signup (V2) :
--   consents: [
--     { "type": "terms",   "granted": true,
--       "version": "v1.0.0", "effective_date": "2026-07-11" },
--     { "type": "privacy", "granted": true,
--       "version": "v1.0.0", "effective_date": "2026-07-11" }
--   ]
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
  -- L'opus_id est gravé une seule fois : jamais régénéré par un retry.
  insert into public.profiles (id, opus_id, full_name, locale)
  values (p_user_id, public.generate_opus_id(), v_full_name, v_locale)
  on conflict (id) do nothing;

  -- ── 2. Le Passport (ÉMIS) ───────────────────────────────────────────
  if not exists (select 1 from public.passports where profile_id = p_user_id) then
    begin
      insert into public.passports (profile_id, handle, lifecycle_stage, issued_at)
      values (
        p_user_id,
        public.generate_unique_handle(v_full_name),
        'identity_established',
        now()
      )
      on conflict (profile_id) do nothing;
    exception
      when unique_violation then
        insert into public.passports (profile_id, handle, lifecycle_stage, issued_at)
        values (p_user_id, public.generate_unique_handle(v_full_name),
                'identity_established', now())
        on conflict (profile_id) do nothing;
    end;
  end if;

  select id into v_passport_id
  from public.passports
  where profile_id = p_user_id;

  -- ── 3. Le Trust Index (baseline : score NULL, jamais 0/100) ─────────
  if v_passport_id is not null then
    insert into public.trust_index (passport_id, score, state)
    values (v_passport_id, null, 'establishing')
    on conflict (passport_id) do nothing;
  end if;

  -- ── 4. Les consentements (V2) — version ET date d'entrée en vigueur ──
  if jsonb_typeof(p_meta -> 'consents') = 'array' then
    for v_consent in select * from jsonb_array_elements(p_meta -> 'consents')
    loop
      insert into public.consents (
        profile_id, type, granted, version, effective_date, granted_at
      )
      values (
        p_user_id,
        v_consent ->> 'type',
        coalesce((v_consent ->> 'granted')::boolean, false),
        coalesce(nullif(v_consent ->> 'version', ''),
                 public.consent_default_version()),
        coalesce(nullif(v_consent ->> 'effective_date', '')::date,
                 public.consent_default_effective_date()),
        now()
      )
      on conflict (profile_id, type, version) do nothing;
    end loop;
  end if;
end;
$$;

comment on function public.issue_passport(uuid, jsonb) is
  'ÉMISSION du Passport : atomique et idempotente. 4 écritures (profil + passport + trust_index + consentements versionnés et datés). Un retry n''émet JAMAIS deux Passports.';

revoke all on function public.issue_passport(uuid, jsonb)         from public, anon, authenticated;
revoke all on function public.consent_default_version()           from public, anon;
revoke all on function public.consent_default_effective_date()    from public, anon;
