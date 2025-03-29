import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-expect-error Plugin mismatch
  plugins: [svgr(), tsconfigPaths(), react()],
  resolve: {
    extensions: ['.mdx', '.tsx', '.ts', '.js'],
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'text'],
      // Components should be tested by Storybook instead
      include: ['src/**/*.ts'],
      // Testing barrel files is redundant
      exclude: ['src/**/index.ts'],
    },
  },
})
