/**
 * Middleware — rafraîchit la session et protège les routes.
 *
 * V1 — GARDE DE VÉRIFICATION : on ne laisse accéder à la cérémonie et au
 * Dashboard qu'une identité RÉELLEMENT vérifiée (email_confirmed_at).
 * C'est la même condition que la garde du trigger d'émission en base :
 * défense en profondeur, jamais une seule ligne de défense.
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function middleware(request: NextRequest) {
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
  const isProtected =
    path.startsWith('/dashboard') ||
    path.startsWith('/emission') ||
    path === '/passport' ||
    path.startsWith('/passport/');

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/establish', request.url));
  }

  // V1 — une identité non vérifiée n'atteint NI la cérémonie NI le Dashboard.
  if (isProtected && user && !user.email_confirmed_at) {
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp)$).*)'],
};
