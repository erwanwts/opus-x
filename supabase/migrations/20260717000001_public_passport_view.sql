-- =====================================================================
-- Opus X — WEB-003 Lot 3 : Vue publique du Passport + fermeture du Point B
-- =====================================================================
-- OBJET : exposer display_name (= profiles.full_name) et headline au Passport
-- PUBLIC, tout en RESSERRANT la surface anon (Point B). Après cette migration,
-- l'anon ne lit plus AUCUNE table brute : seulement une PROJECTION en lecture
-- seule des colonnes publiques, pour les seules lignes visibility='public'.
--
-- CHOIX SECURITY-DEFINER (assumé, borné) : la vue s'exécute avec les droits de
-- son propriétaire (postgres) — ce qui lui permet de joindre `profiles`, que
-- l'anon ne peut PAS lire. Le linter Supabase signalera « security definer
-- view » : c'est DÉLIBÉRÉ. La vue ne projette QUE des colonnes publiques et son
-- WHERE visibility='public' est la seule porte. Aucun champ interne
-- (profile_id, id, status, opus_id, email) n'y transite.
--
-- INVARIANTS PRÉSERVÉS :
--   • profiles reste TOTALEMENT fermé à anon (email/opus_id morts).
--   • Le nom n'est JAMAIS dupliqué : source unique = profiles (join, pas de copie).
--   • Le trigger d'émission (issue_passport) n'est PAS touché.
--   • 404 non-énumérant : la vue ne renvoie une ligne que si visibility='public'
--     → privé / unlisted / inexistant = aucune ligne = indistinguables.
-- =====================================================================

-- ---------------------------------------------------------------------
-- La vue publique — projection en lecture seule des colonnes publiques.
-- ---------------------------------------------------------------------
create or replace view public.public_passport_view
  with (security_invoker = false) as
  select
    p.handle,
    p.lifecycle_stage,
    pr.full_name as display_name,
    pr.headline
  from public.passports p
  join public.profiles pr on pr.id = p.profile_id
  where p.visibility = 'public';

comment on view public.public_passport_view is
  'Projection PUBLIQUE en lecture seule du Passport (lignes visibility=public uniquement). Security-definer ASSUMÉ : joint profiles (illisible par anon) pour n''exposer QUE {handle, lifecycle_stage, display_name, headline}. Aucun champ interne (profile_id / id / status / opus_id / email). Source unique de la divulgation publique du nom.';

-- ---------------------------------------------------------------------
-- Point B — couper l'accès brut anon aux tables.
-- passports n'est plus lisible en brut par anon : fin de l'exposition
-- colonne-large (profile_id / id / status / issued_at / updated_at). La policy
-- passports_select_public devient inerte pour anon (plus de grant) — on la
-- conserve, documentée, comme intention (aucune ligne publique brute lisible).
-- ---------------------------------------------------------------------
revoke select on public.passports from anon;

-- profiles : déjà révoqué (migration RLS) — on RÉAFFIRME (ceinture + bretelles).
revoke all on public.profiles from anon;

-- ---------------------------------------------------------------------
-- L'anon ne lit QUE la vue.
-- ---------------------------------------------------------------------
grant select on public.public_passport_view to anon;

comment on policy "passports_select_public" on public.passports is
  'INERTE POUR ANON depuis Lot 3 : le grant SELECT sur passports a été révoqué pour anon. La lecture publique passe désormais EXCLUSIVEMENT par public_passport_view (whitelist de colonnes). Policy conservée pour l''intention/documentation.';
