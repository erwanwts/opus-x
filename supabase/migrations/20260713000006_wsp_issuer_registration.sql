-- =====================================================================
-- Opus X — Sprint 2 — LOT C0-a : ENREGISTREMENT D'UN ISSUER (côté RÉCEPTEUR)
-- Autorités : SPRINT-002 v1.2 (C0) · ENG-002 v0.2 · ARCH-001 v0.3 §5.5.
--
-- Enregistre un Issuer RÉEL du protocole dans la zone FAITS d'Opus X : son
-- identité protocolaire, son redirect_uri autorisé, son statut. C'est la
-- moitié RÉCEPTEUR de la liaison (D9, multi-Issuer par conception) — sans elle,
-- l'ingestion §8 rejette dès le premier contrôle (HMAC : secret introuvable).
--
-- W7 : identifiant NEUTRE ('issuer:wts-001'), libellé neutre ('WTS Issuer').
--   Aucun nom d'organisation-Issuer dans l'id, le display_name, les commentaires
--   ni le nom de fichier. Un Issuer n'est jamais nommé en dur dans le code.
--
-- LE SECRET HMAC N'EST PAS ICI (déliberément). wsp_issuer_secrets.hmac_secret
--   est stocké EN CLAIR (Opus X doit recalculer le HMAC entrant). Ce dépôt est
--   POUSSÉ (github.com/erwanwts/opus-x) : committer le secret en clair dans une
--   migration versionnée le graverait à perpétuité dans l'historique git.
--   → Le secret est posé HORS-REPO par un script one-shot (Voie a du brief C0-a),
--     et remis une seule fois au responsable. Ici : l'Issuer, jamais son secret.
--
-- Ce lot NE POSE PAS de consentement (c'est le sujet qui le pose, versant Issuer)
-- ni de fait ni d'ingestion. Une seule table touchée : public.wsp_issuers.
-- =====================================================================

insert into public.wsp_issuers (
  id,
  display_name,
  status,
  redirect_uri,
  hmac_key_ref,
  accountable_contact
)
values (
  'issuer:wts-001',                              -- identité protocole NEUTRE (W7)
  'WTS Issuer',                                  -- libellé humain neutre
  'active',
  'http://localhost:3000/api/wsp/link/callback', -- redirect_uri EXACT (dev de l'Issuer)
  null,                                           -- colonne dormante : le lien réel = wsp_issuer_secrets.issuer_id
  'info@worldtradingskool.com'                    -- contact redevable (ARCH-001 §4)
)
-- Réapplication sûre : append-only interdit UPDATE/DELETE, jamais un INSERT
-- idempotent. DO NOTHING n'effectue aucune mutation (aucun trigger déclenché).
on conflict (id) do nothing;
