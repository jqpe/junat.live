import type { Locale } from '~/types/common'

import { SITE_FULL_URL } from '~/constants'

export const fullUrl = (
  path: string,
  args?: {
    locale?: Locale
    currentLocale?: Locale
    replace?: Record<Locale, Record<string, string>>
  }
) => {
  let localePrefixedPath = [args?.locale, path].join('')

  if (args?.replace && args.locale && args.currentLocale) {
    const elements = args.replace[args.locale]

    for (const key of Object.keys(elements)) {
      localePrefixedPath = localePrefixedPath.replace(
        args.replace[args.currentLocale][key],
        elements[key]
      )
    }
  }

  return new URL(localePrefixedPath, SITE_FULL_URL).toString()
}
