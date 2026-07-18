/**
 * GET /api/concepts — les 41 protocol_concept (nœuds sans Record propre).
 * Statique.
 */
import { conceptList, registryResponse } from '@/lib/registry/api';

export const dynamic = 'force-static';

export function GET() {
  return registryResponse(conceptList());
}
