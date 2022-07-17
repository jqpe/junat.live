import { describe, expect, it } from 'vitest'
import { camelCaseKeys } from '../../src/utils/camel_case_keys'

describe('camel case keys', () => {
  const obj = { snake_case: 0, more_keys: 1 }

  it('camel cases snake case keys', () => {
    expect(Object.keys(camelCaseKeys(obj))).to.have.members([
      'snakeCase',
      'moreKeys'
    ])
  })

  it('retains original items', () => {
    expect(Object.values(camelCaseKeys(obj))).to.have.members([0, 1])
  })

  it('throws type error if object is not an object', () => {
    // @ts-expect-error Should be an object
    expect(() => camelCaseKeys('')).toThrow(TypeError)
  })
})
