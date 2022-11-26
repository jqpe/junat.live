import type { Locale } from '~/types/common'

import { SITE_VALID_URL } from '~/constants'

export const fullUrl = (path: string, locale?: Locale) => {
  const pathWithLocale = [locale, path].join('')

  return new URL(pathWithLocale, SITE_VALID_URL).toString()
}
