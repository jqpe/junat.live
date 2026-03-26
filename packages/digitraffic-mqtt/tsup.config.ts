import { defineConfig } from 'tsup'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  entry: [
    './src/**/*.ts',
    './src/index.ts',
    '!src/setup.ts',
    '!src/mqtt_server_setup.ts',
  ],
  format: 'esm',
  splitting: false,
  dts: true,
  clean: true,
  sourcemap: true,
  minify: isProd,
})
