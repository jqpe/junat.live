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

/**
 * Takes an object and returns an array of its children objects.
 */
function getChildren(obj: Record<string, unknown>) {
  const props = Object.keys(obj)

  return props
    .map(prop => obj[prop] instanceof Object && obj[prop])
    .filter(Boolean) as Record<string, unknown>[]
}

function getRecords() {
  const records: Record<string, unknown>[][] = Object.keys(MODULES)
    .map(key => (MODULES[key] as any).default)
    .map(obj => {
      const props = Object.keys(obj)

      return props
        .map(prop => obj[prop] instanceof Object && obj[prop])
        .filter(Boolean)
    })

  return records
}
