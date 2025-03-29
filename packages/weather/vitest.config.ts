import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'text'],
      include: ['src'],
      exclude: ['**/*d.ts'],
    },
  },
})
