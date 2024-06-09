import tsPackage from '@junat/rollup/typescript-package.js'

export default Object.assign(tsPackage, { external: 'mqtt' })
