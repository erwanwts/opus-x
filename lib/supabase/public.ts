/**
 * Client Supabase PUBLIC (anon, sans cookies) — pour l'endpoint public du
 * Passport (§4.3). Il ne porte AUCUNE session : la RLS applique la seule
 * policy publique (`visibility = 'public'`), jamais la policy propriétaire.
 * Ainsi, qu'un utilisateur connecté ou un anonyme appelle /passports/{handle},
 * il voit exactement la même chose — aucune fuite via la session.
 *
 * ⚠️ Clé anon uniquement. La RLS est la barrière (§3.11). Jamais de service_role.
 */
import { createClient } from '@supabase/supabase-js';

export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
