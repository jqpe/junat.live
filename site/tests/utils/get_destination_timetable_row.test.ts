import {
  getDestinationTimetableRow,
  ITrain
} from '@utils/get_destination_timetable_row'

import { it, expect } from 'vitest'

const train: ITrain = {
  timeTableRows: [
    { stationShortCode: 'HKI', type: 'DEPARTURE' },
    { stationShortCode: 'LEN', type: 'ARRIVAL' },
    { stationShortCode: 'LEN', type: 'DEPARTURE' },
    { stationShortCode: 'AIN', type: 'ARRIVAL' }
  ],
  commuterLineID: 'P'
}
const noCommuterLineID: ITrain = { ...train, commuterLineID: undefined }

const [first, airport, last] = (() => {
  return [0, 1, -1].map(i => train.timeTableRows.at(i)!.stationShortCode)
})()

it('returns last timetable row if from is defined but commuter line id is undefined', () => {
  const tr = getDestinationTimetableRow(noCommuterLineID, first)

  expect(tr.stationShortCode).toBe(last)
})

it.each([train, { ...train, commuterLineID: 'I' }])(
  'always returns last timetable row if from is undefined or equal to LEN',
  trainMock => {
    const getTr = (from?: string) => {
      return getDestinationTimetableRow(trainMock, from).stationShortCode
    }

    expect(getTr()).toStrictEqual(last)
    expect(getTr('LEN')).toStrictEqual(last)
  }
)

it('returns airport if commuter line id is defined and from is not equal to LEN', () => {
  const { stationShortCode } = getDestinationTimetableRow(train, first)

  expect(stationShortCode).toStrictEqual(airport)
})

it("returns airport even if from doesn't exist in timetable rows", () => {
  const noFrom: ITrain = {
    ...train,
    timeTableRows: train.timeTableRows.filter(
      tr => tr.stationShortCode !== first
    )
  }

  const { stationShortCode } = getDestinationTimetableRow(noFrom, first)

  expect(stationShortCode).toStrictEqual(airport)
})
