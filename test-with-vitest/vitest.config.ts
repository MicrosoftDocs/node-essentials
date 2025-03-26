import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'istanbul', // Alternatively, you can use "c8"
      reporter: ['text', 'lcov'],
      // Optionally add thresholds here:
      // lines: 80,
      // functions: 80,
      // branches: 80,
      // statements: 80,
    },
  },
});
