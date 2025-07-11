import type { GetTranslatedValue } from '@junat/core/i18n'
import type { Code } from '@junat/core/utils/train'
import type { SingleTrainFragment } from '@junat/graphql/digitraffic'

import { getCalendarDate } from '@junat/core/utils/date'
import { getTrainType } from '@junat/core/utils/train'

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

type GetTrainTitleType = Pick<SingleTrainFragment, 'trainType' | 'trainNumber'>

export const getTrainTitle = <T extends GetTrainTitleType>(
  train: Readonly<T> | undefined,
  t: GetTranslatedValue,
) => {
  const isCommuter = train && 'commuterLineID' in train && train.commuterLineID

  const trainType =
    train &&
    getTrainType(train.trainType.name as Code, {
      train: t('train'),
      trainTypes: t('trainTypes'),
    })
  const commuterTrain = isCommuter
    ? `${train.commuterLineID}-${t('train').toLowerCase()} ${train.trainNumber}`
    : undefined

  const typeNumber = trainType ? `${trainType} ${train.trainNumber}` : undefined

  return { trainType, trainTitle: commuterTrain || typeNumber }
}
