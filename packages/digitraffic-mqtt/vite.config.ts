import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: ['./src/mqtt_server_setup.ts'],
    setupFiles: ['./src/setup.ts'],
    alias: {
      "~": "src"
    },
    coverage: {
      all: true,
      include: ['src'],
      exclude: ['src/types', 'src/mqtt_server_setup.ts', 'src/constants']
    }
  }
})
