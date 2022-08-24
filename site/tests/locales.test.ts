/// <reference types="vite/client"/>

import { expect, test } from 'vitest'

const MODULES: Record<string, JSON> = import.meta.glob('/src/locales/*.json', {
  eager: true
})

test('localizations have same keys (Depth=0)', () => {
  const keys = Object.keys(MODULES)

  for (let i = 0; i < keys.length; i++) {
    const prev = i !== 0 ? i - 1 : keys.length - 1

    const a = Object.keys(MODULES[keys[prev]]).sort()
    const b = Object.keys(MODULES[keys[i]]).sort()

    const message = `Expected ${keys[prev]} to have same keys as ${keys[i]}`

    expect(a, message).toStrictEqual(b)
  }
})
