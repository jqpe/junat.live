import { describe, expect, it } from 'vitest'
import { camelCase } from '../../src/utils/camel_case'

describe('camel case', () => {
  it('camel cases camel case', () => {
    expect(camelCase('camelCase')).toStrictEqual('camelCase')
  })

  it('camel cases snake case', () => {
    expect(camelCase('snake_case')).toStrictEqual('snakeCase')
  })

  it('camel cases kebab case', () => {
    expect(camelCase('kebab-case')).toStrictEqual('kebabCase')
  })

  it('camel cases pascal case', () => {
    expect(camelCase('PascalCase')).toStrictEqual('pascalCase')
  })

  it('camel cases title case', () => {
    expect(camelCase('Title Case')).toStrictEqual('titleCase')
  })
})
