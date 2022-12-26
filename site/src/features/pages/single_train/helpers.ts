import { DEFAULT_LOCALE } from '~/constants'

/**
 * Returns the calendar date according to locale.
 *
 * @param date {"latest" | string} Either latest or a date that can be parsed with `Date.parse`.
 * @param locale Locale to format the time with.
 */
export const getFormattedDate = (date: string, locale?: string | string[]) => {
  const dateTime = Intl.DateTimeFormat(locale || DEFAULT_LOCALE, {
    dateStyle: 'long'
  })

  if (date === 'latest') {
    return
  }

  try {
    return dateTime.format(new Date(Date.parse(date)))
  } catch (error) {
    console.error(error, date)
  }
}