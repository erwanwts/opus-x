/**
 * Client Supabase — CÔTÉ NAVIGATEUR.
 * Clé anon uniquement. La RLS est la barrière (spec §3.11).
 * ⚠️ JAMAIS de service_role ici.
 */
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
