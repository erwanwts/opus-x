/**
 * ATTESTATION DU MANIFESTE — il correspond au corpus, rejouée à CHAQUE build.
 *
 * Pourquoi cette attestation existe. Le `_manifest.json` porte un checksum par
 * Record, censé attester que chaque artefact publié correspond à sa source. À la
 * réidentification éditoriale (`62027b4`, 2026-07-20 00:11), 11 checksums sont
 * devenus périmés : le manifeste a continué d'attester une conformité qu'il
 * n'avait pas. La divergence a duré ≈ 24 h 40 min, jusqu'à `1c9ffa3`
 * (2026-07-21 00:52) — découverte par une régénération manuelle, PAR AUCUN TEST,
 * car il n'en existait pas. Registre des règles découvertes, PROPOSITION (1),
 * 3ᵉ occurrence : « un instrument non testé n'atteste rien. »
 *
 * Ce test EST l'instrument manquant. Il ne régénère pas le manifeste : il
 * rejoue le sha256 de chaque Record et le compare au checksum stocké. Comme il
 * tourne dans `npm test` (qui doit passer avant tout build), la même divergence
 * ne peut plus rester invisible : elle casse le build au lieu de dormir un jour.
 *
 * Il hashe les OCTETS BRUTS du disque, exactement comme le générateur
 * (`scripts/registry/manifest.mjs`, `createHash('sha256').update(buf)`). Le
 * `.gitattributes` (`* text=auto eol=lf`) garantit que le disque porte les mêmes
 * octets LF que le blob sur lequel le manifeste a été calculé.
 *
 * Périmètre : intégrité du manifeste UNIQUEMENT. Aucun statut, aucune promotion.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');
const MANIFEST = path.join(process.cwd(), 'content/registry/_manifest.json');

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) as {
  file_count: number;
  excluded_files: string[];
  expected_ranges: string | null;
  records: { source_filename: string; checksum_sha256: string; document_id: string | null }[];
};

/** Plages déclarées « PREFIX-<start>..<end> », séparées par des virgules. */
function parseRanges(spec: string | null) {
  if (!spec) return [];
  return spec.split(',').map((s) => s.trim()).filter(Boolean).map((term) => {
    const m = term.match(/^([A-Za-z0-9]+)-(\d+)\.\.(\d+)$/);
    if (!m) throw new Error(`plage invalide : ${term}`);
    return { prefix: m[1], start: parseInt(m[2], 10), end: parseInt(m[3], 10) };
  });
}
function idInRanges(id: string | null, ranges: ReturnType<typeof parseRanges>) {
  const m = id?.match(/^([A-Za-z0-9]+)-(\d+)$/);
  if (!m) return false;
  const [, prefix, num] = m;
  return ranges.some((r) => r.prefix === prefix && +num >= r.start && +num <= r.end);
}

const excluded = new Set(manifest.excluded_files ?? []);
const mdFiles = readdirSync(DIR)
  .filter((f) => /\.md$/i.test(f) && !excluded.has(f))
  .sort();

const sha256 = (buf: Buffer) => createHash('sha256').update(buf).digest('hex');

describe('ATTESTATION DU MANIFESTE — rejouée à chaque build', () => {
  it('file_count == nombre de fichiers .md non exclus sur le disque', () => {
    expect(manifest.file_count).toBe(mdFiles.length);
  });

  it('la population est identique — aucun Record sur disque absent du manifeste, ni l’inverse', () => {
    const inManifest = new Set(manifest.records.map((r) => r.source_filename));
    const onDisk = new Set(mdFiles);
    expect([...onDisk].filter((f) => !inManifest.has(f)), 'sur disque, absent du manifeste').toEqual([]);
    expect([...inManifest].filter((f) => !onDisk.has(f)), 'dans le manifeste, absent du disque').toEqual([]);
  });

  it('le checksum stocké de CHAQUE Record égale le sha256 de son contenu actuel', () => {
    const drift: { file: string; stored: string; disk: string }[] = [];
    for (const r of manifest.records) {
      const full = path.join(DIR, r.source_filename);
      const disk = sha256(readFileSync(full));
      if (disk !== r.checksum_sha256) {
        drift.push({ file: r.source_filename, stored: r.checksum_sha256.slice(0, 12), disk: disk.slice(0, 12) });
      }
    }
    // C'est exactement la divergence qui a duré ≈ 24 h 40 min sans être vue.
    // Un tableau non vide NOMME les Records périmés, il ne dit pas seulement « faux ».
    expect(drift).toEqual([]);
  });

  // GARDE DE PLAGE — l'assertion inverse de la mesure M2. Le générateur est SILENCIEUX
  // sur un id hors `expected_ranges` (il ne signale que les trous DANS chaque plage) :
  // un artefact non prévu serait absorbé sans un mot. Ce test est le fil de détente —
  // il passe aujourd'hui (les 33 sont dans les plages) et échouera, en le NOMMANT, le
  // jour où un id hors plage apparaît. Il ne CORRIGE rien et ne touche pas aux plages :
  // la série de l'artefact de promotion est une décision de l'Architecte.
  it('tout id PRÉSENT tombe dans une plage déclarée — sinon échec nommé', () => {
    const ranges = parseRanges(manifest.expected_ranges);
    expect(ranges.length, 'des plages doivent être déclarées').toBeGreaterThan(0);
    const outOfRange = manifest.records
      .filter((r) => !idInRanges(r.document_id, ranges))
      .map((r) => `${r.source_filename} (id: ${r.document_id ?? '—'})`);
    expect(outOfRange).toEqual([]);
  });

  // D-004 — la série de promotion PROMO-xxx est déclarée hors des plages OCR. Ce test
  // PROUVE le garde de plage sur ce cas réel, par mutation : avec la plage PROMO déclarée,
  // PROMO-001 est accepté ; sans elle (mutation), il est rejeté — exactement l'état
  // AVANT l'amendement. C'est la démonstration que le garde décide bien sur PROMO-001.
  it('D-004 — PROMO-001 est en plage APRÈS l’amendement, rejeté sans la plage PROMO (mutation)', () => {
    const ranges = parseRanges(manifest.expected_ranges);
    expect(ranges.some((r) => r.prefix === 'PROMO'), 'la plage PROMO doit être déclarée (D-004)').toBe(true);
    expect(idInRanges('PROMO-001', ranges), 'après amendement : accepté').toBe(true);
    const sansPromo = ranges.filter((r) => r.prefix !== 'PROMO');
    expect(idInRanges('PROMO-001', sansPromo), 'avant amendement : rejeté').toBe(false);
  });
});
