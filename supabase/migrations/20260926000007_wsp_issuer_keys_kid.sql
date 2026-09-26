-- =====================================================================
-- Opus X — Phase 3 — SIGNATURE DES ATTESTATIONS : RÉSOLUTION PAR kid (D-063)
-- =====================================================================
-- Contrat gelé : ENG-002 v0.5 §6.6. Décision D-063 (C) : la clé de vérification
-- se résout par le `kid` du header JWS = wsp_issuer_keys.id (`{issuer}#{key_id}`).
--
-- La table wsp_issuer_keys existe déjà (20260925000001) : id (PK = kid complet),
-- issuer_id, algorithm(EdDSA), public_key_jwk (public only), key_id (kid court),
-- status(active|revoked). Cette migration Phase 3 :
--   • rend key_id OBLIGATOIRE (un kid est requis pour la résolution) ;
--   • garantit l'unicité (issuer_id, key_id) ;
--   • ajoute le résolveur wsp_active_issuer_key(kid) → JWK publique active.
--
-- Clé PUBLIQUE = savoir public (vérif tierce) : lecture ouverte CONSERVÉE,
-- aucune écriture client (posée à l'enregistrement d'émetteur). Idempotent.
-- ⚠️ NON APPLIQUÉE : spéc gelée, à appliquer au build Phase 3 (STAGING d'abord).
-- =====================================================================

-- Un kid est désormais requis (la table est vide en staging/prod hors clés QA
-- de test, qui portent déjà key_id) : la résolution par kid l'exige.
alter table public.wsp_issuer_keys alter column key_id set not null;

-- Unicité du kid par émetteur (l'id PK '{issuer}#{key_id}' l'implique déjà ;
-- on la rend explicite sur (issuer_id, key_id) pour la résolution).
create unique index if not exists wsp_issuer_keys_kid_uidx
  on public.wsp_issuer_keys(issuer_id, key_id);

-- =====================================================================
-- wsp_active_issuer_key(kid) — résout le kid (= id) vers la JWK PUBLIQUE active.
--   Réservé à la vérification : renvoie la clé publique (jamais de privé — la
--   colonne ne contient que du public). null si kid inconnu ou clé révoquée.
-- =====================================================================
create or replace function public.wsp_active_issuer_key(p_kid text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select public_key_jwk
  from public.wsp_issuer_keys
  where id = p_kid and status = 'active';
$$;

comment on function public.wsp_active_issuer_key(text) is
  'Phase 3 (D-063 C, ENG-002 §6.6) : résout le kid du header JWS (= wsp_issuer_keys.id) vers la JWK PUBLIQUE active. null si inconnu/révoqué. Clé publique uniquement.';

-- Clé publique = savoir public : vérification par un tiers. Même exposition que
-- la lecture de la table (lecture ouverte, aucune écriture client).
revoke all on function public.wsp_active_issuer_key(text) from public;
grant execute on function public.wsp_active_issuer_key(text) to anon, authenticated;

-- ════════════════════════════════════════════════════════
-- POST-MIGRATION VERIFICATIONS
-- ════════════════════════════════════════════════════════
-- 1. key_id NOT NULL + index unique :
--    select is_nullable from information_schema.columns
--     where table_name='wsp_issuer_keys' and column_name='key_id';  → NO
-- 2. Résolveur présent :
--    select count(*) from pg_proc where proname='wsp_active_issuer_key';  → 1
-- 3. Un kid actif résout une JWK publique ; un kid révoqué → null.
