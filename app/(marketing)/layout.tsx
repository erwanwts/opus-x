import type { Metadata } from 'next';
import { fontVars } from '@/lib/site/fonts';
import '@/app/globals.css';

/**
 * TRANSITOIRE — supprimé au Lot C quand (marketing) migre vers (site)/[locale]
 * et que / passe au 307. Existe uniquement pour donner un root layout à la
 * landing existante pendant que la branche application acquiert le sien
 * (pattern « multiple root layouts » : plus de app/layout.tsx unique).
 * Rend EXACTEMENT le même <html lang="fr"> + 3 polices que l'ancien root.
 */
export const metadata: Metadata = {
  title: 'Opus X',
  description: 'Votre identité professionnelle, établie pour la vie.',
};

export default function MarketingRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
