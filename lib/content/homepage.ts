/**
 * =====================================================================
 * Opus X — Contenu de la Homepage (archétype institutionnel, PAS une fiche concept)
 * =====================================================================
 * La prose éditoriale (verbatim architecte) vit désormais dans
 * `content/i18n/{locale}.json` (source par locale) — lue via `i18nContent`. Ce
 * module n'assemble plus que la STRUCTURE : résolution des liens (Reading Paths,
 * Resources) par `pillarHrefBySlug`, libellés Resources = titres canoniques.
 *
 * Les liens deviennent actifs DÈS l'entrée d'une page dans PILLARS (même mécanisme
 * que les pastilles d'entités) ; une page absente reste du TEXTE BRUT (jamais de
 * lien mort) et est tracée dans `_gaps`. Les noms de liens des Reading Paths sont
 * des TERMES CANONIQUES (anglais) : ils sont retrouvés dans le texte traduit car
 * le lexique est verrouillé.
 * =====================================================================
 */
import { loadRecord } from '@/lib/registry/source';
import { PILLARS, pillarHrefBySlug, ctaHref } from '@/lib/seo/pillars';
import { i18nContent } from '@/lib/content/i18n';

export interface ReadingPathLink {
  name: string;
  href: string | null; // null → texte brut (page non publiée dans PILLARS)
}
export interface ReadingPath {
  audience: string;
  text: string;
  links: ReadingPathLink[]; // dans l'ordre d'apparition dans `text`
}
export interface ResourceLink {
  title: string;
  href: string | null;
}
export interface HomepageContent {
  hero: {
    h1: string;
    valueProp: string;
    /** `href` RÉSOLU : null = la page n'existe pas → libellé inerte (RD-001). */
    ctaPrimary: { label: string; href: string | null };
    ctaSecondary: { label: string; href: string | null };
  };
  /** Titres de sections (localisés) rendus par <HomePage>. */
  headings: { whyExists: string; foundations: string; ecosystem: string; readingPaths: string; resources: string };
  whyExists: string[];
  foundationsIntro: string;
  foundations: { name: string; body: string[] }[];
  ecosystem: string[];
  readingPaths: ReadingPath[];
  resourcesIntro: string;
  resources: ResourceLink[];
  finalCta: { label: string; href: string | null };
  signature: { contentVersion: string; editorialStatus: string; publisher: string; language: string };
  _gaps: string[];
}

// Mapping nom de page (Reading Paths) → slug. Les noms sont des TERMES CANONIQUES,
// identiques dans toutes les locales ; on ne déduit rien, on lie les pages nommées.
const NAME_TO_SLUG: Record<string, string> = {
  'Professional Passport': 'professional-passport',
  Evidence: 'evidence',
  Trust: 'trust',
  'World Skills Protocol': 'world-skills-protocol',
  Verification: 'verification',
  Registry: 'registry',
  'API & Developers': 'developers', // route /{locale}/developers ; non résolu tant qu'absent de PILLARS pour la locale
};

/** Étiquette de langue du signataire, par locale. */
const SIGNATURE_LANGUAGE: Record<string, string> = { en: 'English', fr: 'Français', es: 'Español' };

/** Titre canonique d'un pilier (= Canonical Name du Record), pour les libellés de navigation. */
function pillarTitle(recordId: string | null): string {
  if (!recordId) return '';
  const doc = loadRecord(recordId);
  return doc?.metadata['Canonical Name'] || recordId;
}

/**
 * Résout la Homepage pour une locale : prose lue de `content/i18n/{locale}.json`,
 * liens des Reading Paths et Resources via `pillarHrefBySlug`. Toute page nommée
 * mais non résolue (absente de PILLARS pour la locale) est tracée dans `_gaps` —
 * jamais un lien mort.
 */
export function buildHomepage(locale: string): HomepageContent {
  const gaps: string[] = [];
  const t = i18nContent(locale).home;

  /** Résout une destination de CTA et trace l'absence — jamais de substitution. */
  const cta = (destination: string): string | null => {
    const href = ctaHref(destination, locale);
    if (!href) gaps.push(`cta:${destination}`);
    return href;
  };

  const readingPaths: ReadingPath[] = t.readingPaths.map((p) => ({
    audience: p.audience,
    text: p.text,
    links: p.pages.map((name) => {
      const slug = NAME_TO_SLUG[name];
      const href = slug ? pillarHrefBySlug(slug, locale) : null;
      if (!href) gaps.push(`reading-path:${name}`);
      return { name, href };
    }),
  }));

  // « Explore the Resources » : fiches concept, libellé = Canonical Name (corpus, anglais).
  const resources: ResourceLink[] = PILLARS.filter((p) => p.recordId).map((p) => ({
    title: pillarTitle(p.recordId),
    href: pillarHrefBySlug(p.slug, locale),
  }));

  // eslint-disable-next-line no-console
  console.log(`[geo:gaps] homepage (${locale}): ${gaps.length ? gaps.join(', ') : 'none'}`);

  return {
    hero: {
      h1: t.hero.h1,
      valueProp: t.hero.valueProp,
      ctaPrimary: { label: t.hero.ctaPrimaryLabel, href: cta('/professional-passport') },
      ctaSecondary: { label: t.hero.ctaSecondaryLabel, href: cta('#platform') },
    },
    headings: t.headings,
    whyExists: t.whyExists,
    foundationsIntro: t.foundationsIntro,
    foundations: t.foundations,
    ecosystem: t.ecosystem,
    readingPaths,
    resourcesIntro: t.resourcesIntro,
    resources,
    finalCta: { label: t.finalCtaLabel, href: cta('/world-skills-protocol') },
    signature: { contentVersion: '1.0.0', editorialStatus: 'Draft', publisher: 'Opus X', language: SIGNATURE_LANGUAGE[locale] ?? 'English' },
    _gaps: gaps,
  };
}
