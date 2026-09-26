-- =====================================================================
-- Opus X — Sprint 2 — T-A : TOKENS DE PARTAGE DU PASSEPORT (D-058→D-062)
-- =====================================================================
-- Consultation par token (capability URL). Le sujet génère un lien tokenisé
-- qui révèle son passeport à qui le détient (D-058/D-T1), et peut le révoquer.
--
--   • Le token en clair n'est JAMAIS stocké : seul son sha256 (token_hash).
--     Généré EN BASE (gen_random_bytes, CSPRNG) + hashé ; renvoyé UNE seule
--     fois par la RPC. Même sémantique que generateLinkToken/hashLinkToken
--     (256 bits d'aléa, sha256 hex), mais en base pour un retour atomique.
--   • MVP : 1 token stable UNIQUE par passeport (D-059) — index unique partiel
--     sur les actifs. generate ROTE (révoque l'actif, en émet un neuf).
--   • Révocation (D-062) : revoked_at ; active ⟺ revoked_at IS NULL ;
--     revoke idempotent.
--   • Sujet = SESSION (P3) : jamais fourni. RLS owner-scopé ; écriture via RPC.
--
-- La RÉSOLUTION (resolve_share_token) et la route publique sont en T-B.
-- Idempotent. STAGING d'abord, jamais prod.
-- =====================================================================

create table if not exists public.passport_share_tokens (
  id          text        primary key default ('pst_' || public.generate_ulid()),
  passport_id uuid        not null references public.passports(id) on delete cascade,
  token_hash  text        not null,                 -- sha256(token) hex — JAMAIS le token en clair
  created_at  timestamptz not null default now(),
  revoked_at  timestamptz,                          -- NULL = actif
  unique (token_hash)
);

comment on table public.passport_share_tokens is
  'Tokens de partage (capability URL, D-058) : (passport) → token révélant les compétences PUBLIÉES à qui détient le lien. Le token en clair n''est jamais stocké (seul token_hash = sha256). active ⟺ revoked_at IS NULL. MVP : 1 actif par passeport (D-059).';
comment on column public.passport_share_tokens.token_hash is
  'sha256 hex du token. Le token en clair n''est JAMAIS stocké ni relu — remis une seule fois à la génération.';

-- MVP D-059 : au plus UN token actif par passeport.
create unique index if not exists passport_share_tokens_one_active_idx
  on public.passport_share_tokens(passport_id) where revoked_at is null;

-- =====================================================================
-- generate_share_token() — GÉNÉRER (rote). Sujet = session (P3).
--   Révoque l'actif éventuel, émet un token neuf (aléa en base), stocke le
--   HASH, renvoie le token EN CLAIR une seule fois.
-- =====================================================================
create or replace function public.generate_share_token()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user     uuid := (select auth.uid());
  v_passport uuid;
  v_token    text;
  v_hash     text;
  v_id       text;
begin
  if v_user is null then
    raise exception 'Non authentifié.' using errcode = '42501';
  end if;

  select pa.id into v_passport
  from public.passports pa
  join public.profiles pr on pr.id = pa.profile_id
  where pr.id = v_user;
  if v_passport is null then
    raise exception 'Aucun Passeport.' using errcode = 'check_violation';
  end if;

  -- Rotation : l'actif éventuel devient inactif (MVP 1 token stable).
  update public.passport_share_tokens
     set revoked_at = now()
   where passport_id = v_passport and revoked_at is null;

  -- Token neuf : 256 bits d'aléa (CSPRNG), URL-safe (hex). Hash seul stocké.
  v_token := 'wsps_' || encode(extensions.gen_random_bytes(32), 'hex');
  v_hash  := encode(extensions.digest(v_token, 'sha256'), 'hex');

  insert into public.passport_share_tokens (passport_id, token_hash)
  values (v_passport, v_hash)
  returning id into v_id;

  -- Le token EN CLAIR n'est renvoyé QU'ICI, une seule fois.
  return jsonb_build_object('share_token', v_token, 'token_id', v_id, 'status', 'active');
end;
$$;

comment on function public.generate_share_token() is
  'GÉNÈRE un token de partage (D-058/D-062) : rote l''actif, émet un token neuf (aléa en base), stocke le sha256, renvoie le token EN CLAIR une seule fois. Sujet = session (P3).';

revoke all on function public.generate_share_token() from public, anon;
grant execute on function public.generate_share_token() to authenticated;

-- =====================================================================
-- revoke_share_token() — RÉVOQUER (idempotent). Sujet = session (P3).
-- =====================================================================
create or replace function public.revoke_share_token()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user     uuid := (select auth.uid());
  v_passport uuid;
  v_count    integer;
begin
  if v_user is null then
    raise exception 'Non authentifié.' using errcode = '42501';
  end if;

  select pa.id into v_passport
  from public.passports pa
  join public.profiles pr on pr.id = pa.profile_id
  where pr.id = v_user;
  if v_passport is null then
    raise exception 'Aucun Passeport.' using errcode = 'check_violation';
  end if;

  update public.passport_share_tokens
     set revoked_at = now()
   where passport_id = v_passport and revoked_at is null;
  get diagnostics v_count = row_count;

  -- Idempotent : aucun actif → rien à faire, pas d'erreur.
  return jsonb_build_object('revoked', v_count, 'status', 'revoked');
end;
$$;

comment on function public.revoke_share_token() is
  'RÉVOQUE le token de partage actif du sujet (D-062). Idempotent : aucun actif → no-op. Sujet = session (P3).';

revoke all on function public.revoke_share_token() from public, anon;
grant execute on function public.revoke_share_token() to authenticated;

-- =====================================================================
-- RLS — le sujet lit SES tokens (métadonnées : existence/date/état, jamais le
-- clair qui n'existe pas en base). Écriture uniquement via les RPC. anon : rien.
-- =====================================================================
alter table public.passport_share_tokens enable row level security;

drop policy if exists "passport_share_tokens_select_owner" on public.passport_share_tokens;
create policy "passport_share_tokens_select_owner"
  on public.passport_share_tokens for select to authenticated
  using (exists (
    select 1 from public.passports pa
    join public.profiles pr on pr.id = pa.profile_id
    where pa.id = passport_share_tokens.passport_id
      and pr.id = (select auth.uid())
  ));

revoke all on public.passport_share_tokens from anon, authenticated;
grant select on public.passport_share_tokens to authenticated; -- la RLS restreint au propriétaire

-- ════════════════════════════════════════════════════════
-- POST-MIGRATION VERIFICATIONS
-- ════════════════════════════════════════════════════════
-- 1. Table + index unique partiel (1 actif/passeport) :
--    select indexname from pg_indexes where tablename='passport_share_tokens';
-- 2. Fonctions présentes :
--    select proname from pg_proc where proname in ('generate_share_token','revoke_share_token'); → 2
-- 3. Générer → 1 clair une fois + hash stocké ; révoquer → inactif : test O-T-A (staging).
