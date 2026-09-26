-- =====================================================================
-- Opus X — D-064 : redirect_uri d'émetteur = FAIT VERSIONNÉ append-only
-- =====================================================================
-- Résout D-057. wsp_issuers est append-only (wsp_issuers_no_mutation,
-- 20260713000002) : UPDATE/DELETE interdits (23001), tous rôles inclus. Une
-- ligne née avec redirect_uri NULL ne peut donc PLUS être corrigée par UPDATE.
--
-- DÉCISION D-064 : le redirect_uri devient un FAIT VERSIONNÉ (append-only) —
-- « une évolution est une NOUVELLE version, jamais une mutation ». État courant
-- = DERNIER événement du couple (issuer). wsp_issuers.redirect_uri reste en
-- LECTURE DE REPLI (rétro-compat) tant qu'aucun événement n'existe.
--
-- N'DÉPEND PAS de 20260926000007 (Phase-3 kid). Idempotent. STAGING d'abord,
-- JAMAIS prod (l'INSERT du vrai callback en prod est une opération manuelle).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Table : fait versionné du redirect_uri. INSERT only (append-only).
-- Contrôle de forme : https:// (ou http://localhost pour le dev), sans espace.
-- ---------------------------------------------------------------------
create table if not exists public.wsp_issuer_redirect_events (
  id           text        primary key default ('ire_' || public.generate_ulid()),
  issuer_id    text        not null references public.wsp_issuers(id),
  redirect_uri text        not null
               -- Forme stricte : https://<hôte>/… OU http://localhost[:port]/… , sans espace.
               -- `like 'http://localhost%'` acceptait http://localhost.evil.com — corrigé.
               check (
                 (redirect_uri ~ '^https://[^\s/]+/'
                  or redirect_uri ~ '^http://localhost(:[0-9]{1,5})?/')
                 and redirect_uri !~ '\s'
               ),
  seq          integer     not null,               -- ordinal par émetteur ; état courant = max(seq)
  occurred_at  timestamptz not null default now(),
  recorded_at  timestamptz not null default now(),
  unique (issuer_id, seq)
);

comment on table public.wsp_issuer_redirect_events is
  'Fait VERSIONNÉ du redirect_uri d''un émetteur (D-064, résout D-057). Append-only : changer = INSÉRER une nouvelle version. État courant = dernier événement (max seq). Repli : wsp_issuers.redirect_uri si aucun événement. Écriture service_role uniquement.';

create index if not exists wsp_issuer_redirect_events_couple_idx
  on public.wsp_issuer_redirect_events(issuer_id, seq desc);

-- ---------------------------------------------------------------------
-- Append-only STRUCTUREL (les 3 axes, comme la zone faits W2).
-- ---------------------------------------------------------------------
drop trigger if exists wsp_issuer_redirect_events_no_mutation on public.wsp_issuer_redirect_events;
create trigger wsp_issuer_redirect_events_no_mutation
  before update or delete on public.wsp_issuer_redirect_events
  for each row execute function public.wsp_reject_mutation();

drop trigger if exists wsp_issuer_redirect_events_no_truncate on public.wsp_issuer_redirect_events;
create trigger wsp_issuer_redirect_events_no_truncate
  before truncate on public.wsp_issuer_redirect_events
  for each statement execute function public.wsp_reject_mutation();

-- ---------------------------------------------------------------------
-- RLS activé, AUCUNE policy → deny by default. Écriture/lecture client
-- interdites ; seul service_role/postgres (qui bypasse la RLS) INSÈRE.
-- ---------------------------------------------------------------------
alter table public.wsp_issuer_redirect_events enable row level security;
revoke all on public.wsp_issuer_redirect_events from anon, authenticated;
-- (aucun grant, aucune policy : anon/authenticated ne lisent ni n'écrivent.)

-- =====================================================================
-- wsp_authorize_issuer (MÊME signature 5-arg — create or replace, PAS de
-- surcharge). Seul changement : le redirect_uri COURANT = dernier événement
-- versionné (D-064), sinon repli sur wsp_issuers.redirect_uri. Garde
-- fail-closed conservée (NULL → refus). Le reste est VERBATIM (20260713000004).
-- =====================================================================
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

  -- Issuer actif (préservé).
  if not exists (
    select 1 from public.wsp_issuers where id = p_issuer_id and status = 'active'
  ) then
    raise exception 'Autorisation impossible.' using errcode = 'check_violation';
  end if;

  -- redirect_uri COURANT = dernier événement versionné (D-064) ; repli sur la
  -- colonne wsp_issuers.redirect_uri (rétro-compat) si aucun événement.
  select redirect_uri into v_registered
  from public.wsp_issuer_redirect_events
  where issuer_id = p_issuer_id
  order by seq desc
  limit 1;
  if v_registered is null then
    select redirect_uri into v_registered
    from public.wsp_issuers
    where id = p_issuer_id and status = 'active';
  end if;

  -- Garde EXACTE (fail-closed) : NULL / vide / non conforme → refus, rien d'écrit.
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
  'OCTROI : redirect_uri COURANT = dernier événement wsp_issuer_redirect_events (D-064), sinon repli wsp_issuers.redirect_uri ; correspondance EXACTE, fail-closed. Enregistre le consentement ''grant'', émet un CODE (≤60 s). Sujet dérivé de la session (P3).';

-- Grants inchangés (create or replace les préserve ; on ne recrée pas de surcharge).

-- ════════════════════════════════════════════════════════
-- POST-MIGRATION VERIFICATIONS
-- ════════════════════════════════════════════════════════
-- 1. Table + append-only :
--    select to_regclass('public.wsp_issuer_redirect_events');   -- non NULL
--    select tgname from pg_trigger where tgrelid='public.wsp_issuer_redirect_events'::regclass
--      and not tgisinternal;   -- 2 (no_mutation, no_truncate)
-- 2. AUCUNE surcharge créée par 000008 (create-or-replace de la 5-arg seule) :
--    select count(*) from pg_proc where proname='wsp_authorize_issuer';   -- INCHANGÉ
--    Sur staging il y en a DEUX (4-arg orpheline (text,text,text,integer) SANS
--    redirect_uri, dérive hors dépôt + 5-arg). 000008 laisse ce compte à 2→2 ;
--    l'orpheline est retirée par une migration DÉDIÉE (D-065), pas ici.
-- 3. Comportements (repli / événement / refus mutation / refus anon) : test staging.
