import type { GetTranslatedValue } from '@junat/core/i18n'
import type { Train } from '@junat/digitraffic/types'

import { getCalendarDate, getFormattedTime } from '../utils/date.js'

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
      liveEstimateTime?: string
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

    return (
      Date.parse(timetableRow.liveEstimateTime ?? timetableRow.scheduledTime) >
      Date.now()
    )
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

  return train.timeTableRows.at(-1)!
}

export type Codes = [
  'AE',
  'HDM',
  'HL',
  'HLV',
  'HSM',
  'HV',
  'IC',
  'LIV',
  'MUS',
  'MUV',
  'MV',
  'P',
  'PAI',
  'PVV',
  'PYO',
  'S',
  'SAA',
  'T',
  'TYO',
  'VET',
  'VEV',
  'VLI',
  'V',
]

export type Code = Codes[number]

type TrainType = (typeof import('@junat/i18n/en.json'))['trainTypes']

type TranslationsRecord = {
  train: string
  trainTypes: TrainType
}

export const getTrainType = (code: Code, i18n: TranslationsRecord): string => {
  const t = <T extends keyof TrainType>(key: T) => i18n.trainTypes[key]

  const codes: Record<Code, string> = {
    AE: 'Allegro',
    IC: 'InterCity',
    PVV: 'Tolstoi',
    S: 'Pendolino',
    MUV: i18n.train,
    HL: t('commuterTrain'),
    HLV: t('commuterTrain'),
    HDM: t('regionalTrain'),
    HSM: t('regionalTrain'),
    HV: t('multipleUnit'),
    MV: t('multipleUnit'),
    V: t('locomotive'),
    VET: t('locomotive'),
    VEV: t('locomotive'),
    LIV: t('trackInspectionTrolley'),
    MUS: t('museumTrain'),
    P: t('expressTrain'),
    PAI: t('onCallTrain'),
    PYO: t('nightExpressTrain'),
    SAA: t('convoyTrain'),
    T: t('cargoTrain'),
    TYO: t('workTrain'),
    VLI: t('additionalLocomotive'),
  }

  return codes[code] || i18n.train
}

export const getTrainHref = (
  t: GetTranslatedValue,
  date: string,
  trainNumber: number,
) => {
  const departureDate = getCalendarDate(date)
  const today = getCalendarDate(new Date().toString())

  if (departureDate === today) {
    return `/${t('routes.train')}/${trainNumber}`
  }

  return `/${t('routes.train')}/${departureDate}/${trainNumber}`
}

export const hasLongTrainType = (train: {
  commuterLineID?: string
  trainType: string
  trainNumber: number
}): boolean => {
  const combined = `${train.trainType}${train.trainNumber}`

  return !train.commuterLineID && combined.length > 5
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

/**
 * @returns A predicate that can be used in e.g. `Array.prototype.filter`
 */
export const singleTimetableFilter = <
  T extends { commercialStop?: boolean | null; type?: 'DEPARTURE' | 'ARRIVAL' },
>(
  type: 'DEPARTURE' | 'ARRIVAL',
  rows: T[] | readonly T[],
) => {
  return function predicate(row: T, index: number): boolean {
    return Boolean(
      (row.type === type || index === rows.length - 1) && row.commercialStop,
    )
  }
}
