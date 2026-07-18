/**
 * =====================================================================
 * Opus X — Registre des pages piliers GEO (source unique)
 * =====================================================================
 * Consommé À LA FOIS par le sitemap et les generateStaticParams des pages, pour
 * que les URLs publiées et le sitemap restent synchrones PAR CONSTRUCTION.
 *
 * EN d'abord (fallback strict WEB-001B §10.2) : une page n'émet que les locales
 * RÉELLEMENT traduites. Une route non traduite n'est pas générée, absente du
 * sitemap et des hreflang.
 * =====================================================================
 */
export interface Pillar {
  slug: string;
  recordId: string | null; // Record OCR source (null = page sans Record dédié)
  translatedLocales: string[]; // locales réellement disponibles (EN d'abord)
  /**
   * Libellé du CTA (éditorial), GRAVÉ par pilier — jamais templaté depuis le titre.
   * Absent = CTA non rendu sur la page, tracé dans _gaps (le libellé n'est pas encore
   * gravé par l'architecte). On n'invente aucun libellé.
   */
  ctaLabel?: string;
}

/** Les piliers PUBLIÉS. On n'ajoute une entrée que quand la page existe vraiment. */
export const PILLARS: Pillar[] = [
  { slug: 'evidence', recordId: 'OCR-110', translatedLocales: ['en'], ctaLabel: 'View the Evidence Registry Entry' },
  { slug: 'professional-passport', recordId: 'OCR-101', translatedLocales: ['en'], ctaLabel: 'View the Professional Passport Registry Entry' },
  { slug: 'world-skills-protocol', recordId: 'OCR-100', translatedLocales: ['en'], ctaLabel: 'View the World Skills Protocol Registry Entry' },
  { slug: 'trust', recordId: 'OCR-105', translatedLocales: ['en'], ctaLabel: 'View the Trust Registry Entry' },
  { slug: 'frameworks', recordId: 'OCR-115', translatedLocales: ['en'], ctaLabel: 'View the Framework Registry Entry' },
  { slug: 'registry', recordId: 'OCR-124', translatedLocales: ['en'], ctaLabel: 'Explore the Canonical Registry' },
  { slug: 'verification', recordId: 'OCR-107', translatedLocales: ['en'], ctaLabel: 'View the Verification Registry Entry' },
];

export function pillarBySlug(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

/**
 * SOURCE UNIQUE de vérité pour les liens d'entités (les 12 pages en héritent).
 * Un OCR-id ne devient un lien QUE s'il a une page pilier PUBLIÉE dans la locale
 * courante (registre PILLARS). Sinon → null (texte brut, JAMAIS de lien /api/).
 * Les pages non encore publiées se lieront automatiquement dès leur ajout à PILLARS.
 */
export function entityHref(ocrId: string, locale: string): string | null {
  const p = PILLARS.find((x) => x.recordId === ocrId && x.translatedLocales.includes(locale));
  return p ? `/${locale}/${p.slug}` : null;
}
