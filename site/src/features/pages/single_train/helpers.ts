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

/**
 * Workaround to not focus date input which triggers a modal dialog on some user agents, but keep the focus context inside dialog.
 */
export const handleAutoFocus = (event: Event) => {
  type EventTargetWithFocus = EventTarget & { focus: () => unknown }

  // don't focus the date input as this causes user agent date picker dialog to open
  event.preventDefault()
  // ...but keep the dialog focused so the focus doesn't "bleed"
  if (
    event.target &&
    'focus' in event.target &&
    typeof (event.target as EventTargetWithFocus).focus === 'function'
  ) {
    ;(event.target as EventTargetWithFocus).focus()
  }
}
