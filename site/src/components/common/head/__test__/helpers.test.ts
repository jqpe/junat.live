import { SITE_URL } from '~/constants'
import { it, expect } from 'vitest'

import { fullUrl } from '../helpers'

it('joins site_full_url with path (string without slash)', () => {
  expect(fullUrl('path')).toStrictEqual(`${SITE_URL}/path`)
})

it('joins site_full_url with path (string _with_ slash)', () => {
  expect(fullUrl('/path')).toStrictEqual(`${SITE_URL}/path`)
})

it('replaces words according to `replace` argument', () => {
  expect(
    fullUrl('/x', {
      currentLocale: 'fi',
      locale: 'en',
      replace: { fi: { x: 'x' }, en: { x: 'y' }, sv: {} }
    })
  ).toStrictEqual(`${SITE_URL}/en/y`)
})

it('has slash if locale is defined', () => {
  expect(
    fullUrl('x', {
      locale: 'en'
    })
  ).toStrictEqual(`${SITE_URL}/en/x`)
})
