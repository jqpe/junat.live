import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react(), svgr({ include: '**/*.svg' })],
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
