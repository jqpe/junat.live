import type { GetTranslatedValue } from '@junat/core/i18n'
import type { TimetableRow, Train } from '@junat/digitraffic/types'
import type {
  LiveTrainFragment,
  RowFragment,
  SingleTrainFragment,
} from '@junat/graphql/digitraffic'

import { TimeTableRowType } from '@junat/graphql/digitraffic'

import { getCalendarDate, getFormattedTime } from '../utils/date.js'

type Row = RowFragment

type TimedRowBase = 'station' | 'scheduledTime' | 'type'

export const toCurrentRows = <
  T extends {
    timeTableRows: Pick<Row, TimedRowBase>[]
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
    timeTableRows: Readonly<Pick<Row, TimedRowBase | 'liveEstimateTime'>[]>
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
export const getFutureTimetableRow = <T extends Pick<Row, TimedRowBase>>(
  stationShortCode: string,
  timetableRows: readonly T[],
  type: 'DEPARTURE' | 'ARRIVAL',
): T | undefined => {
  const stationTimetableRows = timetableRows.filter(
    tr => tr.station?.shortCode === stationShortCode && tr.type === type,
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
    timeTableRows: Pick<Row, TimedRowBase | 'liveEstimateTime'>[]
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
    timeTableRows: Pick<Row, TimedRowBase>[]
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

/** Returns destination timetable row with support for Ring Rail */
export const getDestinationTimetableRow = <
  T extends {
    commuterLineid: LiveTrainFragment['commuterLineid']
    timeTableRows: Readonly<Array<Pick<Row, 'station' | 'type'>>>
  },
>(
  train: T,
  stationShortCode?: string,
): T['timeTableRows'][number] => {
  const currentRowIndex = train.timeTableRows.findIndex(
    t =>
      t.station?.shortCode === stationShortCode &&
      t.type === TimeTableRowType.Departure,
  )
  const currentRow = train.timeTableRows[currentRowIndex]

  if (
    currentRow &&
    train.commuterLineid &&
    ['P', 'I'].includes(train.commuterLineid)
  ) {
    const airportIndex = train.timeTableRows.findIndex(
      ({ station, type }) => station?.shortCode === 'LEN' && type === 'ARRIVAL',
    )

    if (airportIndex > currentRowIndex) {
      return train.timeTableRows[airportIndex]!
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

export const hasLongTrainType = (
  train: Pick<
    LiveTrainFragment,
    'commuterLineid' | 'trainType' | 'trainNumber'
  >,
): boolean => {
  const combined = `${train.trainType.name}${train.trainNumber}`

  return !train.commuterLineid && combined.length > 5
}

export const hasLiveEstimateTime = <
  T extends Pick<Row, 'liveEstimateTime' | 'scheduledTime'>,
>(
  timetableRow: T,
): timetableRow is T & { liveEstimateTime: string } => {
  if (!timetableRow.liveEstimateTime) {
    return false
  }

  return (
    getFormattedTime(timetableRow.liveEstimateTime) !==
    getFormattedTime(timetableRow.scheduledTime)
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

/** @internal */
const convertRow = (row: TimetableRow): RowFragment => ({
  ...row,
  liveEstimateTime: row.liveEstimateTime || null,
  type: row.type as TimeTableRowType,
  commercialStop: row.commercialStop || null,
  commercialTrack: row.commercialTrack || null,
  station: {
    shortCode: row.stationShortCode,
  },
})

/** Convert train from an REST/MQTT response type to a GraphQL fragment */
export function convertTrain(train: Train): SingleTrainFragment
/** Convert train from an REST/MQTT response type to a GraphQL fragment*/
export function convertTrain(train: Train): LiveTrainFragment

export function convertTrain(train: Train) {
  return {
    ...train,
    commuterLineid: train.commuterLineID || null,
    version: train.version.toString(),
    trainType: {
      name: train.trainType,
    },
    timeTableRows: (train.timeTableRows || []).map(row => convertRow(row)),
  }
}
