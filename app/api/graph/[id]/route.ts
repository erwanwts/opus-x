/**
 * GET /api/graph/[id] — voisinage d'un nœud (arêtes entrantes/sortantes/via).
 * id = OCR-101 (Record) ou ext:evidence-link (concept/externe). Statique.
 */
import { graphNeighborhood, graphNodeIds, registryResponse, notFoundResponse } from '@/lib/registry/api';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return graphNodeIds().map((id) => ({ id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = graphNeighborhood(id);
  return data ? registryResponse(data) : notFoundResponse();
}
