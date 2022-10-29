import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [tsconfigPaths(), react(), svgr({ exportAsDefault: true })],
  test: {
    environment: 'jsdom',
    globalSetup: ['../packages/digitraffic-mqtt/src/mqtt_server_setup.ts'],
    setupFiles: ['tests/_setup.ts'],
    includeSource: ['src/**/*.{js,ts,tsx}'],
    coverage: {
      src: ['src'],
      exclude: ['src/types']
    }
  }
})
