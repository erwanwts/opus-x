import type { MetadataRoute } from 'next';
import { indexPlan } from '@/lib/seo/sitemapPlans';

/**
 * PLAN D'INDEXATION (WEB-002 Lot D · WEB-001B §12 · fallback strict §10.2).
 *
 * PRINCIPE : le plan ne décrit QUE le réel, et seulement ce qui est **indexable**.
 * Il dérive de `robots`, qui dérive lui-même du statut documentaire du Record —
 * un seul maillon décisionnel (RD-011). Une page en `noindex` n'y figure pas :
 * la déclarer enverrait deux signaux contradictoires au même moteur.
 *
 * Les 33 Records étant en `Draft`, aucune page de registre n'y figure aujourd'hui.
 * Le plan REMONTE de lui-même à mesure des promotions, sans intervention.
 *
 * Home + piliers : hreflang limité aux locales RÉELLEMENT traduites (registre
 * PILLARS, source unique aussi des generateStaticParams). Jamais un chemin
 * fantôme, jamais une locale absente.
 *
 * Le plan de DÉCOUVERTE, lui, expose tout le corpus publié quel que soit son
 * statut : `app/sitemap-discovery.xml/route.ts`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexPlan().map((e) => ({
    url: e.url,
    ...(e.languages ? { alternates: { languages: e.languages } } : {}),
  }));
}
