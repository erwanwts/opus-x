/**
 * GET /api/graph — le Knowledge Graph V1 figé, entier (porte son propre _meta).
 * Statique.
 */
import { graphFull, registryResponse } from '@/lib/registry/api';

export const dynamic = 'force-static';

export function GET() {
  return registryResponse(graphFull());
}
