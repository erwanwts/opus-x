import type { Metadata } from 'next';
import { fontVars } from '@/lib/site/fonts';
import '@/app/globals.css';

/**
 * ROOT LAYOUT des PROJECTIONS DU CORPUS — `/records`.
 *
 * Troisième root layout du dépôt (pattern « multiple root layouts »), à côté de
 * celui du site localisé et de celui de l'application. Il existe pour une raison
 * de fond, pas de commodité : ces pages ne sont **pas localisées**. Un Record est
 * en anglais et le restera, donc `lang="en"` est fixe, et aucun fournisseur
 * next-intl n'a lieu d'être ici.
 *
 * Aucune métadonnée éditoriale n'est posée à ce niveau : chaque page dérive les
 * siennes de l'artefact qu'elle projette (règle de dérivation gravée).
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://opusx.world'),
};

export default function RecordsRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
