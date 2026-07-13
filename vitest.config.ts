import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, './') } },
  // Runtime JSX automatique (react/jsx-runtime) — pour les tests de composants
  // React, sans import React explicite (aligné sur le build Next).
  esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
  // Les tests d'intégration (base LIVE) ont leur propre config et ne doivent
  // jamais s'exécuter dans le run unitaire hors-ligne.
  test: {
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/integration/**'],
  },
});
