-- =====================================================================
-- Opus X — Sprint 2 — LOT O2a-EXT : LE CANAL DU JETON (échange de code)
-- Autorités : SPRINT-002 Lot C0 (« type OAuth / Stripe Connect ») · ARCH-001.
--
-- PRINCIPE VERROUILLÉ : tout flux permettant à un tiers d'écrire dans un
-- Passport passe par Opus X — jamais par simple connaissance d'un identifiant.
--
-- LE PROBLÈME CORRIGÉ : /api/link/authorize renvoyait le JETON au navigateur
-- du professionnel (copiable, journalisable, rejouable). Le modèle
-- d'autorisation d'O2a était irréprochable, livré par un canal qui l'annulait.
--
-- LA CORRECTION : échange de code, serveur à serveur.
--   authorize renvoie un CODE d'échange (usage unique, ≤60 s, sans pouvoir
--   propre). L'Issuer échange le code + SON HMAC contre le jeton, par un canal
--   arrière. Aucune surface ne renvoie plus jamais un jeton au navigateur.
--
-- ⚠️ NE TOUCHE PAS wsp_consent_events (append-only, déjà clos).
-- Dépendance : pgcrypto (hmac/digest). Supabase : schéma `extensions`.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- =====================================================================
-- redirect_uri ENREGISTRÉ de l'Issuer (le callback autorisé, une seule valeur).
--   Le code d'échange n'est JAMAIS renvoyé en JSON : /api/link/authorize
--   redirige (302) vers {redirect_uri}?code=…&state=…. Un redirect_uri non
--   enregistré est refusé — c'est ce qui empêche un site tiers de capter le
--   retour. Ajout par ALTER (DDL, métadonnée) : append-only non déclenché,
--   fixé à l'INSCRIPTION de l'Issuer (une évolution est une réinscription).
-- =====================================================================
alter table public.wsp_issuers
  add column if not exists redirect_uri text;

comment on column public.wsp_issuers.redirect_uri is
  'Callback OAuth ENREGISTRÉ de l''Issuer. /api/link/authorize ne redirige (302) que vers cette valeur exacte — jamais un JSON, jamais une URL non enregistrée.';

-- =====================================================================
-- wsp_exchange_codes — le CODE d'échange (credential, PAS un fait).
--   Usage unique, courte durée, lié au triplet (subject, issuer, consent_seq).
--   Stocké en HASH. Sans pouvoir propre : il n'autorise aucune écriture ; il
--   ne sert qu'à obtenir le jeton, une fois, par le canal arrière HMAC.
--   Zone MUTABLE (il doit pouvoir mourir) → jamais dans le fact store.
-- =====================================================================
create table if not exists public.wsp_exchange_codes (
  id          text        primary key default ('xcode_' || public.generate_ulid()),
  code_hash   text        not null unique,               -- SHA-256 hex du code
  subject_id  text        not null references public.profiles(opus_id),
  issuer_id   text        not null references public.wsp_issuers(id),
  consent_seq integer     not null,                       -- le grant auquel le code est lié
  expires_at  timestamptz not null,
  consumed_at timestamptz,                                -- NULL tant que non consommé
  created_at  timestamptz not null default now()
);

comment on table public.wsp_exchange_codes is
  'Code d''échange (credential, usage unique, ≤60 s). Sans pouvoir propre : ne sert qu''à obtenir le jeton une fois par canal arrière HMAC. Stocké en hash. Zone mutable (doit pouvoir mourir), jamais un fait.';

create index if not exists wsp_exchange_codes_lookup_idx
  on public.wsp_exchange_codes(code_hash, issuer_id);

-- =====================================================================
-- wsp_issuer_secrets — le secret HMAC partagé d'un Issuer (serveur uniquement).
--   Symétrique (nécessaire pour recalculer le HMAC). Jamais lisible côté
--   client : RLS deny total, aucun grant. Seule une fonction SECURITY DEFINER
--   le lit, pour vérifier une signature. Mutable (rotation).
-- =====================================================================
create table if not exists public.wsp_issuer_secrets (
  issuer_id   text        primary key references public.wsp_issuers(id),
  hmac_secret text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.wsp_issuer_secrets is
  'Secret HMAC partagé d''un Issuer (symétrique). Serveur uniquement : RLS deny total, aucun grant. Lu seulement par wsp_exchange_code (SECURITY DEFINER) pour vérifier une signature.';

-- ---------------------------------------------------------------------
-- Append-only PAS ici (credentials mutables) — mais updated_at maintenu.
-- ---------------------------------------------------------------------
drop trigger if exists wsp_issuer_secrets_touch on public.wsp_issuer_secrets;
create trigger wsp_issuer_secrets_touch
  before update on public.wsp_issuer_secrets
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- wsp_ct_eq(a, b) — comparaison à TEMPS CONSTANT (anti-timing).
--   OR-accumule les différences sur toute la longueur : le temps ne dépend
--   pas de la position de la première divergence. La longueur (64 hex) n'est
--   pas secrète, un court-circuit sur longueur est acceptable.
-- =====================================================================
create or replace function public.wsp_ct_eq(a text, b text)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  d  integer := 0;
  i  integer;
  la integer := length(a);
begin
  if a is null or b is null or la <> length(b) then
    return false;
  end if;
  for i in 1..la loop
    d := d | (ascii(substr(a, i, 1)) # ascii(substr(b, i, 1)));
  end loop;
  return d = 0;
end;
$$;

revoke all on function public.wsp_ct_eq(text, text) from public, anon, authenticated;

-- =====================================================================
-- wsp_authorize_issuer — REFONTE : mint un CODE, plus jamais un jeton.
--   Enregistre le fait de consentement 'grant' (comme avant) PUIS émet un code
--   d'échange lié à ce grant. NE touche PLUS wsp_issuer_authorizations (le
--   jeton est minté à l'échange). Le sujet vient de la session (P3).
-- =====================================================================
-- RESTRICT explicite : le drop échoue si quoi que ce soit dépend de la
-- fonction (jamais de cascade). Il n'emporte que la fonction 3-args et son ACL.
drop function if exists public.wsp_authorize_issuer(text, text, text) restrict;

create or replace function public.wsp_authorize_issuer(
  p_issuer_id            text,
  p_consent_text_version text,
  p_code_hash            text,
  p_redirect_uri         text,
  p_ttl_seconds          integer default 60
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_subject    text := public.current_opus_id();
  v_registered text;
  v_seq        integer;
  v_attempt    integer;
  v_ttl        integer;
  v_expires    timestamptz;
begin
  if v_subject is null then
    raise exception 'Non authentifié.' using errcode = '42501';
  end if;

  -- Issuer actif + redirect_uri ENREGISTRÉ qui correspond EXACTEMENT (avant tout
  -- enregistrement de grant : un redirect_uri non conforme n'écrit rien).
  select redirect_uri into v_registered
  from public.wsp_issuers
  where id = p_issuer_id and status = 'active';

  if v_registered is null
     or coalesce(btrim(p_redirect_uri), '') = ''
     or v_registered <> p_redirect_uri then
    raise exception 'Autorisation impossible.' using errcode = 'check_violation';
  end if;

  if coalesce(btrim(p_consent_text_version), '') = '' then
    raise exception 'Version de consentement requise.' using errcode = 'check_violation';
  end if;
  if coalesce(btrim(p_code_hash), '') = '' then
    raise exception 'Empreinte de code requise.' using errcode = 'check_violation';
  end if;

  -- TTL borné : 1..60 s. Un code d'échange se consomme en sub-seconde ; 60 s
  -- couvre largement la latence réseau/redirection tout en minimisant la
  -- fenêtre de rejeu (front-channel → le plus court raisonnable).
  v_ttl := least(greatest(coalesce(p_ttl_seconds, 60), 1), 60);

  -- Fait de consentement 'grant' (identité d'émission = consent_seq).
  for v_attempt in 1..5 loop
    select coalesce(max(consent_seq), 0) + 1 into v_seq
    from public.wsp_consent_events
    where subject_id = v_subject and issuer_id = p_issuer_id;
    begin
      insert into public.wsp_consent_events
        (subject_id, issuer_id, action, consent_text_version, consent_seq, occurred_at)
      values (v_subject, p_issuer_id, 'grant', p_consent_text_version, v_seq, now());
      exit;
    exception when unique_violation then
      if v_attempt = 5 then raise; end if;
    end;
  end loop;

  v_expires := now() + make_interval(secs => v_ttl);

  insert into public.wsp_exchange_codes (code_hash, subject_id, issuer_id, consent_seq, expires_at)
  values (p_code_hash, v_subject, p_issuer_id, v_seq, v_expires);

  return jsonb_build_object(
    'opus_id',     v_subject,
    'consent_seq', v_seq,
    'state',       'active',
    'expires_at',  v_expires
  );
end;
$$;

comment on function public.wsp_authorize_issuer(text, text, text, text, integer) is
  'OCTROI : valide le redirect_uri enregistré, enregistre le consentement ''grant'', émet un CODE d''échange (≤60 s). Ne mint JAMAIS le jeton (fait à l''échange). Sujet dérivé de la session (P3).';

revoke all on function public.wsp_authorize_issuer(text, text, text, text, integer) from public, anon;
grant execute on function public.wsp_authorize_issuer(text, text, text, text, integer) to authenticated;

-- =====================================================================
-- wsp_exchange_code — L'ÉCHANGE, serveur à serveur (canal arrière).
--   L'Issuer présente : le code (clair) + horodatage + signature HMAC.
--   Opus X vérifie, DANS CET ORDRE, tout échec renvoyant la MÊME exception
--   (indifférenciée — aucune énumération) :
--     1. l'Issuer a un secret (authentifié)
--     2. horodatage frais (anti-rejeu ±300 s)
--     3. signature HMAC valide (comparaison temps constant)
--     4. code présent, non expiré, non consommé, ET appartenant à CET Issuer
--        → CONSOMMÉ ATOMIQUEMENT (UPDATE ... WHERE consumed_at IS NULL) :
--          une seule requête concurrente gagne
--     5. consentement ACTIF (révoqué entre octroi et échange → refus)
--   Sur succès : mint le jeton (empreinte) et le renvoie une fois.
-- =====================================================================
create or replace function public.wsp_exchange_code(
  p_issuer_id  text,
  p_timestamp  text,
  p_code       text,
  p_signature  text,
  p_token_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_secret   text;
  v_expected text;
  v_now      bigint := floor(extract(epoch from now()))::bigint;
  v_ts       bigint;
  v_code_hash text;
  v_subject  text;
  v_seq      integer;
  -- Une SEULE exception pour TOUS les échecs : indifférenciée (anti-énumération).
  c_fail     constant text := 'exchange_failed';
begin
  -- 1. Authentification : l'Issuer possède un secret.
  select hmac_secret into v_secret from public.wsp_issuer_secrets where issuer_id = p_issuer_id;
  if v_secret is null then
    raise exception '%', c_fail using errcode = '28000';
  end if;

  -- 2. Fraîcheur de l'horodatage.
  begin
    v_ts := p_timestamp::bigint;
  exception when others then
    raise exception '%', c_fail using errcode = '28000';
  end;
  if abs(v_now - v_ts) > 300 then
    raise exception '%', c_fail using errcode = '28000';
  end if;

  -- 3. Signature HMAC (temps constant).
  v_expected := encode(extensions.hmac(p_timestamp || '.' || p_code, v_secret, 'sha256'), 'hex');
  if not public.wsp_ct_eq(v_expected, lower(coalesce(p_signature, ''))) then
    raise exception '%', c_fail using errcode = '28000';
  end if;

  -- 4. Consommation ATOMIQUE du code, lié à CET Issuer, non expiré, non consommé.
  v_code_hash := encode(extensions.digest(p_code, 'sha256'), 'hex');
  update public.wsp_exchange_codes
     set consumed_at = now()
   where code_hash   = v_code_hash
     and issuer_id   = p_issuer_id       -- le code d'un autre Issuer ne matche pas
     and consumed_at is null
     and expires_at  > now()
  returning subject_id, consent_seq into v_subject, v_seq;
  if not found then
    raise exception '%', c_fail using errcode = '28000';
  end if;

  -- 5. Consentement toujours ACTIF (révocation entre octroi et échange → refus).
  if not public.wsp_consent_active(v_subject, p_issuer_id) then
    raise exception '%', c_fail using errcode = '28000';
  end if;

  -- Succès : mint le jeton (empreinte), une autorisation par couple.
  insert into public.wsp_issuer_authorizations (subject_id, issuer_id, token_hash)
  values (v_subject, p_issuer_id, p_token_hash)
  on conflict (subject_id, issuer_id)
    do update set token_hash = excluded.token_hash, updated_at = now();

  return jsonb_build_object('opus_id', v_subject);
end;
$$;

comment on function public.wsp_exchange_code(text, text, text, text, text) is
  'ÉCHANGE canal arrière : code + HMAC de l''Issuer → jeton, minté une fois. Consommation atomique (une seule requête concurrente gagne). Tout échec = même exception (indifférenciée).';

revoke all on function public.wsp_exchange_code(text, text, text, text, text) from public;
-- Appelable sans session (l'Issuer n'est pas un utilisateur Supabase) — la
-- sécurité est le HMAC vérifié À L'INTÉRIEUR, pas l'appartenance d'un rôle.
grant execute on function public.wsp_exchange_code(text, text, text, text, text) to anon, authenticated;

-- =====================================================================
-- RLS — credentials : aucun accès client.
-- =====================================================================
alter table public.wsp_exchange_codes enable row level security;
alter table public.wsp_issuer_secrets enable row level security;
-- Aucune policy → deny by default (même authenticated). Aucun grant.
revoke all on public.wsp_exchange_codes from anon, authenticated;
revoke all on public.wsp_issuer_secrets from anon, authenticated;
