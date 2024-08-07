import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { internalIpV4 } from 'internal-ip'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM)

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [tsconfigPaths(), TanStackRouterVite(), svgr(), react()],
  resolve: {
    alias: {
      '@junat/i18n': '../packages/i18n/src',
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: mobile ? '0.0.0.0' : false,
    hmr: mobile
      ? {
          protocol: 'ws',
          host: await internalIpV4(),
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
}))
