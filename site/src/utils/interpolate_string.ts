/* eslint-disable @typescript-eslint/no-explicit-any */

import { IntlMessageFormat } from 'intl-messageformat'

import { LOCALES } from '@junat/core/constants'

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
