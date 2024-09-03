/// <reference types="node" />

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/**/*.ts', './src/index.ts'],
  format: 'esm',
  target: 'es2022',
  splitting: false,
  dts: true,
  silent: true,
  minify: true,
  clean: true,
  sourcemap: true,
})
