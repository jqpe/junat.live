import { fileURLToPath } from 'url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore
  plugins: [svgr(), tsconfigPaths(), react()],
  resolve: {
    extensions: ['.mdx', '.tsx', '.ts', '.js'],
  },
  test: {
    environment: 'jsdom',
    coverage: {
      clean: false,
      provider: 'istanbul',
      reporter: ['json', 'text'],
      exclude: [
        'src/**/index.ts',
        '.storybook/',
        'tsup.config.ts',
        '**virtual:**',
        '**/*.svg',
      ],
    },
    projects: [
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
