import { defineConfig } from 'tsup'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: 'esm',
  splitting: false,
  dts: true,
  clean: true,
  sourcemap: true,
  minify: isProd,
})
