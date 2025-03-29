import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: './src/setup.ts',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json'],
      include: ['src'],
      exclude: ['src/types', './src/setup.ts'],
    },
  },
})
