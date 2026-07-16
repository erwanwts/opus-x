import type { MetadataRoute } from 'next';

/**
 * robots.txt (WEB-002 Lot D · WEB-001B §12).
 * Autorise le crawl du site ; ferme les surfaces applicatives non indexables
 * (API et espace privé /me). Pas de blocage de crawler IA ici (llms.txt = plus tard).
 * Les pages non publiées porteront leur propre noindex PAR PAGE (WEB-D3), jamais ici.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/me/'] }],
    sitemap: 'https://opusx.world/sitemap.xml',
    host: 'https://opusx.world',
  };
}
