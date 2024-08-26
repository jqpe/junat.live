/// <reference types="node" />

import { copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import svgr from 'esbuild-plugin-svgr'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    './src/**/*.{tsx,ts}',
    './src/index.ts',
    '!.storybook/',
    '!src/**/*.stories.*',
    '!src/**/*.d.ts',
  ],
  format: 'esm',
  target: 'es2022',
  splitting: false,
  dts: true,
  silent: true,
  minify: true,
  clean: true,
  sourcemap: true,
  banner: { js: '"use client";' },
  esbuildPlugins: [svgr()],
  onSuccess: async () => {
    const fileUrl = new URL(
      'style.css',
      import.meta.resolve('@jqpe/react-spring-bottom-sheet'),
    )

    copyFileSync(fileURLToPath(fileUrl), './dist/bottom-sheet.css')
  },
})
