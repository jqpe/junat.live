import type { Locale } from '~/types/common'

import { getCalendarDate } from '~/utils/date'

export const getFormattedDate = (
  date: string | undefined,
  today: string,
  locale: Locale
) => {
  if (date === 'latest') {
    return today
  }

  const intl = Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
  const parsedDate = new Date(
    Date.parse(`${date === undefined ? new Date() : date}`)
  )

  if (getCalendarDate(`${parsedDate}`) === getCalendarDate(`${new Date()}`)) {
    return today
  }

  return intl.format(parsedDate)
}
