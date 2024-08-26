import { useQueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

import { getCalendarDate } from '@junat/core/utils/date'

import { useCachedTrain } from '../../src/digitraffic/use_cached_train'

vi.mock('@tanstack/react-query')
vi.mock('@junat/core/utils/date')

describe('useCachedTrain', () => {
  it('returns undefined when no data is found', () => {
    vi.mocked(useQueryClient).mockReturnValue({
      getQueryData: vi.fn().mockReturnValue(undefined),
    } as any)

    const result = useCachedTrain({ trainNumber: 123 })
    expect(result).toBeUndefined()
  })

  it('finds a train with matching trainNumber and departureDate', () => {
    const mockTrain = { trainNumber: 123, departureDate: '2023-05-01' }
    vi.mocked(useQueryClient).mockReturnValue({
      getQueryData: vi.fn().mockReturnValue([mockTrain]),
    } as any)

    const result = useCachedTrain({
      trainNumber: 123,
      departureDate: '2023-05-01',
    })
    expect(result).toEqual(mockTrain)
  })

  it('uses current date when departureDate is "latest"', () => {
    const currentDate = '2023-05-01'
    vi.mocked(getCalendarDate).mockReturnValue(currentDate)
    const mockTrain = { trainNumber: 123, departureDate: currentDate }
    vi.mocked(useQueryClient).mockReturnValue({
      getQueryData: vi.fn().mockReturnValue([mockTrain]),
    } as any)

    const result = useCachedTrain({ trainNumber: 123, departureDate: 'latest' })
    expect(result).toEqual(mockTrain)
    expect(getCalendarDate).toHaveBeenCalled()
  })

  it('returns undefined when no matching train is found', () => {
    const mockTrains = [
      { trainNumber: 123, departureDate: '2023-05-01' },
      { trainNumber: 456, departureDate: '2023-05-02' },
    ]
    vi.mocked(useQueryClient).mockReturnValue({
      getQueryData: vi.fn().mockReturnValue(mockTrains),
    } as any)

    const result = useCachedTrain({
      trainNumber: 789,
      departureDate: '2023-05-03',
    })
    expect(result).toBeUndefined()
  })
})
