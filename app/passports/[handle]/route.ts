/**
 * =====================================================================
 * GET /passports/{handle}   (LOT 8 · §4.3, §5.3)
 * =====================================================================
 * Endpoint PUBLIC du Passport. Appelé en ANON (aucune session) : la RLS
 * n'applique que la policy publique (`visibility = 'public'`), jamais la
 * policy propriétaire — un utilisateur connecté et un anonyme voient la même
 * chose.
 *
 * SPRINT 1 : renvoie TOUJOURS 404 (aucun Passport n'est public — privé par
 * défaut). La whitelist (§5.3) est néanmoins branchée : le jour où le partage
 * s'ouvrira, seuls les champs whitelistés sortiront (jamais email, jamais
 * payload brut).
 *
 * NON-ÉNUMÉRATION : un handle inexistant ET un Passport non public renvoient
 * le MÊME 404 — impossible de déduire l'existence d'une identité.
 * =====================================================================
 */
import type { NextRequest } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';
import { buildPublicPassport } from '@/lib/api/publicPassport';
import { apiJson, notFound } from '@/lib/api/http';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const supabase = createPublicClient();

  // Anon + filtre visibility='public' : en Sprint 1, aucune ligne ne remonte.
  // Handle inexistant OU Passport privé → même résultat (aucune ligne) → 404.
  const { data } = await supabase
    .from('passports')
    .select('handle, lifecycle_stage, visibility')
    .eq('handle', handle)
    .eq('visibility', 'public')
    .maybeSingle();

  if (!data) return notFound(); // ← chemin unique du Sprint 1.

  // Chemin FUTUR (jamais atteint en Sprint 1) : projection whitelistée, jamais
  // un champ interne. Les champs non encore lisibles en anon restent nuls.
  const publicView = buildPublicPassport({
    display_name: null,
    headline: null,
    lifecycle_stage: data.lifecycle_stage,
    verified: false,
    trust_status: 'establishing',
    skills_status: 'empty',
    evidence: [],
  });

  return apiJson(publicView);
}
