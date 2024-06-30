/* c8 ignore start – module has only type exports */

import { LOCALES } from '#constants.js'

export type TranslationBase = typeof import('@junat/i18n/en.json')

type Locale = (typeof LOCALES)[number]

export type TranslationDeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${TranslationDeepKeyOf<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

export type TranslationDeepValueOf<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? TranslationDeepValueOf<T[K], Rest>
      : never
    : never

export type GetTranslatedValue = <
  P extends TranslationDeepKeyOf<TranslationBase>,
>(
  path: P,
) => TranslationDeepValueOf<TranslationBase, P>

export type GetTranslatedStruct = <
  P extends TranslationDeepKeyOf<TranslationBase>,
>(
  path: P,
) => Record<Locale, TranslationDeepValueOf<TranslationBase, P>>

export type TranslateFn = <T extends Locale | 'all'>(
  locale: T,
) => T extends 'all' ? GetTranslatedStruct : GetTranslatedValue

// Can't export translate directly as tools like Webpack can't resolve the inlined requires
// Instead create an additional wrapper that takes require as a parameter
export const createSyncTranslator = (require: NodeRequire) => {
  const translate: TranslateFn = locale => {
    return function getTranslatedValue(path) {
      const getLocale = (localeName: Omit<Locale, 'all'> = locale) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const json = require(`@junat/i18n/${localeName}.json`)
        return path.split('.').reduce((obj, key) => obj[key], json)
      }

      if (locale === 'all') {
        const locales = LOCALES.map(l => [l, getLocale(l)])

        return Object.fromEntries(locales)
      }

      return getLocale()
    }
  }

  return translate
}
