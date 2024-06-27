import type { Locale } from '~/types/common'

import { LOCALES } from '@junat/core/constants'

type Base = typeof import('../../../packages/i18n/src/en.json')

type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${DeepKeyOf<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

type DeepValueOf<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? DeepValueOf<T[K], Rest>
      : never
    : never

export function translate(
  locale: 'all',
): <P extends DeepKeyOf<Base>>(path: P) => Record<Locale, DeepValueOf<Base, P>>

export function translate<T extends Locale>(
  locale: T,
): <P extends DeepKeyOf<Base>>(path: P) => DeepValueOf<Base, P>

export function translate(locale: Locale | 'all') {
  return function getTranslatedValue<P extends DeepKeyOf<Base>>(path: P) {
    const getLocale = (
      localeName: Omit<Locale, 'all'> = locale,
    ): DeepValueOf<Base, P> => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
      const json = require(`@junat/i18n/${localeName}.json`)
      return path.split('.').reduce((obj, key) => obj[key], json)
    }

    if (locale === 'all') {
      const locales = LOCALES.map(l => [l, getLocale(l)])

      return Object.fromEntries(locales) as Record<Locale, DeepValueOf<Base, P>>
    }

    return getLocale()
  }
}
