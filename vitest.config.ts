import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/**/*.test.{ts,tsx}'], environment: 'node', reporters: ['default', 'json'], outputFile: 'reports/vitest-results.json' } });
