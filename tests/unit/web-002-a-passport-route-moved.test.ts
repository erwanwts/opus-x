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
 *   a) La route /p/[handle] EXISTE (page.tsx). Chemin réel depuis le Lot B :
 *      app/(application)/(public-passport)/p/[handle]/page.tsx — les route
 *      groups « (application) » et « (public-passport) » sont invisibles dans
 *      l'URL, qui reste /p/{handle}.
 *   b) app/(public-passport)/[handle]/ N'EXISTE PLUS (ancienne route racine).
 *   c) Aucun segment nommé EXACTEMENT "[handle]" n'occupe la position racine de
 *      l'URL — c.-à-d. n'est atteignable depuis app/ en ne traversant que des
 *      route groups « (...) » (invisibles dans l'URL). Le Passport public n'est
 *      jamais à la racine.
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
    // Depuis le Lot B, (public-passport) vit sous le route group (application).
    const moved = path.join(
      APP, '(application)', '(public-passport)', 'p', '[handle]', 'page.tsx'
    );
    expect(existsSync(moved)).toBe(true);
  });

  it('b) l’ancienne route racine (public-passport)/[handle] a disparu', () => {
    const old = path.join(APP, '(public-passport)', '[handle]');
    expect(existsSync(old)).toBe(false);
  });

  it('c) aucun segment "[handle]" n’occupe la position racine de l’URL', () => {
    // Position « racine d'URL » = tout segment atteignable depuis app/ en ne
    // traversant QUE des route groups « (...) » (invisibles dans l'URL). On
    // descend donc RÉCURSIVEMENT à travers les route groups imbriqués — depuis
    // le Lot B, la hiérarchie est app/(application)/(public-passport)/… — et on
    // collecte chaque segment ainsi exposé à la racine.
    const urlRootSegments: string[] = [];

    function walk(dir: string) {
      for (const child of childDirs(dir)) {
        urlRootSegments.push(child);
        if (isRouteGroup(child)) walk(path.join(dir, child));
      }
    }
    walk(APP);

    expect(urlRootSegments).not.toContain('[handle]');
  });
});
