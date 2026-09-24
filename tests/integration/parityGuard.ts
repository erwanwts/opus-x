/**
 * =====================================================================
 * Garde de parité STAGING ↔ DÉPÔT — la COLLECTE (vérité-terrain, D-037).
 * =====================================================================
 * Sonde la base de staging via les clients de test DÉJÀ en place (aucun
 * credential supplémentaire), puis délègue la décision à `parityViolation`
 * (module pur). Appelée par `globalSetup` : si la base est en retard sur le
 * dépôt, la campagne ÉCHOUE BRUYAMMENT avant le moindre test — comme la
 * garde anti-prod refuse de démarrer sur une cible non isolée.
 * =====================================================================
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { parityViolation, type ParityProbes } from '../parity/parityRules';

/** Rassemble les faits de VÉRITÉ-TERRAIN — ce que la base fait, pas ce qu'un ledger prétend. */
export async function gatherProbes(
  admin: SupabaseClient,
  anon: SupabaseClient,
): Promise<ParityProbes> {
  // Pont : appeler la fonction ; PGRST202 = introuvable dans le schéma = absente.
  const fn = await admin.rpc('wsp_resolve_subject_passport', { p_opus_id: '__parity_probe__' });
  const bridgeResolveFn: ParityProbes['bridgeResolveFn'] =
    fn.error?.code === 'PGRST202' ? 'absent' : 'present';

  // Vue publique : sélectionner issued_at ; erreur (colonne/vue absente) = absent.
  const view = await anon.from('public_passport_view').select('issued_at').limit(1);
  const publicViewIssuedAt: ParityProbes['publicViewIssuedAt'] = view.error ? 'absent' : 'present';

  // Durcissement Lot 3 : l'anon doit se voir REFUSER la lecture brute de passports.
  const raw = await anon.from('passports').select('id').limit(1);
  const anonPassportsRaw: ParityProbes['anonPassportsRaw'] = raw.error ? 'denied' : 'readable';

  // Palier 2 : la table wsp_passport_updates existe (erreur = absente).
  const pu = await admin.from('wsp_passport_updates').select('id', { head: true, count: 'exact' }).limit(0);
  const passportUpdatesTable: ParityProbes['passportUpdatesTable'] = pu.error ? 'absent' : 'present';

  // Palier 3 : la fonction wsp_my_active_skills existe (PGRST202 = absente ;
  // en service_role elle rend [] sans erreur, ce qui suffit à prouver sa présence).
  const sk = await admin.rpc('wsp_my_active_skills');
  const skillsSourceFn: ParityProbes['skillsSourceFn'] = sk.error?.code === 'PGRST202' ? 'absent' : 'present';

  // D-040 : la fonction wsp_advance_lifecycle existe (PGRST202 = absente ; sinon
  // présente — un uuid bidon renvoie void sans effet, aucune erreur bloquante).
  const lc = await admin.rpc('wsp_advance_lifecycle', { p_passport_id: '00000000-0000-0000-0000-000000000000' });
  const lifecycleAdvanceFn: ParityProbes['lifecycleAdvanceFn'] = lc.error?.code === 'PGRST202' ? 'absent' : 'present';

  // Palier 4 : la table wsp_competency_trust existe (erreur = absente).
  const ct = await admin.from('wsp_competency_trust').select('passport_id', { head: true, count: 'exact' }).limit(0);
  const competencyTrustTable: ParityProbes['competencyTrustTable'] = ct.error ? 'absent' : 'present';

  return { bridgeResolveFn, publicViewIssuedAt, anonPassportsRaw, passportUpdatesTable, skillsSourceFn, lifecycleAdvanceFn, competencyTrustTable };
}

/** Applique la garde : lève BRUYAMMENT si le staging ne reflète pas le dépôt. */
export async function assertStagingReflectsRepo(
  admin: SupabaseClient,
  anon: SupabaseClient,
): Promise<void> {
  const probes = await gatherProbes(admin, anon);
  const violation = parityViolation(probes);
  if (violation) {
    throw new Error('\n' + violation + '\n');
  }
}
