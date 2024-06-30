/**
 * Get calendar date in extended format as specified in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates)
 */
export const getCalendarDate = (date: string) => {
  return new Date(date).toISOString().split('T')[0]!
}

/**
 * Formats a date into format `hh.mm` (hours.minutes).
 * @param {string} dateString
 * A valid date that can be parsed with `Date.parse()`
 * @see https://mdn.io/date_parse
 */
export const getFormattedTime = (dateString: string) => {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid time value ${dateString}`)
  }

  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')

  return `${hours}.${minutes}`
}
