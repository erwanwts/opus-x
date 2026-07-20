/**
 * =====================================================================
 * Résolution d'une cible de section Relations en référence de nœud
 * =====================================================================
 * EXTRAIT de build-graph.mjs sans changement de comportement, pour qu'une
 * règle de résolution soit couverte par un test unitaire au lieu d'être
 * vérifiable seulement par régénération de l'artefact.
 *
 * Les tables (TITLE_TO_ID notamment) sont peuplées APRÈS l'import, au scan
 * des Records : la fabrique les capture par référence, jamais par copie.
 *
 * RÈGLE DE RÉSOLUTION (gravée par l'architecte) — formalisation d'une règle
 * implicitement attendue par l'architecture, pas une capacité nouvelle :
 *
 *   « Within a Relations section, if a target identifier matches both a Record
 *     title and a declared Concept, concept resolution SHALL take precedence.
 *     Record resolution SHALL only occur when no declared Concept matches the
 *     identifier. »
 *
 * Portée : la règle ne vise QUE la résolution par titre de Record. Les
 * raccourcis de `name_aliases` relèvent d'un autre mécanisme et restent hors
 * de son champ — décision explicite, à instruire séparément.
 * =====================================================================
 */

export const norm = (s) => s.toLowerCase().trim();

export function slug(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fabrique le résolveur en le fermant sur les tables du générateur.
 *
 * @param {object} tables
 * @param {Map<string,string>} tables.NAME_ALIASES      label normalisé → OCR-id (raccourci)
 * @param {Map<string,string>} tables.TITLE_TO_ID       titre normalisé → OCR-id
 * @param {Set<string>}        tables.FLAGGED_NAMES     titres ambigus, jamais résolus globalement
 * @param {Map<string,string>} tables.LABEL_TO_CATEGORY label normalisé → catégorie de classification
 */
export function makeParseNodeRef({ NAME_ALIASES, TITLE_TO_ID, FLAGGED_NAMES, LABEL_TO_CATEGORY }) {
  /** Résout un libellé en référence de nœud. Ordre : (a) OCR-id explicite n'importe
   *  où → interne ; (b) note entre parenthèses ; (c) raccourci de nom → interne ;
   *  (c·bis) concept déclaré → PRÉCÉDENCE sur la résolution par titre ;
   *  (d) titre de Record exact (hors set signalé) → interne ; (e) sinon externe. */
  return function parseNodeRef(text) {
    const t = text.trim();

    // (a) Un `(OCR-\d+)` N'IMPORTE OÙ → nœud interne (Défaut 2a). Le texte avant la
    //     parenthèse = label ; le reste de la parenthèse + le texte APRÈS (« in
    //     Certified state », « coordinates and criteria ») = qualificatif → note.
    const idAnywhere = t.match(/\((OCR-\d+)([^)]*)\)/);
    if (idAnywhere) {
      const id = idAnywhere[1];
      const label = t.slice(0, idAnywhere.index).trim();
      const parenRest = idAnywhere[2].replace(/^[\s,;]+|[\s,;]+$/g, '').trim();
      const after = t.slice(idAnywhere.index + idAnywhere[0].length).trim();
      const note = [parenRest, after].filter(Boolean).join(' ').trim() || null;
      return { id, label: label || id, type: 'internal', note };
    }

    // (b) Parenthèse non-id en fin → note (« reflexive », « as prior art… »).
    let note = null;
    let label = t;
    const paren = t.match(/\(([^)]*)\)\s*$/);
    if (paren) {
      label = t.slice(0, paren.index).trim();
      const rest = paren[1].replace(/^[\s,;]+|[\s,;]+$/g, '').trim();
      if (rest) note = rest;
    }

    // (c) Raccourci de nom (Passport→OCR-101…) → fusion avec le Record (décision V1).
    const nlabel = norm(label);
    if (NAME_ALIASES.has(nlabel)) {
      return { id: NAME_ALIASES.get(nlabel), label, type: 'internal', note, resolved_by_alias: true };
    }

    // (c·bis) RÈGLE GRAVÉE — un identifiant qui est À LA FOIS un titre de Record et
    //         un Concept déclaré résout vers le CONCEPT. La résolution par titre (d)
    //         n'a lieu qu'à défaut de concept déclaré portant ce nom.
    if (
      LABEL_TO_CATEGORY.get(nlabel) === 'protocol_concept' &&
      TITLE_TO_ID.has(nlabel) &&
      !FLAGGED_NAMES.has(nlabel)
    ) {
      return { id: 'ext:' + slug(label), label, type: 'external', note, resolved_by_concept: true };
    }

    // (d) Titre de Record EXACT (hors set signalé/ambigu) → nœud interne (Défaut 1).
    if (TITLE_TO_ID.has(nlabel) && !FLAGGED_NAMES.has(nlabel)) {
      return { id: TITLE_TO_ID.get(nlabel), label, type: 'internal', note, resolved_by_name: true };
    }

    // (e) Sinon externe (décision A).
    return { id: 'ext:' + slug(label), label, type: 'external', note };
  };
}
