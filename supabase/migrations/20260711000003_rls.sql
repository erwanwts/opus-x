-- =====================================================================
-- Opus X — Sprint 1 — LOT 3 (b) : RLS — DENY BY DEFAULT
-- Source d'autorité : spec figée §3.6, §3.11, §5.3
--
-- Principe : RLS activé sur TOUTES les tables applicatives.
-- Aucune policy = aucun accès. Le Passport est PRIVÉ PAR DÉFAUT.
-- Le service_role bypasse la RLS (émission serveur, Lot 4) — jamais côté client.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Activation RLS — TOUTES les tables, y compris les stubs
-- ---------------------------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.passports           enable row level security;
alter table public.trust_index         enable row level security;
alter table public.skills              enable row level security;
alter table public.evidence            enable row level security;
alter table public.consents            enable row level security;
alter table public.frameworks          enable row level security;
alter table public.passport_frameworks enable row level security;
alter table public.partners            enable row level security;

-- =====================================================================
-- profiles — select/update self. AUCUN insert client (émission via trigger).
-- =====================================================================
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles
  for update
  to authenticated
  using      (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Pas de policy INSERT/DELETE : le profil est ÉMIS côté serveur (Lot 4), jamais par le client.

-- =====================================================================
-- passports — select/update propriétaire via profile_id.
-- + policy publique PRÉPARÉE MAIS INACTIVE EN FAIT :
--   elle n'expose que les lignes visibility='public' — or aucune ligne
--   n'est publique en Sprint 1 (privé par défaut). La page publique = 404.
-- =====================================================================
drop policy if exists "passports_select_owner" on public.passports;
create policy "passports_select_owner"
  on public.passports
  for select
  to authenticated
  using (profile_id = (select auth.uid()));

drop policy if exists "passports_update_owner" on public.passports;
create policy "passports_update_owner"
  on public.passports
  for update
  to authenticated
  using      (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

-- Policy publique préparée (Décision : URL réservée & modélisée, NON OUVERTE).
-- Inactive de fait : aucune ligne n'a visibility='public' en Sprint 1.
drop policy if exists "passports_select_public" on public.passports;
create policy "passports_select_public"
  on public.passports
  for select
  to anon
  using (visibility = 'public');

comment on policy "passports_select_public" on public.passports is
  'PRÉPARÉE, INACTIVE EN SPRINT 1 : aucune ligne publique (privé par défaut). Le partage public exigera un consentement public_share explicite (§5.4).';

-- Pas de policy INSERT/DELETE : le Passport est ÉMIS côté serveur, jamais par le client.

-- =====================================================================
-- trust_index — select propriétaire via appartenance du passport.
-- Aucun insert/update client (réservé au service_role / Edge Functions).
-- =====================================================================
drop policy if exists "trust_index_select_owner" on public.trust_index;
create policy "trust_index_select_owner"
  on public.trust_index
  for select
  to authenticated
  using (
    exists (
      select 1 from public.passports p
      where p.id = trust_index.passport_id
        and p.profile_id = (select auth.uid())
    )
  );

-- =====================================================================
-- skills — select propriétaire. Vide en Sprint 1.
-- =====================================================================
drop policy if exists "skills_select_owner" on public.skills;
create policy "skills_select_owner"
  on public.skills
  for select
  to authenticated
  using (
    exists (
      select 1 from public.passports p
      where p.id = skills.passport_id
        and p.profile_id = (select auth.uid())
    )
  );

-- =====================================================================
-- evidence — select propriétaire. Vide en Sprint 1.
-- Écriture réservée aux partenaires via service_role (futur, avec consentement).
-- =====================================================================
drop policy if exists "evidence_select_owner" on public.evidence;
create policy "evidence_select_owner"
  on public.evidence
  for select
  to authenticated
  using (
    exists (
      select 1 from public.passports p
      where p.id = evidence.passport_id
        and p.profile_id = (select auth.uid())
    )
  );

-- =====================================================================
-- consents — select/insert propriétaire (RGPD §5.4).
-- =====================================================================
drop policy if exists "consents_select_owner" on public.consents;
create policy "consents_select_owner"
  on public.consents
  for select
  to authenticated
  using (profile_id = (select auth.uid()));

drop policy if exists "consents_insert_owner" on public.consents;
create policy "consents_insert_owner"
  on public.consents
  for insert
  to authenticated
  with check (profile_id = (select auth.uid()));

-- =====================================================================
-- STUBS — RLS activé, AUCUNE policy client en Sprint 1.
-- Conséquence : totalement inaccessibles depuis le client. C'est voulu.
-- (frameworks, passport_frameworks, partners)
-- =====================================================================
-- Aucune policy. Deny by default.

-- =====================================================================
-- Durcissement : le rôle anon n'a aucun droit résiduel sur les tables
-- applicatives (la RLS est la barrière, les grants sont la ceinture).
-- =====================================================================
revoke all on public.profiles            from anon;
revoke all on public.trust_index         from anon;
revoke all on public.skills              from anon;
revoke all on public.evidence            from anon;
revoke all on public.consents            from anon;
revoke all on public.frameworks          from anon, authenticated;
revoke all on public.passport_frameworks from anon, authenticated;
revoke all on public.partners            from anon, authenticated;

-- passports : anon conserve SELECT au niveau grant, mais la RLS le restreint
-- aux seules lignes visibility='public' (aucune en Sprint 1).
grant select on public.passports to anon;
