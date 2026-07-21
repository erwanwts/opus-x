/**
 * Résolution de la destination d'un CTA — « ne jamais combler une absence
 * documentaire par une hypothèse ».
 *
 * L'enjeu est le CAS NULL : une destination citée par un texte éditorial mais
 * dont la page n'existe pas ne doit JAMAIS produire un href. Inoffensive tant que
 * CTA_ENABLED est false, elle deviendrait un 404 vivant le jour où le flag bascule.
 */
import { describe, it, expect } from 'vitest';
import { ctaHref, PILLARS } from './pillars';

describe('ctaHref — le cas null', () => {
  it('destination dont la page N’EXISTE PAS → null (jamais un lien mort)', () => {
    // Destinations citées par les archétypes, sans page publiée à ce jour.
    expect(ctaHref('/graph', 'en')).toBeNull();
    expect(ctaHref('/records', 'en')).toBeNull();
    expect(ctaHref('/dictionary', 'en')).toBeNull();
  });

  it('destination vide → null (aucun href fabriqué)', () => {
    expect(ctaHref('', 'en')).toBeNull();
  });

  it('AUCUNE SUBSTITUTION : /graph ne devient pas /knowledge-graph', () => {
    const kg = ctaHref('/knowledge-graph', 'en');
    const g = ctaHref('/graph', 'en');
    expect(g).toBeNull();
    expect(g).not.toBe(kg); // une absence n'emprunte jamais l'adresse d'une voisine
  });

  it('locale sans traduction → null, même si la page existe en anglais', () => {
    expect(ctaHref('/registry', 'en')).toBe('/en/registry');
    expect(ctaHref('/registry', 'fr')).toBeNull();
    expect(ctaHref('/registry', 'es')).toBeNull();
  });
});

describe('ctaHref — ce qui doit continuer de résoudre', () => {
  it('slug d’une page publiée → lien préfixé de la locale', () => {
    expect(ctaHref('/registry', 'en')).toBe('/en/registry');
    expect(ctaHref('registry', 'en')).toBe('/en/registry'); // sans barre de tête
  });

  it('route /api générée par le dépôt → destination CONSERVÉE', () => {
    // Les CTA des pages piliers pointent vers l'entrée de registre du Record.
    expect(ctaHref('/api/registry/OCR-110', 'en')).toBe('/api/registry/OCR-110');
  });

  it('ancre interne → conservée', () => {
    expect(ctaHref('#platform', 'en')).toBe('#platform');
  });

  it('chaque pilier publié résout dans ses locales traduites', () => {
    for (const p of PILLARS) {
      for (const locale of p.translatedLocales) {
        expect(ctaHref(`/${p.slug}`, locale)).toBe(`/${locale}/${p.slug}`);
      }
    }
  });

  it('le lien s’activera SEUL le jour où la page entrera dans PILLARS', () => {
    // Invariant de conception : la résolution ne connaît que PILLARS ; aucune
    // exception codée par slug, donc aucune dette à retirer plus tard.
    const published = new Set(PILLARS.filter((p) => p.translatedLocales.includes('en')).map((p) => p.slug));
    expect(ctaHref('/graph', 'en') === null).toBe(!published.has('graph'));
  });
});
