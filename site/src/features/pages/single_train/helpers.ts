import type { Locale } from '~/types/common'

import { getCalendarDate } from '~/utils/date'

export const getLocalizedDate = (
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
  interface EventTargetWithFocus extends EventTarget {
    focus: () => unknown
  }

  const target = event.target as EventTargetWithFocus | undefined

  // don't focus the date input as this causes user agent date picker dialog to open
  event.preventDefault()
  // ...but keep the dialog focused so the focus doesn't "bleed"
  if ('focus' in (target ?? {}) && typeof target?.focus === 'function') {
    target?.focus()
  }
}

export const getDepartureDate = (props: {
  userProvided: string | undefined
  default: unknown
}) => {
  if (props.userProvided) {
    if (!/(latest|\d{4}-\d{2}-\d{2})/.test(props.userProvided)) {
      throw new TypeError('Date is not valid ISO 8601 calendar date.')
    }

    return props.userProvided
  }

  if (props.default) {
    return String(props.default)
  }
}
