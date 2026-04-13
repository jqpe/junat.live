// @ts-check
import { serwist } from '@serwist/next/config'

export default serwist({
  swDest: 'public/sw.js',
  swSrc: 'src/service_worker.ts',
  globIgnores: [
    '**/dynamic-css-manifest.json',
    '**/*.map',
    '**/manifest.*.js',
    '**/*.pmtiles',
  ],
})
