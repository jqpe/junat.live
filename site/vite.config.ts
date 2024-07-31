/* eslint-disable @typescript-eslint/ban-ts-comment */

import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    // @ts-ignore
    tsconfigPaths(),
    // @ts-ignore
    react({ fastRefresh: false }),
    // @ts-ignore
    svgr({ exportAsDefault: true, include: '**/*.svg' }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/_setup.ts'],
    coverage: {
      all: true,
      include: ['src'],
      provider: 'istanbul',
      reporter: ['json'],
    },
  },
})
