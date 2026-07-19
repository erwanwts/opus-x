// @vitest-environment jsdom
/**
 * _gaps — traçabilité interne SANS fuite au rendu (arbitrage architecte).
 * Une section canonique sans source :
 *   • est listée dans content._gaps (couche données / journal de build) ;
 *   • n'émet AUCUN titre orphelin dans le HTML ;
 *   • n'apparaît JAMAIS (ni "_gaps" ni le titre) dans le HTML ni le JSON-LD.
 * Cas gravé : OCR-107 (Verification) — pas de Lifecycle (c'est un acte, pas une entité).
 */
import { describe, it, expect, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// next/link → simple ancre (pas de routeur en test).
vi.mock('next/link', () => ({ default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a> }));

import { GeoPage } from './GeoPage';
import { buildGeoContent } from '@/lib/content/geo';

afterEach(() => cleanup());

describe('GeoPage — _gaps sans fuite au rendu', () => {
  it('OCR-107 : Lifecycle absent → tracé dans _gaps, 0 titre orphelin, 0 "_gaps" au rendu', () => {
    const content = buildGeoContent('verification', 'OCR-107', { label: '', href: '' }, 'en');
    expect(content).not.toBeNull();
    // 1) le trou est tracé dans la couche données
    expect(content!._gaps).toContain('Lifecycle');

    const { container } = render(<GeoPage content={content!} />);
    const headings = Array.from(container.querySelectorAll('h2')).map((h) => h.textContent);
    // 2) aucun titre orphelin "Lifecycle"
    expect(headings).not.toContain('Lifecycle');
    // 3) le champ interne ne fuit jamais au rendu
    expect(container.innerHTML).not.toContain('_gaps');
  });

  it('OCR-101 (complet) : rendu sans aucune fuite de "_gaps"', () => {
    const content = buildGeoContent('professional-passport', 'OCR-101', { label: '', href: '' }, 'en');
    expect(content).not.toBeNull();
    const { container } = render(<GeoPage content={content!} />);
    expect(container.innerHTML).not.toContain('_gaps');
  });
});
