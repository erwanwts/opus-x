/**
 * Middleware COMPOSÉ (WEB-002 Lot C2) — locale du SITE + garde de session APP.
 *
 * Branchement par 1er segment de pathname :
 *   • en/fr/es (déjà localisé)  → next-intl ;
 *   • segment RÉSERVÉ app/handler → garde de session (appSession) — JAMAIS d'intl ;
 *   • sinon (/, /about…)         → next-intl (ajoute la locale, 307 sur /, WEB-D5).
 *
 * `appSession` est la garde V1 EXISTANTE, copiée VERBATIM : getUser() (donc le
 * refresh de session via setAll) s'exécute sur TOUS les segments réservés,
 * exactement comme avant ; SEULES les redirections restent conditionnées à
 * isProtected (/dashboard, /emission, /passport). Aucun changement de
 * comportement de session sur l'application prouvée.
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { routeKind } from '@/lib/routing/routeKind';

type CookieToSet = { name: string; value: string; options: CookieOptions };

const intlMiddleware = createMiddleware(routing);

// La table des segments RÉSERVÉS et l'aiguillage vivent dans lib/routing/routeKind —
// SOURCE UNIQUE, couverte par une matrice de non-régression. Aucune copie locale ici :
// deux tables qui divergeraient seraient une panne silencieuse sur TOUTES les requêtes.

// Sous-ensemble RÉELLEMENT protégé — prédicat verbatim de la garde V1.
const isProtected = (path: string) =>
  path.startsWith('/dashboard') ||
  path.startsWith('/emission') ||
  path === '/passport' ||
  path.startsWith('/passport/');

// Garde de session V1 — copie EXACTE de l'ancien middleware. getUser()+refresh
// TOUJOURS ; redirections SI isProtected. Rien d'autre n'est modifié.
async function appSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (isProtected(path) && !user) {
    return NextResponse.redirect(new URL('/establish', request.url));
  }

  // V1 — une identité non vérifiée n'atteint NI la cérémonie NI le Dashboard.
  if (isProtected(path) && user && !user.email_confirmed_at) {
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  return response;
}

export async function middleware(request: NextRequest) {
  // La DÉCISION est extraite (lib/routing/routeKind) ; le middleware n'exécute plus
  // que le régime choisi. Comportement inchangé — cf. routeKind.test.ts, qui compare
  // la fonction extraite à une réimplémentation littérale de la logique d'origine.
  //   • `app`  → garde de session (refresh toujours), JAMAIS de locale ;
  //   • `intl` → next-intl (rendu localisé, ou ajout de la locale : 307, WEB-D5).
  return routeKind(request.nextUrl.pathname) === 'app'
    ? appSession(request)
    : intlMiddleware(request);
}

export const config = {
  // Couvre site + routes app ; exclut _next static/image, favicon et tout
  // chemin à extension (assets). La garde reste appelée sur /dashboard etc.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
