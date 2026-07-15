/**
 * =====================================================================
 * POST /api/link/authorize   (Sprint 2 · LOT O2a-EXT)
 * =====================================================================
 * Le professionnel, AUTHENTIFIÉ, autorise un Issuer. Le sujet est TOUJOURS la
 * session — jamais fourni (P3).
 *
 * LE CANAL, DE BOUT EN BOUT (défini par Opus X) :
 *   navigateur → 302 vers {redirect_uri}?code=…&state=… → callback Issuer →
 *   POST /link/token (HMAC) → jeton.
 *
 * Ce endpoint répond par une REDIRECTION 302, JAMAIS par un JSON contenant le
 * code : une 302 n'expose rien au script (extension, console.log, rapport
 * d'erreur), un JSON exposerait tout. Le `redirect_uri` doit correspondre à
 * celui ENREGISTRÉ en base (vérifié dans wsp_authorize_issuer) — sinon refus,
 * ce qui empêche un site tiers de capter le retour.
 *
 * `state` est OPAQUE à Opus X : restitué tel quel, vérifié par l'Issuer (CSRF).
 * =====================================================================
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { IssuerLinkService } from '@/lib/link/IssuerLinkService';

/** Refus uniforme : jamais de code, jamais de redirection vers l'URL fournie. */
function refused(origin: string) {
  return NextResponse.redirect(new URL('/link?error=refused', origin), { status: 302 });
}

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/establish', origin), { status: 302 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return refused(origin);
  }
  const issuerId = form.get('issuer_id');
  const redirectUri = form.get('redirect_uri');
  const state = form.get('state');

  if (typeof issuerId !== 'string' || typeof redirectUri !== 'string') {
    return refused(origin);
  }

  try {
    const service = new IssuerLinkService(supabase);
    const { code } = await service.authorize(issuerId, redirectUri);

    // redirect_uri a été validé == l'enregistré (dans la RPC) : on peut y aller.
    const target = new URL(redirectUri);
    target.searchParams.set('code', code);
    if (typeof state === 'string' && state.length > 0) {
      target.searchParams.set('state', state);
    }
    return NextResponse.redirect(target, { status: 302 });
  } catch {
    // redirect_uri non enregistré, Issuer inconnu, etc. → refus (aucun code).
    return refused(origin);
  }
}
