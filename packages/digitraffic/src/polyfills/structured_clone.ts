// @ts-nocheck

import structuredClone from '@ungap/structured-clone'

if (!globalThis.structuredClone) {
  globalThis.structuredClone = structuredClone
}

export {}
