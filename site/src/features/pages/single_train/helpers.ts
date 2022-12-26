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

/**
 * Returns a boolean indicating whether `date` is in the past.
 *
 * @param date Any date that can be parsed with `Date.parse` or `"latest"`
 */
export const isDateFormer = (date: string) => {
  if (date === 'latest') {
    return false
  }

  try {
    return Date.parse(date) < Date.now()
  } catch (error) {
    console.error('Could not parse time:', error)
    return false
  }
}

export const whenDateIsFormer = <T, K>(
  date: string,

  {
    returns,
    otherwiseIfDefined
  }: {
    returns: T
    otherwiseIfDefined: K
  }
) => {
  if (isDateFormer(date)) {
    return returns
  }

  return otherwiseIfDefined ?? returns
}
