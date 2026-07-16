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

type CookieToSet = { name: string; value: string; options: CookieOptions };

const intlMiddleware = createMiddleware(routing);

// Premiers segments RÉSERVÉS à l'application / aux handlers (jamais localisés).
// Validés contre l'arborescence réelle (route groups dépliés) au Lot C2.
const RESERVED = new Set([
  'dashboard', 'emission', 'establish', 'verify-email', 'passport', 'link',
  'me', 'p', 'passports', 'auth', 'api', 'frameworks', 'issuers',
]);

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

function hasLocalePrefix(seg: string) {
  return (routing.locales as readonly string[]).includes(seg);
}

export async function middleware(request: NextRequest) {
  const first = request.nextUrl.pathname.split('/')[1] ?? '';
  // Déjà localisé (/en /fr /es) → next-intl.
  if (hasLocalePrefix(first)) return intlMiddleware(request);
  // Segment réservé app/handler → garde de session (refresh toujours), JAMAIS de locale.
  if (RESERVED.has(first)) return appSession(request);
  // Chemin de site non préfixé (/, /about, …) → next-intl ajoute la locale (307, WEB-D5).
  return intlMiddleware(request);
}

export const config = {
  // Couvre site + routes app ; exclut _next static/image, favicon et tout
  // chemin à extension (assets). La garde reste appelée sur /dashboard etc.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
