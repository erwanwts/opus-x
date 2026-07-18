/**
 * =====================================================================
 * Opus X — Accès aux données du registre canonique (build-time)
 * =====================================================================
 * SOURCE UNIQUE de lecture des artefacts figés du pipeline WSP-001 :
 *   • content/registry/wsp-graph.json        (le Knowledge Graph V1)
 *   • content/registry/_manifest.json        (l'index des Records)
 *   • docs/web/registry-import/OCR-100/*.md   (les 26+6 Records canoniques)
 *
 * Ces lectures se font AU BUILD (les routes /api/* sont `force-static`) : rien
 * n'est lu par requête. Aucune donnée n'est inventée — on projette le figé.
 *
 * Réutilisable par les futures pages GEO (même module d'accès).
 * =====================================================================
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ROOT = process.cwd();
const REGISTRY_DIR = path.join(ROOT, 'content', 'registry');
const RECORDS_DIR = path.join(ROOT, 'docs', 'web', 'registry-import', 'OCR-100');

function readJson<T>(p: string): T {
  return JSON.parse(readFileSync(p, 'utf8')) as T;
}

// ─── Types (minimaux, alignés sur les fichiers réels) ────────────────────────
export interface GraphNode {
  id: string;
  type: 'internal' | 'external';
  label: string;
  node_type: string;
  node_scope: string;
  canonical?: boolean;
  registry_entry?: boolean;
  specialization_of?: string;
  geo_page?: boolean;
  standard_ref?: string;
  requires_manual_resolution?: boolean;
  candidates?: string[];
}
export interface GraphEdge {
  source: string;
  predicate: string | null;
  target: string;
  edge_type: string;
  semantic_stability: string | null;
  flipped: boolean;
  reflexive: boolean;
  via: string | null;
  note: string | null;
  schema_edge?: boolean;
  edge_origin?: string;
  provenance: { record: string; line: number | null; raw: string; source_predicate: string | null; cascade_resolved?: boolean };
}
export interface Graph {
  _meta: { resolution_commit: string; resolution_version: string; [k: string]: unknown };
  nodes: GraphNode[];
  edges: GraphEdge[];
}
export interface ManifestRecord {
  source_filename: string;
  document_id: string;
  title: string;
  canonical_id: string;
  version: string;
  lifecycle_status: string;
  normative_informative: string;
  checksum_sha256: string;
}
export interface Manifest {
  schema: string;
  records: ManifestRecord[];
}

// ─── Chargement mémoïsé (une seule lecture par build) ─────────────────────────
let _graph: Graph | null = null;
let _graphVersion: string | null = null;
export function loadGraph(): Graph {
  if (!_graph) {
    const raw = readFileSync(path.join(REGISTRY_DIR, 'wsp-graph.json'), 'utf8');
    _graph = JSON.parse(raw) as Graph;
    // graph_version : checksum du fichier figé, calculé À LA LECTURE (on ne
    // touche NI au graphe NI à build-graph.mjs). Change si le graphe change.
    _graphVersion = 'sha256:' + createHash('sha256').update(raw).digest('hex').slice(0, 16);
  }
  return _graph;
}

/** Checksum du fichier wsp-graph.json figé (identité de version du graphe). */
export function graphVersion(): string {
  if (!_graphVersion) loadGraph();
  return _graphVersion as string;
}

let _manifest: Manifest | null = null;
export function loadManifest(): Manifest {
  if (!_manifest) _manifest = readJson<Manifest>(path.join(REGISTRY_DIR, '_manifest.json'));
  return _manifest;
}

/** Les Records réellement présents comme fichiers OCR-1xx/0xx (pas les exclus). */
export function registryRecords(): ManifestRecord[] {
  return loadManifest().records.filter((r) => /^OCR-\d+$/.test(r.document_id));
}

// ─── Parsing d'un Record (tableau d'en-tête + sections) ───────────────────────
export interface RecordDoc {
  id: string;
  title: string;
  metadata: Record<string, string>;
  sections: Record<string, string>;
  checksum: string;
}

/** Charge et parse un Record par son id (OCR-101…). null si inconnu/absent. */
export function loadRecord(id: string): RecordDoc | null {
  const rec = loadManifest().records.find((r) => r.document_id === id);
  if (!rec) return null;
  let md: string;
  try {
    md = readFileSync(path.join(RECORDS_DIR, rec.source_filename), 'utf8');
  } catch {
    return null;
  }

  const title = (md.match(/^#\s+(.+?)\s*$/m) || [, id])[1];

  // Tableau d'en-tête : lignes « | **Field** | Value | » (avant la 1re « ## »).
  const metadata: Record<string, string> = {};
  const headEnd = md.search(/\n##\s/);
  const head = headEnd === -1 ? md : md.slice(0, headEnd);
  for (const line of head.split(/\r?\n/)) {
    const m = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|\s*(.*?)\s*\|\s*$/);
    if (m) metadata[m[1].trim()] = m[2].replace(/`/g, '').trim();
  }

  // Sections : « ## Name » jusqu'à la prochaine « ## » (ou fin). Markdown brut.
  const sections: Record<string, string> = {};
  const re = /\n##\s+(.+?)\s*\n([\s\S]*?)(?=\n##\s|\n#\s|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) sections[m[1].trim()] = m[2].trim();

  return { id, title, metadata, sections, checksum: rec.checksum_sha256 };
}
