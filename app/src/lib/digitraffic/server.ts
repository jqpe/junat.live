// Memoizes `fetchStations` to not stress test the Digitraffic servers
// when generating static pages 🤩

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { GetStationsOptions } from '@junat/digitraffic'

import { INACTIVE_STATIONS } from '@junat/core/constants'
import { fetchStations } from '@junat/digitraffic'

import { translate } from '~/i18n'

const memoize = <T>(fn: (...args: any[]) => Promise<T>) => {
  const cache = new Map<string, T>()
  return async (...args: any[]): Promise<T> => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = await fn(...args)
    cache.set(key, result)
    return result
  }
}

const fetchStationsData = async (options: GetStationsOptions) => {
  const t = translate('all')
  return fetchStations({
    inactiveStations: INACTIVE_STATIONS,
    ...options,
    keepInactive: false,
    i18n: t('stations'),
    proxy: true,
  })
}

export const getStations = memoize(async (options: GetStationsOptions) => {
  return fetchStationsData(options)
})
