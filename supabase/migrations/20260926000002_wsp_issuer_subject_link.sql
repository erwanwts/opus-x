-- =====================================================================
-- Opus X — Sprint 2 — O-C : TABLE DE LIAISON ISSUER ↔ OPUS (D-053)
-- =====================================================================
-- Décision D-053 : le reliage student ↔ opus ↔ passport est matérialisé des
-- DEUX côtés, mais OPUS X est AUTORITAIRE. Ici, la carte de vérité : le couple
-- (issuer_id, external_subject_id) — p.ex. (issuer:wts-001, student_id)
-- — résout vers EXACTEMENT UN opus_id. C'est le reliage provisoire de D-047,
-- matérialisé.
--
-- L'AUTORITÉ = l'unicité (issuer_id, external_subject_id) qui MORD : une fois le
-- couple relié à un opus, l'Issuer ne peut PAS le repointer vers un autre sujet.
-- Le sujet est TOUJOURS dérivé de la session (current_opus_id, P3) — jamais
-- fourni ; l'Issuer ne fournit que SON identifiant externe, jamais l'opus_id.
--
-- Ce n'est pas un « fait » WSP (zone W2 append-only) mais une INFRASTRUCTURE de
-- résolution, comme wsp_issuer_authorizations : mutable techniquement (touch),
-- mais le mapping (issuer, external_subject)→opus est verrouillé par la
-- contrainte. Aucune lecture cliente d'autrui (anti-énumération).
--
-- Idempotent : create table if not exists, create or replace, drop policy if
-- exists. Rejouable sans effet de bord. STAGING d'abord, jamais prod.
-- =====================================================================

create table if not exists public.wsp_issuer_subject_links (
  id                  text        primary key
                      default ('isl_' || public.generate_ulid()),
  issuer_id           text        not null references public.wsp_issuers(id),
  external_subject_id text        not null,             -- l'id du sujet CHEZ l'Issuer (ex. student_id)
  opus_id             text        not null references public.profiles(opus_id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  -- L'AUTORITÉ : un couple (issuer, external_subject) → un seul opus. MORD.
  unique (issuer_id, external_subject_id)
);

comment on table public.wsp_issuer_subject_links is
  'Carte de reliage AUTORITAIRE (D-053) : (issuer_id, external_subject_id) → opus_id. Opus X est la vérité. L''unicité (issuer_id, external_subject_id) empêche un Issuer de repointer son sujet externe vers un autre Passeport. Sujet dérivé de la session (P3), jamais fourni.';
comment on column public.wsp_issuer_subject_links.external_subject_id is
  'Identifiant du sujet CHEZ l''Issuer (p.ex. student_id). Jamais l''opus_id, qui reste dérivé de la session.';

create index if not exists wsp_issuer_subject_links_opus_idx
  on public.wsp_issuer_subject_links(opus_id);

-- updated_at maintenu automatiquement (infrastructure mutable).
drop trigger if exists wsp_issuer_subject_links_touch on public.wsp_issuer_subject_links;
create trigger wsp_issuer_subject_links_touch
  before update on public.wsp_issuer_subject_links
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- wsp_link_subject(issuer, external_subject) — RELIER (autoritaire).
--   Sujet = current_opus_id (session), JAMAIS fourni (P3). Enregistre le
--   couple → opus. Idempotent pour le MÊME opus ; refuse si le couple est déjà
--   relié à un AUTRE opus (l'Issuer ne repointe pas — Opus X autoritaire).
-- =====================================================================
create or replace function public.wsp_link_subject(
  p_issuer_id           text,
  p_external_subject_id text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_opus     text := public.current_opus_id();
  v_existing text;
begin
  if v_opus is null then
    raise exception 'Non authentifié.' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.wsp_issuers where id = p_issuer_id and status = 'active'
  ) then
    raise exception 'Liaison impossible.' using errcode = 'check_violation';
  end if;
  if coalesce(btrim(p_external_subject_id), '') = '' then
    raise exception 'Sujet externe requis.' using errcode = 'check_violation';
  end if;

  select opus_id into v_existing
  from public.wsp_issuer_subject_links
  where issuer_id = p_issuer_id and external_subject_id = p_external_subject_id;

  if v_existing is not null then
    if v_existing <> v_opus then
      -- Couple déjà relié à un AUTRE sujet : refus. L'unicité aurait mordu de
      -- toute façon ; on lève explicitement pour un message franc.
      raise exception 'subject_link_conflict' using errcode = '23505';
    end if;
    return jsonb_build_object(
      'opus_id', v_opus, 'issuer_id', p_issuer_id,
      'external_subject_id', p_external_subject_id, 'status', 'existing'
    );
  end if;

  insert into public.wsp_issuer_subject_links (issuer_id, external_subject_id, opus_id)
  values (p_issuer_id, p_external_subject_id, v_opus);

  return jsonb_build_object(
    'opus_id', v_opus, 'issuer_id', p_issuer_id,
    'external_subject_id', p_external_subject_id, 'status', 'linked'
  );
end;
$$;

comment on function public.wsp_link_subject(text, text) is
  'RELIER (D-053) : enregistre (issuer, external_subject) → current_opus_id. Sujet dérivé de la session (P3). Idempotent pour le même opus ; refuse un repointage vers un autre opus (Opus X autoritaire).';

revoke all on function public.wsp_link_subject(text, text) from public, anon;
grant execute on function public.wsp_link_subject(text, text) to authenticated;

-- =====================================================================
-- wsp_resolve_external_subject(issuer, external_subject) — RÉSOUDRE → opus.
--   Réservé au service_role (back-channel de liaison). JAMAIS à authenticated :
--   sinon on sonderait le reliage d'autrui (énumération).
-- =====================================================================
create or replace function public.wsp_resolve_external_subject(
  p_issuer_id           text,
  p_external_subject_id text
)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select opus_id
  from public.wsp_issuer_subject_links
  where issuer_id = p_issuer_id and external_subject_id = p_external_subject_id;
$$;

comment on function public.wsp_resolve_external_subject(text, text) is
  'Résout (issuer, external_subject) → opus_id. Réservé au service_role (back-channel) : jamais à authenticated (anti-énumération).';

revoke all on function public.wsp_resolve_external_subject(text, text) from public, anon, authenticated;
grant execute on function public.wsp_resolve_external_subject(text, text) to service_role;

-- =====================================================================
-- RLS — le sujet lit SES reliages ; personne d'autre. Écriture via RPC only.
-- =====================================================================
alter table public.wsp_issuer_subject_links enable row level security;

drop policy if exists "wsp_issuer_subject_links_select_subject" on public.wsp_issuer_subject_links;
create policy "wsp_issuer_subject_links_select_subject"
  on public.wsp_issuer_subject_links for select to authenticated
  using (opus_id = public.current_opus_id());

revoke all on public.wsp_issuer_subject_links from anon, authenticated;
grant select on public.wsp_issuer_subject_links to authenticated; -- la RLS restreint aux lignes du sujet

-- ════════════════════════════════════════════════════════
-- POST-MIGRATION VERIFICATIONS
-- ════════════════════════════════════════════════════════
-- 1. Table + contrainte d'unicité présentes :
--    select conname from pg_constraint
--     where conrelid='public.wsp_issuer_subject_links'::regclass and contype='u';
--    → wsp_issuer_subject_links_issuer_id_external_subject_id_key
-- 2. Fonctions présentes :
--    select proname from pg_proc where proname in
--      ('wsp_link_subject','wsp_resolve_external_subject');  → 2 lignes
-- 3. L'unicité MORD : voir le test d'intégration O-C (staging).
