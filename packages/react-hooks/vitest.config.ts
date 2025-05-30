import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({

  plugins: [react()],
  test: {
    setupFiles: './test_setup.ts',
    environment: 'jsdom',
    coverage: {
      provider: "istanbul",
      reporter: ['text', 'json'],
      include: ['src'],
      exclude: ['src/**/index.ts'],
    },
  },
})
