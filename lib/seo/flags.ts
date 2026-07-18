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
 * Reste `false` tant que l'API JSON n'est pas déployée (exigence architecte : ne
 * JAMAIS pointer vers une ressource inexistante). Bascule ICI, nulle part ailleurs.
 */
export const CTA_ENABLED = false;
