#!/usr/bin/env node
/**
 * =====================================================================
 * WSP-001 · Livrable 2 — Extracteur de Knowledge Graph
 * =====================================================================
 * Lit les 26 Records (docs/web/registry-import/OCR-100/OCR-1xx.md), extrait
 * leur section `## Knowledge Graph Relationships`, résout chaque prédicat via
 * OCR-007 (content/registry/ocr-007-resolution.json, projection de la source
 * unique), et émet les arêtes canoniques du graphe.
 *
 * INVARIANT (doctrine architecte) :
 *   « Représentation incomplète mais fidèle > complète par interprétation.
 *     Une absence d'information est une information. »
 *   L'extracteur ne FABRIQUE JAMAIS une sémantique absente de la source.
 *   - Prédicat absent du JSON de résolution → ERREUR signalée, jamais deviné.
 *   - 2e saut d'une cascade sans prédicat → cascade_hop (predicate:null), jamais
 *     une assertion sémantique inventée.
 *
 * Déterministe, sans dépendance. Sorties versionnées (content/registry/) :
 *   - wsp-graph.json         {_meta, nodes, edges}
 *   - wsp-graph.report.json  (Rejected écartés, externes, cascade_hops,
 *                             réflexifs, erreurs — matière du Livrable 3)
 * =====================================================================
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const RECORDS_DIR = 'docs/web/registry-import/OCR-100';
const RESOLUTION = 'content/registry/ocr-007-resolution.json';
const OUT_GRAPH = 'content/registry/wsp-graph.json';
const OUT_REPORT = 'content/registry/wsp-graph.report.json';

// ─── Résolution OCR-007 (projection, source unique = le markdown gravé) ──────
const resolutionDoc = JSON.parse(readFileSync(RESOLUTION, 'utf8'));
const RESOLVE = resolutionDoc.predicates;

// ─── Table nom→OCR-id (construite au runtime depuis les H1 des 26 Records) ────
// Un label externe qui est EXACTEMENT le titre d'un Record résout vers ce Record
// (Défaut 1). Contexte-libre, appariement exact — jamais un raccourci deviné.
const TITLE_TO_ID = new Map();
// Labels qui matchent un titre mais que l'architecte a signalés comme AMBIGUS :
// résolution contexte-dépendante impossible mécaniquement → jamais auto-résolus.
const FLAGGED_NAMES = new Set(['identity']);
const norm = (s) => s.toLowerCase().trim();

// ─── Utilitaires ────────────────────────────────────────────────────────────
function slug(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Le premier séparateur de flèche (→ ou ->) et sa longueur, ou -1. */
function firstArrow(s) {
  const u = s.indexOf('→');
  const a = s.indexOf('->');
  if (u === -1 && a === -1) return { idx: -1, len: 0 };
  if (u === -1) return { idx: a, len: 2 };
  if (a === -1) return { idx: u, len: 1 };
  return u < a ? { idx: u, len: 1 } : { idx: a, len: 2 };
}

/** Découpe une expression cible sur TOUTES les flèches (cascade → segments). */
function splitCascade(expr) {
  return expr
    .split(/→|->/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Découpe un segment en atomes cibles sur virgule / slash AU NIVEAU 0 (hors
 * parenthèses) : une virgule dans « (OCR-110, reflexive) » ou « (as prior art,
 * not equivalents) » ne coupe PAS. C'est la règle qui préserve les notes.
 */
function splitAtoms(segment) {
  const out = [];
  let buf = '';
  let depth = 0;
  for (const ch of segment) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (depth === 0 && (ch === ',' || ch === '/')) {
      if (buf.trim()) out.push(buf.trim());
      buf = '';
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

/**
 * Analyse un atome cible → {id, label, type, note, via}. Règle mécanique :
 * présence d'un `(OCR-\d+)` = nœud interne ; sinon nœud externe (décision A).
 * Un suffixe ` via <X>` devient une métadonnée (via), pas un nœud/arête distinct.
 * Une parenthèse non-id (« reflexive », « as prior art… ») devient une note.
 */
function parseAtom(atom) {
  let text = atom.trim();
  let via = null;

  // ` via <X>` — le X peut porter son propre (OCR-id).
  const viaMatch = text.match(/\s+via\s+(.+)$/i);
  if (viaMatch) {
    text = text.slice(0, viaMatch.index).trim();
    via = parseNodeRef(viaMatch[1].trim());
  }

  const node = parseNodeRef(text);
  return { ...node, via };
}

/** Résout un libellé en référence de nœud. Ordre : (a) OCR-id explicite n'importe
 *  où → interne ; (b) titre de Record exact (hors set signalé) → interne ;
 *  (c) sinon externe. */
function parseNodeRef(text) {
  const t = text.trim();

  // (a) Un `(OCR-\d+)` N'IMPORTE OÙ → nœud interne (Défaut 2a). Le texte avant la
  //     parenthèse = label ; le reste de la parenthèse + le texte APRÈS (« in
  //     Certified state », « coordinates and criteria ») = qualificatif → note.
  const idAnywhere = t.match(/\((OCR-\d+)([^)]*)\)/);
  if (idAnywhere) {
    const id = idAnywhere[1];
    const label = t.slice(0, idAnywhere.index).trim();
    const parenRest = idAnywhere[2].replace(/^[\s,;]+|[\s,;]+$/g, '').trim();
    const after = t.slice(idAnywhere.index + idAnywhere[0].length).trim();
    const note = [parenRest, after].filter(Boolean).join(' ').trim() || null;
    return { id, label: label || id, type: 'internal', note };
  }

  // (b) Parenthèse non-id en fin → note (« reflexive », « as prior art… »).
  let note = null;
  let label = t;
  const paren = t.match(/\(([^)]*)\)\s*$/);
  if (paren) {
    label = t.slice(0, paren.index).trim();
    const rest = paren[1].replace(/^[\s,;]+|[\s,;]+$/g, '').trim();
    if (rest) note = rest;
  }

  // (c) Titre de Record EXACT (hors set signalé) → nœud interne (Défaut 1).
  const nlabel = norm(label);
  if (TITLE_TO_ID.has(nlabel) && !FLAGGED_NAMES.has(nlabel)) {
    return { id: TITLE_TO_ID.get(nlabel), label, type: 'internal', note, resolved_by_name: true };
  }

  // (d) Sinon externe (décision A).
  return { id: 'ext:' + slug(label), label, type: 'external', note };
}

// ─── Registres ──────────────────────────────────────────────────────────────
const nodes = new Map(); // id -> {id, type, label}
const externalRefs = new Map(); // ext id -> Set(records)
const edges = [];
const report = {
  rejected: [], // prédicats emit_edge:false (Rejected → OCR-008/009)
  externals: [], // nœuds externes (rempli en fin)
  cascade_hops: [], // arêtes de 2e+ saut (predicate:null)
  unresolved_canonical: [], // emit_edge:true mais canonical:null (Evolving non résolu, ex. separates)
  reflexives: [], // auto-boucles STRUCTURELLES (source === target, id explicite)
  reflexive_noted: [], // « (reflexive) » déclaré en note SANS OCR-id (cible externe) — à revoir
  two_predicate_lines: [], // lignes portant 2 prédicats (canonical + inverse)
  name_flagged: [], // label ~ un titre mais AMBIGU/raccourci (Identity, Passport, Protocol) — architecte
  compound_target: [], // cible externe cachant 2 cibles (« … from … », separates) — architecte
  verbose_externals: [], // labels externes multi-mots (prose) — revue architecte
  errors: [], // prédicat absent du JSON, ligne non parsable — À CORRIGER
};

function addNode(ref) {
  if (!nodes.has(ref.id)) nodes.set(ref.id, { id: ref.id, type: ref.type, label: ref.label });
  return ref.id;
}
function noteExternal(ref, record) {
  if (ref.type !== 'external') return;
  if (!externalRefs.has(ref.id)) externalRefs.set(ref.id, new Set());
  externalRefs.get(ref.id).add(record);
}

// ─── Émission d'une arête « prédicat » (résolue via OCR-007) ─────────────────
// `seen` (par ligne) dédup les 2 prédicats/ligne : supersedes + superseded_by
// produisent la MÊME arête canonique — on ne la compte qu'une fois.
function emitPredicateEdge(srcId, predToken, tgtRef, ctx, seen) {
  const r = RESOLVE[predToken];
  if (!r) {
    report.errors.push({
      record: ctx.record, line: ctx.line, predicate: predToken,
      reason: 'prédicat absent de ocr-007-resolution.json (INVARIANT : jamais deviné)', raw: ctx.raw,
    });
    return;
  }
  if (r.emit_edge === false) {
    report.rejected.push({
      record: ctx.record, line: ctx.line, predicate: predToken,
      canonical_status: r.status, target_registry: r.target_registry, raw: ctx.raw,
    });
    return;
  }

  // flip_edge : la direction canonique inverse source et cible.
  let source = srcId;
  let target = tgtRef.id;
  if (r.flip_edge) { source = tgtRef.id; target = srcId; }

  // canonical:null + emit_edge:true = résolution Evolving OUVERTE (ex. separates).
  // L'arête est émise (le JSON le demande) mais SANS prédicat inventé.
  const hasCanonical = r.canonical !== null && r.canonical !== undefined;

  const key = `${source}|${hasCanonical ? r.canonical : '?' + predToken}|${target}`;
  if (seen.has(key)) return; // arête déjà émise par l'autre prédicat de la ligne
  seen.add(key);

  addNode(tgtRef);
  noteExternal(tgtRef, ctx.record);
  const viaId = tgtRef.via ? (addNode(tgtRef.via), noteExternal(tgtRef.via, ctx.record), tgtRef.via.id) : null;

  const reflexive = source === target;
  const note = tgtRef.note || null;

  const edge = {
    source, predicate: hasCanonical ? r.canonical : null, target,
    edge_type: hasCanonical ? 'predicate' : 'unresolved_predicate',
    semantic_stability: r.semantic_stability,
    flipped: !!r.flip_edge,
    reflexive,
    via: viaId,
    note,
    provenance: { record: ctx.record, line: ctx.line, raw: ctx.raw, source_predicate: predToken },
  };
  if (!hasCanonical) {
    edge.unresolved_canonical = true;
    edge.indexed_as_predicate = false;
    report.unresolved_canonical.push({ record: ctx.record, line: ctx.line, source_predicate: predToken, source, target, raw: ctx.raw });
  }
  edges.push(edge);

  if (reflexive) {
    report.reflexives.push({ record: ctx.record, line: ctx.line, node: source, predicate: r.canonical, raw: ctx.raw });
  } else if (note && /reflexive/i.test(note)) {
    // « (reflexive) » déclaré mais sans OCR-id : la source ne se nomme pas —
    // on NE PAS infère l'auto-boucle (doctrine), on la signale pour revue.
    report.reflexive_noted.push({ record: ctx.record, line: ctx.line, source, target, predicate: r.canonical, note, raw: ctx.raw });
  }
}

// ─── Émission d'un saut de cascade (2e+ saut, SANS prédicat — option c) ───────
// Doctrine : préserver la continuité structurelle sans inventer de sémantique.
function emitCascadeHop(fromRef, toRef, ctx) {
  addNode(fromRef); noteExternal(fromRef, ctx.record);
  addNode(toRef); noteExternal(toRef, ctx.record);
  const edge = {
    source: fromRef.id, predicate: null, target: toRef.id,
    edge_type: 'cascade_hop',
    edge_origin: 'implicit_cascade',
    non_inferente: true,
    indexed_as_predicate: false,
    excluded_from_predicate_stats: true,
    semantic_stability: null,
    flipped: false,
    reflexive: fromRef.id === toRef.id,
    via: null,
    note: null,
    provenance: { record: ctx.record, line: ctx.line, raw: ctx.raw, source_predicate: null },
  };
  edges.push(edge);
  report.cascade_hops.push({ record: ctx.record, line: ctx.line, source: fromRef.id, target: toRef.id, raw: ctx.raw });
  return edge;
}

// ─── Traitement d'une ligne KG ───────────────────────────────────────────────
function processLine(sourceRef, rawLine, lineNo, record) {
  const bullet = rawLine.match(/^\s*[-*]\s+(.*)$/);
  if (!bullet) return;
  const body = bullet[1].trim();

  const arrow = firstArrow(body);
  if (arrow.idx === -1) {
    report.errors.push({ record, line: lineNo, reason: 'ligne KG sans flèche (non parsable)', raw: body });
    return;
  }

  const left = body.slice(0, arrow.idx).trim();
  const right = body.slice(arrow.idx + arrow.len).trim();

  // Prédicats : ôter backticks, séparer sur « / » (2 prédicats/ligne possibles).
  const preds = left.replace(/`/g, '').split('/').map((p) => p.trim()).filter(Boolean);
  if (preds.length > 1) {
    report.two_predicate_lines.push({ record, line: lineNo, predicates: preds, raw: body });
  }

  const ctx = { record, line: lineNo, raw: body };
  const segments = splitCascade(right);
  const cascade = segments.length > 1;

  // Segment 0 : arêtes « prédicat » depuis la source vers chaque atome.
  const seg0 = splitAtoms(segments[0]).map(parseAtom);
  const seen = new Set();
  for (const pred of preds) {
    for (const atom of seg0) emitPredicateEdge(sourceRef.id, pred, atom, ctx, seen);
  }

  // Sauts de cascade (segment i → i+1) : cascade_hop, sans prédicat (option c).
  if (cascade) {
    let prevAtoms = seg0;
    for (let i = 1; i < segments.length; i++) {
      const curAtoms = splitAtoms(segments[i]).map(parseAtom);
      for (const from of prevAtoms) {
        for (const to of curAtoms) emitCascadeHop(from, to, ctx);
      }
      prevAtoms = curAtoms;
    }
  }
}

// ─── Boucle principale ────────────────────────────────────────────────────────
const files = readdirSync(RECORDS_DIR).filter((f) => /^OCR-1\d{2}_.*\.md$/i.test(f)).sort();
let recordsWithKG = 0;

// 1ʳᵉ passe : construire TITLE_TO_ID depuis les H1 (« # OCR-xxx — Label »).
for (const f of files) {
  for (const l of readFileSync(path.join(RECORDS_DIR, f), 'utf8').split(/\r?\n/)) {
    const h1 = l.match(/^#\s+(OCR-\d+)\s*[—–-]\s*(.+?)\s*$/);
    if (h1) { TITLE_TO_ID.set(norm(h1[2]), h1[1]); break; }
  }
}

for (const f of files) {
  const full = path.join(RECORDS_DIR, f);
  const lines = readFileSync(full, 'utf8').split(/\r?\n/);

  // Source = H1 « # OCR-xxx — Label ».
  let sourceRef = null;
  for (const l of lines) {
    const h1 = l.match(/^#\s+(OCR-\d+)\s*[—–-]\s*(.+?)\s*$/);
    if (h1) { sourceRef = { id: h1[1], label: h1[2].trim(), type: 'internal' }; break; }
  }
  if (!sourceRef) {
    report.errors.push({ record: f, line: 1, reason: 'H1 (# OCR-xxx — Label) introuvable', raw: lines[0] || '' });
    continue;
  }
  addNode(sourceRef);

  // Section KG : de « ## Knowledge Graph Relationships » au prochain « ## ».
  let inKG = false;
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^##\s+Knowledge Graph Relationships\s*$/.test(l)) { inKG = true; found = true; continue; }
    if (inKG && /^##\s+/.test(l)) break;
    if (inKG) processLine(sourceRef, l, i + 1, sourceRef.id);
  }
  if (found) recordsWithKG++;
  else report.errors.push({ record: sourceRef.id, line: 1, reason: 'section KG absente', raw: '' });
}

// ─── Finalisation du rapport ──────────────────────────────────────────────────
report.externals = [...externalRefs.entries()]
  .map(([id, recs]) => ({ id, label: nodes.get(id)?.label ?? id, records: [...recs].sort() }))
  .sort((a, b) => a.id.localeCompare(b.id));

// Signalements NON tranchés par le parseur (→ architecte), calculés sur les
// externes SUBSISTANTS (ceux que la résolution nom→id n'a pas absorbés).
const titleIds = [...TITLE_TO_ID.entries()];
for (const ext of report.externals) {
  const nlabel = norm(ext.label);
  // (a) matche EXACT un titre mais signalé (Identity) ; ou raccourci = dernier
  //     mot d'un titre (Passport→Professional Passport, Protocol→World Skills Protocol).
  if (TITLE_TO_ID.has(nlabel) && FLAGGED_NAMES.has(nlabel)) {
    report.name_flagged.push({ label: ext.label, exact_match: TITLE_TO_ID.get(nlabel), reason: 'match exact mais AMBIGU (contexte-dépendant)', records: ext.records });
  } else {
    const cand = titleIds.filter(([t]) => t === nlabel || t.endsWith(' ' + nlabel)).map(([, id]) => id);
    if (cand.length) report.name_flagged.push({ label: ext.label, candidates: cand, reason: cand.length > 1 ? 'raccourci ambigu (plusieurs titres)' : 'raccourci probable (non résolu)', records: ext.records });
  }
  // (b) cible composée « … from … » (separates) : deux cibles non séparées.
  if (/\sfrom\s/i.test(ext.label)) {
    report.compound_target.push({ label: ext.label, reason: 'cache 2 cibles (séparateur « from »)', records: ext.records });
  }
  // (c) label externe multi-mots (≥3) = prose à revoir.
  if (ext.label.trim().split(/\s+/).length >= 3) {
    report.verbose_externals.push({ label: ext.label, records: ext.records });
  }
}

const nodeList = [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id));
const internalCount = nodeList.filter((n) => n.type === 'internal').length;
const externalCount = nodeList.filter((n) => n.type === 'external').length;
const predicateEdges = edges.filter((e) => e.edge_type === 'predicate');

// Tri stable des arêtes : par record, ligne, puis triplet.
edges.sort((a, b) => {
  const pa = a.provenance, pb = b.provenance;
  return pa.record.localeCompare(pb.record) || pa.line - pb.line ||
    `${a.source}|${a.predicate}|${a.target}`.localeCompare(`${b.source}|${b.predicate}|${b.target}`);
});

const graph = {
  _meta: {
    source_resolution: 'ocr-007-resolution.json',
    resolution_commit: resolutionDoc._meta.source_commit,
    resolution_version: resolutionDoc._meta.source_version,
    generated_from: RECORDS_DIR,
    records_with_kg: recordsWithKG,
    counts: {
      nodes_total: nodeList.length,
      nodes_internal: internalCount,
      nodes_external: externalCount,
      edges_total: edges.length,
      edges_predicate: predicateEdges.length,
      edges_cascade_hop: report.cascade_hops.length,
      edges_unresolved_canonical: report.unresolved_canonical.length,
      reflexives: report.reflexives.length,
      reflexive_noted: report.reflexive_noted.length,
      rejected_dropped: report.rejected.length,
      name_flagged: report.name_flagged.length,
      compound_target: report.compound_target.length,
      errors: report.errors.length,
    },
    note: 'Projection dérivée d\'OCR-007 (source unique). cascade_hop = continuité structurelle, jamais une assertion sémantique (predicate:null).',
  },
  nodes: nodeList,
  edges,
};

writeFileSync(OUT_GRAPH, JSON.stringify(graph, null, 2) + '\n', 'utf8');
writeFileSync(OUT_REPORT, JSON.stringify(report, null, 2) + '\n', 'utf8');

// ─── Résumé console ───────────────────────────────────────────────────────────
const c = graph._meta.counts;
console.log('WSP-001 build-graph —', recordsWithKG, 'Records avec section KG');
console.log('  nodes:', c.nodes_total, '(internes', c.nodes_internal + ', externes', c.nodes_external + ')');
console.log('  edges:', c.edges_total, '(predicate', c.edges_predicate + ', cascade_hop', c.edges_cascade_hop + ')');
console.log('  reflexives:', c.reflexives, '| Rejected écartées:', c.rejected_dropped, '| erreurs:', c.errors);
console.log('  →', OUT_GRAPH, '+', OUT_REPORT);
