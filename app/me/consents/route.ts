/**
 * =====================================================================
 * GET /me/consents · POST /me/consents   (LOT 8 · §4.5)
 * =====================================================================
 * Journal de consentement (RGPD §5.4), sous JWT et RLS propriétaire.
 *
 * POST est IDEMPOTENT : l'index unique (profile_id, type, version) garantit
 * qu'un consentement rejoué ne crée pas de doublon. Le format de version suit
 * l'amendement architecte (vX.Y.Z) posé au Lot 4 — un format hérité (« 2026-07 »)
 * est rejeté par la contrainte de base, donc refusé ici en 400.
 *
 * GET n'expose pas ip / user_agent (minimisation) — seulement ce qui décrit le
 * consentement lui-même.
 * =====================================================================
 */
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiJson, unauthorized, badRequest } from '@/lib/api/http';

const ALLOWED_TYPES = ['terms', 'privacy', 'partner_ingestion', 'public_share'];
const VERSION_RE = /^v\d+\.\d+\.\d+$/; // aligné sur la contrainte de base (amendement)
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const { data, error } = await supabase
    .from('consents')
    .select('type, granted, version, effective_date, granted_at, revoked_at')
    .eq('profile_id', user.id)
    .order('granted_at', { ascending: false });

  if (error) return badRequest('Lecture refusée.');
  return apiJson({ consents: data ?? [] });
}

export async function POST(request: NextRequest) {
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

  const type = body.type;
  const version = body.version;
  const granted = body.granted;
  const effectiveDate = body.effective_date;

  if (typeof type !== 'string' || !ALLOWED_TYPES.includes(type)) {
    return badRequest('Type de consentement invalide.');
  }
  if (typeof version !== 'string' || !VERSION_RE.test(version)) {
    return badRequest('Version invalide (format attendu : vX.Y.Z).');
  }
  if (typeof granted !== 'boolean') {
    return badRequest('Le champ « granted » doit être un booléen.');
  }
  if (effectiveDate !== undefined && (typeof effectiveDate !== 'string' || !DATE_RE.test(effectiveDate))) {
    return badRequest('Date d’entrée en vigueur invalide (attendu : YYYY-MM-DD).');
  }

  // Idempotent : ignoreDuplicates sur (profile_id, type, version).
  const { error } = await supabase.from('consents').upsert(
    {
      profile_id: user.id,
      type,
      version,
      granted,
      ...(effectiveDate ? { effective_date: effectiveDate } : {}),
    },
    { onConflict: 'profile_id,type,version', ignoreDuplicates: true }
  );

  if (error) return badRequest('Enregistrement refusé.');
  return apiJson({ ok: true }, 201);
}
