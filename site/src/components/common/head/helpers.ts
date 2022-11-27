import type { Locale } from '~/types/common'

import { SITE_FULL_URL } from '~/constants'

/**
 * Prefixes a path with {@link SITE_FULL_URL} and optionally `locale`
 *
 * @returns
 * - A full url with `path` prefixed with `locale` if given as an argument
 * - A full url with `path` with word(s) replaced according to `replace` if `currentLocale` and `locale` are also defined
 */
export const fullUrl = (
  path: string,
  {
    locale,
    currentLocale,
    replace
  }: {
    /**
     * Will be used to prefix path
     */
    locale?: Locale
    /**
     * Locale present in `path` if `path` is a localized string. Only needed with `replace`
     */
    currentLocale?: Locale
    /**
     * If `currentLocale` and `locale` are defined, replace words defined in `replace` if they are found in `path`
     *
     * `path` is expected to be a localized string with `currentLocale` the locale it's written in.
     *
     * @example
     * ```ts
     * fullUrl("/x", { currentLocale: "fi", locale: "en", replace: {fi: {}, en: {x: "y"}, sv: {}}})
     * // -> <url>/en/y
     * ```
     */
    replace?: Record<Locale, Record<string, string>>
  } = {}
) => {
  let maybeLocalePrefixedPath = [locale, path].join(
    locale && !path.startsWith('/') ? '/' : ''
  )

  if (replace && currentLocale && locale) {
    const elements: Record<string, string> = replace[locale]

    for (const key of Object.keys(elements)) {
      maybeLocalePrefixedPath = maybeLocalePrefixedPath.replace(
        replace[currentLocale][key],
        elements[key]
      )
    }
  }

  return new URL(maybeLocalePrefixedPath, SITE_FULL_URL).toString()
}
