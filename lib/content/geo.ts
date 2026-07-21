/**
 * =====================================================================
 * Opus X — Contenu d'une page GEO, dérivé d'un Record canonique
 * =====================================================================
 * Projette les sections d'un Record (loadRecord) en données structurées pour
 * <GeoPage>. AUCUN fait fabriqué : chaque champ vient VERBATIM d'une section
 * d'OCR-1xx (parsing seulement). Les slots éditoriaux/UI (CTA) sont fournis en
 * paramètre — jamais inventés dans les données du Record.
 *
 * Cartographie section canonique → section OCR (WEB-001B §11 complété) :
 *   Réponse directe = GEO Summary · Définition = Canonical Definition ·
 *   Pourquoi = Motivation · Comment = Conceptual Model · Acteurs = Relationships
 *   (décision architecte : prose du Record) · Cycle de vie = Lifecycle ·
 *   Exemple = Examples · Non-exemple = Counter Examples · Distinctions = Common
 *   Misunderstandings · Key Facts = Design Goals · FAQ = FAQ · Sources = Cross
 *   References · Date/Auteur/Version = en-tête · Liens entités = graphe.
 *
 * CONTRAT DE TEXTE (durci — Lot GEO 1b) :
 *   • l'emphase italique du Record (`*mot*`) est PROJETÉE en segment `{ em:true }`
 *     — jamais supprimée, jamais ajoutée (seule la source décide) ;
 *   • le gras (`**` / `__`) et les backticks restent réduits au texte nu ;
 *   • le rendu ne manipule que du TEXTE (le composant l'échappe) — 0 HTML injecté.
 * =====================================================================
 */
import { loadRecord } from '@/lib/registry/source';
import { graphNeighborhood } from '@/lib/registry/api';
import { entityHref, ctaHref } from '@/lib/seo/pillars';
import { CTA_ENABLED } from '@/lib/seo/flags';

// ─── Modèle de texte riche ─────────────────────────────────────────────────
/** Segment inline : du texte, éventuellement en emphase (italique présente dans le Record). */
export interface Span {
  text: string;
  em?: boolean;
}
/** Bloc de prose : paragraphe, ou énumération (lead-in + items) issue de la règle éditoriale. */
export type Block =
  | { kind: 'p'; spans: Span[] }
  | { kind: 'ul'; lead: Span[]; items: Span[][] };

export interface FaqItem {
  q: Span[];
  a: Span[];
}
export interface EntityLink {
  id: string;
  label: string;
  href: string | null; // page pilier si publiée dans la locale, sinon null (texte brut)
}
export interface GeoPageContent {
  slug: string;
  recordId: string;
  title: string; // H1 (plain — sert aussi au <title>, au breadcrumb, aux métadonnées)
  directAnswer: Span[]; // 40-80 mots
  definition: Span[]; // définition canonique
  whyExists: Block[]; // pourquoi cela existe
  howItWorks: Block[]; // comment cela fonctionne
  actors: Block[]; // acteurs
  lifecycle: Span[][]; // cycle de vie (étapes)
  examples: Span[][]; // exemple
  nonExamples: Span[][]; // non-exemple
  distinctions: Block[]; // distinctions
  keyFacts: Span[][]; // key facts (bloc LLM)
  faq: FaqItem[];
  sources: string[]; // sources normatives (références — plain)
  meta: { version: string; author: string; date: string; status: string };
  entityLinks: EntityLink[]; // liens entités (depuis le graphe)
  /** CTA éditorial/UI. `href` RÉSOLU : null = destination inexistante → libellé inerte. */
  cta: { label: string; href: string | null; enabled: boolean };
  /**
   * Sections canoniques SANS source dans le Record (une absence est une information).
   * INSTRUMENT DE TRAÇABILITÉ INTERNE UNIQUEMENT : consommé par le journal de build,
   * JAMAIS rendu dans le HTML ni dans le JSON-LD. Une section absente n'émet aucun
   * titre orphelin (le composant omet la section entière).
   */
  _gaps: string[];
}

// ─── Projection de l'emphase inline ─────────────────────────────────────────
/**
 * Projette l'emphase inline d'un fragment de Record en segments.
 *   • `**gras**`, `__gras__`, `` `code` `` → texte nu (traitement inchangé) ;
 *   • `*italique*` → segment `{ em:true }` (l'emphase de la SOURCE est projetée) ;
 *   • aucune emphase n'est introduite : seule celle présente dans le Record est rendue.
 * Renvoie des segments de TEXTE — le composant les échappe (jamais de HTML du Record).
 */
export function inline(src: string): Span[] {
  const pre = src
    .replace(/\*\*(.+?)\*\*/g, '$1') // gras d'abord (protège l'italique `*`)
    .replace(/__(.+?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
  const spans: Span[] = [];
  const re = /\*([^*\n]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(pre)) !== null) {
    if (m.index > last) spans.push({ text: pre.slice(last, m.index) });
    spans.push({ text: m[1], em: true });
    last = m.index + m[0].length;
  }
  if (last < pre.length) spans.push({ text: pre.slice(last) });
  return spans.length ? spans : [{ text: pre }];
}

/** Aplati des segments en texte nu (métadonnées : description/OG — jamais de balise). */
export function spansToText(spans: Span[]): string {
  return spans.map((s) => s.text).join('');
}
/** Réduit un fragment à du texte nu (H1/titre/sources) : projette puis aplati. */
const plainText = (s: string): string => spansToText(inline(s));

// ─── Règle éditoriale déterministe : énumération « composed of » ─────────────
/**
 * Sépare la liste et une éventuelle phrase suivante, MOT POUR MOT. Le délimiteur
 * est `;` s'il est présent (liste à ponctuation forte), sinon `,`. Le point de
 * clôture de l'énumération est retiré ; toute phrase qui le suit est renvoyée telle
 * quelle (elle redeviendra un paragraphe). Aucun mot n'est modifié ni réordonné.
 */
function enumerate(rest: string): { items: string[]; trailing: string } {
  const delim = rest.includes(';') ? ';' : ',';
  const items = rest.split(delim).map((x) => x.trim()).filter(Boolean);
  let trailing = '';
  if (items.length) {
    const lastRaw = items[items.length - 1];
    const sIdx = lastRaw.search(/\.\s+\S/); // « … item. Phrase suivante »
    if (sIdx >= 0) {
      items[items.length - 1] = lastRaw.slice(0, sIdx).trim();
      trailing = lastRaw.slice(sIdx + 1).trim();
    } else {
      items[items.length - 1] = lastRaw.replace(/\.$/, '').trim(); // point de clôture
    }
  }
  return { items, trailing };
}

// Journalisation des déclenchements composed-of (traçabilité build). Dédupliqué par
// (page · section · nb items) pour une ligne par déclenchement réel, malgré les
// double-appels de buildGeoContent (generateMetadata + rendu).
const _composedOfLogged = new Set<string>();
function logComposedOf(ctx: ProseCtx, count: number): void {
  const key = `${ctx.slug}|${ctx.section}|${count}`;
  if (_composedOfLogged.has(key)) return;
  _composedOfLogged.add(key);
  // eslint-disable-next-line no-console
  console.log(`[geo:composed-of] ${ctx.slug} · ${ctx.section} · ${count} items`);
}

interface ProseCtx {
  slug: string;
  section: string;
}

/**
 * Un paragraphe → un ou plusieurs blocs. RÈGLE (Lot GEO 1b, cas « énumération
 * composed-of ») appliquée par le composant, identique aux 12 pages, SANS modifier
 * un mot, une affirmation, un ordre logique ni une portée normative :
 *   « … is [not] composed of: a; b; c. [Phrase.] » → lead-in + liste [+ paragraphe].
 *
 * GARDE (durcissement architecte) : ne se déclenche QUE si le dernier item commence
 * par « and » ou « or » (marqueur de clôture d'énumération). Sinon → `<p>` (jamais
 * d'erreur), pour ne pas découper une phrase à virgules portant une incise.
 * Chaque déclenchement est journalisé au build.
 */
function paragraphToBlocks(p: string, ctx: ProseCtx): Block[] {
  const m = p.match(/^(.*?\bcomposed of):\s*(.+)$/is);
  if (m) {
    const lead = `${m[1].trim()}:`; // conserve « … composed of: »
    const { items, trailing } = enumerate(m[2].trim());
    const last = items[items.length - 1] ?? '';
    if (items.length >= 2 && /^(and|or)\s/i.test(last)) {
      logComposedOf(ctx, items.length);
      const blocks: Block[] = [{ kind: 'ul', lead: inline(lead), items: items.map(inline) }];
      if (trailing) blocks.push({ kind: 'p', spans: inline(trailing) });
      return blocks;
    }
  }
  return [{ kind: 'p', spans: inline(p) }];
}

/** Prose d'une section → blocs. Paragraphes séparés par une ligne vide ; espaces normalisés. */
function prose(section: string | undefined, ctx: ProseCtx): Block[] {
  if (!section) return [];
  return section
    .trim()
    .split(/\n\s*\n/)
    .map((para) => para.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .flatMap((para) => paragraphToBlocks(para, ctx));
}

/**
 * Key Facts = projection SANS PERTE de Design Goals (prose) en faits (phrases).
 * Règle DÉTERMINISTE (arbitrage architecte) : segmentation aux frontières de phrase
 * (`.!?` + espace + majuscule/guillemet/parenthèse ; garde décimales et points
 * internes). AUCUNE sélection, AUCUNE reformulation : toute la prose est projetée, dans
 * l'ordre. Le split à groupe capturant conserve les délimiteurs (lossless par construction).
 * ASSERTION : si la concaténation des faits diffère de la source, on JETTE — le build
 * casse plutôt que rendre un fait tronqué (jamais de projection avec perte).
 */
export function keyFactsFromProse(section?: string): Span[][] {
  if (!section) return [];
  const src = section.trim();
  if (!src) return [];
  const parts = src.split(/([.!?]+["')\]]?\s+)(?=[A-Z"(\[])/);
  const facts: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const seg = parts[i] + (parts[i + 1] ?? '');
    if (seg.trim()) facts.push(seg);
  }
  if (facts.join('') !== src) {
    throw new Error(
      `[geo:keyfacts] projection avec perte sur Design Goals (source ${src.length} car. != concat ${facts.join('').length} car.)`,
    );
  }
  return facts.map((f) => inline(f.trim()));
}

// ─── Parsers de listes / FAQ (emphase inline projetée) ──────────────────────
const quoted = (s: string): Span[] => inline(s.replace(/^>\s?/gm, '').trim());
function bullets(section?: string): Span[][] {
  if (!section) return [];
  return section
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*[-*]\s+(.*)$/)?.[1]?.trim())
    .filter((x): x is string => !!x)
    .map(inline);
}
function numbered(section?: string): Span[][] {
  if (!section) return [];
  return section
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*\d+\.\s+(.*)$/)?.[1]?.trim())
    .filter((x): x is string => !!x)
    .map(inline);
}
function faqPairs(section?: string): FaqItem[] {
  if (!section) return [];
  const out: FaqItem[] = [];
  for (const l of section.split(/\r?\n/)) {
    const m = l.match(/^\s*\d+\.\s*\*\*(.+?)\*\*\s*(.*)$/);
    if (m) out.push({ q: inline(m[1].trim()), a: inline(m[2].trim()) });
  }
  return out;
}

/**
 * Construit le contenu d'une page pilier à partir de son Record. `cta` est le
 * seul apport éditorial (choix UI) ; tout le reste est projeté du Record.
 */
export function buildGeoContent(
  slug: string,
  recordId: string,
  cta: { label: string; href: string }, // `enabled` NON accepté ici : dérivé du flag unique
  locale: string,
): GeoPageContent | null {
  const doc = loadRecord(recordId);
  if (!doc) return null;
  const S = doc.sections;
  const ctx = (section: string): ProseCtx => ({ slug, section });

  // Liens entités : Records reliés dans le graphe (voisinage), SAUF le Record
  // courant (pas d'auto-lien). Le href vient du résolveur UNIQUE `entityHref`.
  const nb = graphNeighborhood(recordId);
  const entityLinks: EntityLink[] = [];
  const seen = new Set<string>([recordId]); // exclut le Record courant
  for (const e of [...(nb?.edges_out ?? []), ...(nb?.edges_in ?? [])]) {
    const other = e.source === recordId ? e.target : e.source;
    if (/^OCR-\d+$/.test(other) && !seen.has(other)) {
      seen.add(other);
      entityLinks.push({ id: other, label: other, href: entityHref(other, locale) });
    }
  }

  const content: Omit<GeoPageContent, '_gaps'> = {
    slug,
    recordId,
    title: plainText(doc.metadata['Canonical Name'] || doc.title.replace(/^OCR-\d+\s*[—–-]\s*/, '')),
    directAnswer: quoted(S['GEO Summary'] || ''),
    definition: quoted(S['Canonical Definition'] || ''),
    whyExists: prose(S['Motivation'], ctx('Why It Exists')),
    howItWorks: prose(S['Conceptual Model'], ctx('How It Works')),
    actors: prose(S['Relationships'] || S['Governance'], ctx('Actors')),
    lifecycle: numbered(S['Lifecycle']),
    examples: bullets(S['Examples']),
    nonExamples: bullets(S['Counter Examples']),
    distinctions: prose(S['Common Misunderstandings'], ctx('Distinctions')),
    keyFacts: keyFactsFromProse(S['Design Goals']),
    faq: faqPairs(S['FAQ']),
    sources: (S['Cross References'] || '').split(/\s*·\s*/).map((s) => s.trim()).filter(Boolean),
    meta: {
      version: doc.metadata['Version'] || '',
      author: doc.metadata['Owner'] || '',
      date: doc.metadata['Last Update'] || '',
      status: doc.metadata['Status'] || '',
    },
    entityLinks,
    // `enabled` vient EXCLUSIVEMENT du flag unique lib/seo/flags — la page ne fournit
    // que label + destination ; elle ne peut pas rendre le CTA actif localement.
    // La DESTINATION est RÉSOLUE (ctaHref) : elle ne devient un href que si la cible
    // existe. Absente → null → libellé inerte, jamais un lien mort.
    cta: { label: cta.label, href: ctaHref(cta.href, locale), enabled: CTA_ENABLED },
  };

  // Traçabilité des sections sans source (null → omises au rendu). Section canonique →
  // champ projeté ; un champ vide = un trou. JOURNAL DE BUILD uniquement (jamais rendu).
  const SECTION_OF: Array<[keyof typeof content, string]> = [
    ['directAnswer', 'Direct Answer'], ['definition', 'Canonical Definition'],
    ['whyExists', 'Why It Exists'], ['howItWorks', 'How It Works'], ['actors', 'Actors'],
    ['lifecycle', 'Lifecycle'], ['examples', 'Examples'], ['nonExamples', 'Counter Examples'],
    ['distinctions', 'Distinctions'], ['keyFacts', 'Key Facts'], ['faq', 'FAQ'],
    ['sources', 'Normative Sources'],
  ];
  const _gaps = SECTION_OF.filter(([k]) => (content[k] as unknown[]).length === 0).map(([, title]) => title);
  // CTA éditorial : absent si son libellé n'est pas gravé (pillars.ctaLabel). Tracé.
  if (!content.cta.label) _gaps.push('CTA');
  // Destination citée mais non résolue (page absente de PILLARS) : le libellé restera
  // INERTE. Trou tracé — jamais comblé par une destination de substitution.
  else if (!content.cta.href) _gaps.push(`CTA-destination:${cta.href}`);
  // eslint-disable-next-line no-console
  console.log(`[geo:gaps] ${slug} (${recordId}): ${_gaps.length ? _gaps.join(', ') : 'none'}`);

  return { ...content, _gaps };
}
