import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    environment: 'node',
  },
  // The app's tsconfig sets `jsx: preserve` because Next compiles JSX itself. Vitest has to
  // transform it, so it needs the automatic runtime told to it explicitly — otherwise any spec
  // that imports a component (proof.tsx, to assert the proof slots are empty) fails to parse.
  esbuild: { jsx: 'automatic' },
});
