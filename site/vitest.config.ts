import { fileURLToPath } from 'url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      clean: false,
      include: ['src'],
      provider: 'istanbul',
      reporter: ['json', 'text'],
      exclude: ['src/pages/**'],
    },
    projects: [
      {
        extends: true,
        // @ts-ignore
        plugins: [tsconfigPaths(), react(), svgr({ include: '**/*.svg' })],
        test: {
          name: 'site',
          environment: 'jsdom',
          setupFiles: ['tests/_setup.ts'],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: fileURLToPath(new URL('.storybook', import.meta.url)),
            storybookScript: 'pnpm storybook --no-open',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
