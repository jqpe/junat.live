import type { StationPassengerInfoFragment } from '@junat/graphql/digitraffic'

import { format, isAfter, isBefore, isWithinInterval, parse } from 'date-fns'

import { DEFAULT_TRAINS_COUNT, TRAINS_MULTIPLIER } from '@junat/core/constants'
import { DayOfWeek } from '@junat/graphql/digitraffic'

/**
 * The fetch button should only be visible if there are trains to be fetched or when trains are being fetched.
 * The button will be always visible when `isLoading = true` and there are trains.
 *
 * 1. If there are no trains the button must be hidden.
 * 2. If there are initial trains ({@link DEFAULT_TRAINS_COUNT|view default}) show the button.
 * 3. If there is more trains than {@link DEFAULT_TRAINS_COUNT|default} and the modulo of {@link TRAINS_MULTIPLIER} compared to the length of trains is zero, show the button.
 *
 * Trains are counted as follows:
 *
 * - *0*. default (e.g. 20)
 * - *1*. multiplier * index (e.g. multiplier = 100 => 100)
 * - *2*. when multiplier = 100 => 200
 *
 * If the API responds with 191 trains in the above case, displaying the button is redundant and is hidden when index = 2.
 *
 * The case: `191 % 100 != 0`
 *
 * Additionally, `fetchCount` parameter may be used to deal with an edge case where new trains were fetched but the returned amount of trains is {@link DEFAULT_TRAINS_COUNT}.
 */
export function showFetchButton(
  trains: number,
  isLoading = false,
  fetchCount = 0,
) {
  if (trains === 0) {
    return false
  }

  if (isLoading) {
    return true
  }

  const isPrimaryState = trains === DEFAULT_TRAINS_COUNT && fetchCount === 0
  const hasMoreTrains = trains % TRAINS_MULTIPLIER === 0

  return isPrimaryState || hasMoreTrains
}

const hasMessage = (
  message: StationPassengerInfoFragment,
  locale: 'fi' | 'en' | 'sv',
): boolean => {
  return Boolean(message?.video?.text[locale])
}

type Rules = (StationPassengerInfoFragment['video'] & {})['deliveryRules']

const isContinuousVisualizationValid = (rules: Rules): boolean => {
  const now = new Date()

  if (rules.startDateTime) {
    const startTime = rules.startTime
      ? parse(rules.startTime, 'HH:mm:ss', new Date(rules.startDateTime))
      : new Date(rules.startDateTime)

    if (isBefore(now, startTime)) {
      return false
    }
  }

  if (rules.endDateTime) {
    const endTime = rules.endTime
      ? parse(rules.endTime, 'HH:mm:ss', new Date(rules.endDateTime))
      : new Date(rules.endDateTime)

    if (isAfter(now, endTime)) {
      return false
    }
  }

  return true
}

const isWithinTimeInterval = (
  now: Date,
  startTime: Date,
  endTime: Date,
): boolean => {
  return isWithinInterval(now, { start: startTime, end: endTime })
}

const isWhenDeliveryValid = (rules: Rules): boolean => {
  const now = new Date()
  const currentDay = format(now, 'EEEE').toUpperCase() as DayOfWeek

  if (rules.weekDays && !rules.weekDays.includes(currentDay)) {
    return false
  }

  if (rules.startDateTime && rules.endDateTime) {
    const startTime = rules.startTime
      ? parse(rules.startTime, 'HH:mm:ss', new Date(rules.startDateTime))
      : new Date(rules.startDateTime)

    const endTime = rules.endTime
      ? parse(rules.endTime, 'HH:mm:ss', new Date(rules.endDateTime))
      : new Date(rules.endDateTime)

    return isWithinTimeInterval(now, startTime, endTime)
  }

  return true
}

export const shouldDisplayPassengerInfoMessage = (
  message: StationPassengerInfoFragment,
  locale: 'fi' | 'en' | 'sv',
): boolean => {
  if (!hasMessage(message, locale)) {
    return false
  }

  const rules = message.video?.deliveryRules

  switch (rules?.deliveryType) {
    case 'CONTINUOS_VISUALIZATION': {
      return isContinuousVisualizationValid(rules)
    }
    case 'WHEN':
      return isWhenDeliveryValid(rules)
  }

  return false
}
