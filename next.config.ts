import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { transitionalRedirects } from './lib/seo/transitional-redirects';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Redirections transitoires (compat wtf → world-trader, À RETIRER — voir module).
  async redirects() {
    return transitionalRedirects;
  },
};

// Plugin next-intl (charge i18n/request.ts par défaut). Aucune autre option modifiée.
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
