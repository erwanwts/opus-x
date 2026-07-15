/**
 * =====================================================================
 * POST /api/link/revoke   (Sprint 2 · LOT O2a)
 * =====================================================================
 * Le professionnel révoque l'autorisation d'un Issuer. La révocation coupe
 * les émissions FUTURES ; elle n'efface AUCUN fait déjà reçu. Le jeton devient
 * inerte automatiquement (l'état courant du couple passe à 'revoked').
 *
 * Sujet = session courante, jamais fourni. Réponse uniforme en cas d'échec.
 * =====================================================================
 */
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiJson, apiError, unauthorized, badRequest } from '@/lib/api/http';
import { IssuerLinkService } from '@/lib/link/IssuerLinkService';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Corps JSON invalide.');
  }

  const issuerId = body.issuer_id;
  if (typeof issuerId !== 'string' || issuerId.trim() === '') {
    return badRequest('issuer_id requis.');
  }

  try {
    const service = new IssuerLinkService(supabase);
    const result = await service.revoke(issuerId.trim());
    return apiJson(result);
  } catch {
    return apiError('revoke_failed', 'Révocation impossible.', 400);
  }
}
