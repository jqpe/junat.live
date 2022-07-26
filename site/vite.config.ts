import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [tsconfigPaths(), react(), svgr({ exportAsDefault: true })],
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/_setup.ts'],
    coverage: {
      src: ['src'],
      exclude: ['src/types']
    }
  }
})
