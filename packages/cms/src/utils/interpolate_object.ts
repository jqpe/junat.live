import { interpolateString } from './interpolate_string'

export const interpolateObject = <T extends Record<string, unknown>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: T,
  obj: Record<string, unknown>
) => {
  const result = base
  const keysToInterpolate = Object.keys(base).filter(key => {
    const value = base[key]
    if (typeof value === 'string') {
      return /{{\s?\w+\s?}}/.test(value)
    }
    return false
  })

  for (const key of keysToInterpolate) {
    const value = base[key]

    if (typeof value === 'string') {
      ;(result[key] as string) = interpolateString(value, obj)
    }
  }

  return result
}
