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
