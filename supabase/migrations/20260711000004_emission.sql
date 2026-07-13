-- =====================================================================
-- Opus X — Sprint 1 — LOT 4 : ÉMISSION IDEMPOTENTE DU PASSPORT
-- Source d'autorité : spec figée §3.5, §3.11, §5.4 — package §0.4 (V1/V2/V3)
--
-- Le Passport n'est pas créé : il est ÉMIS.
-- L'émission est ATOMIQUE (4 écritures) et IDEMPOTENTE (un retry n'émet
-- JAMAIS deux Passports — la forge de l'écran 5 s'appuie sur cette garantie).
--
-- LES TROIS VIGILANCES, CÂBLÉES ICI :
--   V1 — Aucune émission avant vérification RÉELLE de l'email
--        → garde WHEN (new.email_confirmed_at is not null) sur le trigger.
--   V2 — Consentements pré-profil transportés (métadonnées de signup)
--        → lus depuis raw_user_meta_data, journalisés idempotemment.
--   V3 — Signal serveur de complétude
--        → RPC finalize_emission() : ne renvoie complete=true QUE si les
--          4 écritures existent. La cérémonie l'attend avant d'afficher
--          « Identity Successfully Established ».
-- =====================================================================

-- ---------------------------------------------------------------------
-- Contrat de métadonnées attendu au signup (V2)
-- supabase.auth.signUp({ email, password, options: { data: {
--    full_name: 'Marie Dubois',
--    locale:    'fr',
--    consents: [
--      { "type": "terms",   "granted": true, "version": "1.0" },
--      { "type": "privacy", "granted": true, "version": "1.0" }
--    ]
-- }}})
-- ---------------------------------------------------------------------

-- Version des documents légaux si non transmise par le client.
-- ⚠️ DÉCISION À CONFIRMER (voir rapport STOP) : chaîne de version des CGU /
-- Politique de confidentialité en vigueur au lancement.
create or replace function public.consent_default_version()
returns text
language sql
immutable
set search_path = ''
as $$ select '1.0'::text $$;

-- ---------------------------------------------------------------------
-- issue_passport(user_id, meta) — L'ÉMISSION
-- Atomique (une transaction) et idempotente (on conflict do nothing).
-- Appelée par le trigger (V1) et, en filet de sécurité, par finalize_emission().
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
  'ÉMISSION du Passport : atomique et idempotente. 4 écritures (profil + passport + trust_index + consentements). Un retry n''émet JAMAIS deux Passports.';

-- ---------------------------------------------------------------------
-- handle_new_user() — le déclencheur d'émission
-- V1 : ne s'exécute QUE si l'email est réellement confirmé.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- V1 — garde absolue : aucune émission pour une identité non vérifiée.
  if new.email_confirmed_at is null then
    return new;
  end if;

  begin
    perform public.issue_passport(new.id, coalesce(new.raw_user_meta_data, '{}'::jsonb));
  exception
    when others then
      -- On ne bloque JAMAIS l'authentification si l'émission échoue.
      -- Le filet de sécurité est finalize_emission() (V3), qui rattrapera :
      -- la cérémonie n'affichera pas « Identity Successfully Established »
      -- tant que les 4 écritures ne sont pas confirmées.
      raise warning 'Opus X — émission différée pour % : %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

comment on function public.handle_new_user() is
  'V1 — Émission déclenchée UNIQUEMENT à la confirmation réelle de l''email (email_confirmed_at renseigné).';

-- Le trigger couvre les deux chemins de confirmation :
--  • INSERT déjà confirmé (ex. auto-confirm, provider OAuth vérifié)
--  • UPDATE posant email_confirmed_at (parcours magic link / double opt-in)
drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after insert or update of email_confirmed_at on auth.users
  for each row
  when (new.email_confirmed_at is not null)
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- finalize_emission() — LE SIGNAL SERVEUR (V3)
--
-- Appelée par la cérémonie (écran 5). Elle :
--   1. rattrape une émission incomplète (idempotent — filet de sécurité) ;
--   2. VÉRIFIE que les 4 écritures existent ;
--   3. ne renvoie complete = true QUE si tout est cohérent.
--
-- La ligne « Identity Successfully Established » n'apparaît qu'après un
-- complete = true. Si le serveur est lent, l'animation TIENT.
-- ---------------------------------------------------------------------
create or replace function public.finalize_emission()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id   uuid := (select auth.uid());
  v_email_ok  boolean;
  v_meta      jsonb;
  v_result    jsonb;
begin
  if v_user_id is null then
    raise exception 'Non authentifié.' using errcode = '42501';
  end if;

  -- V1 — vérification serveur : l'email est-il réellement confirmé ?
  select (u.email_confirmed_at is not null), coalesce(u.raw_user_meta_data, '{}'::jsonb)
    into v_email_ok, v_meta
  from auth.users u
  where u.id = v_user_id;

  if not coalesce(v_email_ok, false) then
    return jsonb_build_object(
      'complete', false,
      'reason',   'email_not_verified'
    );
  end if;

  -- Filet de sécurité idempotent : si le trigger a échoué, on émet ici.
  perform public.issue_passport(v_user_id, v_meta);

  -- V3 — vérification des 4 écritures. complete=true seulement si TOUT existe.
  select jsonb_build_object(
           'complete', (
                pr.id is not null
            and pa.id is not null
            and ti.passport_id is not null
            and c.consent_count > 0
           ),
           'opus_id',         pr.opus_id,
           'handle',          pa.handle,
           'lifecycle_stage', pa.lifecycle_stage,
           'issued_at',       pa.issued_at,
           'trust_state',     ti.state,
           'checks', jsonb_build_object(
             'profile',    pr.id is not null,
             'passport',   pa.id is not null,
             'trust_index',ti.passport_id is not null,
             'consents',   c.consent_count > 0
           )
         )
    into v_result
  from public.profiles pr
  left join public.passports   pa on pa.profile_id = pr.id
  left join public.trust_index ti on ti.passport_id = pa.id
  left join lateral (
    select count(*) as consent_count
    from public.consents cc
    where cc.profile_id = pr.id and cc.granted = true
  ) c on true
  where pr.id = v_user_id;

  return coalesce(v_result, jsonb_build_object('complete', false, 'reason', 'not_issued'));
end;
$$;

comment on function public.finalize_emission() is
  'V3 — Signal serveur de complétude. complete=true UNIQUEMENT si les 4 écritures existent (profil + passport + trust_index + consentements). La cérémonie attend ce signal.';

-- ---------------------------------------------------------------------
-- Grants — least privilege
-- ---------------------------------------------------------------------
revoke all on function public.issue_passport(uuid, jsonb) from public, anon, authenticated;
revoke all on function public.handle_new_user()           from public, anon, authenticated;
revoke all on function public.consent_default_version()   from public, anon;

-- Seul l'utilisateur authentifié peut demander la finalisation de SA propre émission.
grant execute on function public.finalize_emission() to authenticated;
