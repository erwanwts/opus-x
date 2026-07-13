/**
 * =====================================================================
 * GET /me · PATCH /me   (LOT 8 · §4.2)
 * =====================================================================
 * Profil courant, sous JWT (§4.6). Sélection de colonnes EXPLICITE : l'email
 * vit dans auth.users, jamais dans `profiles` — et n'est de toute façon jamais
 * renvoyé ici. PATCH n'accepte que les champs autorisés (§4.2).
 * =====================================================================
 */
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiJson, unauthorized, notFound, badRequest } from '@/lib/api/http';

const PROFILE_COLUMNS = 'id, opus_id, full_name, headline, avatar_url, locale, created_at';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return notFound();
  return apiJson(data);
}

// Seuls ces champs sont modifiables (§4.2). Tout autre champ est ignoré.
const PATCHABLE = ['full_name', 'headline', 'avatar_url', 'locale'] as const;

export async function PATCH(request: NextRequest) {
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

  const patch: Record<string, string> = {};
  for (const key of PATCHABLE) {
    const value = body[key];
    if (value === undefined) continue;
    if (typeof value !== 'string') return badRequest(`Champ « ${key} » invalide.`);
    patch[key] = value;
  }

  if (Object.keys(patch).length === 0) {
    return badRequest('Aucun champ modifiable fourni.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(patch) // RLS : profiles_update_self garantit id = auth.uid()
    .eq('id', user.id)
    .select(PROFILE_COLUMNS)
    .maybeSingle();

  if (error) return badRequest('Mise à jour refusée.');
  if (!data) return notFound();
  return apiJson(data);
}
