/// <reference types="vite/client"/>

import { expect, test } from 'vitest'

const MODULES: Record<string, object> = import.meta.glob('/src/*.json', {
  eager: true,
  import: 'default',
})

// There are rare cases where we might want to skip testing for a particular object
// Format: [[keys for depth 0], [keys for depth 1]...]
const SKIP_KEY = [['stations']]

test('localizations have same keys max depth = 3', () => {
  const keys = Object.keys(MODULES)

  for (let i = 0; i < keys.length; i++) {
    const hasPrev = i !== 0
    const prev = hasPrev ? i - 1 : keys.length - 1

    const aObj = MODULES[keys[prev]!]
    const bObj = MODULES[keys[i]!]

    compareKeys(aObj, bObj, 0, 3)
  }
})

test('no dots in keys ', () => {
  // Check that no key has a dot; this simplifies dynamically creating localization structures
  function checkForDots(obj: object, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key
      const msg = `Dots in JSON keys are not allowed! Modify the key at: "${currentPath}"`

      expect(key.includes('.'), msg).toBe(false)

      if (typeof value === 'object' && value !== null) {
        checkForDots(value, currentPath)
      }
    }
  }

  const keys = Object.keys(MODULES)

  for (const key of keys) {
    const obj = MODULES[key]
    checkForDots(obj)
  }
})

function compareKeys(
  aObj: object,
  bObj: object,
  depth: number,
  maxDepth: number,
) {
  SKIP_KEY.at(depth)?.every(keyToSkip => {
    delete aObj[keyToSkip]
    delete bObj[keyToSkip]
  })

  const aKeys = Object.keys(aObj).sort()
  const bKeys = Object.keys(bObj).sort()

  expect(aKeys).toStrictEqual(bKeys)

  if (depth < maxDepth) {
    for (const key of aKeys) {
      if (typeof aObj[key] === 'object') {
        const aChild = aObj[key]
        const bChild = bObj[key]
        compareKeys(aChild, bChild, depth + 1, maxDepth)
      }
    }
  }
}
