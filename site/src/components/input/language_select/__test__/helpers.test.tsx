import { handleValueChange } from '../helpers'

import { it, expect, vi, afterAll } from 'vitest'

it('replaces current page', () => {
  const replace = vi.fn(() => Promise.resolve(true))

  const locale = 'fi' as const
  const nextLocale = 'en' as const

  // Localized routes are covered in another test case
  const asPath = '/train/2020' as const

  handleValueChange({
    router: { asPath, locale, replace },
    stations: [],
    value: nextLocale
  })

  expect(replace).toHaveBeenCalledOnce()
  expect(replace).toHaveBeenCalledWith(asPath, undefined, {
    locale: nextLocale,
    scroll: false
  })
})

it('supports localized routes', () => {
  const replace = vi.fn(() => Promise.resolve(true))

  const locale = 'fi' as const
  const nextLocale = 'en' as const

  const asPath = '/juna/2022' as const

  handleValueChange({
    router: { asPath, locale, replace },
    stations: [],
    value: nextLocale
  })

  expect(replace).toHaveBeenCalledOnce()
  expect(replace).not.toHaveBeenLastCalledWith(asPath)
})

afterAll(() => {
  vi.resetAllMocks()
})
