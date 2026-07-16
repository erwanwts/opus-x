#!/usr/bin/env node
/**
 * =====================================================================
 * WEB-003B.0 — Manifeste d'import CONTRÔLÉ du corpus OCR (Registry)
 * =====================================================================
 * RAPPORT DE LECTURE, PAS UN IMPORT. Ce script lit un dossier de .md OCR
 * (fourni par le superviseur dans docs/web/registry-import/), extrait le
 * tableau de métadonnées EN TÊTE de chaque fichier, calcule un checksum
 * SHA-256, et SIGNALE les anomalies (séquence, doublons, métadonnées,
 * homonyme PDF). Il NE modifie, NE reformule, NE normalise, N'IMPORTE aucun
 * Record. content/registry/ n'est jamais lu ; il ne reçoit que _manifest.json.
 *
 * Sorties :
 *   • stdout                         → le manifeste JSON (preuve machine)
 *   • content/registry/_manifest.json → le même JSON (preuve d'import contrôlé,
 *                                       committé À TERME — pas dans ce lot)
 *   • stderr                         → résumé humain (compte fichiers / anomalies)
 *
 * Usage :
 *   node scripts/registry/manifest.mjs <dossier-md> [--expected "OCR-000..005,OCR-100..125"] [--pretty]
 *
 * --expected : plages AUTORITATIVES, éventuellement DISJOINTES (séparées par
 *   des virgules). Les manquants sont calculés UNIQUEMENT à l'intérieur de
 *   chaque plage : un écart ENTRE deux plages (ex. 006–099) n'est jamais
 *   signalé. Sans --expected → heuristique de clusters (advisoire).
 *
 * ⚠️ CALIBRAGE FORMAT : le parseur d'en-tête essaie 3 formats (frontmatter YAML,
 *   tableau markdown |clé|valeur|, lignes « Champ : valeur »). Si un fichier ne
 *   correspond à AUCUN, il est marqué formatDetected:"none" et une anomalie
 *   header_unparsed est émise — à examiner AVANT toute extraction fine.
 * =====================================================================
 */
import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

// ---------------------------------------------------------------------
// Champs canoniques du manifeste (dans l'ordre de sortie).
// REQUIRED → absence = anomalie ; les autres → listés si absents (advisoire).
// ---------------------------------------------------------------------
const FIELD_LABELS = {
  document_id: ['document id', 'documentid', 'id', 'doc id'],
  title: ['title', 'titre'],
  canonical_id: ['canonical id', 'canonicalid', 'canonical'],
  version: ['version', 'ver'],
  lifecycle_status: ['lifecycle status', 'lifecycle', 'status', 'statut', 'lifecycle_status'],
  classification: ['classification', 'class'],
  normative_informative: [
    'normative/informative', 'normative informative', 'normative_informative',
    'normative / informative', 'normative-informative', 'nature',
  ],
};
const REQUIRED_FIELDS = ['document_id', 'title'];
const OPTIONAL_FIELDS = ['canonical_id', 'version', 'lifecycle_status', 'classification', 'normative_informative'];

// Normalise un libellé : retire l'emphase markdown (**gras**, _italique_, `code`),
// les accents, met en minuscules, compacte les espaces. Les en-têtes OCR réels
// portent des libellés en gras : « | **Document ID** | … | ».
function normLabel(s) {
  return s
    .replace(/[*_`]/g, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Mappe un libellé brut vers une clé canonique (ou null).
function labelToKey(rawLabel) {
  const n = normLabel(rawLabel);
  for (const [key, aliases] of Object.entries(FIELD_LABELS)) {
    if (aliases.includes(n)) return key;
  }
  return null;
}

// ---------------------------------------------------------------------
// Extraction de l'en-tête — 3 formats essayés dans l'ordre.
// Retourne { raw: {label->value}, format: 'frontmatter'|'md-table'|'kv-lines'|'none' }
// ---------------------------------------------------------------------
function extractHeader(content) {
  const head = content.split(/\r?\n/).slice(0, 60); // en-tête = 60 premières lignes max

  // (1) Frontmatter YAML : --- ... ---
  if (head[0] !== undefined && head[0].trim() === '---') {
    const end = head.findIndex((l, i) => i > 0 && l.trim() === '---');
    if (end > 0) {
      const raw = {};
      for (const line of head.slice(1, end)) {
        const m = line.match(/^\s*([^:]+?)\s*:\s*(.+?)\s*$/);
        if (m) raw[m[1]] = stripQuotes(m[2]);
      }
      if (Object.keys(raw).length) return { raw, format: 'frontmatter' };
    }
  }

  // (2) Tableau markdown |clé|valeur| ou |champ1|champ2|…| + ligne de valeurs.
  const tbl = parseFirstMarkdownTable(head);
  if (tbl) return { raw: tbl.raw, format: 'md-table' };

  // (3) Lignes « **Champ :** valeur » ou « Champ: valeur ».
  const raw = {};
  for (const line of head) {
    const m = line.match(/^\s*\*{0,2}\s*([A-Za-z][A-Za-z /_-]*?)\s*\*{0,2}\s*[:：]\s*(.+?)\s*$/);
    if (m && labelToKey(m[1])) raw[m[1]] = stripQuotes(m[2]);
  }
  if (Object.keys(raw).length) return { raw, format: 'kv-lines' };

  return { raw: {}, format: 'none' };
}

function stripQuotes(v) {
  return v.replace(/^["'`]+|["'`]+$/g, '').trim();
}

// Parse le PREMIER tableau markdown de l'en-tête.
// Gère 2 formes : clé/valeur (2 colonnes) OU en-têtes/valeurs (1 ligne de données).
function parseFirstMarkdownTable(lines) {
  const rows = [];
  let started = false;
  for (const line of lines) {
    const isRow = /^\s*\|.*\|\s*$/.test(line);
    if (isRow) {
      started = true;
      const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      rows.push(cells);
    } else if (started) {
      break; // fin du tableau contigu
    }
  }
  if (rows.length < 2) return null;

  // Retire la ligne de séparation markdown (|---|---|).
  const data = rows.filter((r) => !r.every((c) => /^:?-{2,}:?$/.test(c) || c === ''));
  if (data.length < 1) return null;

  const raw = {};

  // Forme A : clé/valeur — 2 colonnes, colonne gauche = libellés connus.
  const looksKV = data.every((r) => r.length === 2) && data.some((r) => labelToKey(r[0]));
  if (looksKV) {
    for (const [k, v] of data) raw[k] = stripQuotes(v);
    return { raw };
  }

  // Forme B : en-têtes + valeurs — 1ʳᵉ ligne = libellés, 2ᵉ = valeurs.
  if (data.length >= 2 && data[0].some((c) => labelToKey(c))) {
    const headers = data[0];
    const values = data[1];
    headers.forEach((h, i) => {
      if (values[i] !== undefined) raw[h] = stripQuotes(values[i]);
    });
    return { raw };
  }
  return null;
}

// rawMap (libellés) → { fields: {clé canonique -> valeur}, found: [...], missing: [...] }
function mapFields(raw) {
  const fields = {};
  for (const [label, value] of Object.entries(raw)) {
    const key = labelToKey(label);
    if (key && fields[key] === undefined && value !== '') fields[key] = value;
  }
  const allExpected = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];
  const found = allExpected.filter((k) => fields[k] !== undefined);
  const missing = allExpected.filter((k) => fields[k] === undefined);
  return { fields, found, missing };
}

// ---------------------------------------------------------------------
// Séquence : parse --expected en termes disjoints PREFIX-<start>..<end>.
// ---------------------------------------------------------------------
function parseExpected(spec) {
  if (!spec) return null;
  const ranges = [];
  for (const term of spec.split(',').map((s) => s.trim()).filter(Boolean)) {
    const m = term.match(/^([A-Za-z0-9]+)-(\d+)\.\.(\d+)$/);
    if (!m) throw new Error(`--expected: terme invalide « ${term} » (attendu PREFIX-000..005)`);
    const [, prefix, startTok, endTok] = m;
    ranges.push({
      prefix,
      start: parseInt(startTok, 10),
      end: parseInt(endTok, 10),
      width: Math.max(startTok.length, endTok.length),
    });
  }
  return ranges;
}

// Parse un document_id « OCR-101 » → { prefix:'OCR', num:101 } (ou null).
function parseId(id) {
  if (!id) return null;
  const m = String(id).match(/^([A-Za-z0-9]+)-(\d+)$/);
  return m ? { prefix: m[1], num: parseInt(m[2], 10) } : null;
}

function pad(num, width) {
  return String(num).padStart(width, '0');
}

// ---------------------------------------------------------------------
// Programme principal.
// ---------------------------------------------------------------------
function main() {
  const args = process.argv.slice(2);
  let inputDir = null;
  let expectedSpec = null;
  let excludeSpec = null;
  const opts = { pretty: true };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--expected') expectedSpec = args[++i];
    else if (a === '--exclude') excludeSpec = args[++i];
    else if (a === '--pretty') opts.pretty = true;
    else if (a === '--no-pretty') opts.pretty = false;
    else if (!a.startsWith('--')) inputDir = a;
  }

  if (!inputDir) {
    console.error('Usage: node scripts/registry/manifest.mjs <dossier-md> [--expected "OCR-000..005,OCR-100..125"]');
    process.exit(2);
  }
  if (!existsSync(inputDir)) {
    console.error(`Dossier introuvable : ${inputDir}`);
    process.exit(2);
  }

  const expected = parseExpected(expectedSpec);

  // Fichiers EXPLICITEMENT exclus de la moulinette (décision opérateur, tracée).
  // Ils restent sur le disque ; ils ne sont ni comptés, ni analysés, ni passés
  // au générateur d'artefacts. Ex. : doc de gouvernance non numéroté hors OCR.
  const excludeSet = new Set(
    (excludeSpec ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  );

  // Inventaire du dossier.
  const entries = readdirSync(inputDir);
  const allMd = entries.filter((f) => /\.md$/i.test(f)).sort();
  const excludedFiles = allMd.filter((f) => excludeSet.has(f));
  const mdFiles = allMd.filter((f) => !excludeSet.has(f));
  const pdfStems = new Set(
    entries.filter((f) => /\.pdf$/i.test(f)).map((f) => f.replace(/\.pdf$/i, ''))
  );

  const records = [];
  const anomalies = [];

  for (const filename of mdFiles) {
    const full = path.join(inputDir, filename);
    const buf = readFileSync(full);
    const content = buf.toString('utf8');
    const checksum = createHash('sha256').update(buf).digest('hex');

    const { raw, format } = extractHeader(content);
    const { fields } = mapFields(raw);

    // Le `title` n'est PAS un champ de la table de métadonnées OCR : le titre du
    // Record est son titre H1 (« # OCR-100 — World Skills Protocol »). On le
    // source donc depuis le premier H1, faute de champ dédié dans la table.
    if (fields.title === undefined) {
      const h1 = content.match(/^#\s+(.+?)\s*$/m);
      if (h1) fields.title = h1[1].trim();
    }
    const allExpected = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];
    const found = allExpected.filter((k) => fields[k] !== undefined);
    const missing = allExpected.filter((k) => fields[k] === undefined);

    const stem = filename.replace(/\.md$/i, '');
    const pdfHomonym = pdfStems.has(stem);

    records.push({
      source_filename: filename,
      document_id: fields.document_id ?? null,
      title: fields.title ?? null,
      canonical_id: fields.canonical_id ?? null,
      version: fields.version ?? null,
      lifecycle_status: fields.lifecycle_status ?? null,
      classification: fields.classification ?? null,
      normative_informative: fields.normative_informative ?? null,
      checksum_sha256: checksum,
      pdf_homonym: pdfHomonym,
      header_format: format,
      metadata_fields_found: found,
      metadata_fields_missing: missing,
    });

    // --- Anomalies par fichier ---
    if (format === 'none') {
      anomalies.push({ type: 'header_unparsed', file: filename, note: 'aucun format d\'en-tête reconnu (frontmatter / table md / kv-lines)' });
    }
    for (const req of REQUIRED_FIELDS) {
      if (fields[req] === undefined) {
        anomalies.push({ type: 'metadata_missing_required', file: filename, field: req });
      }
    }
    if (missing.some((k) => OPTIONAL_FIELDS.includes(k))) {
      anomalies.push({
        type: 'metadata_incomplete',
        file: filename,
        fields: missing.filter((k) => OPTIONAL_FIELDS.includes(k)),
      });
    }
    // Cohérence document_id ↔ nom de fichier (id déductible du nom).
    const fileIdMatch = stem.match(/([A-Za-z0-9]+-\d+)/);
    if (fields.document_id && fileIdMatch && fileIdMatch[1] !== fields.document_id) {
      anomalies.push({
        type: 'id_filename_mismatch',
        file: filename,
        document_id: fields.document_id,
        filename_id: fileIdMatch[1],
      });
    }
    if (pdfHomonym) {
      anomalies.push({ type: 'pdf_homonym_present', file: filename, pdf: `${stem}.pdf`, note: 'présence signalée seulement — aucun parsing PDF' });
    }
  }

  // --- Doublons de document_id ---
  const byId = new Map();
  for (const r of records) {
    if (!r.document_id) continue;
    if (!byId.has(r.document_id)) byId.set(r.document_id, []);
    byId.get(r.document_id).push(r.source_filename);
  }
  for (const [id, files] of byId) {
    if (files.length > 1) anomalies.push({ type: 'duplicate_document_id', document_id: id, files });
  }

  // --- Complétude de séquence (uniquement DANS chaque plage --expected) ---
  const presentByPrefix = new Map();
  for (const r of records) {
    const p = parseId(r.document_id);
    if (p) {
      if (!presentByPrefix.has(p.prefix)) presentByPrefix.set(p.prefix, new Set());
      presentByPrefix.get(p.prefix).add(p.num);
    }
  }
  if (expected) {
    for (const rng of expected) {
      const present = presentByPrefix.get(rng.prefix) ?? new Set();
      const missingNums = [];
      for (let n = rng.start; n <= rng.end; n++) {
        if (!present.has(n)) missingNums.push(`${rng.prefix}-${pad(n, rng.width)}`);
      }
      if (missingNums.length) {
        anomalies.push({
          type: 'missing_in_sequence',
          range: `${rng.prefix}-${pad(rng.start, rng.width)}..${pad(rng.end, rng.width)}`,
          missing: missingNums,
        });
      }
    }
  } else {
    // Heuristique advisoire : clusters contigus, trous internes seulement.
    for (const [prefix, set] of presentByPrefix) {
      const nums = [...set].sort((a, b) => a - b);
      let clusterStart = nums[0];
      let prev = nums[0];
      const flushCluster = (from, to) => {
        const gaps = [];
        for (let n = from; n <= to; n++) if (!set.has(n)) gaps.push(`${prefix}-${n}`);
        if (gaps.length) anomalies.push({ type: 'missing_in_sequence_heuristic', prefix, cluster: `${from}..${to}`, missing: gaps, note: 'advisoire (pas de --expected)' });
      };
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] - prev > 10) { flushCluster(clusterStart, prev); clusterStart = nums[i]; }
        prev = nums[i];
      }
      flushCluster(clusterStart, prev);
    }
  }

  // --- Assemblage du manifeste ---
  records.sort((a, b) => a.source_filename.localeCompare(b.source_filename));
  const manifest = {
    schema: 'opusx.registry.manifest/v1',
    generated_from: inputDir,
    expected_ranges: expectedSpec ?? null,
    excluded_files: excludedFiles,
    file_count: records.length,
    anomaly_count: anomalies.length,
    records,
    anomalies,
  };

  const json = JSON.stringify(manifest, null, opts.pretty ? 2 : 0);

  // Écriture : stdout + content/registry/_manifest.json (preuve d'import contrôlé).
  const outDir = path.join(process.cwd(), 'content', 'registry');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, '_manifest.json'), json + '\n', 'utf8');
  process.stdout.write(json + '\n');

  // Résumé humain sur stderr.
  const byType = {};
  for (const a of anomalies) byType[a.type] = (byType[a.type] ?? 0) + 1;
  console.error('──────────────────────────────────────────────');
  console.error(`Manifeste : ${records.length} fichier(s) .md analysé(s) depuis ${inputDir}`);
  if (excludedFiles.length) {
    console.error(`Exclus (décision opérateur, hors moulinette) : ${excludedFiles.length} — ${excludedFiles.join(', ')}`);
  }
  console.error(`Anomalies : ${anomalies.length}` + (anomalies.length ? '' : ' (aucune)'));
  for (const [t, c] of Object.entries(byType)) console.error(`  • ${t} : ${c}`);
  console.error(`Écrit : content/registry/_manifest.json (NON committé dans ce lot)`);
  console.error('──────────────────────────────────────────────');
}

main();
