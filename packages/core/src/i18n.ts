/* c8 ignore start – module has only type exports */

import { LOCALES } from './constants.js'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IntlMessageFormat } from 'intl-messageformat'

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

/**
 * Replaces `{ key }` in a string with a matching key in `obj`
 *
 * @example
 * ```js
 * const interpolatedString = interpolateString('{ x } met {y}.', {
 *  x: 0,
 *  y: 1
 * })
 * console.assert(interpolatedString === '0 met 1.')
 * ```
 */
export const interpolateString = <
  T extends { toString: (...args: any) => string } | undefined | null,
>(
  string: string,
  obj: Record<string, T>,
): string => {
  const result = new IntlMessageFormat(string, [...LOCALES])
    .format(obj)
    ?.toString()

  if (!result) {
    throw new TypeError(
      `Interpolating ${string} with ${JSON.stringify(obj)} is not possible!`,
    )
  }

  return result
}
