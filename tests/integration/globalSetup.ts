/**
 * globalSetup d'intégration — exécute les GARDES une fois, AVANT tout worker
 * de test. Si l'une échoue, toute la campagne s'arrête ici, bruyamment, avant
 * qu'un seul test ne touche la base.
 *
 * DEUX gardes, dans l'ordre :
 *   1. anti-prod (assertSafeStagingTarget) — la cible EST le staging isolé ;
 *   2. parité vérité-terrain (assertStagingReflectsRepo, D-037) — le staging
 *      REFLÈTE le dépôt (les objets dont dépend la campagne existent vraiment).
 *      Sans elle, un test vert ne prouve pas ce qu'il prétend.
 */
import { assertSafeStagingTarget, admin, anonClient } from './_harness';
import { assertStagingReflectsRepo } from './parityGuard';

export default async function setup() {
  assertSafeStagingTarget();
  await assertStagingReflectsRepo(admin, anonClient());
}
