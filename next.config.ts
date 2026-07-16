import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// Plugin next-intl (charge i18n/request.ts par défaut). Aucune autre option modifiée.
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
