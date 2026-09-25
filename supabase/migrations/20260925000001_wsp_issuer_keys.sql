-- =====================================================================
-- Opus X — Sprint 2 — SOUS-PALIER 2a : CLÉS PUBLIQUES D'ÉMETTEUR (D-046)
-- Autorités : SPRINT-002 (multi-Issuer, D9) · ARCH-001 v0.3 §5.5 · D-046.
--
-- Vérifier un credential Open Badges 3.0 = vérifier une signature ASYMÉTRIQUE
-- avec la CLÉ PUBLIQUE de l'émetteur. Cette table stocke ces clés publiques.
--
-- 🔴 SÉPARÉ de wsp_issuer_secrets (secret HMAC SYMÉTRIQUE, canal requête). Ici :
--    clé PUBLIQUE ASYMÉTRIQUE (Ed25519), qui authentifie le CREDENTIAL lui-même.
--    Opus X ne détient JAMAIS de clé privée d'émetteur (colonne `public_key_jwk`
--    = matériel PUBLIC uniquement ; jamais de composante privée).
--
-- 🔴 Clé PUBLIQUE = savoir public : n'importe quel tiers vérificateur peut la lire
--    (D9). Lecture ouverte (anon/authenticated), AUCUNE écriture client (posée par
--    migration / enregistrement d'émetteur, comme wsp_issuers). Rotation possible
--    (status revoked) → PAS append-only strict (à la différence des faits, W2).
--
-- Ce lot NE POSE PAS de clé réelle (aucun émetteur réel enregistré ici) : la table
-- naît vide ; la clé publique d'un émetteur réel est insérée à son enregistrement.
-- =====================================================================

create table if not exists public.wsp_issuer_keys (
  id             text        primary key,                 -- 'issuer:<id>#key-1'
  issuer_id      text        not null references public.wsp_issuers(id),
  algorithm      text        not null check (algorithm in ('EdDSA')),  -- OB 3.0 VC-JWT (Ed25519)
  public_key_jwk jsonb       not null,                     -- CLÉ PUBLIQUE (JWK OKP/Ed25519). JAMAIS de privé.
  key_id         text,                                     -- 'kid' optionnel (corrélation header JWS)
  status         text        not null default 'active'
                 check (status in ('active', 'revoked')),
  created_at     timestamptz not null default now()
);

comment on table public.wsp_issuer_keys is
  'Clés PUBLIQUES asymétriques des émetteurs (OB 3.0 VC-JWT, Ed25519). Séparé de wsp_issuer_secrets (HMAC symétrique). Opus X ne détient jamais de clé privée. Lecture publique, écriture par migration/enregistrement.';
comment on column public.wsp_issuer_keys.public_key_jwk is
  'Clé PUBLIQUE au format JWK (kty=OKP, crv=Ed25519). Matériel public uniquement — aucune composante privée (`d`).';

create index if not exists wsp_issuer_keys_issuer_idx
  on public.wsp_issuer_keys(issuer_id, status);

-- =====================================================================
-- RLS — clé publique = lecture ouverte, aucune écriture client.
-- =====================================================================
alter table public.wsp_issuer_keys enable row level security;

drop policy if exists "wsp_issuer_keys_read_all" on public.wsp_issuer_keys;
create policy "wsp_issuer_keys_read_all"
  on public.wsp_issuer_keys for select to anon, authenticated using (true);

revoke insert, update, delete on public.wsp_issuer_keys from anon, authenticated;
grant select on public.wsp_issuer_keys to anon, authenticated;

-- =====================================================================
-- POST-MIGRATION VERIFICATIONS
-- =====================================================================
-- 1. Table + FK vers wsp_issuers :
--    select 1 from information_schema.tables where table_name='wsp_issuer_keys';  → 1
-- 2. RLS : 1 policy SELECT, 0 write :
--    select cmd, count(*) from pg_policies where tablename='wsp_issuer_keys' group by 1;
-- 3. Aucune clé au départ (aucun émetteur réel enregistré ici) :
--    select count(*) from public.wsp_issuer_keys;  → 0
