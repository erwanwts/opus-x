/**
 * LACUNE OUVERTE — franchissement de régime d'adressage (localisé → canonique).
 *
 * Ce test ne valide pas le lien : il MESURE la lacune et vérifie que son nom dit
 * ce qui est vrai. Le nom précédent (`cross-locale-link`) affirmait un
 * franchissement de LOCALE. C'est faux, et le test ci-dessous le démontre :
 * la destination n'existe dans AUCUNE locale — elle est non localisée par
 * construction. Le lecteur ne change pas de langue, il change de régime
 * d'adressage (§16.1 : localisé `/{locale}/{slug}` → canonique `/records/{id}`).
 */
import { describe, it, expect } from 'vitest';
import { buildGeoContent } from './geo';
import { PILLARS, entityHref } from '@/lib/seo/pillars';

const GAP = 'localized-to-canonical-link';

/** Toutes les pages piliers rendues, telles que le build les génère : `en` seul. */
const PAGES = PILLARS.filter((p) => p.recordId && p.translatedLocales.includes('en')).map((p) => ({
  slug: p.slug,
  content: buildGeoContent(p.slug, p.recordId!, { label: '', href: '' }, 'en'),
}));

const crossings = PAGES.flatMap(({ slug, content }) =>
  (content?._gaps ?? []).filter((g) => g.startsWith(`${GAP}:`)).map((g) => ({ slug, id: g.slice(GAP.length + 1) })),
);

describe('lacune de franchissement de régime — nom, compte, et motif', () => {
  it('le nom obsolète `cross-locale-link` n’est plus émis nulle part', () => {
    for (const { slug, content } of PAGES) {
      expect((content?._gaps ?? []).filter((g) => g.startsWith('cross-locale-link')), slug).toEqual([]);
    }
  });

  it('la lacune est émise, et son compte est mesuré (pas supposé)', () => {
    expect(crossings.length).toBeGreaterThan(0);
    // Compte figé pour qu'une variation devienne visible au lieu de passer inaperçue.
    expect(crossings.length).toBe(64);
  });

  it('chaque destination relève du régime CANONIQUE — jamais d’un préfixe de locale', () => {
    for (const { slug, id } of crossings) {
      const href = entityHref(id, 'en');
      expect(href, `${slug} → ${id}`).toBe(`/records/${id.toLowerCase()}`);
      expect(href!.startsWith('/en/'), `${slug} → ${id}`).toBe(false);
    }
  });

  it('MOTIF — la destination n’est pas « dans une autre langue » : elle n’en a aucune', () => {
    // S'il s'agissait d'un franchissement de locale, une variante localisée existerait
    // ailleurs. Aucune n'existe : le résolveur ne rend RIEN hors de la locale canonique.
    for (const { id } of crossings) {
      expect(entityHref(id, 'fr'), `${id} en fr`).toBeNull();
      expect(entityHref(id, 'es'), `${id} en es`).toBeNull();
    }
  });

  it('la lacune ne fuit jamais hors du journal de build', () => {
    // `_gaps` est une couche données ; sa non-fuite au rendu est couverte par
    // GeoPage.gaps.test. Ici : elle reste bien un gap, jamais un lien qualifié.
    for (const { content } of PAGES) {
      expect(content?.entityLinks.some((l) => 'qualified' in l)).toBeFalsy();
    }
  });
});
