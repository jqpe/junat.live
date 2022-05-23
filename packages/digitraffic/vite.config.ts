import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: './src/setup.ts',
    coverage: {
      all: true,
      include: ['src']
    }
  }
})
