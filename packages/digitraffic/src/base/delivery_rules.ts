import type {
  AudioDeliveryRules,
  PassengerInformationMessage,
  VideoDeliveryRules,
  WeekDay,
} from '../types/passenger_information'

import {
  differenceInMilliseconds,
  format,
  isWithinInterval,
  parse,
  parseISO,
} from 'date-fns'

export const shouldShowInformationMessage = (
  message: PassengerInformationMessage,
  onlyShowStationMessages = true,
) => {
  const validInFuture = Date.parse(message.startValidity) > Date.now(),
    validInPast = Date.parse(message.endValidity) < Date.now()

  if (validInFuture || validInPast) {
    return false
  }

  return !(onlyShowStationMessages && message.trainNumber)
}

const MINUTE = 60 * 1000

const checkNowDelivery = (
  createdAt: string | undefined,
  now: Date,
): boolean => {
  if (!createdAt) return false
  return differenceInMilliseconds(now, parseISO(createdAt)) > 10 * MINUTE
}

const checkDateInterval = (
  now: Date,
  startDateTime: Date,
  endDateTime: Date,
): boolean => {
  // Convert to date as date interval should not consider time
  const startDate = new Date(format(startDateTime, 'yyyy-MM-dd'))
  const endDate = new Date(format(endDateTime, 'yyyy-MM-dd'))
  const todayDate = new Date(format(now, 'yyyy-MM-dd'))

  return isWithinInterval(todayDate, { start: startDate, end: endDate })
}

const checkDateRange = (
  now: Date,
  startDateTime: Date,
  endDateTime: Date,
): boolean => {
  const startDate = new Date(format(startDateTime, 'yyyy-MM-dd'))
  const endDate = new Date(format(endDateTime, 'yyyy-MM-dd'))
  const todayDate = new Date(format(now, 'yyyy-MM-dd'))
  return !(todayDate < startDate || todayDate > endDate)
}

const checkWeekDays = (now: Date, weekDays?: WeekDay[]): boolean => {
  if (!weekDays?.length) return true
  const today = format(now, 'EEEE').toUpperCase() as WeekDay
  return weekDays.includes(today)
}

const checkTimeRange = (
  now: Date,
  startTime?: string,
  endTime?: string,
): boolean => {
  if (!startTime || !endTime) return true
  const currentTime = parse(format(now, 'HH:mm'), 'HH:mm', new Date())
  const start = parse(startTime, 'HH:mm', new Date())
  const end = parse(endTime, 'HH:mm', new Date())
  return isWithinInterval(currentTime, { start, end })
}

export const satisfiesDeliveryRules = (
  rules: VideoDeliveryRules | AudioDeliveryRules,
  createdAt?: string,
) => {
  if (!rules.startDateTime || !rules.endDateTime) return false

  const now = new Date()
  const startDateTime = parseISO(rules.startDateTime)
  const endDateTime = parseISO(rules.endDateTime)
  const hasTimeRange = Boolean(rules.startTime && rules.endTime)

  if (rules.deliveryType === 'NOW') {
    return checkNowDelivery(createdAt, now)
  }

  if (!hasTimeRange && !checkDateInterval(now, startDateTime, endDateTime)) {
    return false
  }

  if (hasTimeRange && !checkDateRange(now, startDateTime, endDateTime)) {
    return false
  }

  if (!checkWeekDays(now, rules.weekDays)) {
    return false
  }

  return checkTimeRange(now, rules.startTime, rules.endTime)
}
