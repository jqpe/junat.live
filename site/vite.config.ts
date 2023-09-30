import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'node:path'

// Vite does not support `publishConfig.directory` and will look for packages relative to `process.cwd()` which is `site`
const resolveDistributedPackage = (name: string) => {
  return path.resolve(process.cwd(), `../packages/${name}/dist`)
}

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({ fastRefresh: false }),
    svgr({ exportAsDefault: true })
  ],
  resolve: {
    alias: {
      '@junat/digitraffic': resolveDistributedPackage('digitraffic'),
      '@junat/design': resolveDistributedPackage('design-tokens')
    }
  },
  test: {
    environment: 'jsdom',
    globalSetup: ['../packages/digitraffic-mqtt/src/mqtt_server_setup.ts'],
    setupFiles: ['tests/_setup.ts'],
    coverage: {
      all: true,
      include: ['src'],
      exclude: [
        'src/types',
        'src/generated/**/*',
        'src/lib/digitraffic/{queries,fragments}/*'
      ],
      provider: 'istanbul',
      reporter: ['lcovonly', 'text'],
      reportsDirectory: 'coverage/site'
    }
  }
})
