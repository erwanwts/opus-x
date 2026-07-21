/**
 * Homepage — résolution des références internes (RD-001).
 *
 * Les deux CTA de la Homepage fabriquaient leur adresse par CONCATÉNATION
 * (`/${locale}/professional-passport`), sans consulter le registre. Aucun lien mort
 * en pratique — les pages existent — mais le défaut était structurel : une page
 * sortie de PILLARS, ou une Homepage traduite dans une locale où la cible ne l'est
 * pas, aurait produit un lien mort SILENCIEUX.
 *
 * Ces tests gravent la correction : l'adresse est résolue, jamais fabriquée.
 */
import { describe, it, expect } from 'vitest';
import { buildHomepage } from './homepage';

describe('CTA de la Homepage — résolus, jamais fabriqués', () => {
  it('en anglais, les deux CTA résolvent vers leur page', () => {
    const c = buildHomepage('en');
    expect(c.hero.ctaPrimary.href).toBe('/en/professional-passport');
    expect(c.finalCta.href).toBe('/en/world-skills-protocol');
  });

  it("l'ancre interne est conservée telle quelle", () => {
    expect(buildHomepage('en').hero.ctaSecondary.href).toBe('#platform');
  });

  it('LE CAS NULL — locale non traduite → aucun href, absence tracée', () => {
    // Les piliers ne sont traduits qu'en anglais : en français, la cible n'existe pas.
    const c = buildHomepage('fr');
    expect(c.hero.ctaPrimary.href).toBeNull();
    expect(c.finalCta.href).toBeNull();
    expect(c._gaps).toContain('cta:/professional-passport');
    expect(c._gaps).toContain('cta:/world-skills-protocol');
  });

  it("aucune adresse n'est fabriquée par concaténation de la locale", () => {
    // Le défaut d'origine produisait `/fr/professional-passport` alors que la page
    // n'existe pas. Plus aucune adresse ne doit apparaître pour une locale non traduite.
    const c = buildHomepage('fr');
    const hrefs = [c.hero.ctaPrimary.href, c.finalCta.href];
    expect(hrefs.some((h) => typeof h === 'string' && h.startsWith('/fr/'))).toBe(false);
  });

  it('en anglais, la Homepage ne signale aucune lacune', () => {
    expect(buildHomepage('en')._gaps).toEqual([]);
  });

  it('« Explore the Resources » ne liste que les fiches concept (libellés non vides)', () => {
    // Les archétypes éditoriaux (recordId null) n'y figurent pas : leur libellé serait vide.
    const c = buildHomepage('en');
    expect(c.resources.length).toBeGreaterThan(0);
    expect(c.resources.every((r) => r.title.length > 0)).toBe(true);
  });

  it('le lien « API & Developers » des Reading Paths est actif depuis la publication de la page', () => {
    const c = buildHomepage('en');
    const dev = c.readingPaths
      .flatMap((p) => p.links)
      .find((l) => l.name === 'API & Developers');
    expect(dev?.href).toBe('/en/developers');
  });
});
