/* eslint-disable @typescript-eslint/ban-ts-comment */

import path from 'node:path'

import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Vite does not support `publishConfig.directory` and will look for packages relative to `process.cwd()` which is `site`
const resolveDistributedPackage = (name: string) => {
  return path.resolve(process.cwd(), `../packages/${name}/dist`)
}

export default defineConfig({
  plugins: [
    // @ts-ignore
    tsconfigPaths(),
    // @ts-ignore
    react({ fastRefresh: false }),
    // @ts-ignore
    svgr({ exportAsDefault: true, include: '**/*.svg' }),
  ],
  resolve: {
    alias: {
      '@junat/digitraffic': resolveDistributedPackage('digitraffic'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/_setup.ts'],
    coverage: {
      all: true,
      include: ['src'],
      exclude: [
        'src/types',
        'src/generated/**/*',
        'src/lib/digitraffic/{queries,fragments}/*',
        // These are tested by Storybook
        'src/components/**/*',
        'src/features/**/components/*',
        'src/features/**/styles/*',
        '**/*.stories.tsx',
      ],
      provider: 'istanbul',
      reporter: 'json',
    },
  },
})
