/**
 * =====================================================================
 * Opus X — ENTITÉS DU REGISTRE : prédicats, familles, types (Lot D)
 * =====================================================================
 * Trois familles de projections, toutes dérivées d'artefacts déjà publiés :
 *   • prédicats — `content/registry/ocr-007-resolution.json`, projection d'OCR-007 ;
 *   • familles  — regroupement des prédicats par leur champ `family` ;
 *   • types     — `node_type` des nœuds du Knowledge Graph.
 *
 * RD-009 — ces pages organisent, relient et présentent. Elles n'établissent rien :
 * chaque valeur affichée existe déjà dans un artefact publié, et rien n'est calculé
 * qui ne s'y trouve pas.
 *
 * AUCUNE PROSE. Ces entités n'ont pas de texte éditorial et n'en auront pas : leurs
 * métadonnées sont dérivées de leurs propres champs, jamais rédigées. Là où une
 * valeur manque, elle n'est pas produite — la lacune est tracée.
 * =====================================================================
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const RESOLUTION = path.join(process.cwd(), 'content/registry/ocr-007-resolution.json');
const GRAPH = path.join(process.cwd(), 'content/registry/wsp-graph.json');

/** Une forme de surface d'un prédicat : le libellé tel qu'un Record peut l'écrire. */
export interface PredicateSurface {
  surface: string;
  status: string;
  direction: string | null;
  canonical: string | null;
  emitEdge: boolean;
  flipEdge: boolean;
  note: string | null;
  sourceRef: string | null;
}

export interface PredicateEntity {
  id: string; // PRD-nnn
  family: string | null;
  semanticStability: string | null;
  targetRegistry: string | null;
  /** Toutes les formes de surface partageant cet identifiant. */
  surfaces: PredicateSurface[];
  /** Arêtes portant ce prédicat canonique dans la projection courante. */
  edgeCount: number;
  /**
   * Le prédicat canonique est PARTAGÉ par plusieurs identifiants : le compte
   * d'arêtes ne peut alors pas être attribué à l'un d'eux sans inférence. Signalé,
   * jamais réparti au jugé.
   */
  edgeCountShared: boolean;
  _gaps: string[];
}

export interface FamilyEntity {
  id: string; // slug de la famille
  name: string;
  predicateIds: string[];
  surfaceCount: number;
  /** Arêtes DISTINCTES de la projection dont le prédicat relève de cette famille. */
  edgeCount: number;
}

/**
 * Formes de surface publiées SANS identifiant de prédicat. Le registre les porte,
 * mais ne leur assigne aucun `predicate_id` : elles ne peuvent donc pas avoir de
 * page. Elles sont EXPOSÉES ici plutôt que silencieusement écartées — une absence
 * est une information.
 */
export interface OrphanSurface {
  surface: string;
  status: string;
  canonical: string | null;
  sourceRef: string | null;
}

export interface TypeEntity {
  id: string; // node_type
  nodeCount: number;
  /** Quelques libellés représentatifs — jamais une liste inventée. */
  sample: string[];
}

interface RawPredicate {
  predicate_id?: string;
  family?: string;
  status?: string;
  direction?: string;
  canonical?: string | null;
  emit_edge?: boolean;
  flip_edge?: boolean;
  note?: string;
  source_ref?: string;
  semantic_stability?: string;
  target_registry?: string | null;
}

let _cache: {
  predicates: PredicateEntity[];
  families: FamilyEntity[];
  types: TypeEntity[];
  orphanSurfaces: OrphanSurface[];
} | null = null;

/** Slug stable d'une famille — minuscules, séparateurs normalisés. */
export function familySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function load() {
  if (_cache) return _cache;
  const doc = JSON.parse(readFileSync(RESOLUTION, 'utf8')) as { predicates: Record<string, RawPredicate> };
  const graph = JSON.parse(readFileSync(GRAPH, 'utf8')) as {
    nodes: { node_type?: string; label: string }[];
    edges: { predicate: string | null }[];
  };

  // Arêtes par prédicat canonique — mesuré sur la projection courante.
  const edgesByCanonical = new Map<string, number>();
  for (const e of graph.edges) {
    if (!e.predicate) continue;
    edgesByCanonical.set(e.predicate, (edgesByCanonical.get(e.predicate) ?? 0) + 1);
  }

  // Les canonicals portés par PLUSIEURS identifiants : leur compte d'arêtes est ambigu.
  const idsByCanonical = new Map<string, Set<string>>();
  for (const v of Object.values(doc.predicates)) {
    if (!v.predicate_id || !v.canonical) continue;
    const set = idsByCanonical.get(v.canonical) ?? new Set<string>();
    set.add(v.predicate_id);
    idsByCanonical.set(v.canonical, set);
  }

  const orphanSurfaces: OrphanSurface[] = [];
  const byId = new Map<string, PredicateEntity>();
  for (const [surface, v] of Object.entries(doc.predicates)) {
    const id = v.predicate_id;
    if (!id) {
      // Sans identifiant, pas de page — mais l'entrée existe : on la trace.
      orphanSurfaces.push({
        surface,
        status: v.status ?? '',
        canonical: v.canonical ?? null,
        sourceRef: v.source_ref ?? null,
      });
      continue;
    }
    let entity = byId.get(id);
    if (!entity) {
      entity = {
        id,
        family: v.family ?? null,
        semanticStability: v.semantic_stability ?? null,
        targetRegistry: v.target_registry ?? null,
        surfaces: [],
        edgeCount: 0,
        edgeCountShared: false,
        _gaps: [],
      };
      byId.set(id, entity);
    }
    entity.surfaces.push({
      surface,
      status: v.status ?? '',
      direction: v.direction ?? null,
      canonical: v.canonical ?? null,
      emitEdge: v.emit_edge === true,
      flipEdge: v.flip_edge === true,
      note: v.note ?? null,
      sourceRef: v.source_ref ?? null,
    });
  }

  const predicates = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
  for (const p of predicates) {
    p.surfaces.sort((a, b) => a.surface.localeCompare(b.surface));
    const canon = p.surfaces.find((s) => s.canonical)?.canonical ?? null;
    p.edgeCount = canon ? (edgesByCanonical.get(canon) ?? 0) : 0;
    p.edgeCountShared = canon ? (idsByCanonical.get(canon)?.size ?? 0) > 1 : false;
    if (p.edgeCountShared) p._gaps.push('edge_attribution');
    if (!p.family) p._gaps.push('family');
    if (!p.semanticStability) p._gaps.push('semantic_stability');
  }

  // Les canonicals de chaque famille — sert à compter les arêtes DISTINCTES.
  const canonicalsByFamily = new Map<string, Set<string>>();
  const famMap = new Map<string, FamilyEntity>();
  for (const p of predicates) {
    if (!p.family) continue;
    const id = familySlug(p.family);
    const f = famMap.get(id) ?? { id, name: p.family, predicateIds: [], surfaceCount: 0, edgeCount: 0 };
    f.predicateIds.push(p.id);
    f.surfaceCount += p.surfaces.length;
    famMap.set(id, f);
    const set = canonicalsByFamily.get(id) ?? new Set<string>();
    for (const s of p.surfaces) if (s.canonical) set.add(s.canonical);
    canonicalsByFamily.set(id, set);
  }
  // Somme d'arêtes par famille : jamais un cumul des comptes par prédicat — deux
  // identifiants peuvent partager un canonical, ce qui compterait deux fois la
  // même arête. On compte les arêtes DISTINCTES de la projection.
  for (const [id, f] of famMap) {
    const canons = canonicalsByFamily.get(id) ?? new Set<string>();
    f.edgeCount = graph.edges.filter((e) => e.predicate && canons.has(e.predicate)).length;
  }
  const families = [...famMap.values()].sort((a, b) => a.name.localeCompare(b.name));

  const typeMap = new Map<string, TypeEntity>();
  for (const n of graph.nodes) {
    const t = n.node_type;
    if (!t) continue;
    const e = typeMap.get(t) ?? { id: t, nodeCount: 0, sample: [] };
    e.nodeCount++;
    if (e.sample.length < 6) e.sample.push(n.label);
    typeMap.set(t, e);
  }
  const types = [...typeMap.values()].sort((a, b) => b.nodeCount - a.nodeCount);

  _cache = { predicates, families, types, orphanSurfaces };
  return _cache;
}

export const allPredicates = (): PredicateEntity[] => load().predicates;
export const allFamilies = (): FamilyEntity[] => load().families;
export const allTypes = (): TypeEntity[] => load().types;
/** Formes de surface publiées sans identifiant — tracées, jamais écartées en silence. */
export const orphanSurfaces = (): OrphanSurface[] => load().orphanSurfaces;

export const predicateById = (id: string): PredicateEntity | undefined =>
  allPredicates().find((p) => p.id.toLowerCase() === id.toLowerCase());
export const familyById = (id: string): FamilyEntity | undefined =>
  allFamilies().find((f) => f.id === id.toLowerCase());
export const typeById = (id: string): TypeEntity | undefined =>
  allTypes().find((t) => t.id.toLowerCase() === id.toLowerCase());
