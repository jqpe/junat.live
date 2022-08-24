import type { Locale } from '../types/common'

import { LOCALES } from 'src/constants'

export const getLocale = (locale?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !LOCALES.includes(locale as any)) {
    throw new Error(`Unimplemented locale ${locale}`)
  }
  return locale as Locale
}
