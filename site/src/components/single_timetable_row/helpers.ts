import type { Locale } from '~/types/common'

/**
 * Whether a train is late and has a estimated time of arrival / departure
 *
 * If the train is late less than a minute it's considered to be on time
 */
export const hasLiveEstimate = (timetableRow: {
  liveEstimateTime?: string
  scheduledTime: string
}): boolean => {
  if (!timetableRow.liveEstimateTime) {
    return false
  }

  const [scheduledDate, liveEstimateDate] = [
    timetableRow.scheduledTime,
    timetableRow.liveEstimateTime
  ].map(isoString => {
    const date = new Date(Date.parse(isoString))

    return `${date.getHours()}:${date.getMinutes()}`
  })

  return scheduledDate !== liveEstimateDate
}

/**
 * If the train's live estimate time or scheduled time is in the past, the train is considered departed.
 */
export const hasDeparted = (timetableRow: {
  liveEstimateTime?: string
  scheduledTime: string
}) => {
  const now = new Date()

  return (
    +Date.parse(timetableRow.liveEstimateTime ?? timetableRow.scheduledTime) <=
    +now
  )
}

export const getLocalizedStationName = (
  locale: Locale,
  stations: {
    stationShortCode: string
    stationName: { [K in Locale]: string }
  }[],
  timetableRow: {
    stationShortCode: string
  }
) => {
  return stations.find(
    station => station.stationShortCode === timetableRow.stationShortCode
  )?.stationName[locale]
}
