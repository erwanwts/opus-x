/**
 * GET /api/concepts/[slug] — un concept protocolaire. Les champs absents du
 * corpus V1 (definition, alias, semantic_status) sortent `null` + `_gaps` —
 * jamais fabriqués. Statique (generateStaticParams).
 */
import { conceptDetail, conceptSlugs, registryResponse, notFoundResponse } from '@/lib/registry/api';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return conceptSlugs().map((slug) => ({ slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = conceptDetail(slug);
  return data ? registryResponse(data) : notFoundResponse();
}
