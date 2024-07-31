import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      all: true,
      include: ['src'],
      exclude: ['src/constants.ts', 'src/index.ts', 'src/i18n.ts'],
      reporter: ['json'],
    },
  },
})
