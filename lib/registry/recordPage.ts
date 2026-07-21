/**
 * =====================================================================
 * Opus X — Fabrique de page Record (LOT GEO 2 · Lot C)
 * =====================================================================
 * Une page de Registry est une PROJECTION DOCUMENTAIRE dérivée du Canonical
 * Corpus. Elle ne constitue jamais une publication normative indépendante ni une
 * représentation faisant autorité — régénérable, supprimable, périssable, jamais
 * source de vérité. Traitée exactement comme le Knowledge Graph.
 *
 * RD-009 — « Une projection peut organiser, relier, présenter et agréger des
 * informations ; elle ne peut jamais établir un fait, prendre une décision de
 * gouvernance ou produire une nouvelle norme. » Ce module agrège et présente ;
 * il n'établit rien.
 *
 * RÈGLE DE DÉRIVATION (gravée) — « Toute métadonnée publiée par une projection est
 * dérivée exclusivement du Canonical Corpus selon une chaîne de dérivation
 * déterministe. Lorsqu'une valeur ne peut être dérivée sans hypothèse, elle n'est
 * pas produite et la lacune est tracée. »
 * Il n'y a donc PAS de troisième niveau de repli : à défaut, la valeur est `null`
 * et part dans `_gaps`. Aucune description n'est fabriquée.
 * =====================================================================
 */
import { splitRecord, headerFields, type BoundaryMode, DEFAULT_BOUNDARY } from './recordBoundary';
import { parseRecordBody, type MdBlock } from './markdown';

const BASE = 'https://opusx.world';
/** Racine des projections. `/records` — 4 CTA gravés y pointent déjà. */
export const RECORDS_ROOT = '/records';

export interface RecordPageMeta {
  title: string;
  /** `null` = non dérivable sans hypothèse → tracé dans `_gaps`, jamais fabriqué. */
  description: string | null;
  /** `true` quand la description vient du gabarit et non du corpus (étiquetage). */
  descriptionIsDerived: boolean;
  canonical: string;
  /** DÉRIVÉ du statut documentaire, jamais codé en dur (RD-007). */
  robots: 'noindex,follow' | 'index,follow';
  /** Type Schema.org gravé pour les projections de Record. */
  jsonLdType: 'Article';
}

export interface RecordPageContent {
  id: string;
  /** Libellé du H1, après le tiret cadratin. Présent 33/33. */
  label: string;
  /** Statut documentaire — affiché AVANT le titre (décision gravée). */
  status: string;
  version: string;
  /** Champs du tableau d'en-tête, tels quels. Aucune valeur interprétée. */
  fields: Record<string, string>;
  /** Corps canonique projeté. */
  blocks: MdBlock[];
  /** L'en-tête contenait un bloc « removed at publication » — jamais publié. */
  hadGroundingNote: boolean;
  boundary: BoundaryMode;
  meta: RecordPageMeta;
  _gaps: string[];
}

const RE_H1 = /^#\s+(OCR-\d+)\s+—\s+(.+)$/;
const DESC_MAX = 160;

/** Libellé du H1 — source de nom UNIVERSELLE (33/33), là où `Canonical Name` ne couvre que 26. */
export function labelFromH1(h1: string): { id: string; label: string } | null {
  const m = RE_H1.exec(h1.trim());
  return m ? { id: m[1], label: m[2].trim() } : null;
}

/**
 * Première phrase d'un texte, sans dépasser `max` caractères et JAMAIS coupée au
 * milieu d'un mot. Renvoie `null` si aucune phrase complète n'entre dans la limite.
 */
export function firstSentence(text: string, max = DESC_MAX): string | null {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (!flat) return null;
  const end = flat.search(/[.!?](\s|$)/);
  const sentence = end >= 0 ? flat.slice(0, end + 1) : flat;
  if (sentence.length <= max) return sentence;
  const cut = sentence.lastIndexOf(' ', max);
  return cut > 0 ? sentence.slice(0, cut).trimEnd() + '…' : null;
}

/** Texte brut d'une section du corps (pour la description). */
function sectionText(blocks: MdBlock[], title: string): string {
  const i = blocks.findIndex((b) => b.kind === 'heading' && b.spans.map((s) => s.text).join('').trim() === title);
  if (i < 0) return '';
  const out: string[] = [];
  for (let j = i + 1; j < blocks.length; j++) {
    const b = blocks[j];
    if (b.kind === 'heading') break;
    if (b.kind === 'p' || b.kind === 'quote') out.push(b.spans.map((s) => s.text).join(''));
  }
  return out.join(' ');
}

/**
 * Cascade de dérivation de la description — DEUX niveaux, pas trois.
 *   1. première phrase de `## GEO Summary` (32/33 des Records en ont une) ;
 *   2. à défaut, gabarit de champs MESURÉS, étiqueté « Derived metadata ».
 * Sinon `null` : la lacune est tracée, rien n'est fabriqué.
 *
 * L'étiquette est « Derived metadata », JAMAIS « Canonical summary » : un champ
 * dérivé doit rester identifiable comme projection (RD-009).
 */
export function deriveDescription(
  blocks: MdBlock[],
  fields: Record<string, string>,
): { value: string | null; derived: boolean } {
  const geo = firstSentence(sectionText(blocks, 'GEO Summary'));
  if (geo) return { value: geo, derived: false };

  const kindOrLayer = fields['Kind'] || fields['Layer'];
  const version = fields['Version'];
  const status = fields['Status'];
  if (kindOrLayer && version && status) {
    return {
      value: `Derived metadata — ${kindOrLayer} · Version ${version} · Status ${status} · Canonical Registry of the World Skills Protocol.`,
      derived: true,
    };
  }
  return { value: null, derived: false };
}

/** `robots` DÉRIVÉ du statut : la promotion rend la page indexable sans intervention. */
export function robotsFromStatus(status: string): RecordPageMeta['robots'] {
  return status.trim().toLowerCase() === 'draft' ? 'noindex,follow' : 'index,follow';
}

/** Projette un Record en contenu de page. Ne modifie ni n'interprète aucune valeur. */
export function buildRecordPage(
  raw: string,
  boundary: BoundaryMode = DEFAULT_BOUNDARY,
): RecordPageContent | null {
  const split = splitRecord(raw, boundary);
  const head = labelFromH1(split.h1);
  if (!head) return null;

  const fields = headerFields(split);
  const blocks = parseRecordBody(split.body);
  const gaps: string[] = [];

  const status = fields['Status'] ?? '';
  const version = fields['Version'] ?? '';
  if (!status) gaps.push('Status');
  if (!version) gaps.push('Version');

  const { value: description, derived } = deriveDescription(blocks, fields);
  if (!description) gaps.push('description');

  return {
    id: head.id,
    label: head.label,
    status,
    version,
    fields,
    blocks,
    hadGroundingNote: split.hasGroundingNote,
    boundary,
    meta: {
      title: `${head.id} — ${head.label} | Canonical Registry`,
      description,
      descriptionIsDerived: derived,
      canonical: `${BASE}${RECORDS_ROOT}/${head.id.toLowerCase()}`,
      robots: robotsFromStatus(status),
      jsonLdType: 'Article',
    },
    _gaps: gaps,
  };
}
