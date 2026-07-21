/**
 * =====================================================================
 * Opus X — Modèle commun des ARCHÉTYPES ÉDITORIAUX
 * =====================================================================
 * Un archétype n'est PAS une fiche concept : il n'a pas de Record source et ne se
 * projette d'aucun OCR. Sa prose est livrée VERBATIM par l'architecte et vit dans
 * `lib/content/<archétype>.ts` — source unique, aucun mot reformulé, raccourci ni
 * ajouté. La présentation vit dans <ArchetypePage>.
 *
 * RÈGLE DE LIEN (gravée) : « Ne jamais combler une absence documentaire par une
 * hypothèse. » Toute destination citée passe par `ctaHref` ; si la page n'existe
 * pas, le CTA reste un LIBELLÉ INERTE et l'absence est tracée dans `_gaps`. Aucune
 * substitution : `/graph` n'emprunte jamais l'adresse de `/knowledge-graph`. Le jour
 * où la page entre dans PILLARS, le lien s'active de lui-même.
 * =====================================================================
 */
import { ctaHref } from '@/lib/seo/pillars';
import { CTA_ENABLED } from '@/lib/seo/flags';

/** Bloc de contenu d'un archétype. Du TEXTE seulement — le composant l'échappe. */
export type ArchetypeBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'h3'; text: string };

export interface ArchetypeCta {
  label: string;
  /** Destination CITÉE par le texte de l'architecte — conservée telle quelle. */
  destination: string;
  /** Destination RÉSOLUE : `null` = la page n'existe pas → libellé inerte. */
  href: string | null;
  /** Flag global unique (lib/seo/flags). Un CTA n'est actif que si `href` existe AUSSI. */
  enabled: boolean;
}

export interface ArchetypeSection {
  title: string;
  blocks: ArchetypeBlock[];
  /** CTA intercalé en fin de section (Developers §9 et §10). */
  cta?: ArchetypeCta;
}

export interface ArchetypeQa {
  q: string;
  a: ArchetypeBlock[];
}
export interface ArchetypeQaSection {
  title: string;
  qa: ArchetypeQa[];
}

export interface ArchetypeContent {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  hero: {
    h1: string;
    subtitle: string;
    blocks: ArchetypeBlock[];
    ctas: ArchetypeCta[];
  };
  /** Sections de prose, dans l'ordre du document. */
  sections: ArchetypeSection[];
  /** Sections de questions/réponses (page Cross-cutting Questions). Vide ailleurs. */
  qaSections: ArchetypeQaSection[];
  /** Conclusion — absente sur certains archétypes (tableau vide → section omise). */
  conclusion: ArchetypeBlock[];
  finalCta: { title: string; text: string; ctas: ArchetypeCta[] };
  signature: {
    documentVersion: string;
    editorialStatus: string;
    publisher: string;
    language: string;
  };
  /**
   * Destinations citées SANS page existante (une absence est une information).
   * TRAÇABILITÉ DE BUILD UNIQUEMENT — jamais rendue dans le HTML ni le JSON-LD.
   */
  _gaps: string[];
}

/**
 * Résout un CTA. La destination citée est conservée pour la traçabilité ; seul le
 * `href` dépend de l'existence réelle de la page. Une destination non résolue est
 * poussée dans `gaps` — jamais remplacée.
 */
export function resolveCta(
  label: string,
  destination: string,
  locale: string,
  gaps: string[]
): ArchetypeCta {
  const href = ctaHref(destination, locale);
  if (!href) gaps.push(`cta:${destination}`);
  return { label, destination, href, enabled: CTA_ENABLED };
}

/** Journal de build des destinations absentes (une ligne par archétype). */
export function logGaps(slug: string, gaps: string[]): void {
  const unique = [...new Set(gaps)];
  // eslint-disable-next-line no-console
  console.log(`[geo:gaps] ${slug} (archetype): ${unique.length ? unique.join(', ') : 'none'}`);
}

/** Raccourcis de construction — la prose reste lisible dans les modules de contenu. */
export const p = (text: string): ArchetypeBlock => ({ kind: 'p', text });
export const ul = (...items: string[]): ArchetypeBlock => ({ kind: 'ul', items });
export const h3 = (text: string): ArchetypeBlock => ({ kind: 'h3', text });
