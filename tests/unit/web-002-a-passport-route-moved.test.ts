/**
 * =====================================================================
 * WEB-002 · LOT A — Passport HTML public déplacé  /{handle} → /p/{handle}
 * =====================================================================
 * Post-conditions PERMANENTES de la migration de route (WEB-002.0). Test
 * STRUCTUREL, 100 % filesystem : aucune dépendance Supabase, aucun réseau,
 * exécutable localement (hors périmètre SEC-02).
 *
 * But de la migration : libérer la position RACINE de l'URL pour accueillir
 * `[locale]` au Lot C, SANS jamais laisser le Passport public à la racine.
 *
 * On affirme trois faits durables :
 *   a) app/(public-passport)/p/[handle]/page.tsx EXISTE (nouvelle route).
 *   b) app/(public-passport)/[handle]/ N'EXISTE PLUS (ancienne route racine).
 *   c) Aucun segment nommé EXACTEMENT "[handle]" n'est enfant direct de app/
 *      ni d'un route group "(...)" enfant direct de app/ → le Passport public
 *      n'occupe jamais la position racine de l'URL.
 *
 * NB — On n'affirme PAS « aucun [x] à la racine » : ce serait faux dès le
 * Lot C, qui introduit légitimement app/(site)/[locale]. La garde porte
 * uniquement sur le segment "[handle]".
 * =====================================================================
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../../');
const APP = path.join(ROOT, 'app');

/** Sous-répertoires directs d'un dossier (noms seuls). */
function childDirs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => statSync(path.join(dir, name)).isDirectory());
}

/** Un nom de segment est-il un route group Next.js « (...) » ? */
const isRouteGroup = (name: string) => name.startsWith('(') && name.endsWith(')');

describe('WEB-002 Lot A — migration de la route publique du Passport', () => {
  it('a) la nouvelle route /p/[handle] existe', () => {
    const moved = path.join(APP, '(public-passport)', 'p', '[handle]', 'page.tsx');
    expect(existsSync(moved)).toBe(true);
  });

  it('b) l’ancienne route racine (public-passport)/[handle] a disparu', () => {
    const old = path.join(APP, '(public-passport)', '[handle]');
    expect(existsSync(old)).toBe(false);
  });

  it('c) aucun segment "[handle]" n’occupe la position racine de l’URL', () => {
    // Positions « racine d'URL » = enfants directs de app/, plus les enfants
    // directs d'un route group « (...) » (les route groups sont invisibles
    // dans l'URL : leurs enfants sont donc à la racine effective de l'URL).
    const rootLevelSegments: string[] = [];

    for (const child of childDirs(APP)) {
      rootLevelSegments.push(child);
      if (isRouteGroup(child)) {
        for (const grandChild of childDirs(path.join(APP, child))) {
          rootLevelSegments.push(grandChild);
        }
      }
    }

    expect(rootLevelSegments).not.toContain('[handle]');
  });
});
