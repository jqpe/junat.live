import { sortSimplifiedTrains } from '@utils/sort_simplified_trains'

import { it, expect } from 'vitest'

const date = new Date().toISOString()

const TRAINS = [
  { scheduledTime: date, trainNumber: 1 },
  { scheduledTime: date, trainNumber: 2 }
] as const

it("doesn't sort trains if they're already sorted", () => {
  expect(sortSimplifiedTrains(TRAINS)).toStrictEqual(TRAINS)
})

it('sorts trains by date (oldest first)', () => {
  const now = new Date().toISOString()

  const trains = [{ ...TRAINS[0], scheduledTime: now }, TRAINS[0]]

  expect(sortSimplifiedTrains(trains)[0].scheduledTime).toStrictEqual(date)
})
