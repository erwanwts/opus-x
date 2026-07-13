/**
 * =====================================================================
 * GET /me/passport · PATCH /me/passport   (LOT 8 · §4.3)
 * =====================================================================
 * GET  → le Passport courant (§4.3), sous JWT. opus_id vient du profil (§3.3).
 * PATCH → préparé mais DÉSACTIVÉ en Sprint 1 : 403 feature_disabled.
 * =====================================================================
 */
import { createClient } from '@/lib/supabase/server';
import { apiJson, unauthorized, notFound, featureDisabled } from '@/lib/api/http';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  // Le Passport (RLS propriétaire) + l'opus_id du profil (identité canonique).
  const [{ data: passport }, { data: profile }] = await Promise.all([
    supabase
      .from('passports')
      .select('id, handle, visibility, lifecycle_stage, issued_at, status')
      .eq('profile_id', user.id)
      .maybeSingle(),
    supabase.from('profiles').select('opus_id').eq('id', user.id).maybeSingle(),
  ]);

  if (!passport || !profile) return notFound();

  return apiJson({
    id: passport.id,
    opus_id: profile.opus_id,
    handle: passport.handle,
    visibility: passport.visibility,
    lifecycle_stage: passport.lifecycle_stage,
    issued_at: passport.issued_at,
    status: passport.status,
  });
}

export async function PATCH() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  // Édition handle/visibility préparée, désactivée en Sprint 1 (§4.3).
  return featureDisabled();
}
