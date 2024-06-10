import { FINTRAFFIC } from '~/constants'

type Path = keyof typeof FINTRAFFIC.LOCALE_PATHS

/**
 * For {@link FINTRAFFIC.LOCALE_PATHS|supported locales} return it, otherwise default to English.
 */
export const getFintrafficPath = (locale?: Path): Path => {
  if (locale && locale in FINTRAFFIC.LOCALE_PATHS) {
    return FINTRAFFIC.LOCALE_PATHS[locale]
  }

  return FINTRAFFIC.LOCALE_PATHS['en']
}
