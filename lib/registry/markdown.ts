/**
 * =====================================================================
 * Opus X — Moteur de projection du corps d'un Record (LOT GEO 2 · Lot B)
 * =====================================================================
 * Projette le markdown d'un Record en DONNÉES STRUCTURÉES. Il ne produit
 * jamais de HTML : le composant qui les rend émet des éléments React depuis du
 * TEXTE, que React échappe. Aucun `dangerouslySetInnerHTML`, nulle part.
 *
 * ZÉRO DÉPENDANCE — décision du plan GEO 1a, tenue ici. Le jeu de constructions
 * du corpus est CLOS et mesuré (11 constructions, 0 lien, 0 image, blocs de code
 * tous en `json`) : un moteur ciblé le couvre intégralement, là où une
 * bibliothèque ajouterait ~15 dépendances transitives à un dépôt qui en compte 20.
 *
 * INVARIANT DE PROJECTION — la raison d'être de ce fichier :
 *   « Le nombre de caractères significatifs du corps publié doit être identique
 *     avant et après projection, à l'exception des transformations explicitement
 *     autorisées par le moteur de rendu. »
 * Il porte sur les caractères NON BLANCS. Les 11 transformations autorisées sont
 * énumérées dans docs/web/WEB-003-LOT-GEO-2-invariant-de-projection.md et
 * vérifiées par markdown.invariant.test.ts.
 *
 * RÈGLE DE FRONTIÈRE 1 — un bloc de code est OPAQUE : aucune transformation à
 * l'intérieur. 70 des 73 pseudo-balises du corpus y vivent ; c'est cette règle
 * qui les protège.
 * RÈGLE DE FRONTIÈRE 2 — ordre de retrait : marqueurs de bloc, puis inline ;
 * le gras AVANT l'italique, sinon `**gras**` se lit comme un italique contenant
 * un astérisque.
 * =====================================================================
 */

export interface MdSpan {
  text: string;
  strong?: boolean;
  em?: boolean;
  code?: boolean;
}

export type MdBlock =
  | { kind: 'heading'; level: number; spans: MdSpan[] }
  | { kind: 'p'; spans: MdSpan[] }
  | { kind: 'ul'; items: MdSpan[][] }
  | { kind: 'ol'; items: MdSpan[][] }
  | { kind: 'quote'; spans: MdSpan[] }
  | { kind: 'table'; rows: MdSpan[][][] }
  | { kind: 'code'; lang: string; text: string }
  | { kind: 'hr' };

/**
 * Segments inline. Le gras est la PREMIÈRE alternative : à position égale il
 * l'emporte sur l'italique (règle de frontière 2). Le code inline perd ses
 * accents graves mais conserve son texte — y compris s'il ressemble à du balisage.
 */
const INLINE = /\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|`([^`\n]+)`/g;

export function inlineSpans(src: string): MdSpan[] {
  const spans: MdSpan[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(INLINE.source, 'g'); // instance locale : la récursion réentre
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) spans.push({ text: src.slice(last, m.index) });
    if (m[1] !== undefined) {
      // Le gras peut CONTENIR d'autres marqueurs — « **Is `Opus ID` a synonym?** ».
      // Sans récursion, les accents graves imbriqués ne seraient jamais retirés et
      // ressortiraient dans le texte : c'est l'invariant qui a révélé ce cas.
      for (const s of inlineSpans(m[1])) spans.push({ ...s, strong: true });
    } else if (m[2] !== undefined) {
      for (const s of inlineSpans(m[2])) spans.push({ ...s, em: true });
    } else {
      // Le code inline est TERMINAL : son contenu est littéral, jamais réanalysé.
      // C'est ce qui protège `<level>` — la pseudo-balise ressort telle quelle.
      spans.push({ text: m[3], code: true });
    }
    last = m.index + m[0].length;
  }
  if (last < src.length) spans.push({ text: src.slice(last) });
  return spans;
}

/** Découpe les cellules d'une ligne de tableau, hors barres de bordure. */
function tableCells(line: string): MdSpan[][] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => inlineSpans(c.trim()));
}

const RE_FENCE = /^```(\w*)\s*$/;
const RE_HEADING = /^(#{1,4}) +(.*)$/;
const RE_UL = /^\s*[-*+] +(.*)$/;
const RE_OL = /^\s*\d+\. +(.*)$/;
const RE_QUOTE = /^> ?(.*)$/;
const RE_HR = /^---+\s*$/;
const RE_TABLE_SEP = /^\|[\s:|-]+\|$/;

/**
 * Projette le corps d'un Record en blocs. Les blocs de code sont isolés EN
 * PREMIER et jamais réanalysés : leur contenu ressort à l'octet près.
 */
export function parseRecordBody(body: string): MdBlock[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const blocks: MdBlock[] = [];
  let para: string[] = [];
  let ul: MdSpan[][] = [];
  let ol: MdSpan[][] = [];
  let table: MdSpan[][][] = [];

  const flush = () => {
    if (para.length) { blocks.push({ kind: 'p', spans: inlineSpans(para.join(' ')) }); para = []; }
    if (ul.length) { blocks.push({ kind: 'ul', items: ul }); ul = []; }
    if (ol.length) { blocks.push({ kind: 'ol', items: ol }); ol = []; }
    if (table.length) { blocks.push({ kind: 'table', rows: table }); table = []; }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ── Bloc de code : OPAQUE, capturé avant toute autre règle ──
    const fence = RE_FENCE.exec(line);
    if (fence) {
      flush();
      const lang = fence[1] ?? '';
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
      blocks.push({ kind: 'code', lang, text: buf.join('\n') });
      continue;
    }

    if (!line.trim()) { flush(); continue; }
    if (RE_HR.test(line)) { flush(); blocks.push({ kind: 'hr' }); continue; }
    if (RE_TABLE_SEP.test(line)) continue; // ligne de structure, aucun texte

    const h = RE_HEADING.exec(line);
    if (h) { flush(); blocks.push({ kind: 'heading', level: h[1].length, spans: inlineSpans(h[2]) }); continue; }

    const q = RE_QUOTE.exec(line);
    if (q) { flush(); blocks.push({ kind: 'quote', spans: inlineSpans(q[1]) }); continue; }

    if (line.startsWith('|')) { if (para.length) flush(); table.push(tableCells(line)); continue; }

    const o = RE_OL.exec(line);
    if (o) { if (para.length || ul.length) flush(); ol.push(inlineSpans(o[1])); continue; }

    const u = RE_UL.exec(line);
    if (u) { if (para.length || ol.length) flush(); ul.push(inlineSpans(u[1])); continue; }

    if (ul.length || ol.length || table.length) flush();
    para.push(line.trim());
  }
  flush();
  return blocks;
}

/** Texte signifiant d'une suite de segments. */
function spansText(spans: MdSpan[]): string {
  return spans.map((s) => s.text).join('');
}

/**
 * TEXTE SIGNIFIANT projeté — la grandeur sur laquelle porte l'invariant.
 * Concatène tout ce qui est rendu au lecteur ; `hr` et les lignes de structure
 * n'apportent aucun texte.
 */
export function projectedText(blocks: MdBlock[]): string {
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.kind) {
      case 'heading':
      case 'p':
      case 'quote':
        out.push(spansText(b.spans));
        break;
      case 'ul':
      case 'ol':
        for (const it of b.items) out.push(spansText(it));
        break;
      case 'table':
        for (const row of b.rows) for (const cell of row) out.push(spansText(cell));
        break;
      case 'code':
        out.push(b.text);
        break;
      case 'hr':
        break;
    }
  }
  return out.join('\n');
}

/** Caractères NON BLANCS — la grandeur de l'invariant (insensible à l'indentation). */
export function nonBlank(s: string): number {
  return s.replace(/\s/g, '').length;
}
