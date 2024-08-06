import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/**/*.tsx', '!src/**/*.stories.*', './src/index.ts'],
  format: 'esm',
  target: 'es2022',
  splitting: false,
  dts: true,
  minify: true,
  clean: true,
  sourcemap: true,
})
