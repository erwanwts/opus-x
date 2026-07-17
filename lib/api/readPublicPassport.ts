/**
 * =====================================================================
 * Opus X — Lecteur PUBLIC unique du Passport  (§4.3, §5.3)
 * =====================================================================
 * SOURCE UNIQUE de la vue publique : la route JSON `GET /passports/{handle}`
 * ET la page HTML `/p/{handle}` consomment CE lecteur — jamais deux requêtes
 * parallèles, jamais deux projections. Le périmètre public est donc identique
 * PAR CONSTRUCTION, pas par discipline.
 *
 * ANON (aucune session) : l'anon ne lit AUCUNE table brute — il lit la vue
 * `public_passport_view` (WEB-003 Lot 3), qui ne projette que les colonnes
 * publiques des seules lignes `visibility='public'`. Un handle inexistant ET un
 * Passport privé/unlisted/inaccessible renvoient le MÊME résultat vide → `null`
 * → 404. NON-ÉNUMÉRATION : privé indistinct d'inexistant — même chemin, même
 * absence de branche, même timing.
 *
 * La vue joint `profiles` (illisible par anon) pour servir `display_name` /
 * `headline` SANS jamais exposer `profiles` ni un champ interne (profile_id,
 * id, status, opus_id, email — Point B fermé à la racine).
 *
 * PROJECTION : passe EXCLUSIVEMENT par `buildPublicPassport()` (whitelist §5.3).
 * Jamais un spread, jamais un champ interne. Le lecteur reste la SOURCE UNIQUE
 * (route JSON + page HTML).
 * =====================================================================
 */
import { createPublicClient } from '@/lib/supabase/public';
import { buildPublicPassport, type PublicPassport } from '@/lib/api/publicPassport';

/**
 * Vue publique whitelistée d'un Passport, ou `null` si aucune ligne publique.
 * La vue `public_passport_view` ne contient QUE des lignes `visibility='public'`
 * (aucune en Sprint 1 tant qu'aucun partage n'est ouvert).
 */
export async function fetchPublicPassport(handle: string): Promise<PublicPassport | null> {
  const supabase = createPublicClient();

  // La vue filtre déjà visibility='public'. Handle inexistant OU non public →
  // même résultat (aucune ligne). display_name/headline viennent du join profiles.
  const { data } = await supabase
    .from('public_passport_view')
    .select('handle, lifecycle_stage, display_name, headline')
    .eq('handle', handle)
    .maybeSingle();

  if (!data) return null; // ← chemin unique : inexistant == non public.

  // Projection whitelistée. `display_name`/`headline` proviennent de la vue
  // (join profiles) ; `verified`/`trust_status`/`skills_status`/`evidence` ne
  // sont pas portés par la vue en Sprint 1 → valeurs sûres par défaut. Aucune
  // donnée n'est inventée.
  return buildPublicPassport({
    display_name: data.display_name ?? null,
    headline: data.headline ?? null,
    lifecycle_stage: data.lifecycle_stage,
    verified: false,
    trust_status: 'establishing',
    skills_status: 'empty',
    evidence: [],
  });
}
