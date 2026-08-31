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

  it('en fr/es, les CTA de la Home résolvent vers la locale (piliers activés, phase 1)', () => {
    // Activation FR/ES des piliers : les cibles /professional-passport et
    // /world-skills-protocol existent dans la locale → href résolu (jamais fabriqué,
    // c'est pillarHrefBySlug qui produit l'adresse), aucune lacune sur ces cibles.
    for (const loc of ['fr', 'es']) {
      const c = buildHomepage(loc);
      expect(c.hero.ctaPrimary.href).toBe(`/${loc}/professional-passport`);
      expect(c.finalCta.href).toBe(`/${loc}/world-skills-protocol`);
      expect(c._gaps).not.toContain('cta:/professional-passport');
    }
  });

  it('en fr, TOUS les liens de la Home résolvent — site public trilingue (phase 2)', () => {
    // Phase 2 : les 3 archétypes sont traduits. Le lien Reading Path « API & Developers »
    // (→ /developers) résout désormais en /fr/developers ; plus aucune lacune en fr.
    const c = buildHomepage('fr');
    const dev = c.readingPaths.flatMap((p) => p.links).find((l) => l.name === 'API & Developers');
    expect(dev?.href).toBe('/fr/developers');
    expect(c._gaps).toEqual([]);
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
