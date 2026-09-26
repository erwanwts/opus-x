/**
 * =====================================================================
 * Opus X — Lecteur TOKEN-SCOPÉ du Passport (T-B, D-058→D-062)
 * =====================================================================
 * La « sortie » : un tiers consulte un passeport via un lien tokenisé
 * (/verify/{token}). Le token OUTREPASSE le privé (D-T1) mais ne révèle QUE
 * les compétences PUBLIÉES (D-042 conservé). Toute la garde est EN BASE
 * (`resolve_share_token`, security definer) : ici on ne fait que projeter le
 * résultat par la MÊME whitelist que la page publique (`buildPublicPassport`).
 *
 * NON-ÉNUMÉRATION : token inconnu / révoqué / passeport sans compétence publiée
 * → la RPC renvoie `null` → `null` ici → 404. Aucune branche distingue ces cas.
 * Jamais exposés : opus_id, passport_id, le token, le contenu de preuve brut.
 * =====================================================================
 */
import { createPublicClient } from '@/lib/supabase/public';
import { buildPublicPassport, type PublicPassport } from '@/lib/api/publicPassport';

type SharedRow = {
  handle: string;
  display_name: string | null;
  headline: string | null;
  lifecycle_stage: string;
  issued_at: string | null;
  competencies: {
    skill_id: string;
    skill_name: string | null;
    state: string;
    basis_level: string | null;
    evidence_provenance: { issuer_name?: string | null; occurred_at?: string | null }[] | null;
  }[] | null;
};

/** Projection publique whitelistée d'un passeport résolu PAR TOKEN, ou `null`. */
export async function fetchSharedPassport(
  token: string
): Promise<{ passport: PublicPassport; handle: string } | null> {
  const supabase = createPublicClient();

  // Toute la logique (token actif, outrepasse visibility, published conservé,
  // périmètre vide → null) est dans la RPC. On reçoit soit null, soit la
  // projection token-scopée. Aucun accès table brut, aucun filtre côté client.
  const { data, error } = await supabase.rpc('resolve_share_token', { p_token: token });
  if (error || !data) return null; // ← chemin unique : inconnu == révoqué == vide.

  const row = data as SharedRow;

  const competencies = (row.competencies ?? []).map((c) => ({
    skill_id: c.skill_id,
    skill_name: c.skill_name ?? null,
    state: c.state,
    basis_level: c.basis_level ?? null,
    provenance: (c.evidence_provenance ?? []).map((p) => ({
      issuer_name: p.issuer_name ?? null,
      occurred_at: p.occurred_at ?? null,
    })),
  }));

  // Résumés DÉRIVÉS du réel — MÊME logique que le lecteur public (OCR-126).
  const anyEstablished = competencies.some((c) => c.state === 'established');
  const anyEmerging = competencies.some((c) => c.state === 'emerging');

  const passport = buildPublicPassport({
    display_name: row.display_name ?? null,
    headline: row.headline ?? null,
    lifecycle_stage: row.lifecycle_stage,
    issued_at: row.issued_at ?? null,
    verified: anyEstablished,
    trust_status: anyEstablished ? 'established' : anyEmerging ? 'emerging' : 'establishing',
    skills_status: competencies.length > 0 ? 'active' : 'empty',
    evidence: [],
    competencies,
  });

  return { passport, handle: row.handle };
}
