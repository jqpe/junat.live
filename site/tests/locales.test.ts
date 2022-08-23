/// <reference types="vite/client"/>

import { expect, test } from 'vitest'

const MODULES = import.meta.glob('/src/locales/*.json', {
  eager: true
})

test('localizations have same keys (Depth=0)', () => {
  Object.keys(MODULES).reduce((prev, curr) => {
    const a = Object.keys(MODULES[curr] as any).sort()
    const b = Object.keys(MODULES[prev] as any).sort()

    expect(a, `Expected ${curr} to contain same keys as ${prev}`).toStrictEqual(
      b
    )

    return curr
  }, Object.keys(MODULES)[0])
})
