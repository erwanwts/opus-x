#!/usr/bin/env node
/**
 * =====================================================================
 * OCR-GROUND-001 §9 — Générateur des artefacts dérivés (source unique : le .md)
 * =====================================================================
 * Node pur (node:fs + node:crypto), zéro dépendance. Source gouvernée = le
 * Markdown validé `OCR-XXX_*.md`. Les 6 dérivés TEXTE sont reproductibles OCTET
 * pour octet ; le PDF (hors périmètre ici) est content-equality seulement.
 *
 * Chaque artefact porte le MÊME Document ID, Canonical ID, version et
 * `sourceChecksum = sha256:<sha256(.md)>`. Toute section source manquante/vide
 * fait ÉCHOUER la génération (pas d'invention). Idempotent.
 *
 * Usage :
 *   node scripts/registry/generate.mjs generate <src.md> <outDir>
 *   node scripts/registry/generate.mjs verify   <src.md> <goldenDir>
 * =====================================================================
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

// ---- Extraction d'en-tête (table | Field | Value | à libellés gras) ----------
function headerValue(md, label) {
  const re = new RegExp(`^\\|\\s*\\*\\*${label}\\*\\*\\s*\\|\\s*(.+?)\\s*\\|\\s*$`, 'm');
  const m = md.match(re);
  if (!m) throw new Error(`GEN: champ d'en-tête « ${label} » absent`);
  return m[1].replace(/^`|`$/g, '').trim();
}

// ---- Extraction d'une section ## Name … (jusqu'au prochain ## ) --------------
function section(md, name) {
  const re = new RegExp(`\\n## ${name}\\s*\\n([\\s\\S]*?)(?=\\n## |\\n# |$)`);
  const m = md.match(re);
  if (!m || !m[1].trim()) throw new Error(`GEN: section « ${name} » absente ou vide`);
  return m[1].replace(/^\n+/, '').replace(/\s+$/, ''); // corps net, sans blancs encadrants
}

// ---- Bloc ```json ... ``` d'une section --------------------------------------
function jsonBlock(md, name) {
  const body = section(md, name);
  const m = body.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!m) throw new Error(`GEN: bloc \`\`\`json absent dans « ${name} »`);
  return JSON.parse(m[1]);
}

// ---- Frontmatter YAML commun aux dérivés .md ---------------------------------
function frontmatter(meta) {
  return [
    '---',
    `documentId: ${meta.documentId}`,
    `canonicalId: ${meta.canonicalId}`,
    `version: ${meta.version}`,
    `sourceChecksum: ${meta.sourceChecksum}`,
    '---',
    '',
  ].join('\n');
}

// ---- Construit les 6 artefacts dérivés (map nom→bytes) -----------------------
export function buildArtifacts(srcPath) {
  const bytes = readFileSync(srcPath);
  const md = bytes.toString('utf8');
  const checksum = 'sha256:' + createHash('sha256').update(bytes).digest('hex');

  const meta = {
    documentId: headerValue(md, 'Document ID'),
    canonicalId: headerValue(md, 'Canonical ID'),
    version: headerValue(md, 'Version'),
    sourceChecksum: checksum,
  };
  const id = meta.documentId; // ex. OCR-110

  // JSON-LD : header (préfixe _) + le mapping du .md
  const jsonld = {
    _documentId: meta.documentId,
    _canonicalId: meta.canonicalId,
    _version: meta.version,
    _sourceChecksum: meta.sourceChecksum,
    ...jsonBlock(md, 'JSON-LD Mapping'),
  };

  // Keywords : la section Search Keywords, découpée par virgule
  const keywords = section(md, 'Search Keywords').split(',').map((s) => s.trim()).filter(Boolean);

  const seo = {
    documentId: meta.documentId,
    canonicalId: meta.canonicalId,
    version: meta.version,
    sourceChecksum: meta.sourceChecksum,
    seoSummary: section(md, 'SEO Summary'),
    keywords,
  };

  const keywordsArtifact = {
    documentId: meta.documentId,
    canonicalId: meta.canonicalId,
    version: meta.version,
    sourceChecksum: meta.sourceChecksum,
    count: keywords.length,
    keywords,
  };

  const faqMd = `${frontmatter(meta)}\n# ${id} — FAQ\n\n${section(md, 'FAQ')}\n`;
  const geoMd = `${frontmatter(meta)}\n# ${id} — GEO\n\n${section(md, 'GEO Summary')}\n`;
  const llmMd = `${frontmatter(meta)}\n# ${id} — LLM\n\n${section(md, 'LLM Summary')}\n`;

  // JSON : 2 espaces, PAS de newline final (golden se termine par « } »).
  const j = (o) => JSON.stringify(o, null, 2);

  return new Map([
    [`${id}.json`, j(jsonld)],
    [`${id}-faq.md`, faqMd],
    [`${id}-geo.md`, geoMd],
    [`${id}-llm.md`, llmMd],
    [`${id}-seo.json`, j(seo)],
    [`${id}-keywords.json`, j(keywordsArtifact)],
  ]);
}

function main() {
  const [cmd, src, dir] = process.argv.slice(2);
  if (!cmd || !src || !dir) {
    console.error('Usage: generate.mjs <generate|verify> <src.md> <outDir|goldenDir>');
    process.exit(2);
  }
  const artifacts = buildArtifacts(src);

  if (cmd === 'generate') {
    mkdirSync(dir, { recursive: true });
    for (const [name, content] of artifacts) {
      writeFileSync(path.join(dir, name), content, 'utf8');
    }
    console.error(`GEN: ${artifacts.size} artefacts écrits dans ${dir}`);
    return;
  }

  if (cmd === 'verify') {
    let ok = 0, diff = 0;
    for (const [name, content] of artifacts) {
      const goldenPath = path.join(dir, name);
      if (!existsSync(goldenPath)) { console.log(`MISSING golden : ${name}`); diff++; continue; }
      const golden = readFileSync(goldenPath);
      const gen = Buffer.from(content, 'utf8');
      const same = Buffer.compare(golden, gen) === 0;
      const gh = createHash('sha256').update(golden).digest('hex').slice(0, 12);
      const nh = createHash('sha256').update(gen).digest('hex').slice(0, 12);
      console.log(`${same ? 'OK  ' : 'DIFF'}  ${name.padEnd(22)} golden=${gh} regen=${nh}`);
      same ? ok++ : diff++;
    }
    console.error(`\nRésultat : ${ok} OK / ${diff} DIFF (sur ${artifacts.size} dérivés texte)`);
    process.exit(diff === 0 ? 0 : 1);
  }

  console.error(`Commande inconnue : ${cmd}`);
  process.exit(2);
}

main();
