/**
 * Camel cases some common cases found in programmming, notably:
 * - camelCase
 * - PascalCase
 * - snake_case
 * - kebab-case
 * And a few others like title case.
 *
 * It **does not** support `UPPER_CASE_SNAKE_CASE`.
 */
export const camelCase = (string: string) => {
  const re = /[ _-]|(?=[A-Z])/g
  const parts = string.split(re)

  return parts
    .map((part, i) => {
      if (i === 0) {
        return part.toLowerCase()
      }
      return `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}`
    })
    .join('')
}
