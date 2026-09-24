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
    .select('handle, lifecycle_stage, display_name, headline, issued_at')
    .eq('handle', handle)
    .maybeSingle();

  if (!data) return null; // ← chemin unique : inexistant == non public.

  // Palier 5 (D-044) — les compétences PUBLIÉES + leur Trust par compétence +
  // la provenance visible, depuis la vue sécurisée `public_passport_competencies`
  // (DOUBLE FILTRE visibility='public' ET published, D-042/D-043). L'anon lit la
  // vue, JAMAIS une table brute ; la garde back tient, le lecteur ne la contourne pas.
  const { data: comps } = await supabase
    .from('public_passport_competencies')
    .select('skill_id, skill_name, state, basis_level, evidence_provenance')
    .eq('handle', handle);

  const competencies = (comps ?? []).map((c) => ({
    skill_id: c.skill_id as string,
    skill_name: (c.skill_name as string | null) ?? null,
    state: c.state as string,
    basis_level: (c.basis_level as string | null) ?? null,
    provenance: (
      (c.evidence_provenance as { issuer_name?: string | null; occurred_at?: string | null }[]) ?? []
    ).map((p) => ({ issuer_name: p.issuer_name ?? null, occurred_at: p.occurred_at ?? null })),
  }));

  // Résumés DÉRIVÉS du réel (plus de stubs Sprint 1) : verified = ≥1 compétence
  // `established` ; trust_status = le plus haut état atteint « quelque part » (OCR-126).
  const anyEstablished = competencies.some((c) => c.state === 'established');
  const anyEmerging = competencies.some((c) => c.state === 'emerging');

  return buildPublicPassport({
    display_name: data.display_name ?? null,
    headline: data.headline ?? null,
    lifecycle_stage: data.lifecycle_stage,
    issued_at: data.issued_at ?? null,
    verified: anyEstablished,
    trust_status: anyEstablished ? 'established' : anyEmerging ? 'emerging' : 'establishing',
    skills_status: competencies.length > 0 ? 'active' : 'empty',
    evidence: [],
    competencies,
  });
}
