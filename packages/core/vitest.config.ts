import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'text'],
      include: ['src'],
      exclude: ['src/types.ts', 'src/**/index.ts'],
    },
  },
})
