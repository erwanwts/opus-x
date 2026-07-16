import { defineRouting } from 'next-intl/routing';

/**
 * Routing i18n institutionnel (WEB-002 Lot C · WEB-001B §7, §10).
 *   • Langue canonique : en (x-default → /en au Lot C2/C3).
 *   • localePrefix 'always' : chaque langue a SON URL — /en /fr /es.
 *   • Fallback strict : une route non traduite n'est pas générée (§10.2).
 */
export const routing = defineRouting({
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeCookie: { name: 'NEXT_LOCALE' },
});

export type AppLocale = (typeof routing.locales)[number];
