/**
 * =====================================================================
 * Opus X — FRONTIÈRE EN-TÊTE / CORPS d'un Record (LOT GEO 2 · Lot C)
 * =====================================================================
 * Où s'arrête l'en-tête documentaire, où commence le corps canonique.
 *
 * ✅ TRANCHÉ — ARCHITECTURE V3, décision 1 : la frontière du contenu canonique est
 * le PREMIER SÉPARATEUR HORIZONTAL. Ce n'est plus un défaut provisoire, c'est le
 * mode RETENU. Justification mesurée, non préférentielle (voir plus bas).
 *
 * Le paramètre SUBSISTE, et `after-table` reste dans le code comme TÉMOIN de
 * l'alternative mesurée : c'est ce qui permet au test d'exercer les deux modes et
 * de prouver, à chaque exécution, que le mode retenu est le seul des deux à
 * n'exposer aucun bloc « removed at publication ». Un témoin supprimé rendrait la
 * justification invérifiable.
 *
 * Conséquence portée par V3 : l'empreinte porte sur le corps seul — une promotion
 * ne la modifie donc plus.
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
 *   • `first-hr`    — **RETENU** (V3, décision 1). Le corps commence APRÈS la
 *                     première règle `---`. Exclut le tableau de métadonnées ET
 *                     les 17 grounding notes.
 *   • `after-table` — **TÉMOIN**, conservé pour que l'alternative reste mesurable.
 *                     Le corps commence après la DERNIÈRE ligne du tableau ;
 *                     publierait les 17 grounding notes. N'est utilisé par aucune
 *                     page : il n'existe que pour le test comparatif.
 */
export type BoundaryMode = 'first-hr' | 'after-table';

/**
 * Mode RETENU (Architecture V3, décision 1). Ce n'est pas un défaut d'attente :
 * c'est la frontière du contenu canonique, arrêtée sur mesure.
 *
 * Pourquoi lui : il est le seul des deux candidats à n'exposer aucun des 17 blocs
 * portant la mention « removed at publication » — un texte qui demande sa propre
 * suppression n'a pas à figurer sur 17 pages publiques. Le délimiteur est en outre
 * présent et constant sur les 33 Records : il n'y avait rien à définir, seulement
 * à constater.
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
