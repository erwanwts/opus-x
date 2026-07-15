-- =====================================================================
-- Opus X — Sprint 2 — LOT O2a : LIAISON D'IDENTITÉ & AUTORISATION D'ISSUER
-- Autorités : SPRINT-002 v1.2 (Lot C0, W5, W6, D9, P3, P4) ·
--             ENG-002 v0.2 §3, §7 · ENG-001 §10.
--
-- PRINCIPE VERROUILLÉ : tout flux permettant à un tiers d'écrire dans un
-- Passport passe OBLIGATOIREMENT par Opus X. Jamais directement, jamais
-- implicitement, jamais par simple connaissance d'un identifiant.
--
-- Le consentement d'émission appartient à OPUS X, jamais à l'Issuer (le
-- Passport appartient au professionnel — seule la Trust Platform peut
-- autoriser quelqu'un à l'alimenter).
--
-- ⚠️ NE PAS CONFONDRE avec `public.consents` (Sprint 1) : celui-ci est le
--    consentement PRODUIT (CGU/confidentialité). `wsp_consent_events` est le
--    consentement d'ÉMISSION par Issuer. Deux objets distincts.
-- =====================================================================

-- =====================================================================
-- wsp_consent_events — le FAIT de consentement, append-only (zone faits).
--   ÉTAT COURANT = le DERNIER événement pour (subject_id, issuer_id).
--   Révoquer = INSÉRER 'revoke'. Aucun état mutable, aucun UPDATE.
--   « On peut cesser d'alimenter un Passport ; on ne peut pas réécrire son
--     histoire. » — devenu contrainte de schéma.
--
--   IDENTITÉ D'ÉMISSION (ENG-002 §7) : consent_seq est l'ordinal du couple
--   (subject, issuer). UNIQUE (subject_id, issuer_id, consent_seq). Forme
--   choisie et justifiée : (a) c'est l'identité d'émission — deux événements
--   ne peuvent occuper la même position ; (b) il donne l'ORDRE TOTAL exigé par
--   « état = dernier événement » (order by consent_seq desc) ; (c) il rend un
--   double-clic idempotent — la contrainte rejette (23505) le second insert
--   d'un même rang, jamais deux faits au même point de l'histoire.
-- =====================================================================
create table if not exists public.wsp_consent_events (
  id                   text        primary key
                       default ('cev_' || public.generate_ulid()),
  subject_id           text        not null references public.profiles(opus_id),
  issuer_id            text        not null references public.wsp_issuers(id),
  action               text        not null check (action in ('grant', 'revoke')),
  consent_text_version text        not null,             -- P4 : versionné
  consent_seq          integer     not null,             -- ordinal du couple (identité d'émission)
  occurred_at          timestamptz not null,
  recorded_at          timestamptz not null default now(),
  unique (subject_id, issuer_id, consent_seq)
);

comment on table public.wsp_consent_events is
  'FAIT de consentement d''émission, append-only (W2). État courant = dernier événement du couple (subject, issuer). Révoquer = insérer ''revoke''. Distinct de public.consents (Sprint 1, consentement produit).';
comment on column public.wsp_consent_events.consent_seq is
  'Ordinal du couple (subject, issuer) — identité d''émission (ENG-002 §7) + ordre total pour « état = dernier événement ».';

create index if not exists wsp_consent_events_couple_idx
  on public.wsp_consent_events(subject_id, issuer_id, consent_seq desc);

-- =====================================================================
-- wsp_issuer_authorizations — le JETON d'autorisation, en HASH uniquement.
--   Le jeton IDENTIFIE le couple (subject, issuer). Il n'AUTORISE PAS à lui
--   seul : l'autorité est le CONSENTEMENT. Révoquer le consentement rend le
--   jeton inerte AUTOMATIQUEMENT (une seule source de vérité, pas de liste de
--   révocation de jetons). Une autorisation par couple ; le grant (re)pose
--   l'empreinte courante (rotation à chaque octroi).
--
--   Ce n'est pas un « fait » WSP mais une infrastructure de credential :
--   mutable (rotation du hash), jamais lisible côté client, jamais en clair.
-- =====================================================================
create table if not exists public.wsp_issuer_authorizations (
  id          text        primary key
              default ('iaz_' || public.generate_ulid()),
  subject_id  text        not null references public.profiles(opus_id),
  issuer_id   text        not null references public.wsp_issuers(id),
  token_hash  text        not null,                       -- SHA-256 hex du jeton — JAMAIS le jeton
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (subject_id, issuer_id),
  unique (token_hash)
);

comment on table public.wsp_issuer_authorizations is
  'Jeton d''autorisation d''un couple (subject, issuer), stocké en HASH uniquement. N''autorise pas à lui seul : l''autorité est le consentement (wsp_consent_events). Aucun accès client.';
comment on column public.wsp_issuer_authorizations.token_hash is
  'SHA-256 hex du jeton. Le jeton en clair n''est JAMAIS stocké ni relu — remis une seule fois à l''Issuer à l''octroi.';

-- ---------------------------------------------------------------------
-- Append-only STRUCTUREL sur le FAIT de consentement (les 3 axes, W2).
-- (wsp_issuer_authorizations est un credential mutable : pas de garde ici.)
-- ---------------------------------------------------------------------
drop trigger if exists wsp_consent_events_no_mutation on public.wsp_consent_events;
create trigger wsp_consent_events_no_mutation
  before update or delete on public.wsp_consent_events
  for each row execute function public.wsp_reject_mutation();

drop trigger if exists wsp_consent_events_no_truncate on public.wsp_consent_events;
create trigger wsp_consent_events_no_truncate
  before truncate on public.wsp_consent_events
  for each statement execute function public.wsp_reject_mutation();

-- ---------------------------------------------------------------------
-- updated_at sur le credential (mutable) — maintenu automatiquement.
-- ---------------------------------------------------------------------
drop trigger if exists wsp_issuer_authorizations_touch on public.wsp_issuer_authorizations;
create trigger wsp_issuer_authorizations_touch
  before update on public.wsp_issuer_authorizations
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- wsp_consent_active(subject, issuer) — état courant = dernier événement.
--   SECURITY DEFINER : lit l'historique en contournant la RLS. RÉSERVÉ au
--   service_role (chemin d'ingestion O2b). NON accordé à authenticated : sinon
--   un utilisateur pourrait sonder le consentement d'AUTRUI (énumération).
-- =====================================================================
create or replace function public.wsp_consent_active(p_subject_id text, p_issuer_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select action = 'grant'
       from public.wsp_consent_events
      where subject_id = p_subject_id and issuer_id = p_issuer_id
      order by consent_seq desc
      limit 1),
    false);
$$;

comment on function public.wsp_consent_active(text, text) is
  'État courant du consentement d''émission = dernier événement du couple. Réservé au service_role (O2b) : jamais à authenticated (anti-énumération).';

revoke all on function public.wsp_consent_active(text, text) from public, anon, authenticated;
grant execute on function public.wsp_consent_active(text, text) to service_role;

-- =====================================================================
-- wsp_authorize_issuer(issuer, consent_text_version, token_hash) — OCTROI.
--   Le sujet est TOUJOURS l'appelant authentifié (current_opus_id) — jamais
--   fourni en paramètre : pas d'appariement (P3), pas d'énumération d'opus_id.
--   Enregistre un fait 'grant' + (re)pose l'empreinte du jeton. SECURITY
--   DEFINER pour écrire dans le fact store append-only sans surface cliente.
-- =====================================================================
create or replace function public.wsp_authorize_issuer(
  p_issuer_id            text,
  p_consent_text_version text,
  p_token_hash           text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_subject text := public.current_opus_id();
  v_seq     integer;
  v_attempt integer;
begin
  if v_subject is null then
    raise exception 'Non authentifié.' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.wsp_issuers where id = p_issuer_id and status = 'active'
  ) then
    -- Réponse uniforme : ne confirme rien de spécifique.
    raise exception 'Autorisation impossible.' using errcode = 'check_violation';
  end if;
  if coalesce(btrim(p_consent_text_version), '') = '' then
    raise exception 'Version de consentement requise.' using errcode = 'check_violation';
  end if;
  if coalesce(btrim(p_token_hash), '') = '' then
    raise exception 'Empreinte de jeton requise.' using errcode = 'check_violation';
  end if;

  -- Prochaine position, avec ré-essai anti-concurrence (double-clic).
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

  -- Jeton : une autorisation par couple ; rotation de l'empreinte à l'octroi.
  insert into public.wsp_issuer_authorizations (subject_id, issuer_id, token_hash)
  values (v_subject, p_issuer_id, p_token_hash)
  on conflict (subject_id, issuer_id)
    do update set token_hash = excluded.token_hash, updated_at = now();

  return jsonb_build_object('opus_id', v_subject, 'state', 'active', 'consent_seq', v_seq);
end;
$$;

comment on function public.wsp_authorize_issuer(text, text, text) is
  'OCTROI : enregistre un fait de consentement ''grant'' pour l''appelant (current_opus_id) + (re)pose l''empreinte du jeton. Sujet dérivé de la session, jamais fourni (P3).';

revoke all on function public.wsp_authorize_issuer(text, text, text) from public, anon;
grant execute on function public.wsp_authorize_issuer(text, text, text) to authenticated;

-- =====================================================================
-- wsp_revoke_issuer(issuer, consent_text_version) — RÉVOCATION.
--   Insère un fait 'revoke'. N'efface AUCUN fait antérieur. Le jeton devient
--   inerte automatiquement (l'état courant passe à 'revoked').
-- =====================================================================
create or replace function public.wsp_revoke_issuer(
  p_issuer_id            text,
  p_consent_text_version text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_subject text := public.current_opus_id();
  v_seq     integer;
  v_attempt integer;
begin
  if v_subject is null then
    raise exception 'Non authentifié.' using errcode = '42501';
  end if;
  if coalesce(btrim(p_consent_text_version), '') = '' then
    raise exception 'Version de consentement requise.' using errcode = 'check_violation';
  end if;

  for v_attempt in 1..5 loop
    select coalesce(max(consent_seq), 0) + 1 into v_seq
    from public.wsp_consent_events
    where subject_id = v_subject and issuer_id = p_issuer_id;

    begin
      insert into public.wsp_consent_events
        (subject_id, issuer_id, action, consent_text_version, consent_seq, occurred_at)
      values (v_subject, p_issuer_id, 'revoke', p_consent_text_version, v_seq, now());
      exit;
    exception when unique_violation then
      if v_attempt = 5 then raise; end if;
    end;
  end loop;

  return jsonb_build_object('opus_id', v_subject, 'state', 'revoked', 'consent_seq', v_seq);
end;
$$;

comment on function public.wsp_revoke_issuer(text, text) is
  'RÉVOCATION : insère un fait ''revoke'' pour l''appelant. N''efface aucun fait ; le jeton devient inerte (état courant = revoked).';

revoke all on function public.wsp_revoke_issuer(text, text) from public, anon;
grant execute on function public.wsp_revoke_issuer(text, text) to authenticated;

-- =====================================================================
-- RLS — le sujet lit SES consentements ; personne d'autre.
--   Écriture : uniquement via les RPC security definer (aucune policy DML).
--   wsp_issuer_authorizations : AUCUN accès client (credential serveur).
-- =====================================================================
alter table public.wsp_consent_events        enable row level security;
alter table public.wsp_issuer_authorizations enable row level security;

drop policy if exists "wsp_consent_events_select_subject" on public.wsp_consent_events;
create policy "wsp_consent_events_select_subject"
  on public.wsp_consent_events for select to authenticated
  using (subject_id = public.current_opus_id());

-- wsp_issuer_authorizations : aucune policy → deny by default (même authenticated).

revoke all on public.wsp_consent_events        from anon, authenticated;
revoke all on public.wsp_issuer_authorizations from anon, authenticated;

-- Le sujet lit ses consentements (la RLS restreint les lignes ; anon rien).
grant select on public.wsp_consent_events to authenticated;
-- Aucun grant sur wsp_issuer_authorizations : le token_hash n'est jamais lisible côté client.
