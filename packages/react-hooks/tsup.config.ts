/// <reference types="node" />

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/**/*.ts', './src/index.ts', '!src/**/*.d.ts'],
  format: 'esm',
  target: 'es2022',
  splitting: false,
  dts: true,
  minify: true,
  clean: true,
  sourcemap: true,
  banner: { js: '"use client";' },
  external: ['@tanstack/react-query'],
})
