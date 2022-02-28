import type { Train } from '../types/train'

import { describe, expect, it } from 'vitest'

import trains from './fixtures/trains_hki.json'

describe('get live trains', () => {
  it('returns a list of trains', () => {
    expect(trains.length).toBeGreaterThan(0)

    expect(Object.keys(trains[0])).to.contain.all.members([
      'trainNumber',
      'departureDate',
      'operatorUICCode',
      'operatorShortCode',
      'trainType',
      'trainCategory',
      'runningCurrently',
      'cancelled',
      'version',
      'timetableType',
      'timetableAcceptanceDate',
      'timeTableRows'
    ])
  })

  it('has valid timetable rows', () => {
    const timetableRows = trains[0].timeTableRows[0]

    expect(Object.keys(timetableRows)).to.contain.all.members([
      'trainStopping',
      'stationShortCode',
      'stationUICCode',
      'countryCode',
      'type',
      'cancelled',
      'scheduledTime',
      'causes'
    ])
  })

  it('has trains sorted by arrival date', () => {
    const arrivalDates = (trains as Train[]).map(train =>
      train.timeTableRows.map(
        tr => new Date(tr.liveEstimateTime || tr.scheduledTime)
      )
    )
    const sortedByTime = arrivalDates.sort((a, b) => +a - +b)

    expect(arrivalDates).toEqual(sortedByTime)
  })
})
