/**
 * =====================================================================
 * GET /passports/{handle}   (LOT 8 · §4.3, §5.3)
 * =====================================================================
 * Endpoint PUBLIC du Passport. Délègue au lecteur UNIQUE
 * `fetchPublicPassport()` (lib/api/readPublicPassport) — la MÊME source que la
 * page HTML /p/{handle}. Le périmètre public est donc identique par
 * construction : impossible qu'un canal expose plus que l'autre.
 *
 * SPRINT 1 : renvoie TOUJOURS 404 (aucun Passport n'est public — privé par
 * défaut). La whitelist (§5.3) reste branchée dans le lecteur : le jour où le
 * partage s'ouvrira, seuls les champs whitelistés sortiront (jamais email,
 * jamais payload brut).
 *
 * NON-ÉNUMÉRATION : un handle inexistant ET un Passport non public renvoient
 * le MÊME 404, corps identique — impossible de déduire l'existence d'une
 * identité.
 * =====================================================================
 */
import type { NextRequest } from 'next/server';
import { fetchPublicPassport } from '@/lib/api/readPublicPassport';
import { apiJson, notFound } from '@/lib/api/http';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  const view = await fetchPublicPassport(handle);
  if (!view) return notFound(); // inexistant == non public → 404 identique.

  return apiJson(view);
}
