/**
 * =====================================================================
 * Opus X — Redirections transitoires (compat, À RETIRER)
 * =====================================================================
 * MESURE TEMPORAIRE de compatibilité, PAS une seconde identité. Après la
 * migration wtf → wtr, la seule ressource canonique est
 * `/frameworks/world-trader/skills`. L'ancien slug public `wtf` répond
 * UNIQUEMENT par une redirection permanente (301) vers elle, le temps que les
 * consommateurs déjà déployés se mettent à jour.
 *
 * ⚠️ Ce fichier est le SEUL endroit (hors notes de migration, docs préservés et
 * migration forward) où le slug `wtf` subsiste légitimement après migration.
 * Aucun générateur, sitemap, lien interne ou artefact ne doit PRODUIRE `wtf`.
 *
 * Retrait GRAVÉ : redirection active jusqu'au 31 octobre 2026 INCLUS ; à supprimer
 * au plus tard le 1er novembre 2026. Supprimer alors cette entrée ET le test associé.
 * Détails : docs/migration/MIG-wtf-to-wtr-2026-07-18.md.
 * =====================================================================
 */
export interface TransitionalRedirect {
  source: string;
  destination: string;
  statusCode: 301; // 301 Moved Permanently (exigence architecte, pas le 308 de `permanent:true`)
}

export const transitionalRedirects: TransitionalRedirect[] = [
  {
    source: '/frameworks/wtf/skills',
    destination: '/frameworks/world-trader/skills',
    statusCode: 301,
  },
];
