/**
 * =====================================================================
 * Opus X — Métadonnées des pages d'entité du registre (Lot D)
 * =====================================================================
 * Prédicats, familles, types et index. Ces entités n'ont AUCUNE prose : leurs
 * métadonnées sont DÉRIVÉES de leurs propres champs selon une chaîne déterministe,
 * jamais rédigées.
 *
 * `robots` : ces pages projettent le REGISTRE (OCR-007) et le GRAPHE, pas un
 * Record. Elles ne portent donc pas de statut documentaire à dériver, et restent
 * indexables — contrairement aux 33 pages Record, en `noindex` tant que leur
 * Record est en `Draft`.
 * =====================================================================
 */
import {
  allPredicates, allFamilies, allTypes, orphanSurfaces,
  type PredicateEntity, type FamilyEntity, type TypeEntity,
} from './registryEntities';

const BASE = 'https://opusx.world';
export const RECORDS_ROOT = '/records';

export interface EntityMeta {
  title: string;
  description: string;
  canonical: string;
  robots: 'index,follow';
}

/** Une ligne de fiche : libellé + valeur, toutes deux issues d'un artefact publié. */
export interface EntityField {
  label: string;
  value: string;
}

export interface EntityLinkRef {
  label: string;
  href: string;
}

export interface RegistryEntityContent {
  kind: 'predicate' | 'family' | 'type' | 'index';
  id: string;
  heading: string;
  /** Sous-titre dérivé — jamais un slogan. */
  subtitle: string;
  fields: EntityField[];
  /** Tableaux annexes (formes de surface, membres d'une famille…). */
  tables: { caption: string; head: string[]; rows: string[][] }[];
  links: EntityLinkRef[];
  meta: EntityMeta;
  _gaps: string[];
}

const meta = (title: string, description: string, path: string): EntityMeta => ({
  title,
  description,
  canonical: `${BASE}${path}`,
  robots: 'index,follow',
});

// ─── Prédicat ────────────────────────────────────────────────────────────────
export function buildPredicatePage(p: PredicateEntity): RegistryEntityContent {
  const canon = p.surfaces.find((s) => s.canonical)?.canonical ?? null;
  const fields: EntityField[] = [
    { label: 'Predicate ID', value: p.id },
    { label: 'Canonical form', value: canon ?? '—' },
    { label: 'Family', value: p.family ?? '—' },
    { label: 'Semantic stability', value: p.semanticStability ?? '—' },
    { label: 'Surface forms', value: String(p.surfaces.length) },
    {
      label: 'Edges in current projection',
      value: p.edgeCountShared
        ? `${p.edgeCount} — shared canonical form, not attributable to a single predicate`
        : String(p.edgeCount),
    },
  ];
  if (p.targetRegistry) fields.push({ label: 'Target registry', value: p.targetRegistry });

  return {
    kind: 'predicate',
    id: p.id,
    heading: canon ? `${p.id} — ${canon}` : p.id,
    subtitle: p.family
      ? `Canonical predicate of the ${p.family} family, published by OCR-007.`
      : 'Canonical predicate published by OCR-007.',
    fields,
    tables: [
      {
        caption: 'Surface forms',
        head: ['Form', 'Status', 'Direction', 'Emits edge', 'Source'],
        rows: p.surfaces.map((s) => [
          s.surface,
          s.status || '—',
          s.direction ?? '—',
          s.emitEdge ? 'yes' : 'no',
          s.sourceRef ?? '—',
        ]),
      },
    ],
    links: p.family
      ? [{ label: `Family — ${p.family}`, href: `${RECORDS_ROOT}/families/${familyIdOf(p.family)}` }]
      : [],
    meta: meta(
      `${p.id} — ${canon ?? 'predicate'} | Canonical Registry`,
      `Canonical predicate ${p.id}${canon ? ` (${canon})` : ''}${p.family ? `, ${p.family} family` : ''}. ${p.surfaces.length} surface form(s) published by OCR-007.`,
      `${RECORDS_ROOT}/predicates/${p.id.toLowerCase()}`,
    ),
    _gaps: p._gaps,
  };
}

const familyIdOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// ─── Famille ─────────────────────────────────────────────────────────────────
export function buildFamilyPage(f: FamilyEntity): RegistryEntityContent {
  const members = allPredicates().filter((p) => f.predicateIds.includes(p.id));
  return {
    kind: 'family',
    id: f.id,
    heading: f.name,
    subtitle: `Predicate family published by OCR-007, grouping ${f.predicateIds.length} canonical predicate(s).`,
    fields: [
      { label: 'Family', value: f.name },
      { label: 'Predicates', value: String(f.predicateIds.length) },
      { label: 'Surface forms', value: String(f.surfaceCount) },
      { label: 'Edges in current projection', value: String(f.edgeCount) },
    ],
    tables: [
      {
        caption: 'Predicates in this family',
        head: ['Identifier', 'Canonical form', 'Surface forms', 'Edges'],
        rows: members.map((p) => [
          p.id,
          p.surfaces.find((s) => s.canonical)?.canonical ?? '—',
          String(p.surfaces.length),
          String(p.edgeCount),
        ]),
      },
    ],
    links: members.map((p) => ({ label: p.id, href: `${RECORDS_ROOT}/predicates/${p.id.toLowerCase()}` })),
    meta: meta(
      `${f.name} — predicate family | Canonical Registry`,
      `The ${f.name} predicate family of the World Skills Protocol: ${f.predicateIds.length} canonical predicate(s), ${f.surfaceCount} surface form(s), published by OCR-007.`,
      `${RECORDS_ROOT}/families/${f.id}`,
    ),
    _gaps: [],
  };
}

// ─── Type ────────────────────────────────────────────────────────────────────
export function buildTypePage(t: TypeEntity): RegistryEntityContent {
  return {
    kind: 'type',
    id: t.id,
    heading: t.id,
    subtitle: `Node type of the Knowledge Graph projection, carried by ${t.nodeCount} node(s).`,
    fields: [
      { label: 'Type', value: t.id },
      { label: 'Nodes in current projection', value: String(t.nodeCount) },
    ],
    tables: [
      {
        caption: 'Sample nodes',
        head: ['Label'],
        rows: t.sample.map((s) => [s]),
      },
    ],
    links: [],
    meta: meta(
      `${t.id} — node type | Canonical Registry`,
      `Node type ${t.id} of the World Skills Protocol Knowledge Graph, carried by ${t.nodeCount} node(s) in the current projection.`,
      `${RECORDS_ROOT}/types/${t.id.toLowerCase()}`,
    ),
    _gaps: [],
  };
}

// ─── Index ───────────────────────────────────────────────────────────────────
export function buildRecordsIndex(records: { id: string; label: string; status: string }[]): RegistryEntityContent {
  const preds = allPredicates();
  const fams = allFamilies();
  const types = allTypes();
  const orphans = orphanSurfaces();
  return {
    kind: 'index',
    id: 'records',
    heading: 'The Canonical Corpus',
    subtitle:
      'Every Record, predicate, family and node type published by the World Skills Protocol. Each page is a documentary projection; the Records themselves remain the source.',
    fields: [
      { label: 'Records', value: String(records.length) },
      { label: 'Predicates', value: String(preds.length) },
      { label: 'Predicate families', value: String(fams.length) },
      { label: 'Node types', value: String(types.length) },
      { label: 'Surface forms without an identifier', value: String(orphans.length) },
    ],
    tables: [
      {
        caption: 'Records',
        head: ['Identifier', 'Title', 'Status'],
        rows: records.map((r) => [r.id, r.label, r.status]),
      },
      {
        caption: 'Predicate families',
        head: ['Family', 'Predicates', 'Surface forms'],
        rows: fams.map((f) => [f.name, String(f.predicateIds.length), String(f.surfaceCount)]),
      },
      {
        caption: 'Node types',
        head: ['Type', 'Nodes'],
        rows: types.map((t) => [t.id, String(t.nodeCount)]),
      },
    ],
    links: [
      ...records.map((r) => ({ label: r.id, href: `${RECORDS_ROOT}/${r.id.toLowerCase()}` })),
      ...preds.map((p) => ({ label: p.id, href: `${RECORDS_ROOT}/predicates/${p.id.toLowerCase()}` })),
      ...fams.map((f) => ({ label: f.name, href: `${RECORDS_ROOT}/families/${f.id}` })),
      ...types.map((t) => ({ label: t.id, href: `${RECORDS_ROOT}/types/${t.id.toLowerCase()}` })),
    ],
    meta: meta(
      'The Canonical Corpus | Records, predicates and types',
      `Index of the World Skills Protocol Canonical Corpus: ${records.length} Records, ${preds.length} predicates, ${fams.length} families and ${types.length} node types, each published as a documentary projection.`,
      RECORDS_ROOT,
    ),
    _gaps: [],
  };
}
