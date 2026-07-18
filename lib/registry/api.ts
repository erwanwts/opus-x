/**
 * =====================================================================
 * Opus X — API canonique V1 : mise en forme des réponses (build-time)
 * =====================================================================
 * Projette les artefacts figés (source.ts) en réponses JSON stables. Aucune
 * donnée inventée : ce qui n'existe pas dans le corpus sort `null` + `_gaps`.
 *
 * JSON pur en V1 (pas de JSON-LD : @context viendra au Lot 3 après OCR-013).
 * =====================================================================
 */
import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { loadGraph, loadManifest, registryRecords, loadRecord, graphVersion, type GraphNode, type GraphEdge } from './source';

// ─── Enveloppe _meta + réponse ETag (déterministe) ────────────────────────────
// Triptyque de versions demandé par l'architecte : context_version /
// registry_version / graph_version. context_version arrivera au Lot 3 (OCR-013).
export function apiMeta(source: string): Record<string, unknown> {
  const g = loadGraph();
  return {
    api: 'wsp-canonical/v1',
    source,
    context_version: null, // Lot 3 (OCR-013 / @context)
    registry_version: loadManifest().schema, // schéma du registre (_manifest)
    graph_version: graphVersion(), // checksum du wsp-graph.json figé (calculé à la lecture)
    resolution_version: g._meta.resolution_version,
    resolution_commit: g._meta.resolution_commit,
  };
}

/** Réponse JSON figée : ETag stable (hash du corps), Cache-Control revalidable. */
export function registryResponse(data: unknown): NextResponse {
  const body = JSON.stringify(data);
  const etag = '"' + createHash('sha256').update(body).digest('hex').slice(0, 32) + '"';
  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      etag,
      'cache-control': 'public, max-age=3600, must-revalidate',
    },
  });
}

export function notFoundResponse(): NextResponse {
  return NextResponse.json({ error: { code: 'not_found', message: 'Introuvable.' } }, { status: 404 });
}

// ─── /api/registry ────────────────────────────────────────────────────────────
export function registryIndex() {
  const records = registryRecords().map((r) => ({
    id: r.document_id,
    canonical_id: r.canonical_id,
    name: r.title.replace(/^OCR-\d+\s*[—–-]\s*/, ''),
    version: r.version,
    status: r.lifecycle_status,
    normative_informative: r.normative_informative,
    checksum: r.checksum_sha256,
    href: `/api/registry/${r.document_id}`,
  }));
  return { _meta: apiMeta('_manifest.json'), count: records.length, records };
}

export function recordIds(): string[] {
  return registryRecords().map((r) => r.document_id);
}

// ─── /api/registry/[id] ───────────────────────────────────────────────────────
export function recordDetail(id: string) {
  const doc = loadRecord(id);
  if (!doc) return null;
  return {
    _meta: apiMeta(id),
    id: doc.id,
    title: doc.title,
    checksum: doc.checksum,
    metadata: doc.metadata, // les champs du tableau d'en-tête, tels quels
    sections: doc.sections, // TOUTES les sections, markdown brut
  };
}

// ─── /api/graph ───────────────────────────────────────────────────────────────
export function graphFull() {
  const g = loadGraph();
  // Le triptyque de versions doit être sur CHAQUE réponse : on le fusionne
  // au _meta natif du graphe (qui porte counts/note), sans altérer nodes/edges.
  return { ...g, _meta: { ...apiMeta('wsp-graph.json'), ...g._meta } };
}

// ─── /api/graph/[id] ──────────────────────────────────────────────────────────
export function graphNodeIds(): string[] {
  return loadGraph().nodes.map((n) => n.id);
}

export function graphNeighborhood(id: string) {
  const g = loadGraph();
  const node = g.nodes.find((n) => n.id === id);
  if (!node) return null;
  const out = g.edges.filter((e) => e.source === id);
  const inc = g.edges.filter((e) => e.target === id);
  const via = g.edges.filter((e) => e.via === id);
  return {
    _meta: apiMeta('wsp-graph.json'),
    node,
    counts: { out: out.length, in: inc.length, via: via.length },
    edges_out: out,
    edges_in: inc,
    edges_via: via,
  };
}

// ─── Concepts (protocol_concept) ──────────────────────────────────────────────
const CONCEPT_TYPE = 'protocol_concept';
const slugOf = (id: string) => id.replace(/^ext:/, '');
const idOf = (slug: string) => (slug.startsWith('ext:') ? slug : 'ext:' + slug);

function conceptNodes(): GraphNode[] {
  return loadGraph().nodes.filter((n) => n.node_type === CONCEPT_TYPE);
}

/** Records d'origine d'un nœud : les Records dont une arête touche ce nœud. */
function recordsForNode(id: string, edges: GraphEdge[]): string[] {
  const recs = new Set<string>();
  for (const e of edges) {
    if (e.source === id || e.target === id || e.via === id) recs.add(e.provenance.record);
  }
  return [...recs].filter((r) => /^OCR-\d+$/.test(r)).sort();
}

// ─── /api/concepts ────────────────────────────────────────────────────────────
export function conceptList() {
  const edges = loadGraph().edges;
  const concepts = conceptNodes()
    .map((n) => ({
      slug: slugOf(n.id),
      label: n.label,
      specialization_of: n.specialization_of ?? null,
      records: recordsForNode(n.id, edges),
      // V1 : aucune définition dans le corpus → toujours false (voir _gaps).
      has_definition: false,
      href: `/api/concepts/${slugOf(n.id)}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return { _meta: apiMeta('wsp-graph.json'), count: concepts.length, concepts };
}

export function conceptSlugs(): string[] {
  return conceptNodes().map((n) => slugOf(n.id));
}

// ─── /api/concepts/[slug] ─────────────────────────────────────────────────────
export function conceptDetail(slug: string) {
  const g = loadGraph();
  const node = g.nodes.find((n) => n.id === idOf(slug) && n.node_type === CONCEPT_TYPE);
  if (!node) return null;

  const id = node.id;
  const rel = (list: GraphEdge[]) => list.map((e) => ({ predicate: e.predicate, source: e.source, target: e.target, via: e.via, semantic_stability: e.semantic_stability }));

  // Champs ABSENTS du corpus V1 — jamais fabriqués. Voir _gaps.
  const gaps = ['definition', 'alias', 'semantic_status'];

  return {
    _meta: apiMeta('wsp-graph.json'),
    slug,
    name: node.label,
    classification: {
      node_type: node.node_type,
      canonical: node.canonical ?? null,
      registry_entry: node.registry_entry ?? null,
      specialization_of: node.specialization_of ?? null,
    },
    records: recordsForNode(id, g.edges),
    relations: {
      out: rel(g.edges.filter((e) => e.source === id)),
      in: rel(g.edges.filter((e) => e.target === id)),
      via: rel(g.edges.filter((e) => e.via === id)),
    },
    definition: null, // 29/41 absents, 5 en conflit → source future OCR-013 (Lot 3)
    alias: null, // aucune source dans le corpus
    semantic_status: null, // semantic_stability existe sur les ARÊTES, pas sur un concept
    geo_page: { planned: true, href: `/concepts/${slug}` },
    _gaps: gaps,
    _gaps_note: 'Champs absents du corpus V1 — jamais fabriqués. Définitions attendues d\'OCR-013 (glossaire, lot ultérieur).',
  };
}
