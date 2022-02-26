// TODO: implement error if a string contains a key, but the key is not present in `obj`

/**
 * Replaces `{{ key }}` in a string with a matching key in `obj`
 *
 * @example
 * ```js
 * const interpolatedString = interpolateString('{{ x }} met {{y}}.', {
 *  x: 0,
 *  y: 1
 * })
 * console.assert(interpolatedString === '0 met 1.')
 * ```
 */
export const interpolateString = (
  string: string,
  obj: Record<string, any>
): string => {
  if (typeof string !== 'string') {
    throw new TypeError(
      'Parameter string must be defined and be a string. If you want to use a stringified value, convert it before passing it as an argument.'
    )
  }

  let result = string

  if (!obj) {
    return result
  }

  for (const key of Object.keys(obj)) {
    const keyRegExp = new RegExp(`{{\\s?${key}\\s?}}`, 'g')
    const hasKeyInString = keyRegExp.test(string)

    if (hasKeyInString) {
      result = result.replaceAll(keyRegExp, obj[key] ?? '')
    }
  }

  return result
}
