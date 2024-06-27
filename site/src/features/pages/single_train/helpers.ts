import type { Locale } from '~/types/common'
import type { Code } from '~/utils/train'
import type { translate } from '~/utils/translate'

import { getCalendarDate } from '~/utils/date'
import { getTrainType } from '~/utils/train'

export const getLocalizedDate = (
  date: string | undefined,
  today: string,
  locale: Locale,
) => {
  if (date === 'latest') {
    return today
  }

  const intl = Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
  const parsedDate = new Date(
    Date.parse(`${date === undefined ? new Date() : date}`),
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

/**
 * Gets a new train path for `newDepartureDate`. The departure must have changed for this function to return anything.
 */
export const getNewTrainPath = (opts: {
  path: string
  oldDepartureDate: string
  newDepartureDate: string
  trainNumber: string | number
}) => {
  const { oldDepartureDate, trainNumber, path } = opts
  let newDate = opts.newDepartureDate

  const today = getCalendarDate(new Date().toISOString())
  const currentDate = oldDepartureDate === 'latest' ? today : oldDepartureDate

  // Selected current date — do nothing
  if (newDate === currentDate) {
    return
  }

  // Get the localized train part /<localizedTrain>/<departureDate?>/<trainNumber>
  const segment = path.split('/')[1]
  // Restore default /<localizedTrain>/<trainNumber> if departureDate is today
  if (newDate === today) {
    newDate = ''
  }

  return '/' + [segment, newDate, trainNumber].filter(Boolean).join('/')
}

export const handleShare = async (event: React.MouseEvent, data: ShareData) => {
  // Some user agents like to draw stuff on the screen — don't close.
  event.preventDefault()

  return await navigator
    .share(data)
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#exceptions
    .catch(error => {
      // InvalidStateError is triggered when another share is in progress.
      // AbortError is triggered by the user canceling the share.
      if ('name' in error && /AbortError|InvalidStateError/.test(error.name)) {
        return
      }

      throw error
    })
}

export const getTrainTitle = <
  T extends { trainType: string; trainNumber: number | string },
>(
  train: T | undefined,
  locale: Locale,
  t: ReturnType<typeof translate>,
) => {
  const isCommuter = train && 'commuterLineID' in train && train.commuterLineID

  const trainType = train && getTrainType(train.trainType as Code, locale)
  const commuterTrain = isCommuter
    ? `${train.commuterLineID}-${t('train').toLowerCase()} ${train.trainNumber}`
    : undefined

  const typeNumber = trainType ? `${trainType} ${train.trainNumber}` : undefined

  return { trainType, trainTitle: commuterTrain || typeNumber }
}
