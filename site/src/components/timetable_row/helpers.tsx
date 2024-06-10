import type { Locale } from '@typings/common'

import { getCalendarDate, getFormattedTime } from '~/utils/date'

import { ROUTES } from '~/constants/locales'

export const getTrainHref = (
  locale: Locale,
  date: string,
  trainNumber: number
) => {
  const departureDate = new Date(Date.parse(date))
  const now = new Date()

  // The Digitraffic service returns trains 24 hours into the future and thus there's no risk of
  // mistakingly using 'latest' for a train a week from now.
  if (departureDate.getDay() === now.getDay()) {
    return `/${ROUTES[locale].train}/${trainNumber}`
  }

  return `/${ROUTES[locale].train}/${getCalendarDate(date)}/${trainNumber}`
}

export const hasLongTrainType = (train: {
  commuterLineID?: string
  trainType: string
  trainNumber: number
}): boolean => {
  return (
    !train.commuterLineID && `${train.trainType}${train.trainNumber}`.length > 5
  )
}

export const hasLiveEstimateTime = (train: {
  liveEstimateTime?: string
  scheduledTime: string
}): boolean => {
  if (!train.liveEstimateTime) {
    return false
  }

  return (
    getFormattedTime(train.liveEstimateTime) !==
    getFormattedTime(train.scheduledTime)
  )
}
