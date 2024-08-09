import { DEFAULT_LOCALE, FINTRAFFIC } from '@junat/core/constants'

type Path = keyof typeof FINTRAFFIC.LOCALE_PATHS

const isSupportedPath = (locale: string): locale is Path => {
  return Object.keys(FINTRAFFIC.LOCALE_PATHS).includes(locale)
}

/**
 * For {@link FINTRAFFIC.LOCALE_PATHS|supported locales} return it, otherwise default to English.
 */
export const getFintrafficPath = (locale?: string): string => {
  if (locale && isSupportedPath(locale)) {
    return FINTRAFFIC.LOCALE_PATHS[locale]
  }

  return FINTRAFFIC.LOCALE_PATHS[DEFAULT_LOCALE]
}
