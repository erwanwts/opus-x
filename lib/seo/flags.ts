/**
 * =====================================================================
 * Opus X — Flags globaux du site public (source UNIQUE, comme entityHref)
 * =====================================================================
 * `force-static` FIGE ces valeurs AU BUILD : ni variable d'env (évaluée au
 * runtime, sans effet sur des pages pré-rendues), ni constante par page. Un
 * seul point de bascule, importé par la couche contenu — jamais surchargé
 * localement par une page.
 * =====================================================================
 */

/**
 * CTA des pages GEO : `true` = lien actif ; `false` = libellé inerte (non cliquable).
 * ACTIVÉ : tous les CTA pointent désormais vers des PAGES HTML réelles — les piliers
 * vers `/records/{id}` (la page du Record, résolue par le registre), les archétypes
 * vers des pages existantes (`/registry`, `/records`, `/knowledge-graph`). Aucun CTA
 * ne mène à du JSON. La destination reste RÉSOLUE (ctaHref) : une cible absente rend
 * le libellé inerte, jamais un lien mort. Bascule ICI, nulle part ailleurs.
 */
export const CTA_ENABLED = true;
