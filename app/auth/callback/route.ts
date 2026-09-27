/**
 * =====================================================================
 * /auth/callback — ÉCHANGE DU CODE MAGIC LINK CONTRE UNE SESSION
 * =====================================================================
 * Correctif de parcours (smoke test prod) : le magic link revient avec un
 * `?code=` (PKCE). Tant que ce code n'est pas échangé côté serveur, AUCUN
 * cookie de session n'existe — et le middleware (garde V1) redirige la
 * cérémonie vers /establish. Résultat : la confirmation réussit en base, mais
 * l'onglet n'atterrit jamais sur la cérémonie.
 *
 * Ce handler capte le code, l'échange contre une session (les cookies sont
 * posés par le client serveur), PUIS redirige vers la destination interne
 * (/emission par défaut). Il n'affaiblit AUCUNE vigilance :
 *   • V1 reste gardée en base (trigger) ET dans le middleware
 *     (email_confirmed_at). Ce handler ne fait que POSER la session déjà
 *     légitimement acquise par le clic sur le lien — il ne confirme rien
 *     lui-même, il ne contourne rien.
 *   • Aucune chaîne verrouillée, aucune décision produit touchée.
 * =====================================================================
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** N'autorise QUE des chemins internes — jamais d'open redirect. */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/emission';
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNext(searchParams.get('next'));

  // Sans code, rien à échanger : on renvoie dignement au seuil de vérification.
  if (!code) {
    return NextResponse.redirect(new URL('/verify-email?error=missing_code', origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Lien déjà consommé / expiré / invalide : retour au seuil, sans drame.
    return NextResponse.redirect(new URL('/verify-email?error=exchange', origin));
  }

  // Session posée (cookies écrits par le client serveur). L'identité est
  // vérifiée : le middleware laissera désormais passer /emission.
  return NextResponse.redirect(new URL(next, origin));
}
