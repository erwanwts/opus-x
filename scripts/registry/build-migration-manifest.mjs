#!/usr/bin/env node
/**
 * =====================================================================
 * OCR-GROUND-001 §10 — MANIFEST-OCR.json (PLAN de migration Drive)
 * =====================================================================
 * Node pur (node:fs), zéro dépendance. DÉRIVE le manifeste de migration à
 * partir de content/registry/_manifest.json (inventaire d'import committé) —
 * les sourceChecksum sont REPRIS de l'inventaire, jamais retranscrits.
 *
 * ⚠️ C'est un PLAN, NON APPLIQUÉ : aucune action Drive, aucun upload, aucun
 * remplacement. Objet DISTINCT de _manifest.json (inventaire d'import).
 *
 * Statuts d'artefact (exacts) :
 *   • OCR-110 : dérivés « généré et vérifié contre golden » (docs/web/OCR-110-golden/).
 *   • OCR-101 : dérivés « mécanique vérifiée par idempotence ; artefacts NON persistés
 *               (build/ gitignoré) ».
 *   • 30 autres : « à générer (pipeline officiel, depuis le graphe) ».
 *   • PDF : « différé (renderer non construit) » pour tous.
 *
 * Usage : node scripts/registry/build-migration-manifest.mjs
 *   → écrit content/registry/MANIFEST-OCR.json
 * =====================================================================
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const INVENTORY = 'content/registry/_manifest.json';
const OUT = 'content/registry/MANIFEST-OCR.json';

// Les 6 dérivés TEXTE + le PDF, par Record (le .md est la source #1).
const DERIVED = [
  { kind: 'jsonld', suffix: '.json' },
  { kind: 'faq', suffix: '-faq.md' },
  { kind: 'seo', suffix: '-seo.json' },
  { kind: 'geo', suffix: '-geo.md' },
  { kind: 'llm', suffix: '-llm.md' },
  { kind: 'keywords', suffix: '-keywords.json' },
];

function derivedStatus(documentId) {
  if (documentId === 'OCR-110') return 'généré et vérifié contre golden (docs/web/OCR-110-golden/)';
  if (documentId === 'OCR-101') return 'mécanique vérifiée par idempotence ; artefacts NON persistés (build/ gitignoré)';
  return 'à générer (pipeline officiel, depuis le graphe)';
}

const inv = JSON.parse(readFileSync(INVENTORY, 'utf8'));

const records = inv.records.map((r) => {
  const id = r.document_id;                       // ex. OCR-110
  const stem = r.source_filename.replace(/\.md$/i, ''); // ex. OCR-110_Evidence
  const dstatus = derivedStatus(id);

  const artifacts = [
    { kind: 'md', file: r.source_filename, status: 'source (committé au dépôt)' },
    { kind: 'pdf', file: `${stem}.pdf`, status: 'différé (renderer non construit)' },
    ...DERIVED.map((d) => ({ kind: d.kind, file: `${id}${d.suffix}`, status: dstatus })),
  ];

  // Ancien fichier Drive à remplacer : le PDF actuel (seulement si un homonyme existe).
  const drive_old = r.pdf_homonym
    ? [{ file: `${stem}.pdf`, action: 'replace', note: 'PDF actuel du dossier Drive OCR-100' }]
    : [{ note: 'aucun PDF Drive actuel pour ce Record (pdf_homonym=false)' }];

  // Nouveaux artefacts à déposer : les 6 dérivés + le PDF régénéré.
  const drive_new = [
    ...DERIVED.map((d) => ({ file: `${id}${d.suffix}`, kind: d.kind })),
    { file: `${stem}.pdf`, kind: 'pdf', note: 'régénéré (différé)' },
  ];

  return {
    document_id: id,
    canonical_id: r.canonical_id,
    version: r.version,
    status: r.lifecycle_status,               // Draft
    classification: 'P0 Public Canonical',    // arbitrage architecte (par famille)
    sourceChecksum: `sha256:${r.checksum_sha256}`,
    source_md: r.source_filename,
    artifacts,
    drive_old,
    drive_new,
  };
});

const manifest = {
  schema: 'opusx.registry.migration-manifest/v1',
  purpose: 'PLAN de migration Drive — NON APPLIQUÉ. Objet DISTINCT de content/registry/_manifest.json (inventaire d\'import).',
  applied: false,
  generated_from: INVENTORY,
  classification_policy: {
    scheme: 'P0..P4',
    decision: 'P0 Public Canonical par FAMILLE (arbitrage architecte)',
    'OCR-000..005': 'P0 Public Canonical',
    'OCR-100..125': 'P0 Public Canonical',
  },
  duplicate_resolution: {
    rule: 'OCR-00x existe en deux versions dans le Drive',
    authoritative: 'versions LONGUES (dossier Drive OCR-100, ~8-9 Ko) — FONT FOI',
    obsolete_to_remove: 'versions COURTES (dossier Drive OCR, ~2 Ko) = squelettes OCR-000..005 — À RETIRER',
    note: 'les versions courtes sont HORS périmètre d\'import (jamais dans le dépôt) ; le générateur ne DOIT JAMAIS tourner sur une version courte (addendum §C).',
    short_versions_to_remove: ['OCR-000', 'OCR-001', 'OCR-002', 'OCR-003', 'OCR-004', 'OCR-005'].map(
      (id) => ({ document_id: id, drive_folder: 'OCR', action: 'remove', reason: 'obsolète (squelette ~2 Ko)' })
    ),
  },
  artifact_spec: {
    per_record_count: 8,
    kinds: ['md (source)', 'pdf (différé)', 'jsonld', 'faq', 'seo', 'geo', 'llm', 'keywords'],
    note: 'RÉFÉRENCE les artefacts ; n\'exige pas qu\'ils soient tous générés maintenant.',
  },
  generator_validation: {
    'OCR-110': 'golden 6/6 octet + échec-sur-divergence (docs/web/OCR-110-golden/)',
    'OCR-101': 'idempotence 6/6 (run A==run B) + contrat d\'extraction + échec-sur-divergence vs snapshot interne ; artefacts NON persistés',
    autres: 'à générer par le pipeline officiel',
  },
  record_count: records.length,
  excluded_files: inv.excluded_files,          // REG-TERMINOLOGY (hors moulinette)
  records,
  migration_plan: {
    applied: false,
    order: [
      '1. Méta/gouvernance : OCR-000 → OCR-005 (déposer les nouveaux dérivés).',
      '2. Foundational : OCR-100 → OCR-125 (déposer les nouveaux dérivés).',
      '3. Remplacer les PDF actuels (OCR-100 folder) par les PDF régénérés (quand le renderer existera).',
      '4. Retirer les versions COURTES obsolètes (dossier Drive OCR : OCR-000..005).',
    ],
    mapping_old_to_new: 'par document_id : les drive_old d\'un Record sont remplacés par ses drive_new.',
    guard: 'ne jamais faire tourner le générateur sur une version courte (addendum §C).',
  },
  rollback_plan: {
    applied: false,
    steps: [
      '1. En cas d\'échec de dépôt : ne pas retirer les anciens tant que les nouveaux ne sont pas vérifiés.',
      '2. Restaurer les PDF OCR-100 d\'origine (drive_old) par correspondance inverse (document_id).',
      '3. Restaurer les versions COURTES du dossier OCR si elles avaient été retirées.',
      '4. Point de restauration = cet inventaire + les sourceChecksum (content/registry/_manifest.json).',
    ],
    integrity_anchor: 'sourceChecksum (sha256 du .md) par Record — permet de vérifier qu\'un artefact restauré correspond à sa source.',
  },
};

writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.error(`MANIFEST-OCR.json écrit : ${OUT} (${records.length} records, PLAN non appliqué)`);
