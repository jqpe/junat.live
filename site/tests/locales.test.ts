/// <reference types="vite/client"/>

import { expect, test } from 'vitest'

const MODULES: Record<string, any> = import.meta.glob('/src/locales/*.json', {
  eager: true,
  import: 'default'
})

test('localizations have same keys max depth = 3', () => {
  const keys = Object.keys(MODULES)

  for (let i = 0; i < keys.length; i++) {
    const prev = i !== 0 ? i - 1 : keys.length - 1

    const aObj = MODULES[keys[prev]]
    const bObj = MODULES[keys[i]]

    const d0_a = Object.keys(aObj).sort()
    const d0_b = Object.keys(bObj).sort()

    const message = `Expected ${keys[prev]} to have same keys as ${keys[i]}`

    expect(d0_a, message).toStrictEqual(d0_b)

    const d1 = d0_a.filter(key => typeof aObj[key] === 'object')
    const SKIP_KEYS = { d1: 'stations' }

    for (const d of d1) {
      if (d === SKIP_KEYS.d1) {
        continue
      }

      const d1_a = Object.keys(aObj[d]).sort()
      const d1_b = Object.keys(bObj[d]).sort()

      expect(d1_a).toStrictEqual(d1_b)

      const d2 = d1_a.filter(key => typeof aObj[d][key] === 'object')

      for (const d_2 of d2) {
        const a = Object.keys(aObj[d][d_2]).sort()
        const b = Object.keys(bObj[d][d_2]).sort()

        expect(a).toStrictEqual(b)
      }
    }
  }
})
