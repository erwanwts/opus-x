import type { Config } from 'tailwindcss';

/**
 * Opus X — Tailwind mappé sur PRODUCT-001 Annexe A (les CSS vars vivent dans
 * app/globals.css, source unique verbatim de l'Annexe A).
 *
 * LOI D'OBJET (§10) : registre OBJET (Passport) = navy profond + or + serif ;
 * registre OUTIL (Dashboard) = paper + graphite + sans. Ces tokens exposent la
 * palette canonique ; c'est l'usage (par écran) qui incarne les deux registres.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Couleurs en hex littéral (verbatim Annexe A — miroir des CSS vars de
      // globals.css) : Tailwind ne sait injecter l'alpha des modificateurs
      // d'opacité (bg-gold-500/10, ring-navy-500/15…) que sur des hex/rgb/hsl,
      // pas sur des var() nues. Les deux sources portent des valeurs identiques.
      colors: {
        navy: {
          950: '#050b15',
          900: '#0a1628',
          800: '#0f2038',
          700: '#16304f',
          600: '#1e4272',
          500: '#2c5892',
          400: '#5081bc',
          300: '#8fb0d8',
          200: '#c2d6ec',
          100: '#e4edf7',
          50: '#f4f8fc',
        },
        gold: {
          700: '#8a6d2f',
          600: '#a88a42',
          500: '#c9a961',
          400: '#ddc489',
          300: '#ebdcb4',
          100: '#f7f1e2',
        },
        paper: {
          DEFAULT: '#ffffff',
          warm: '#fbfbfa',
        },
        graphite: {
          900: '#14171c',
          700: '#3a4048',
          500: '#6b7280',
          300: '#c9ced6',
          100: '#eef0f3',
        },
        verified: '#1f7a5c',
        attention: '#b4791e',
        critical: '#a02b2b',
        information: '#2c5892',
      },
      fontFamily: {
        // Les trois voix (§6.1).
        institutional: ['var(--font-institutional)'],
        interface: ['var(--font-interface)'],
        engraved: ['var(--font-engraved)'],
      },
      fontSize: {
        // L'échelle modulaire restreinte (§6.2) — size / line-height.
        display: ['48px', { lineHeight: '56px' }],
        h1: ['32px', { lineHeight: '40px' }],
        h2: ['24px', { lineHeight: '32px' }],
        h3: ['19px', { lineHeight: '28px' }],
        'body-lg': ['17px', { lineHeight: '28px' }],
        body: ['15px', { lineHeight: '24px' }],
        'body-sm': ['13px', { lineHeight: '20px' }],
        micro: ['11px', { lineHeight: '16px', letterSpacing: '0.12em' }],
      },
      spacing: {
        // Échelle base-4 (§9.1, Annexe A).
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        24: 'var(--space-24)',
        32: 'var(--space-32)',
        // Alias de respiration (§9.1).
        breathe: 'var(--breathe-md)',
        'breathe-lg': 'var(--breathe-lg)',
        'breathe-xl': 'var(--breathe-xl)',
      },
      borderRadius: {
        control: 'var(--radius-control)', // 6px — boutons & inputs
        surface: 'var(--radius-surface)', // 8px — cards Outil
        object: 'var(--radius-object)', // 16px — le Passport
      },
      boxShadow: {
        overlay: 'var(--shadow-overlay)', // overlays & modales (Outil)
        object: 'var(--shadow-object)', // le Passport (registre Objet)
      },
      transitionDuration: {
        micro: '150ms',
        surface: '300ms',
        object: '1600ms',
      },
      transitionTimingFunction: {
        institutional: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
