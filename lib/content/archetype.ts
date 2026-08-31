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

// ─── Hydratation locale-aware depuis content/i18n/{locale}.json ────────────────
/** Bloc JSON : chaîne (paragraphe), { ul: [...] } (liste) ou { h3: '...' } (sous-titre). */
type JsonBlock = string | { ul: string[] } | { h3: string };
interface JsonArchetype {
  seoTitle: string;
  seoDescription: string;
  hero: { h1: string; subtitle: string; blocks: JsonBlock[]; ctaLabels: string[] };
  sections: { title: string; blocks: JsonBlock[]; ctaLabel?: string }[];
  qaSections: { title: string; qa: { q: string; a: JsonBlock[] }[] }[];
  conclusion: JsonBlock[];
  finalCta: { title: string; text: string; ctaLabels: string[] };
}
/** DESTINATIONS structurelles (identiques par locale) — le JSON ne porte que les LIBELLÉS.
 * `sectionDest` : index de section (0-based) → destination du CTA intercalé. */
export interface ArchetypeStructure {
  slug: string;
  heroDest: string[];
  sectionDest: Record<number, string>;
  finalDest: string[];
}
const SIGNATURE_LANGUAGE: Record<string, string> = { en: 'English', fr: 'Français', es: 'Español' };
const toBlock = (b: JsonBlock): ArchetypeBlock =>
  typeof b === 'string' ? p(b) : 'ul' in b ? ul(...b.ul) : h3(b.h3);

/**
 * Reconstruit un ArchetypeContent depuis la prose LOCALISÉE (content/i18n) et les
 * DESTINATIONS structurelles. Les libellés de CTA viennent du JSON ; leurs cibles,
 * fixes, sont appariées par position — chaque destination reste résolue par `ctaHref`
 * (jamais un lien mort ; absence tracée dans `_gaps`).
 */
export function hydrateArchetype(locale: string, data: JsonArchetype, struct: ArchetypeStructure): ArchetypeContent {
  const gaps: string[] = [];
  const blocks = (bs: JsonBlock[]) => bs.map(toBlock);
  const ctas = (labels: string[], dests: string[]) => labels.map((label, i) => resolveCta(label, dests[i], locale, gaps));
  const content: ArchetypeContent = {
    slug: struct.slug,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    hero: { h1: data.hero.h1, subtitle: data.hero.subtitle, blocks: blocks(data.hero.blocks), ctas: ctas(data.hero.ctaLabels, struct.heroDest) },
    sections: data.sections.map((s, i) => ({
      title: s.title,
      blocks: blocks(s.blocks),
      ...(struct.sectionDest[i] ? { cta: resolveCta(s.ctaLabel ?? '', struct.sectionDest[i], locale, gaps) } : {}),
    })),
    qaSections: data.qaSections.map((qs) => ({ title: qs.title, qa: qs.qa.map((item) => ({ q: item.q, a: blocks(item.a) })) })),
    conclusion: blocks(data.conclusion),
    finalCta: { title: data.finalCta.title, text: data.finalCta.text, ctas: ctas(data.finalCta.ctaLabels, struct.finalDest) },
    signature: { documentVersion: '1.0.0', editorialStatus: 'Draft', publisher: 'Opus X', language: SIGNATURE_LANGUAGE[locale] ?? 'English' },
    _gaps: [...new Set(gaps)],
  };
  logGaps(struct.slug, gaps);
  return content;
}
