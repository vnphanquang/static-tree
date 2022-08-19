/// <reference types="vitest" />

import { defineConfig } from 'vite';

// Configure Vitest (https://vitest.dev/config/)
export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul', // or 'c8'
      reporter: ['text', 'lcov'],
    },
  },
});
