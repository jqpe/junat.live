import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    dir: 'dist',
    format: 'esm',
    preserveModules: true,
  },
  plugins: [typescript(), isProd && terser({})],
})
