/**
 * globalSetup d'intégration — exécute la GARDE DE SÉCURITÉ une fois,
 * AVANT tout worker de test. Si la cible n'est pas isolée, tout le run
 * échoue ici, bruyamment, avant qu'un seul test ne touche la base.
 */
import { assertSafeStagingTarget } from './_harness';

export default function setup() {
  assertSafeStagingTarget();
}
