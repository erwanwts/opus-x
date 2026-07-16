import type { Metadata } from 'next';
import { fontVars } from '@/lib/site/fonts';
import '@/app/globals.css';

/**
 * ROOT LAYOUT de la branche APPLICATION (WEB-002 Lot B, WEB-001B §10.1).
 * Pattern Next.js « multiple root layouts » : ce layout rend <html>/<body>
 * pour toutes les routes applicatives (route groups invisibles dans l'URL).
 * Comportement préservé de l'ancien app/layout.tsx : lang="fr", trois polices.
 */
export const metadata: Metadata = {
  title: 'Opus X',
  description: 'Votre identité professionnelle, établie pour la vie.',
};

export default function ApplicationRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
