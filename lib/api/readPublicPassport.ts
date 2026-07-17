/**
 * =====================================================================
 * Opus X — Lecteur PUBLIC unique du Passport  (§4.3, §5.3)
 * =====================================================================
 * SOURCE UNIQUE de la vue publique : la route JSON `GET /passports/{handle}`
 * ET la page HTML `/p/{handle}` consomment CE lecteur — jamais deux requêtes
 * parallèles, jamais deux projections. Le périmètre public est donc identique
 * PAR CONSTRUCTION, pas par discipline.
 *
 * ANON (aucune session) : la RLS n'applique que la policy publique
 * (`visibility = 'public'`), jamais la policy propriétaire. Un handle
 * inexistant ET un Passport privé/unlisted/inaccessible renvoient le MÊME
 * résultat vide → `null` → 404. NON-ÉNUMÉRATION : privé indistinct
 * d'inexistant — même chemin, même absence de branche, même timing.
 *
 * PROJECTION : passe EXCLUSIVEMENT par `buildPublicPassport()` (whitelist §5.3).
 * Jamais un spread, jamais un champ interne (email, payload brut, opus_id…).
 * =====================================================================
 */
import { createPublicClient } from '@/lib/supabase/public';
import { buildPublicPassport, type PublicPassport } from '@/lib/api/publicPassport';

/**
 * Vue publique whitelistée d'un Passport, ou `null` si aucune ligne publique.
 * Sprint 1 : renvoie TOUJOURS `null` (aucun Passport n'est public — privé par
 * défaut). La whitelist est néanmoins branchée : le jour où le partage
 * s'ouvrira, seuls les champs whitelistés sortiront.
 */
export async function fetchPublicPassport(handle: string): Promise<PublicPassport | null> {
  const supabase = createPublicClient();

  // Anon + filtre visibility='public' : en Sprint 1, aucune ligne ne remonte.
  // Handle inexistant OU Passport non public → même résultat (aucune ligne).
  const { data } = await supabase
    .from('passports')
    .select('handle, lifecycle_stage, visibility')
    .eq('handle', handle)
    .eq('visibility', 'public')
    .maybeSingle();

  if (!data) return null; // ← chemin unique : inexistant == non public.

  // Projection whitelistée. En Sprint 1, l'anon ne lit que les colonnes de
  // `passports` (handle, lifecycle_stage, visibility) : display_name / headline
  // (table `profiles`) et les Evidence restent hors de portée → null / empty.
  // Aucune donnée n'est inventée ; seul `lifecycle_stage` provient de la ligne.
  return buildPublicPassport({
    display_name: null,
    headline: null,
    lifecycle_stage: data.lifecycle_stage,
    verified: false,
    trust_status: 'establishing',
    skills_status: 'empty',
    evidence: [],
  });
}
