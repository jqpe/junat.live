/// <reference types="node" />

import { copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/**/*.{tsx,ts}', '!src/**/*.stories.*', './src/index.ts'],
  format: 'esm',
  target: 'es2022',
  splitting: false,
  dts: true,
  minify: true,
  clean: true,
  sourcemap: true,
  banner: { js: '"use client";' },
  esbuildPlugins: [
    {
      name: 'copy bottom sheet styles',
      setup(build) {
        build.onEnd(() => {
          const fileUrl = new URL(
            'style.css',
            import.meta.resolve('@jqpe/react-spring-bottom-sheet'),
          )

          copyFileSync(fileURLToPath(fileUrl), './dist/bottom-sheet.css')
        })
      },
    },
  ],
})
