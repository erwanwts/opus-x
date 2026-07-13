/**
 * =====================================================================
 * GET /me/dashboard   (LOT 8 · §4.4)
 * =====================================================================
 * L'agrégat du Dashboard, sous JWT, dans la forme EXACTE de §4.4 :
 *   { passport, trust_status, skills_status, evidence_status }
 * AUCUN Frameworks (Décision 2). État vide VÉRIDIQUE (valeurs réelles).
 *
 * Réutilise le DashboardService (la lecture interne RLS reste la même
 * implémentation) ; ce handler n'en est que la surface HTTP destinée aux tiers.
 * =====================================================================
 */
import { createClient } from '@/lib/supabase/server';
import { DashboardService } from '@/lib/dashboard/DashboardService';
import { apiJson, unauthorized, notFound } from '@/lib/api/http';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const data = await new DashboardService(supabase).getDashboard();
  if (!data) return notFound();

  // Forme §4.4 stricte : le passport porte exactement 5 champs (ni id, ni
  // status). Les status gardent une forme garantie (jamais un score, §5.5).
  return apiJson({
    passport: {
      opus_id: data.passport.opus_id,
      handle: data.passport.handle,
      visibility: data.passport.visibility,
      lifecycle_stage: data.passport.lifecycle_stage,
      issued_at: data.passport.issued_at,
    },
    trust_status: data.trust_status ?? { state: 'establishing', score: null },
    skills_status: data.skills_status ?? { state: 'empty', count: 0, verified_count: 0 },
    evidence_status: data.evidence_status ?? { state: 'empty', count: 0 },
  });
}
