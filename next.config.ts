import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Aucune redirection transitoire : chaque représentation canonique a son adresse
// propre (`/frameworks/wtf` et `/frameworks/world-trader` répondent chacune avec
// leur statut d'identité dérivé). Voir docs/migration/MIG-wtf-to-wtr-2026-07-18.md.
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// Plugin next-intl (charge i18n/request.ts par défaut). Aucune autre option modifiée.
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
