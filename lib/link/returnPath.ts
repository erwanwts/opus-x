/**
 * =====================================================================
 * O-A — Préservation du contexte de liaison à travers l'établissement.
 * =====================================================================
 * Décisions : D-052 (le Passeport naît PENDANT le flux d'activation de
 * l'Issuer, voie a) · P3 (le sujet est TOUJOURS la session, jamais fourni).
 *
 * Un sujet FRAIS (non établi) arrivant sur /link ne doit plus tomber dans un
 * cul-de-sac /establish qui perd l'Issuer. On transporte le chemin de retour
 * /link… de bout en bout — establish → magic-link → /auth/callback → émission
 * → /link — pour REVENIR au consentement une fois le Passeport né.
 *
 * INVARIANT DE SÛRETÉ : le retour n'est JAMAIS une URL absolue ni un `//host`.
 * Seul un chemin INTERNE /link de cette application est accepté (jamais un
 * open-redirect, jamais /dashboard ni /linkfoo). Chaque couche stocke le
 * chemin enfant comme UNE valeur de query encodée (URLSearchParams) et le
 * relit avec un seul décodage : aucune ambiguïté sur les `?`/`&` imbriqués.
 * =====================================================================
 */

const LINK_PATH = '/link';

/** Reconstruit le chemin /link?… d'origine à partir de ses paramètres. */
export function buildLinkPath(params: {
  issuer_id?: string;
  redirect_uri?: string;
  state?: string;
}): string {
  const q = new URLSearchParams();
  if (params.issuer_id) q.set('issuer_id', params.issuer_id);
  if (params.redirect_uri) q.set('redirect_uri', params.redirect_uri);
  if (params.state) q.set('state', params.state);
  const qs = q.toString();
  return qs ? `${LINK_PATH}?${qs}` : LINK_PATH;
}

/**
 * Destination d'un sujet NON établi : /establish en portant le retour /link.
 * On ne préserve un retour que si les paramètres minimaux d'une liaison sont
 * présents (issuer_id + redirect_uri) ; sinon /establish nu — rien d'utile à
 * préserver (l'écran /link afficherait « indisponible » de toute façon).
 */
export function buildEstablishReturn(params: {
  issuer_id?: string;
  redirect_uri?: string;
  state?: string;
}): string {
  if (!params.issuer_id || !params.redirect_uri) return '/establish';
  const next = buildLinkPath(params);
  return `/establish?${new URLSearchParams({ next }).toString()}`;
}

/**
 * Valide un chemin de retour reçu (query `next`). N'accepte QU'un chemin
 * INTERNE /link de cette app — jamais une URL absolue, jamais `//host`,
 * jamais un autre chemin, jamais /linkfoo. Renvoie le chemin sûr, ou null.
 */
export function safeLinkReturnPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (raw === LINK_PATH || raw.startsWith(`${LINK_PATH}?`)) return raw;
  return null;
}

/**
 * Chemin de la cérémonie portant le retour /link, s'il est sûr. La cérémonie
 * s'exécute TOUJOURS (le Passeport naît là) ; le `next` ne fait que dire où
 * REVENIR ensuite. Un `next` non /link est ignoré → /emission nu.
 */
export function buildEmissionPath(returnTo?: string | null): string {
  const safe = safeLinkReturnPath(returnTo);
  if (!safe) return '/emission';
  return `/emission?${new URLSearchParams({ next: safe }).toString()}`;
}
