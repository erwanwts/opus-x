/**
 * Les trois voix typographiques (PRODUCT-001 §6.1) — module PARTAGÉ par les
 * root layouts de branche (application, marketing transitoire, et — au Lot C —
 * le site [locale]). Extrait verbatim de l'ancien app/layout.tsx :
 *   • Institutionnelle — Source Serif 4 (l'objet Passport, la vision, la cérémonie)
 *   • Interface        — Inter          (le registre Outil : navigation, formulaires)
 *   • Gravée           — IBM Plex Mono  (l'Opus ID, les identifiants)
 *
 * Poids limités à Regular/Medium/Semibold (§6.3) — jamais de Bold (700+),
 * jamais de Light : « Opus X ne crie pas, et ne suit pas la mode ».
 */
import { Source_Serif_4, Inter, IBM_Plex_Mono } from 'next/font/google';

export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-source-serif',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

// Même chaîne, dans le MÊME ordre, que l'ancien className concaténé de app/layout.tsx.
export const fontVars = `${sourceSerif.variable} ${inter.variable} ${plexMono.variable}`;
