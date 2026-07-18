// @vitest-environment jsdom
/**
 * Couverture paramétrée des pages piliers (fiche concept) — UN test, tous les slugs de
 * PILLARS. Une régression sur UNE page casse le build (pas découverte à l'œil).
 * Pour chaque page : rend sans erreur · H1 attendu · ordre des sections = sous-suite de
 * la SÉQUENCE GRAVÉE · 0 fuite _gaps (HTML + JSON-LD) · 0 titre orphelin (implicite via
 * l'ordre) · présence des 4 blocs JSON-LD (Organization·BreadcrumbList·WebPage·FAQPage).
 */
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('next/link', () => ({ default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a> }));
vi.mock('next-intl/server', () => ({ setRequestLocale: () => {} }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('notFound'); } }));

import { pillarRoute } from './pillarPage';
import { PILLARS } from './pillars';

// Ordre canonique GRAVÉ des sections (titres <h2>), tel que rendu par GeoPage.
// Une page n'émet qu'une SOUS-SUITE (les sections sans source sont omises).
const GRAVEN_ORDER = [
  'Canonical Definition', 'Key Facts', 'Why It Exists', 'How It Works', 'Actors',
  'Lifecycle', 'Examples', 'Counter Examples', 'Distinctions', 'FAQ',
  'Related Entities', 'Normative Sources',
];

// H1 attendu par slug (contrat public). Un nouveau pilier sans entrée ici fait ÉCHOUER
// le test — c'est voulu : l'auteur doit déclarer le H1 attendu.
const EXPECTED_H1: Record<string, string> = {
  'evidence': 'Evidence',
  'professional-passport': 'Professional Passport',
  'world-skills-protocol': 'World Skills Protocol (WSP)',
  'trust': 'Trust',
  'frameworks': 'Framework',
  'registry': 'Canonical Registry',
  'verification': 'Verification',
};

const strip = (s: string) => s.replace(/<[^>]+>/g, '').trim();

describe.each(PILLARS.map((p) => p.slug))('page pilier /%s', (slug) => {
  it('rend correctement (H1, ordre gravé, 0 fuite _gaps, 4 blocs JSON-LD)', async () => {
    const el = await pillarRoute(slug).Page({ params: Promise.resolve({ locale: 'en' }) });
    const html = renderToStaticMarkup(el);

    // H1 attendu
    const h1 = strip(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? '');
    expect(h1, `H1 de ${slug}`).toBe(EXPECTED_H1[slug]);

    // Ordre des sections = sous-suite stricte de la séquence gravée (0 titre inconnu/orphelin,
    // 0 réordonnancement).
    const heads = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => strip(m[1]));
    const idx = heads.map((h) => GRAVEN_ORDER.indexOf(h));
    expect(idx.every((i) => i >= 0), `titres connus (${slug}): ${heads}`).toBe(true);
    expect(idx.every((v, i) => i === 0 || v > idx[i - 1]), `ordre gravé (${slug})`).toBe(true);

    // _gaps ne fuit jamais au rendu
    expect(html, `_gaps HTML (${slug})`).not.toContain('_gaps');

    // 4 blocs JSON-LD, dans l'ordre, sans _gaps
    const blocks = [...html.matchAll(/application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    expect(blocks.map((b) => b['@type']), `blocs JSON-LD (${slug})`).toEqual(
      ['Organization', 'BreadcrumbList', 'WebPage', 'FAQPage'],
    );
    expect(blocks.some((b) => JSON.stringify(b).includes('_gaps')), `_gaps JSON-LD (${slug})`).toBe(false);
  });
});
