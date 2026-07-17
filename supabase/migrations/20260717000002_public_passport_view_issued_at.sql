-- =====================================================================
-- Opus X — WEB-003 Lot 4 : issued_at devient public (divulgation)
-- =====================================================================
-- Ajoute la DATE D'ÉMISSION (passports.issued_at) au périmètre public, comme
-- le nom au Lot 3. Décision de divulgation explicite. Opus ID reste hors vue.
--
-- CREATE OR REPLACE VIEW : les 4 colonnes existantes sont conservées DANS LE
-- MÊME ORDRE (handle, lifecycle_stage, display_name, headline) et issued_at est
-- ajouté EN DERNIER — contrainte de create-or-replace. Owner/grants préservés
-- (le grant select to anon posé au Lot 3 reste valide).
--
-- INVARIANTS INCHANGÉS : security-definer assumé ; profiles jamais exposé à
-- anon ; passports brut révoqué (Point B fermé) ; lignes visibility='public'
-- uniquement (404 non-énumérant). issued_at n'est PAS dans NEVER_PUBLIC.
-- =====================================================================

create or replace view public.public_passport_view
  with (security_invoker = false) as
  select
    p.handle,
    p.lifecycle_stage,
    pr.full_name as display_name,
    pr.headline,
    p.issued_at
  from public.passports p
  join public.profiles pr on pr.id = p.profile_id
  where p.visibility = 'public';

comment on view public.public_passport_view is
  'Projection PUBLIQUE en lecture seule du Passport (lignes visibility=public uniquement). Security-definer ASSUMÉ : joint profiles (illisible par anon) pour n''exposer QUE {handle, lifecycle_stage, display_name, headline, issued_at}. Aucun champ interne (profile_id / id / status / opus_id / email). Source unique de la divulgation publique (nom + date d''émission).';
