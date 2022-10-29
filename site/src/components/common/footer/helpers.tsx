/**
 * For supported locales, Finnish and Swedish, return corresponding segment, otherwise default to English.
 */
export const getFintrafficUriSegment = (
  locale?: string
): 'fi' | 'en' | 'sv' => {
  if (!locale || (locale !== 'fi' && locale !== 'sv')) {
    return 'en'
  }

  return locale
}

import { expect, test } from 'vitest'

if (import.meta.vitest) {
  test('returns finnish for fi', () => {
    expect(getFintrafficUriSegment('fi')).toStrictEqual('fi')
  })

  test('returns swedish for sv', () => {
    expect(getFintrafficUriSegment('sv')).toStrictEqual('sv')
  })

  test('returns english for en', () => {
    expect(getFintrafficUriSegment('en')).toStrictEqual('en')
  })

  test('returns english as default', () => {
    expect(getFintrafficUriSegment('any value')).toStrictEqual('en')
  })
}
