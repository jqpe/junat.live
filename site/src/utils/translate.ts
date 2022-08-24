import type { Locale } from '@typings/common'
import constants from '../constants'

type Base = typeof import('../locales/en.json')
type Rcrd = Record<string, unknown>

/**
 * @returns a function that can be used to get translated values for `locale`
 */
const translate = (locale: Locale | 'all') => {
  /**
   * By convention all values requiring interpolation are prefixed with $,
   * see `locales/en.json` for whats interpolated and `utils/interpolate_string` to see how to interpolate.
   */
  return <
    Key extends keyof Base,
    D1 extends Base[Key] extends Rcrd ? keyof Base[Key] : never,
    D2 extends Base[Key][D1] extends Rcrd
      ? Base[Key][D1] extends Rcrd
        ? keyof Base[Key][D1]
        : never
      : never
  >(
    key: Key,
    depth1?: D1,
    depth2?: D2
  ) => {
    const getLocale = (localeName: string = locale) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
      const json = require(`../locales/${localeName}.json`)

      if (depth2) {
        return json[key][depth1][depth2]
      }

      return depth1 ? json[key][depth1] : json[key]
    }

    if (locale === 'all') {
      const locales = constants.LOCALES

      if (!locales) {
        throw new TypeError('Expected locales to be defined')
      }

      return Object.fromEntries(
        locales.map(siteLocale => [siteLocale, getLocale(siteLocale)])
      )
    }

    return getLocale()
  }
}

export default translate
