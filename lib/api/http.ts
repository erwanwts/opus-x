/**
 * =====================================================================
 * Opus X — Helpers de réponse API  (LOT 8)
 * =====================================================================
 * Enveloppe d'erreur standard (§4.6) : { "error": { "code", "message" } }.
 * Dates ISO 8601 UTC. JWT requis sur /me/* (§4.6).
 *
 * RÈGLE DE NON-ÉNUMÉRATION : une ressource inexistante et une ressource non
 * autorisée renvoient le MÊME 404 — jamais un 403 qui révélerait l'existence.
 * (Le 403 n'est employé que pour une fonctionnalité explicitement désactivée,
 *  qui ne révèle aucune donnée.)
 * =====================================================================
 */
import { NextResponse } from 'next/server';

export function apiJson<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function apiError(code: string, message: string, status: number): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status });
}

/** 401 — aucun JWT / session. */
export const unauthorized = () =>
  apiError('unauthorized', 'Authentification requise.', 401);

/** 404 — inexistant OU non autorisé (indistinguable, anti-énumération). */
export const notFound = () => apiError('not_found', 'Introuvable.', 404);

/** 400 — corps de requête invalide. */
export const badRequest = (message = 'Requête invalide.') =>
  apiError('bad_request', message, 400);

/** 403 — fonctionnalité préparée mais désactivée en Sprint 1 (ne révèle rien). */
export const featureDisabled = () =>
  apiError('feature_disabled', 'Fonctionnalité indisponible en Sprint 1.', 403);
