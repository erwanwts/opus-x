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
  records: { source_filename: string; checksum_sha256: string }[];
};

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
});
