-- =====================================================================
-- Opus X — WEB-003 Lot 5 : Skills + Evidence publiques & marqueur DÉMO
-- =====================================================================
-- OBJET : brancher au Passport PUBLIC (a) la liste des Skills, (b) la liste des
-- Evidence, (c) le statut de vérification, et (d) un marqueur `is_demo` qui rend
-- une vitrine de démonstration IMPOSSIBLE à confondre avec un vrai Passport.
--
-- MOTIF REPRIS DES LOTS 3/4 (inchangé) : l'anon ne lit AUCUNE table brute. Il ne
-- lit que des vues security-definer qui projettent des COLONNES EXPLICITES pour
-- les seules lignes `visibility='public'`. `skills` et `evidence` restent
-- révoquées pour anon (migration RLS) — on ne touche NI aux grants NI aux
-- policies de ces tables. La vue est la seule porte.
--
-- POURQUOI DES VUES SÉPARÉES (et pas un json_agg dans la vue principale) :
-- l'agrégat JSON d'une ligne EST un spread — exactement ce que §5.3 interdit
-- (« réponse construite par whitelist explicite, jamais de spread d'une ligne
-- DB »). Une vue par relation garde la whitelist appliquée PAR LE MOTEUR,
-- colonne par colonne, et isole la future bascule GAP-3 (réécriture d'un corps
-- de vue, sans toucher au nom/à la date).
--
-- ⚠️ ÉCART ASSUMÉ AVEC LE SOCLE §5.3 (arbitrage superviseur, 2026-07-17) :
--    §5.3 énumère « niveaux qualitatifs Trust/Skills, et les Evidence » — soit
--    Skills comme SCALAIRE. La publication d'une LISTE de Skills étend le socle.
--    Décision prise par le superviseur ; `docs/` (WEB-001B §5.3) N'A PAS été
--    modifié ici (document gelé). L'amendement normatif reste dû.
--    Atténuation : on ne publie QUE `skills.name`. Ni `level` (texte libre, sans
--    équivalent WSP : le fact store n'a que `claimed_level`, le claim de
--    l'Issuer, et la zone d'interprétation O3/O4 n'existe pas), ni `verified`
--    (aucun équivalent WSP — W3). On ne pré-engage aucune couche non construite.
--
-- ⚠️ `issuer` : `public.evidence` n'a pas de colonne Issuer. Arbitrage
--    superviseur = OMETTRE. Le champ reste dans PUBLIC_EVIDENCE_WHITELIST et le
--    lecteur l'émet à `null`. Le trou est ASSUMÉ, pas oublié.
--
-- INVARIANTS PRÉSERVÉS :
--   • profiles / passports / skills / evidence : toujours illisibles en brut par anon.
--   • 404 non-énumérant : aucune vue ne renvoie de ligne hors visibility='public'
--     → privé / unlisted / inexistant restent indistinguables.
--   • payload / description d'une Evidence : JAMAIS projetés (hors whitelist §5.3).
--   • Le trigger d'émission (issue_passport) n'est pas touché.
-- =====================================================================

-- ---------------------------------------------------------------------
-- (a) Le marqueur DÉMO — une colonne, pas une convention.
--
-- `false` par défaut : un Passport est un VRAI Passport tant que personne n'a
-- explicitement déclaré le contraire. Le seed de démonstration REFUSE d'écrire
-- des Skills/Evidence d'exemple sur une ligne dont `is_demo` n'est pas `true`
-- → de fausses preuves ne peuvent pas atteindre un vrai profil.
-- ---------------------------------------------------------------------
alter table public.passports
  add column if not exists is_demo boolean not null default false;

comment on column public.passports.is_demo is
  'VITRINE DE DÉMONSTRATION (staging). true ⇒ les Skills/Evidence/vérification de ce Passport sont FICTIFS et la page publique porte un bandeau explicite + robots noindex. false par défaut : un Passport est réel sauf déclaration contraire. Clé d''idempotence du seed de démo, ET garde d''écriture (le seed refuse toute ligne is_demo=false).';

-- ---------------------------------------------------------------------
-- (b) La vue principale — colonnes existantes DANS LE MÊME ORDRE, ajouts EN
-- DERNIER (contrainte de create-or-replace). Owner/grants préservés.
--
-- `verified` est DÉRIVÉ, jamais stocké : `public.passports` n'a pas de colonne
-- `verified`, et on n'en ajoute pas. Deux raisons :
--   1. Cohérence structurelle — le sceau et la timeline lisent le MÊME état.
--      « vérifié mais à l'étape 1/7 » devient irreprésentable.
--   2. Survie à GAP-3 — le fact store WSP n'aura JAMAIS de colonne `verified`
--      (W3 : aucune colonne calculée, aucun score). Le futur `verified` y sera
--      un PRÉDICAT (fait présent ∧ aucune révocation ∧ is_declaration=false).
--      En l'exposant déjà comme prédicat dérivé, le contrat public survit à la
--      bascule : seul le corps de la vue change.
--
-- `skills_status` est DÉRIVÉ par présence/absence. Aucun seuil inventé (pas de
-- « 3 Skills = established ») : ce serait un score déguisé (PRODUCT-001).
-- ---------------------------------------------------------------------
create or replace view public.public_passport_view
  with (security_invoker = false) as
  select
    p.handle,
    p.lifecycle_stage,
    pr.full_name as display_name,
    pr.headline,
    p.issued_at,
    p.is_demo,
    (p.lifecycle_stage in ('passport_verified', 'trusted_professional', 'authority'))
      as verified,
    case
      when exists (select 1 from public.skills s where s.passport_id = p.id) then 'emerging'
      else 'empty'
    end as skills_status
  from public.passports p
  join public.profiles pr on pr.id = p.profile_id
  where p.visibility = 'public';

comment on view public.public_passport_view is
  'Projection PUBLIQUE en lecture seule du Passport (lignes visibility=public uniquement). Security-definer ASSUMÉ : joint profiles (illisible par anon) pour n''exposer QUE {handle, lifecycle_stage, display_name, headline, issued_at, is_demo, verified, skills_status}. Aucun champ interne (profile_id / id / status / opus_id / email). verified et skills_status sont DÉRIVÉS (jamais stockés, jamais un score). Source unique de la divulgation publique.';

-- ---------------------------------------------------------------------
-- (c) Les Skills publiques — UNE SEULE colonne projetée : le nom.
--
-- Pas de `level` (cf. écart §5.3 ci-dessus), pas de `verified`, pas de
-- `evidence_count` (compteur stocké = colonne calculée, interdite côté WSP).
-- ---------------------------------------------------------------------
create or replace view public.public_passport_skills_view
  with (security_invoker = false) as
  select
    p.handle,
    s.name
  from public.skills s
  join public.passports p on p.id = s.passport_id
  where p.visibility = 'public';

comment on view public.public_passport_skills_view is
  'Skills PUBLIQUES d''un Passport (lignes visibility=public uniquement). Security-definer ASSUMÉ : skills reste illisible en brut par anon. Ne projette QUE {handle, name} — jamais level (texte libre, sans équivalent WSP), jamais verified, jamais evidence_count, jamais framework_id. Jointe au lecteur public par handle.';

-- ---------------------------------------------------------------------
-- (d) Les Evidence publiques — whitelist §5.3 appliquée PAR LE MOTEUR.
--
-- `payload` et `description` sont HORS de cette vue : structurellement
-- inatteignables par anon, pas seulement filtrés côté application.
-- `issuer` : absent du schéma (arbitrage = omettre) → le lecteur émet null.
-- `status` (pending/…) : interne, non projeté.
-- ---------------------------------------------------------------------
create or replace view public.public_passport_evidence_view
  with (security_invoker = false) as
  select
    p.handle,
    e.type,
    e.title,
    e.verified,
    e.issued_at
  from public.evidence e
  join public.passports p on p.id = e.passport_id
  where p.visibility = 'public';

comment on view public.public_passport_evidence_view is
  'Evidence PUBLIQUES d''un Passport (lignes visibility=public uniquement). Security-definer ASSUMÉ : evidence reste illisible en brut par anon. Ne projette QUE {handle, type, title, verified, issued_at} — le payload et la description sont STRUCTURELLEMENT hors d''atteinte (§5.3, NEVER_PUBLIC), pas seulement filtrés côté application. issuer : aucune colonne au schéma (trou assumé, Lot 5) → le lecteur émet null.';

-- ---------------------------------------------------------------------
-- (e) L'anon ne lit QUE les vues. Les tables restent révoquées (migration RLS).
-- ---------------------------------------------------------------------
grant select on public.public_passport_skills_view   to anon;
grant select on public.public_passport_evidence_view to anon;
