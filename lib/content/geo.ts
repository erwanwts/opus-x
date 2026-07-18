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
 * =====================================================================
 */
import { loadRecord } from '@/lib/registry/source';
import { graphNeighborhood } from '@/lib/registry/api';
import { entityHref } from '@/lib/seo/pillars';

export interface FaqItem {
  q: string;
  a: string;
}
export interface EntityLink {
  id: string;
  label: string;
  href: string | null; // page pilier si publiée dans la locale, sinon null (texte brut)
}
export interface GeoPageContent {
  slug: string;
  recordId: string;
  title: string; // H1
  directAnswer: string; // 40-80 mots
  definition: string; // définition canonique
  whyExists: string; // pourquoi cela existe
  howItWorks: string; // comment cela fonctionne
  actors: string; // acteurs
  lifecycle: string[]; // cycle de vie (étapes)
  examples: string[]; // exemple
  nonExamples: string[]; // non-exemple
  distinctions: string; // distinctions
  keyFacts: string[]; // key facts (bloc LLM)
  faq: FaqItem[];
  sources: string[]; // sources normatives
  meta: { version: string; author: string; date: string; status: string };
  entityLinks: EntityLink[]; // liens entités (depuis le graphe)
  cta: { label: string; href: string }; // éditorial/UI (paramètre)
}

// ─── Utilitaires de parsing (verbatim — on retire SEULEMENT les marqueurs de
//     mise en forme markdown inline, jamais un mot). ───────────────────────────
/** Retire `**gras**`, `*italique*`, `__gras__`, `` `code` `` — garde le texte intact. */
const plain = (s: string) =>
  s
    .replace(/\*\*(.+?)\*\*/g, '$1') // gras ** d'abord
    .replace(/\*([^*\n]+)\*/g, '$1') // italique * ensuite (plus de ** restant)
    .replace(/__(.+?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
const stripQuote = (s: string) => plain(s.replace(/^>\s?/gm, '').trim());
function bullets(section?: string): string[] {
  if (!section) return [];
  return section.split(/\r?\n/).map((l) => l.match(/^\s*[-*]\s+(.*)$/)?.[1]?.trim()).filter((x): x is string => !!x).map(plain);
}
function numbered(section?: string): string[] {
  if (!section) return [];
  return section.split(/\r?\n/).map((l) => l.match(/^\s*\d+\.\s+(.*)$/)?.[1]?.trim()).filter((x): x is string => !!x).map(plain);
}
function faqPairs(section?: string): FaqItem[] {
  if (!section) return [];
  const out: FaqItem[] = [];
  for (const l of section.split(/\r?\n/)) {
    const m = l.match(/^\s*\d+\.\s*\*\*(.+?)\*\*\s*(.*)$/);
    if (m) out.push({ q: plain(m[1].trim()), a: plain(m[2].trim()) });
  }
  return out;
}

/**
 * Construit le contenu d'une page pilier à partir de son Record. `cta` est le
 * seul apport éditorial (choix UI) ; tout le reste est projeté du Record.
 */
export function buildGeoContent(slug: string, recordId: string, cta: { label: string; href: string }, locale: string): GeoPageContent | null {
  const doc = loadRecord(recordId);
  if (!doc) return null;
  const S = doc.sections;

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

  return {
    slug,
    recordId,
    title: doc.metadata['Canonical Name'] || doc.title.replace(/^OCR-\d+\s*[—–-]\s*/, ''),
    directAnswer: stripQuote(S['GEO Summary'] || ''),
    definition: stripQuote(S['Canonical Definition'] || ''),
    whyExists: plain((S['Motivation'] || '').trim()),
    howItWorks: plain((S['Conceptual Model'] || '').trim()),
    actors: plain((S['Relationships'] || S['Governance'] || '').trim()),
    lifecycle: numbered(S['Lifecycle']),
    examples: bullets(S['Examples']),
    nonExamples: bullets(S['Counter Examples']),
    distinctions: plain((S['Common Misunderstandings'] || '').trim()),
    keyFacts: bullets(S['Design Goals']),
    faq: faqPairs(S['FAQ']),
    sources: (S['Cross References'] || '').split(/\s*·\s*/).map((s) => s.trim()).filter(Boolean),
    meta: {
      version: doc.metadata['Version'] || '',
      author: doc.metadata['Owner'] || '',
      date: doc.metadata['Last Update'] || '',
      status: doc.metadata['Status'] || '',
    },
    entityLinks,
    cta,
  };
}
