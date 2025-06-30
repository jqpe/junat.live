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

export const satisfiesDeliveryRules = (
  rules: VideoDeliveryRules | AudioDeliveryRules,
  createdAt?: string,
) => {
  if (!rules.startDateTime || !rules.endDateTime) return false

  const now = new Date()
  const startDateTime = parseISO(rules.startDateTime)
  const endDateTime = parseISO(rules.endDateTime)
  const hasTimeRange = Boolean(rules.startTime && rules.endTime)

  if (rules.deliveryType === 'NOW' && createdAt) {
    return differenceInMilliseconds(now, parseISO(createdAt)) > 10 * MINUTE
  }

  if (
    !hasTimeRange &&
    !isWithinInterval(now, { start: startDateTime, end: endDateTime })
  ) {
    return false
  }

  if (hasTimeRange) {
    const startDate = new Date(format(startDateTime, 'yyyy-MM-dd'))
    const endDate = new Date(format(endDateTime, 'yyyy-MM-dd'))
    const todayDate = new Date(format(now, 'yyyy-MM-dd'))

    if (todayDate < startDate || todayDate > endDate) return false
  }

  if (rules.weekDays?.length) {
    const today = format(now, 'EEEE').toUpperCase() as WeekDay
    if (!rules.weekDays.includes(today)) return false
  }

  if (hasTimeRange && rules.startTime && rules.endTime) {
    const currentTime = parse(format(now, 'HH:mm'), 'HH:mm', new Date())
    const startTime = parse(rules.startTime, 'HH:mm', new Date())
    const endTime = parse(rules.endTime, 'HH:mm', new Date())

    if (!isWithinInterval(currentTime, { start: startTime, end: endTime })) {
      return false
    }
  }
  return true
}
