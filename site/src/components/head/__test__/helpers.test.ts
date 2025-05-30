import { expect, it } from 'vitest'

import { SITE_URL } from '@junat/core/constants'

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
      // durable to changes to i18n
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      replace: { fi: { x: 'x' }, en: { x: 'y' } } as any,
    }),
  ).toStrictEqual(`${SITE_URL}/en/y`)
})

it('has slash if locale is defined', () => {
  expect(
    fullUrl('x', {
      locale: 'en',
    }),
  ).toStrictEqual(`${SITE_URL}/en/x`)
})
