import { camelCase } from './camel_case'

export const camelCaseKeys = <T extends Record<string, unknown>>(obj: T) => {
  const primitive = !(obj instanceof Object)
  if (primitive || typeof obj !== 'object' || obj === null) {
    throw new TypeError(
      `Parameter obj should be an object, received ${typeof obj}`
    )
  }

  const [keys, newObject]: [
    keys: string[],
    newObject: Record<string, unknown>
  ] = [Object.keys(obj), {}]
  for (const key of keys) {
    newObject[camelCase(key)] = obj[key]
  }

  return newObject as unknown as T
}
