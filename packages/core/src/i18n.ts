/* c8 ignore start – module has only type exports */

import { LOCALES } from './constants.js'

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
