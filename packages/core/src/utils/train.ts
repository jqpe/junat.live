import type { Train } from '@junat/digitraffic/types'

export const toCurrentRows = <
  T extends {
    timeTableRows: {
      stationShortCode: string
      scheduledTime: string
      type: string
    }[]
  },
>(
  stationShortCode: string,
  trains: readonly T[],
  type: 'DEPARTURE' | 'ARRIVAL',
) => {
  return trains.map(train => {
    const currentRow = getFutureTimetableRow(
      stationShortCode,
      train.timeTableRows,
      type,
    )

    return Object.assign(train, { timetableRows: [currentRow] })
  })
}

/**
 * Sorts trains by their expected arrival or departure time.
 */
export const sortTrains = <
  T extends {
    timeTableRows: Readonly<
      Pick<
        Train['timeTableRows'][number],
        'scheduledTime' | 'liveEstimateTime' | 'stationShortCode' | 'type'
      >[]
    >
  },
>(
  trains: Readonly<T[]>,
  stationShortCode: string,
  type: 'DEPARTURE' | 'ARRIVAL',
) => {
  const byRelativeDate = (a: T, b: T) => {
    const aRow = getFutureTimetableRow(stationShortCode, a.timeTableRows, type)
    const bRow = getFutureTimetableRow(stationShortCode, b.timeTableRows, type)

    if (!(aRow && bRow)) {
      console.error('Reached unreachable code (utils@sortTrains)')
      return 0
    }

    const aDate = Date.parse(aRow.liveEstimateTime || aRow.scheduledTime)
    const bDate = Date.parse(bRow.liveEstimateTime || bRow.scheduledTime)

    return aDate - bDate
  }

  return trains
    .filter(t => getFutureTimetableRow(stationShortCode, t.timeTableRows, type))
    .toSorted(byRelativeDate)
}

/**
 * Some trains might depart multiple times from a station. This function gets the timetable row that is closest to departing.
 */
export const getFutureTimetableRow = <
  T extends {
    stationShortCode: string
    scheduledTime: string
    type: string
  },
>(
  stationShortCode: string,
  timetableRows: readonly T[],
  type: 'DEPARTURE' | 'ARRIVAL',
): T | undefined => {
  const stationTimetableRows = timetableRows.filter(
    tr => tr.stationShortCode === stationShortCode && tr.type === type,
  )

  if (stationTimetableRows.length === 0) {
    return
  }

  const row =
    stationTimetableRows.find(
      ({ scheduledTime }) => Date.parse(scheduledTime) > Date.now(),
    ) || stationTimetableRows.at(-1)

  const cancelledAndInPast =
    row &&
    Date.parse(row.scheduledTime) < Date.now() &&
    'commercialTrack' in row &&
    row.commercialTrack === ''

  return cancelledAndInPast ? undefined : row
}

/**
 * From a list of trains return only those whose current time is greater than current date.
 */
export const trainsInFuture = <
  T extends {
    departureDate: string
    timeTableRows: {
      scheduledTime: string
      stationShortCode: string
      type: 'ARRIVAL' | 'DEPARTURE'
    }[]
  },
>(
  newTrains: T[],
  stationShortCode: string,
  type: 'ARRIVAL' | 'DEPARTURE',
) => {
  return newTrains.filter(train => {
    const timetableRow = getFutureTimetableRow(
      stationShortCode,
      train.timeTableRows,
      type,
    )

    if (!timetableRow) {
      return false
    }

    return Date.parse(timetableRow.scheduledTime) > Date.now()
  })
}

export const getNewTrains = <
  T extends {
    timeTableRows: {
      stationShortCode: string
      type: 'DEPARTURE' | 'ARRIVAL'
      scheduledTime: string
    }[]
    trainNumber: number
  },
>(
  trains: T[],
  updatedTrain: T,
  stationShortCode: string,
  type: 'ARRIVAL' | 'DEPARTURE',
) => {
  return trains.map(train => {
    const updated = getFutureTimetableRow(
      stationShortCode,
      updatedTrain.timeTableRows,
      type,
    )
    const original = getFutureTimetableRow(
      stationShortCode,
      train.timeTableRows,
      type,
    )

    const sameTrainNumber = train.trainNumber === updatedTrain.trainNumber

    const sameScheduledTime = original?.scheduledTime === updated?.scheduledTime

    if (sameTrainNumber && sameScheduledTime) {
      return { ...train, ...updatedTrain }
    }

    return train
  })
}

/**
 * Returns the last timetable row or if `from` unequals to LEN (Helsinki Airport) might return the next timetable row with `LEN` station shortcode.
 *
 * This is done so that stations inside Ring Rail Line have expected destinations.
 */
export const getDestinationTimetableRow = <
  T extends {
    commuterLineID?: string
    timeTableRows: Readonly<
      Array<{
        stationShortCode: string
        type: 'DEPARTURE' | 'ARRIVAL'
      }>
    >
  },
>(
  train: T,
  from?: string,
): T['timeTableRows'][number] => {
  if (
    from &&
    from !== 'LEN' &&
    train.commuterLineID &&
    ['P', 'I'].includes(train.commuterLineID)
  ) {
    const airport = train.timeTableRows.find(
      ({ stationShortCode, type }) =>
        stationShortCode === 'LEN' && type === 'ARRIVAL',
    )
    if (airport) {
      return airport
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return train.timeTableRows.at(-1)!
}
