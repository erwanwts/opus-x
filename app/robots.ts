import type { MetadataRoute } from 'next';

/**
 * robots.txt (WEB-002 Lot D · décision 7 — ouverture du registre canonique).
 * Autorise le crawl du site ET des routes canoniques PUBLIQUES en LECTURE SEULE
 * (registre/graph/concepts, toutes en GET, versionnées, indexables).
 * Reste FERMÉ : les routes d'ÉCRITURE `/api/link/*` (POST) et l'espace privé `/me`.
 * `/api/` garde son Disallow par défaut (deny-by-default) ; seules les 3 familles
 * de lecture publique sont Allow. Pages non publiées → noindex PAR PAGE (WEB-D3).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/registry', '/api/graph', '/api/concepts'],
        disallow: ['/api/link/', '/api/', '/me/'],
      },
    ],
    // DEUX plans, une seule décision de gouvernance (RD-011) :
    //   • sitemap.xml           — plan d'INDEXATION, uniquement les pages indexables ;
    //   • sitemap-discovery.xml — plan de DÉCOUVERTE, tout le corpus publié.
    // Le second est déclaré ici parce que, sans déclaration, aucun agent ne le
    // trouverait et sa finalité disparaîtrait.
    sitemap: [
      'https://opusx.world/sitemap.xml',
      'https://opusx.world/sitemap-discovery.xml',
    ],
    host: 'https://opusx.world',
  };
}
