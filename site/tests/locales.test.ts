/// <reference types="vite/client"/>

import { expect, test } from 'vitest'

const MODULES = import.meta.glob('/src/locales/*.json', {
  eager: true
})

test.skip('localizations have same keys (Depth=0)', () => {
  Object.keys(MODULES).reduce((prev, curr) => {
    const a = Object.keys(MODULES[curr] as any).sort()
    const b = Object.keys(MODULES[prev] as any).sort()

    expect(a, `Expected ${curr} to contain same keys as ${prev}`).toStrictEqual(
      b
    )

    return curr
  }, Object.keys(MODULES)[0])
})

test.skip('localizations have same keys (Depth=1)', () => {
  const records = getRecords()

  for (const [i, record] of records.entries()) {
    const last = records[i - 1 < 0 ? records.length - 1 : i - 1]

    for (let j = 0; j < record.length; j++) {
      const a = Object.keys(record[j])
      const b = Object.keys(last[j])

      expect(a).toStrictEqual(b)
    }
  }
})

test.skip('localizations have same keys (Depth=2)', () => {
  const records = getRecords()

  for (const [i, record] of records.entries()) {
    const last = records[i - 1 < 0 ? records.length - 1 : i - 1]

    for (let j = 0; j < record.length; j++) {
      if (getChildren(record[j]).length === 0) {
        continue
      }

      const recordsD1 = getChildren(record[j])

      for (let k = 0; k < recordsD1.length; k++) {
        const a = Object.keys(recordsD1[k]).sort()
        const b = Object.keys(getChildren(last[j])[k]).sort()

        expect(a).toStrictEqual(b)
      }
    }
  }
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
