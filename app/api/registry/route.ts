/**
 * GET /api/registry — index du registre canonique (depuis _manifest.json).
 * Statique : le registre est figé, généré au build.
 */
import { registryIndex, registryResponse } from '@/lib/registry/api';

export const dynamic = 'force-static';

export function GET() {
  return registryResponse(registryIndex());
}
