/**
 * Formats a date into format `hh:mm` for use in timetable rows.
 * @param {string} dateString
 * A valid date that can be parsed with `Date.parse()`
 * @see https://mdn.io/date_parse
 */
export const formatTrainTime = (dateString: string) =>
  Intl.DateTimeFormat('fi', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(Date.parse(dateString))
