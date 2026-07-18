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
 * Skills et Evidence (Lot 5) suivent le MÊME motif : deux vues security-definer
 * dédiées (`public_passport_skills_view`, `public_passport_evidence_view`), donc
 * `skills` / `evidence` restent illisibles en brut par anon, et le `payload` /
 * la `description` d'une Evidence sont STRUCTURELLEMENT hors d'atteinte — pas
 * seulement filtrés ici. Ces deux lectures n'ont lieu QU'APRÈS le null-check :
 * un handle absent/privé ne déclenche AUCUNE requête supplémentaire, donc le
 * timing du 404 reste indistinguable (non-énumération intacte).
 *
 * SOURCE UNIQUE : c'est cette FONCTION qui est unique, pas le nombre d'allers-
 * retours. La route JSON et la page HTML consomment le même objet whitelisté.
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
 * Les vues ne contiennent QUE des lignes `visibility='public'`.
 */
export async function fetchPublicPassport(handle: string): Promise<PublicPassport | null> {
  const supabase = createPublicClient();

  // La vue filtre déjà visibility='public'. Handle inexistant OU non public →
  // même résultat (aucune ligne). display_name/headline viennent du join profiles.
  // `verified` et `skills_status` sont DÉRIVÉS par la vue (jamais stockés).
  const { data } = await supabase
    .from('public_passport_view')
    .select('handle, lifecycle_stage, display_name, headline, issued_at, is_demo, verified, skills_status')
    .eq('handle', handle)
    .maybeSingle();

  if (!data) return null; // ← chemin unique : inexistant == non public.

  // Listes publiques — lues seulement une fois la ligne publique confirmée.
  const [{ data: skillRows }, { data: evidenceRows }] = await Promise.all([
    supabase.from('public_passport_skills_view').select('name').eq('handle', handle).order('name'),
    supabase
      .from('public_passport_evidence_view')
      .select('type, title, verified, issued_at')
      .eq('handle', handle)
      .order('issued_at', { ascending: false }),
  ]);

  // Projection whitelistée. `trust_status` reste un défaut sûr : le moteur Trust
  // n'existe pas (capacité PLANIFIÉE — doctrine G1) et la carte ne le rend pas.
  // `issuer` : aucune colonne au schéma (trou assumé, Lot 5) → null, jamais inventé.
  return buildPublicPassport({
    display_name: data.display_name ?? null,
    headline: data.headline ?? null,
    lifecycle_stage: data.lifecycle_stage,
    issued_at: data.issued_at ?? null,
    verified: data.verified ?? false,
    is_demo: data.is_demo ?? false,
    trust_status: 'establishing',
    skills_status: data.skills_status ?? 'empty',
    skills: skillRows ?? [],
    evidence: (evidenceRows ?? []).map((e) => ({
      type: e.type,
      title: e.title,
      verified: e.verified,
      issued_at: e.issued_at ?? null,
      issuer: null,
    })),
  });
}
