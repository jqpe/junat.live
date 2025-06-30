import { describe, expect, it, vi } from 'vitest'

import { satisfiesDeliveryRules } from '../../src/base/delivery_rules'
import {
  AudioDeliveryRules,
  VideoDeliveryRules,
} from '../../src/types/passenger_information'

const audioData: AudioDeliveryRules = {
  startDateTime: '2025-06-28T21:00',
  endDateTime: '2025-06-29T20:59',
  startTime: '4:00',
  endTime: '5:00',
  weekDays: [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ],
}

const videoData: VideoDeliveryRules = {
  startDateTime: '2025-06-28T21:00:00Z',
  endDateTime: '2025-06-29T20:59:00Z',
  startTime: '6:09',
  endTime: '11:40',
  weekDays: [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ],
  deliveryType: 'WHEN',
}

describe('audio', () => {
  it('returns false when outside start and end time', async () => {
    vi.setSystemTime('2025-06-29T05:40')

    expect(satisfiesDeliveryRules(audioData)).toBe(false)
  })

  it('return true when in start and end time', () => {
    vi.setSystemTime('2025-06-29T04:30')

    expect(satisfiesDeliveryRules(audioData)).toBe(true)
  })
})

describe('video', () => {
  it('returns false when outside start and end time', () => {
    vi.setSystemTime('2025-06-29T19:00')

    expect(satisfiesDeliveryRules(videoData)).toBe(false)
  })
})
