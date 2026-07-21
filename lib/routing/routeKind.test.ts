/**
 * Aiguillage du middleware — MATRICE DE NON-RÉGRESSION.
 *
 * Ce test est écrit pour l'ÉTAT ACTUEL, avant tout ajout. Il a deux rôles :
 *
 *   1. figer, chemin par chemin, le régime que le middleware applique AUJOURD'HUI
 *      (les 11 pages, les 6 routes API, les segments d'application, la racine) ;
 *   2. PROUVER que l'extraction est neutre, en confrontant `routeKind` à une
 *      réimplémentation LITTÉRALE de la logique telle qu'elle vivait en ligne dans
 *      `middleware.ts` — avec sa propre copie de la table des segments réservés.
 *
 * Le point 2 est l'analogue du contrôle « graphe régénéré identique » qui a validé
 * l'extraction de `node-ref.mjs` : on ne se contente pas d'attentes écrites à la
 * main, on compare deux implémentations sur un espace de chemins exhaustif.
 */
import { describe, it, expect } from 'vitest';
import { routeKind, firstSegment, RESERVED, PUBLIC_NO_LOCALE, type RouteKind } from './routeKind';
import { routing } from '@/i18n/routing';

// ─── Réimplémentation LITTÉRALE de l'état d'origine ─────────────────────────
// Recopiée de middleware.ts AVANT extraction, table comprise. Sert d'oracle : si
// l'extraction déviait d'un cas, la comparaison ci-dessous le montrerait.
const RESERVED_BEFORE = new Set([
  'dashboard', 'emission', 'establish', 'verify-email', 'passport', 'link',
  'me', 'p', 'passports', 'auth', 'api', 'frameworks', 'issuers',
]);
function routeKindBefore(pathname: string): RouteKind {
  const first = pathname.split('/')[1] ?? '';
  if ((routing.locales as readonly string[]).includes(first)) return 'intl';
  if (RESERVED_BEFORE.has(first)) return 'app';
  return 'intl';
}

// ─── Les chemins RÉELS du site et de l'application ──────────────────────────
const PILLARS = [
  'evidence', 'professional-passport', 'world-skills-protocol', 'trust',
  'frameworks', 'registry', 'verification',
];
const ARCHETYPES = ['knowledge-graph', 'developers', 'questions'];
const API_ROUTES = [
  '/api/registry', '/api/registry/OCR-110', '/api/graph',
  '/api/graph/OCR-110', '/api/concepts', '/api/concepts/framework',
];
const APP_PATHS = [
  '/dashboard', '/emission', '/establish', '/verify-email', '/passport',
  '/passport/settings', '/link', '/me', '/p/erwan', '/passports/erwan',
  '/auth/callback', '/frameworks/wtf/skills', '/issuers/x',
];

describe('les 11 pages publiées restent en régime intl', () => {
  it.each(routing.locales)('locale /%s — racine de locale', (locale) => {
    expect(routeKind(`/${locale}`)).toBe('intl');
  });

  it.each([...PILLARS, ...ARCHETYPES])('/{locale}/%s dans les 3 locales', (slug) => {
    for (const locale of routing.locales) {
      expect(routeKind(`/${locale}/${slug}`), `/${locale}/${slug}`).toBe('intl');
    }
  });

  it('la racine / part en intl (307 vers /en, WEB-D5)', () => {
    expect(routeKind('/')).toBe('intl');
    expect(firstSegment('/')).toBe('');
  });
});

describe('les 6 routes API restent en régime app — jamais localisées', () => {
  it.each(API_ROUTES)('%s', (p) => {
    expect(routeKind(p)).toBe('app');
  });
});

describe('les chemins d’application restent en régime app', () => {
  it.each(APP_PATHS)('%s', (p) => {
    expect(routeKind(p)).toBe('app');
  });
});

describe('un segment inconnu part en intl (la locale lui est ajoutée)', () => {
  it.each(['/about', '/registry/OCR-110', '/xyz'])('%s', (p) => {
    // `/registry/...` reste en intl : l'index du corpus s'adresse `/records`, et
    // `/registry` demeure la page pilier localisée du concept (OCR-124).
    expect(routeKind(p)).toBe('intl');
  });
});

describe('AMENDEMENT EXPLICITE DU GARDE-FOU — /records passe de intl à public', () => {
  /**
   * Ce bloc REMPLACE l'assertion qui figeait `/records` en `intl`. Elle avait été
   * posée au Lot A précisément pour qu'un tel changement soit impossible par
   * inadvertance : le garde-fou devait céder AU GRAND JOUR, pas être contourné.
   * Il cède ici, et l'écart est énuméré chemin par chemin.
   *
   * AVANT (Lot A)  : /records → intl  → 307 vers /en/records
   * APRÈS (Lot D)  : /records → public → servi tel quel, sans locale
   */
  it.each(['/records', '/records/', '/records/OCR-110', '/records/ocr-110', '/records/a/b'])(
    '%s → public',
    (p) => {
      expect(routeKind(p)).toBe('public');
      expect(routeKindBefore(p)).toBe('intl'); // ce que faisait le middleware d'origine
    },
  );

  it('le régime public ne recouvre AUCUN segment réservé ni aucune locale', () => {
    for (const seg of PUBLIC_NO_LOCALE) {
      expect(RESERVED.has(seg), `${seg} ne doit pas être réservé`).toBe(false);
      expect(routing.locales as readonly string[]).not.toContain(seg);
    }
  });

  it('un segment qui RESSEMBLE à /records reste inchangé', () => {
    for (const p of ['/record', '/records2', '/recordsx/y', '/Records', '/en/records']) {
      expect(routeKind(p), p).toBe(routeKindBefore(p));
    }
  });
});

describe('PREUVE DE NEUTRALITÉ — l’extraction ne change aucun verdict', () => {
  it('la table des segments réservés est identique à celle d’origine', () => {
    expect([...RESERVED].sort()).toEqual([...RESERVED_BEFORE].sort());
  });

  it('routeKind == logique d’origine, sur tous les chemins réels', () => {
    // Aucun chemin RÉEL du site ou de l'application n'est touché par l'ajout du
    // régime `public` : il n'intercepte qu'un segment que personne ne servait.
    const all = [
      '/', ...routing.locales.map((l) => `/${l}`),
      ...routing.locales.flatMap((l) => [...PILLARS, ...ARCHETYPES].map((s) => `/${l}/${s}`)),
      ...API_ROUTES, ...APP_PATHS,
    ];
    for (const p of all) expect(routeKind(p), p).toBe(routeKindBefore(p));
  });

  it('routeKind == logique d’origine, sur un espace de chemins engendré', () => {
    // Croise tous les 1ers segments plausibles (locales, réservés, inconnus, vides)
    // avec plusieurs formes de suffixe — y compris les cas limites de découpage.
    const heads = [
      ...routing.locales, ...RESERVED_BEFORE, '', 'about', 'records', 'registry',
      'EN', 'En', 'apis', 'ap', 'frameworks2', 'p2', 'me2', '-', '_', '123',
    ];
    const tails = ['', '/', '/x', '/x/y', '/x/y/z', '/OCR-110', '/a%20b', '/é'];
    let n = 0;
    for (const h of heads) {
      for (const t of tails) {
        const p = `/${h}${t}`;
        // Divergence ATTENDUE et ÉNUMÉRÉE : uniquement les segments publics.
        if (PUBLIC_NO_LOCALE.has(h)) {
          expect(routeKind(p), p).toBe('public');
          expect(routeKindBefore(p), p).toBe('intl');
        } else {
          expect(routeKind(p), p).toBe(routeKindBefore(p));
        }
        n++;
      }
    }
    expect(n).toBeGreaterThan(200); // l'espace balayé est réellement large
  });

  it('cas limites de découpage — aucun écart', () => {
    for (const p of ['', '/', '//', '///', '/api', '/api/', '//api', '/en', '//en/x']) {
      expect(routeKind(p), JSON.stringify(p)).toBe(routeKindBefore(p));
    }
  });
});

describe('la casse et les quasi-correspondances ne sont jamais réservées', () => {
  it.each(['/API/registry', '/Dashboard', '/EN/evidence'])('%s → intl', (p) => {
    // Aucune normalisation de casse dans l'aiguillage : c'est l'état actuel, figé.
    expect(routeKind(p)).toBe('intl');
  });
});
