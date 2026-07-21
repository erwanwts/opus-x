/**
 * =====================================================================
 * Opus X — FRONTIÈRE EN-TÊTE / CORPS d'un Record (LOT GEO 2 · Lot C)
 * =====================================================================
 * Où s'arrête l'en-tête documentaire, où commence le corps canonique.
 *
 * ⚠️ CE POINT N'EST PAS TRANCHÉ. La frontière est donc **paramétrable** : la
 * fabrique ne fige pas ce qu'elle affiche. Le jour où l'arbitrage tombe, une
 * constante change et rien d'autre.
 *
 * MESURE (docs/registry/MESURES-frontiere-promotion-terminologie.md) :
 *   • H1 en ligne 0 — 33/33 ; tableau de métadonnées ensuite — 33/33 ;
 *   • la première règle `---` existe dans **33/33** : le délimiteur est CONSTANT,
 *     il n'y avait rien à définir, seulement à constater ;
 *   • **17 Records sur 33** portent, ENTRE le tableau et cette règle, un bloc
 *     « Grounding note (removed at publication) » qui DIT LUI-MÊME ne pas devoir
 *     être publié. Le mode `first-hr` l'exclut naturellement du corps ; le mode
 *     `after-table` le publierait — 17 pages afficheraient un texte demandant sa
 *     propre suppression ;
 *   • une seule ambiguïté : **OCR-006**, seul Record portant du texte éditorial
 *     ENTRE le H1 et le tableau. En `first-hr` cette ligne tombe dans l'en-tête.
 *
 * RD-008 — « Le code sert à révéler les conséquences d'une implémentation ; la
 * gouvernance décide ensuite si cette implémentation exprime correctement les
 * principes. » Ce module révèle les deux conséquences ; il n'en choisit aucune.
 * =====================================================================
 */

/**
 * Mode de frontière.
 *   • `first-hr`    — le corps commence APRÈS la première règle `---`.
 *                     Exclut le tableau de métadonnées ET les 17 grounding notes.
 *   • `after-table` — le corps commence après la DERNIÈRE ligne du tableau.
 *                     Exclut le tableau seul ; publie les 17 grounding notes.
 */
export type BoundaryMode = 'first-hr' | 'after-table';

/**
 * Mode appliqué tant que l'arbitrage n'est pas rendu. `first-hr` est retenu par
 * défaut pour une raison mesurée, pas par préférence : c'est le seul des deux qui
 * n'affiche pas les 17 blocs marqués « removed at publication ».
 */
export const DEFAULT_BOUNDARY: BoundaryMode = 'first-hr';

export interface RecordSplit {
  /** Le H1 brut, ligne 0 (`# OCR-nnn — Label`). */
  h1: string;
  /** Lignes de l'en-tête documentaire, frontière exclue. */
  header: string[];
  /** Corps canonique — ce que la projection publie. */
  body: string;
  /** Lignes situées entre le H1 et le tableau (OCR-006 seul en porte). */
  preTable: string[];
  /** Bloc « Grounding note (removed at publication) » présent dans l'en-tête. */
  hasGroundingNote: boolean;
}

const RE_HR = /^---+\s*$/;
const GROUNDING = 'Grounding note (removed at publication)';

/**
 * Découpe un Record. Ne modifie aucun caractère : `body` est une tranche exacte
 * du fichier, et la concaténation `h1 + header + body` reste sans perte.
 */
export function splitRecord(raw: string, mode: BoundaryMode = DEFAULT_BOUNDARY): RecordSplit {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const h1 = lines[0] ?? '';

  const tableLines = lines.map((l, i) => (l.startsWith('|') ? i : -1)).filter((i) => i >= 0);
  const lastTable = tableLines.length ? Math.max(...tableLines) : 0;
  const firstTable = tableLines.length ? Math.min(...tableLines) : 1;
  const firstHr = lines.findIndex((l) => RE_HR.test(l));

  // Frontière : indice de la PREMIÈRE ligne du corps.
  const start =
    mode === 'first-hr'
      ? firstHr >= 0
        ? firstHr + 1
        : lastTable + 1 // aucun `---` : repli mesuré comme inatteignable (33/33 en ont une)
      : lastTable + 1;

  const header = lines.slice(1, start);
  return {
    h1,
    header,
    body: lines.slice(start).join('\n'),
    preTable: lines.slice(1, firstTable).filter((l) => l.trim()),
    hasGroundingNote: header.some((l) => l.includes(GROUNDING)),
  };
}

/** Les champs du tableau d'en-tête, tels quels. Aucune valeur n'est interprétée. */
export function headerFields(split: RecordSplit): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of split.header) {
    const m = /^\|\s*\*\*(.+?)\*\*\s*\|\s*(.*?)\s*\|$/.exec(l);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}
