import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Config des tests d'INTÉGRATION (LOT 11) — base Supabase LIVE (staging).
 * Séparée de la config unitaire : `npm test` reste hors-ligne et rapide.
 * - globalSetup applique la garde de sécurité avant tout.
 * - Exécution séquentielle (fileParallelism: false) : les tests partagent
 *   une base réelle ; on évite les interférences.
 * - Timeouts élargis : appels réseau + attente d'émission par trigger.
 */
export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, './') } },
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.integration.test.ts'],
    globalSetup: ['tests/integration/globalSetup.ts'],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
