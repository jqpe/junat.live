/**
 * For supported locales, Finnish and Swedish, return corresponding segment, otherwise default to English.
 */
export const getFintrafficUriSegment = (
  locale?: string
): 'fi' | 'en' | 'sv' => {
  if (!locale || (locale !== 'fi' && locale !== 'sv')) {
    return 'en'
  }

  return locale
}
