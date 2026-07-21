// @vitest-environment jsdom
/**
 * Couverture des ARCHÉTYPES ÉDITORIAUX (Knowledge Graph · Developers · Questions).
 *
 * L'invariant central n'est pas cosmétique : une destination citée par le texte mais
 * dont la page n'existe pas ne doit JAMAIS produire un `href`. Ce test le vérifie
 * SUR LE HTML RENDU, pas seulement sur la donnée — c'est là que le lien mort
 * apparaîtrait.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('next/link', () => ({ default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a> }));
vi.mock('next-intl/server', () => ({ setRequestLocale: () => {} }));
vi.mock('next/navigation', () => ({
  notFound: () => { throw new Error('notFound'); },
  redirect: (to: string) => { throw new Error(`redirect:${to}`); },
}));

import { archetypeRoute } from './archetypePage';
import { buildKnowledgeGraph } from '@/lib/content/knowledgeGraph';
import { buildDevelopers } from '@/lib/content/developers';
import { buildQuestions, questionsFaqPairs } from '@/lib/content/questions';

const ARCHETYPES = [
  { slug: 'knowledge-graph', build: buildKnowledgeGraph, h1: 'The Knowledge Graph', faqPairs: undefined },
  { slug: 'developers', build: buildDevelopers, h1: 'Build on published meaning', faqPairs: undefined },
  { slug: 'questions', build: buildQuestions, h1: 'Frequently Asked Questions', faqPairs: questionsFaqPairs },
];

/**
 * Destinations dont AUCUNE page n'existe. `/graph` y figure toujours : la page
 * n'existe pas davantage qu'avant — les CTA ont été RECIBLÉS sur le slug canonique
 * `/knowledge-graph` par décision de l'architecte, ils n'y pointent simplement plus.
 * L'assertion reste donc un garde-fou : rien ne doit réintroduire ce chemin.
 */
const ABSENT = ['/graph', '/records', '/dictionary'];

async function renderArchetype(a: (typeof ARCHETYPES)[number], locale = 'en') {
  const el = await archetypeRoute(a).Page({ params: Promise.resolve({ locale }) });
  return renderToStaticMarkup(el);
}

describe.each(ARCHETYPES)('archétype /$slug', (a) => {
  it('rend son H1, sa signature 1.0.0 / Draft, et les 3 blocs JSON-LD', async () => {
    const html = await renderArchetype(a);
    expect(html).toContain(a.h1);
    expect(html).toContain('Document Version 1.0.0');
    expect(html).toContain('Draft');
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain('"@type":"WebPage"');
  });

  it('AUCUN href vers une destination inexistante', async () => {
    const html = await renderArchetype(a);
    for (const dest of ABSENT) {
      expect(html).not.toContain(`href="${dest}"`);
      expect(html).not.toContain(`href="/en${dest}"`);
    }
  });

  it('ne laisse jamais fuiter _gaps dans le HTML', async () => {
    const html = await renderArchetype(a);
    expect(html).not.toContain('_gaps');
    expect(html).not.toContain('cta:/');
  });

  it('CTA_ENABLED=false → aucun CTA actif, les libellés restent inertes', async () => {
    const html = await renderArchetype(a);
    const content = a.build('en');
    const labels = [...content.hero.ctas, ...content.finalCta.ctas].map((c) => c.label);
    for (const label of labels) expect(html).toContain(label);
    expect(html).toContain('aria-disabled="true"');
  });

  it('une locale non traduite REDIRIGE vers l’anglais (307 dérivé)', async () => {
    await expect(renderArchetype(a, 'fr')).rejects.toThrow(`redirect:/en/${a.slug}`);
  });

  it('une locale hors routing → 404', async () => {
    await expect(renderArchetype(a, 'de')).rejects.toThrow('notFound');
  });
});

describe('destinations absentes — tracées, jamais comblées', () => {
  it('Knowledge Graph : les 2 CTA portent le SLUG CANONIQUE et résolvent', async () => {
    const c = buildKnowledgeGraph('en');
    expect(c.hero.ctas[0].destination).toBe('/knowledge-graph');
    expect(c.hero.ctas[0].href).toBe('/en/knowledge-graph');
    expect(c.finalCta.ctas[0].href).toBe('/en/knowledge-graph');
    expect(c._gaps).toEqual([]); // plus aucune destination absente sur cette page
  });

  it('Developers : /registry et /knowledge-graph résolvent, /records reste INERTE', async () => {
    const c = buildDevelopers('en');
    const byDest = Object.fromEntries(
      [...c.hero.ctas, ...c.finalCta.ctas].map((x) => [x.destination, x.href])
    );
    expect(byDest['/registry']).toBe('/en/registry');
    expect(byDest['/knowledge-graph']).toBe('/en/knowledge-graph');
    expect(byDest['/records']).toBeNull(); // conservé inerte, lacune documentée
    expect(c._gaps).toEqual(['cta:/records']);
  });

  it('Questions : /developers résout (la page existe désormais)', async () => {
    const c = buildQuestions('en');
    const dev = c.finalCta.ctas.find((x) => x.destination === '/developers');
    expect(dev?.href).toBe('/en/developers');
  });
});

describe('Questions §12 — aucune promesse de page inexistante', () => {
  it('ne renvoie plus le lecteur vers un Dictionary retiré du périmètre', async () => {
    // Une promesse EN PROSE n'est pas une référence : le résolveur canonique (RD-001)
    // ne la voit pas. Seule une réécriture éditoriale la lève. Texte de l'architecte.
    const html = await renderArchetype(ARCHETYPES[2]);
    expect(html).not.toContain('consult the Dictionary');
    expect(html).toContain(
      'The concepts introduced in this guide are defined by the published Records of the World Skills Protocol.'
    );
    expect(html).toContain(
      "Additional terminology resources will become available as the protocol&#x27;s terminology governance progresses."
    );
  });
});

describe('FAQPage — questions inédites seulement', () => {
  it('émet les 41 paires de la page Questions', async () => {
    const pairs = questionsFaqPairs(buildQuestions('en'));
    expect(pairs).toHaveLength(41);
    expect(pairs.every((x) => x.q.length > 0 && x.a.length > 0)).toBe(true);
    const html = await renderArchetype(ARCHETYPES[2]);
    expect(html).toContain('"@type":"FAQPage"');
  });

  it('les archétypes SANS Q/R n’émettent aucun FAQPage', async () => {
    const html = await renderArchetype(ARCHETYPES[0]);
    expect(html).not.toContain('"@type":"FAQPage"');
  });
});
