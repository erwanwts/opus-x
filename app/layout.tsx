import type { Metadata } from 'next';
import { Source_Serif_4, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

/**
 * Les trois voix typographiques (PRODUCT-001 §6.1) :
 *   • Institutionnelle — Source Serif 4 (l'objet Passport, la vision, la cérémonie)
 *   • Interface        — Inter          (le registre Outil : navigation, formulaires)
 *   • Gravée           — IBM Plex Mono  (l'Opus ID, les identifiants)
 *
 * Poids limités à Regular/Medium/Semibold (§6.3) — jamais de Bold (700+),
 * jamais de Light : « Opus X ne crie pas, et ne suit pas la mode ».
 */
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-source-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Opus X',
  description: 'Votre identité professionnelle, établie pour la vie.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${sourceSerif.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
