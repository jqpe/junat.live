/// <reference types="node" />

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/**/*.ts', './src/index.ts'],
  format: 'esm',
  target: 'es2022',
  splitting: false,
  // Does not handle type imports
  dts: false,
  silent: true,
  minify: true,
  clean: true,
  sourcemap: true,
})
