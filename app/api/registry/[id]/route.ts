/**
 * GET /api/registry/[id] — un Record : métadonnées (tableau d'en-tête) +
 * TOUTES les sections en markdown brut. Statique (generateStaticParams).
 */
import { recordDetail, recordIds, registryResponse, notFoundResponse } from '@/lib/registry/api';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return recordIds().map((id) => ({ id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = recordDetail(id);
  return data ? registryResponse(data) : notFoundResponse();
}
