const prefix = (n: string) => (n.length === 1 ? `0${n}` : n)

/**
 * Get calendar date in extended format as specified in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates)
 */
export const getCalendarDate = (date: string) => {
  return new Intl.DateTimeFormat('fi')
    .format(Date.parse(date))
    .split(/\./g)
    .reverse()
    .map(part => prefix(part))
    .join('-')
}

/**
 * Formats a date into format `hh.mm` (hours.minutes).
 * @param {string} dateString
 * A valid date that can be parsed with `Date.parse()`
 * @see https://mdn.io/date_parse
 */
export const getFormattedTime = (dateString: string) => {
  const intl = Intl.DateTimeFormat('fi', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return intl.format(Date.parse(dateString))
}
