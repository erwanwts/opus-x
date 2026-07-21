// @vitest-environment jsdom
/**
 * Rendu d'une projection documentaire.
 *
 * L'invariant du Lot B portait sur le TEXTE PROJETÉ ; celui-ci porte sur le HTML
 * RENDU — c'est là qu'un passthrough ferait disparaître une pseudo-balise sans
 * erreur. Les deux sont nécessaires : le premier prouve que la donnée est intacte,
 * le second qu'elle atteint la page.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

import { RecordPage, StatusBanner } from './RecordPage';
import { buildRecordPage } from '@/lib/registry/recordPage';

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');
const RECORDS = readdirSync(DIR)
  .filter((f) => f.endsWith('.md'))
  .sort()
  .map((f) => ({ id: f.split('_')[0], raw: readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n') }));

const render = (raw: string) => renderToStaticMarkup(<RecordPage content={buildRecordPage(raw)!} />);
const PSEUDO = /&lt;[a-zA-Z][a-zA-Z0-9_ -]*&gt;/g;

describe('BANDEAU DE STATUT — dérivé, et AVANT le titre', () => {
  it('porte la formulation gravée, mot pour mot', () => {
    const html = renderToStaticMarkup(<StatusBanner status="Draft" />);
    expect(html).toContain('STATUS — Draft');
    expect(html).toContain(
      'This Record is published as part of the Canonical Corpus but has not yet been formally validated.',
    );
  });

  it('précède le titre dans le document', () => {
    const html = render(RECORDS.find((r) => r.id === 'OCR-110')!.raw);
    expect(html.indexOf('STATUS —')).toBeGreaterThan(-1);
    expect(html.indexOf('STATUS —')).toBeLessThan(html.indexOf('<h1'));
  });

  it('les 33 pages le portent — les 33 Records sont en Draft', () => {
    for (const { id, raw } of RECORDS) expect(render(raw), id).toContain('STATUS — Draft');
  });

  it('DISPARAÎT à la promotion, sans intervention', () => {
    const raw = RECORDS.find((r) => r.id === 'OCR-110')!.raw;
    const promoted = raw.replace('| **Status** | Draft |', '| **Status** | Normative |');
    const html = render(promoted);
    expect(html).not.toContain('STATUS —');
    expect(html).not.toContain('has not yet been formally validated');
    // le seul champ modifié est Status : rien d'autre n'a été touché.
    expect(html).toContain('Evidence');
  });
});

describe('AUCUN HTML INJECTÉ — les pseudo-balises atteignent la page', () => {
  it('OCR-110 rend `<level>` échappé, jamais interprété', () => {
    const html = render(RECORDS.find((r) => r.id === 'OCR-110')!.raw);
    expect(html).toContain('&lt;level&gt;');
    expect(html).not.toContain('<level>');
    // la phrase reste entière — c'est le cas de perte silencieuse évité
    expect(html).toContain('Levels shown as');
  });

  it('les pseudo-balises des blocs de code sont rendues, échappées', () => {
    const html = render(RECORDS.find((r) => r.id === 'OCR-110')!.raw);
    expect(html).toContain('&lt;opus_id&gt;');
  });

  it('sur les 33 pages, aucune pseudo-balise n’est perdue', () => {
    let total = 0;
    for (const { id, raw } of RECORDS) {
      const src = (raw.match(/<[a-zA-Z][a-zA-Z0-9_ -]*>/g) ?? []).length;
      const out = (render(raw).match(PSEUDO) ?? []).length;
      expect(out, `${id} : pseudo-balises rendues`).toBe(src);
      total += out;
    }
    expect(total).toBe(73);
  });
});

describe('PROJECTION — la page dit ce qu’elle est', () => {
  it('déclare n’être ni normative ni faisant autorité', () => {
    const html = render(RECORDS[0].raw);
    expect(html).toContain('documentary projection derived from the Canonical Corpus');
    expect(html).toContain('not an independent normative publication');
    expect(html).toContain('The Record itself remains the source.');
  });

  it('le fil d’ariane mène à l’index /records', () => {
    expect(render(RECORDS[0].raw)).toContain('href="/records"');
  });

  it('les métadonnées d’en-tête sont affichées telles quelles', () => {
    const html = render(RECORDS.find((r) => r.id === 'OCR-115')!.raw);
    expect(html).toContain('Document metadata');
    expect(html).toContain('1.1.0');
  });

  it('aucune fuite de _gaps dans le HTML', () => {
    for (const { id, raw } of RECORDS) expect(render(raw), id).not.toContain('_gaps');
  });

  it('les 33 pages rendent sans erreur et portent leur identifiant', () => {
    for (const { id, raw } of RECORDS) expect(render(raw), id).toContain(id);
  });
});
