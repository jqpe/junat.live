import type { Locale } from '@typings/common'

// Not polyfilled by Next.js
// See https://caniuse.com/mdn-javascript_builtins_array_at
import 'core-js/actual/array/at'

import translate from './translate'

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
  'V'
]

export type Code = Codes[number]

interface _Train {
  timeTableRows: {
    stationShortCode: string
    type: 'DEPARTURE' | 'ARRIVAL'
    liveEstimateTime?: string
    scheduledTime: string
    commercialTrack?: string
    cancelled: boolean
    commercialStop?: boolean
  }[]
  commuterLineID?: string
  trainNumber: number
  version: number
  trainType: string
  departureDate: string
}

export const getTrainType = (code: Code, locale: Locale): string => {
  type TrainKeys = keyof (typeof import('../locales/en.json'))['trainTypes']

  const tr = translate(locale)
  const t = (train: TrainKeys) => tr('trainTypes', train)

  const codes: Record<Code, string> = {
    AE: 'Allegro',
    IC: 'InterCity',
    PVV: 'Tolstoi',
    S: 'Pendolino',
    MUV: tr('train'),
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
    VLI: t('additionalLocomotive')
  }

  return codes[code] || tr('train')
}

/**
 * Some trains might depart multiple times from a station. This function gets the timetable row that is closest to departing.
 */
export const getFutureTimetableRow = <
  T extends { stationShortCode: string; scheduledTime: string; type: string }
>(
  stationShortCode: string,
  timetableRows: T[],
  type: 'DEPARTURE' | 'ARRIVAL' = 'DEPARTURE'
): T | undefined => {
  const stationTimetableRows = timetableRows.filter(
    tr => tr.stationShortCode === stationShortCode && tr.type === type
  )

  if (stationTimetableRows.length === 0) {
    return
  }

  return (
    stationTimetableRows.find(({ scheduledTime }) => {
      return +new Date(scheduledTime) - Date.now() > 0
    }) || stationTimetableRows.at(-1)
  )
}

/**
 * From a list of trains return only those whose current time is greater than current date.
 */
export const trainsInFuture = <T extends { departureDate: string }>(
  newTrains: T[]
) => {
  return newTrains.filter(train => {
    return Date.parse(train.departureDate) > Date.now()
  })
}

export const getNewTrains = <T extends _Train>(
  trains: T[],
  updatedTrain: T,
  stationShortCode: string,
  type: 'ARRIVAL' | 'DEPARTURE' = 'DEPARTURE'
) => {
  return trains.map(train => {
    const updated = getFutureTimetableRow(
      stationShortCode,
      updatedTrain.timeTableRows,
      type
    )
    const original = getFutureTimetableRow(
      stationShortCode,
      train.timeTableRows,
      type
    )

    const sameTrainNumber = train.trainNumber === updatedTrain.trainNumber

    const sameScheduledTime = original?.scheduledTime === updated?.scheduledTime

    if (sameTrainNumber && sameScheduledTime) {
      return { ...train, ...updatedTrain }
    }

    return train
  })
}
