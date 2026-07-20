/**
 * =====================================================================
 * GET /frameworks/{id}/skills   (Sprint 2 · LOT O0)
 * =====================================================================
 * Endpoint de DÉCOUVERTE. Un Issuer découvre les Skills d'un Framework et
 * leurs identifiants canoniques — SANS configuration spécifique (D9).
 *
 * `{id}` accepte l'identifiant canonique ('framework:wtr') OU le slug ('world-trader').
 *
 * ADRESSAGE — deux portes, pas trois. Chaque représentation canonique a SON adresse :
 * `framework:wtf` / slug `wtf`, et `framework:wtr` / slug `world-trader`. L'id NU `wtr`
 * n'est ni l'un ni l'autre : il ne résout pas (404). C'est délibéré — `wtr` est le
 * short-id porté par les FAITS (`framework.id` d'une Evidence), pas une adresse de
 * découverte. Lui ouvrir une troisième porte recréerait l'ambiguïté que la
 * réidentification supprime. La représentation antérieure reste consultable à
 * `/frameworks/wtf`, avec son statut dérivé `reidentified` — aucune redirection.
 *
 * Appelé en ANON (savoir public) : les définitions publiées sont lisibles par
 * tous (RLS `using (true)`). Aucune écriture n'est exposée — la zone
 * sémantique est append-only, publiée par migration.
 *
 * NON-ÉNUMÉRATION cohérente avec le Sprint 1 : un Framework inexistant renvoie
 * un 404 neutre.
 *
 * Multi-Issuer PAR CONCEPTION (W7) : rien ici ne nomme, ni ne conditionne, un
 * Issuer particulier. Le même endpoint sert tout Issuer conforme au WSP.
 * =====================================================================
 */
import type { NextRequest } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';
import {
  buildFrameworkDiscovery,
  type SkillRow,
  type ReidentificationRow,
} from '@/lib/api/frameworkDiscovery';
import { apiJson, notFound } from '@/lib/api/http';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createPublicClient();

  // Résolution par identifiant canonique OU slug — un Issuer peut utiliser l'un
  // ou l'autre sans configuration.
  const { data: framework } = await supabase
    .from('wsp_frameworks')
    .select('id, slug, name, publisher')
    .or(`id.eq.${id},slug.eq.${id}`)
    .maybeSingle();

  if (!framework) return notFound();

  // La version publiée la plus récente : c'est sous elle que les Skills sont
  // exposées à la découverte.
  const { data: version } = await supabase
    .from('wsp_framework_versions')
    .select('version, status, effective_date')
    .eq('framework_id', framework.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!version) return notFound();

  const { data: skills } = await supabase
    .from('wsp_skills')
    .select('id, code, name, framework_version, levels:wsp_skill_levels(slug, label, rank, observation_min, observation_max)')
    .eq('framework_id', framework.id)
    .eq('framework_version', version.version)
    .order('code');

  // Statut d'identité DÉRIVÉ : les relations `reidentified_as` (OCR-007) qui
  // touchent CE Framework, dans un sens ou dans l'autre. Le statut n'est jamais
  // stocké — il n'existe que par l'existence d'une ligne. Une définition
  // réidentifiée reste publiée et consultable à son adresse propre.
  const { data: reidentifications } = await supabase
    .from('wsp_reidentifications')
    .select('prior_id, canonical_id')
    .eq('prior_type', 'framework')
    .or(`prior_id.eq.${framework.id},canonical_id.eq.${framework.id}`);

  const discovery = buildFrameworkDiscovery(
    framework,
    version,
    (skills ?? []) as SkillRow[],
    (reidentifications ?? []) as ReidentificationRow[]
  );

  return apiJson(discovery);
}
