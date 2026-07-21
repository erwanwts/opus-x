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
  // ARCHÉTYPES ÉDITORIAUX — pas de Record source (`recordId: null`) : leur prose est
  // livrée par l'architecte, elle ne se projette pas d'un OCR. Ils entrent au registre
  // pour la MÊME raison que les piliers : sitemap, generateStaticParams et résolution
  // des liens (pillarHrefBySlug / ctaHref) restent synchrones PAR CONSTRUCTION.
  // `ctaLabel` absent : leur CTA est porté par leur propre contenu, pas par le registre.
  { slug: 'knowledge-graph', recordId: null, translatedLocales: ['en'] },
  { slug: 'developers', recordId: null, translatedLocales: ['en'] },
  { slug: 'questions', recordId: null, translatedLocales: ['en'] },
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

/**
 * MÊME mécanisme qu'entityHref, mais résolu par SLUG (les archétypes — API &
 * Developers, etc. — n'ont pas de recordId). Consommé par les liens des Reading
 * Paths et de « Explore the Resources » : une page devient un lien DÈS qu'elle
 * entre dans PILLARS (activation automatique, aucune exception codée). Sinon → null
 * (texte brut, jamais de lien mort).
 */
export function pillarHrefBySlug(slug: string, locale: string): string | null {
  const p = PILLARS.find((x) => x.slug === slug && x.translatedLocales.includes(locale));
  return p ? `/${locale}/${p.slug}` : null;
}

/**
 * Chemins de site PUBLIÉS et NON LOCALISÉS — les projections du corpus.
 *
 * Un Record est en anglais et le restera : ces pages n'ont pas de préfixe de
 * locale, et une référence vers elles ne doit pas en recevoir un. Le registre
 * reste la SOURCE : tant qu'un chemin n'y figure pas, une référence vers lui reste
 * INERTE — c'est RD-001, appliquée à un régime d'adressage différent.
 */
export const PUBLISHED_PUBLIC_PATHS = new Set(['/records']);

/**
 * Résout la DESTINATION d'un CTA — même discipline que `entityHref` et
 * `pillarHrefBySlug` : on ne lie que ce qui existe, on n'invente jamais.
 *
 * Un CTA qui recopie sa destination sans la résoudre est un LIEN MORT EN PUISSANCE :
 * inoffensif tant que `CTA_ENABLED` est false (libellé inerte, aucun href émis), il
 * devient un 404 vivant le jour où le flag bascule. La résolution supprime ce risque
 * à la source.
 *
 *   • `/api/...` → route générée par le dépôt, elle EXISTE → destination conservée ;
 *   • `#ancre`   → cible interne à la page → conservée ;
 *   • sinon      → traitée comme un SLUG de page de site, résolu par PILLARS.
 *                  Absent du registre → `null` : le libellé s'affiche INERTE, jamais
 *                  un lien. Le jour où la page entre dans PILLARS, le lien s'active
 *                  de lui-même — aucune retouche éditoriale, aucune dette à retirer.
 *
 * AUCUNE SUBSTITUTION. Une destination absente n'est jamais remplacée par une
 * destination voisine : « ne jamais combler une absence documentaire par une
 * hypothèse ». Elle est tracée dans `_gaps` et attend que la page existe.
 */
export function ctaHref(destination: string, locale: string): string | null {
  if (!destination) return null;
  if (destination.startsWith('/api/')) return destination;
  if (destination.startsWith('#')) return destination;
  // Page publique non localisée : la destination EST son adresse, sans préfixe.
  if (PUBLISHED_PUBLIC_PATHS.has(destination)) return destination;
  return pillarHrefBySlug(destination.replace(/^\/+/, ''), locale);
}
