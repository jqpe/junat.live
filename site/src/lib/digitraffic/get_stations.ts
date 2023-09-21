import type { GetStationsOptions } from '@junat/digitraffic'
import type { LocalizedStation } from '@lib/digitraffic'

import { INACTIVE_STATIONS } from '~/constants'

import { fetchStations } from '@junat/digitraffic'

import translate from '~/utils/translate'

import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Transforms multiple booleans to their number representations. 0 for any falsy value, 1 for any truthy value.
 */
const booleansToNumbers = (booleans: Array<boolean | undefined>) => {
  return booleans.map(boolean => +!!boolean)
}

/**
 * Gets stations by either reading from cache (SSR) or requesting over the wire (CSR)
 *
 * This is done to improve build times as there only needs to be a single network request and subsequent requests will be cached.
 *
 * Translations are provided via {@link translate} and corresponding 'stations' key for _all_ localizations.
 */
export const getStations = async (
  options: GetStationsOptions
): Promise<LocalizedStation[]> => {
  const t = translate('all')

  const defaultFetch = () => {
    return fetchStations({
      inactiveStations: INACTIVE_STATIONS,
      ...options,
      keepInactive: false,
      i18n: t('stations'),
      proxy: true
    })
  }

  // Don't attempt to read cache if inside a browser/service worker context
  if ('window' in globalThis || 'self' in globalThis) {
    return defaultFetch()
  }

  const calendarDate = new Date().toISOString().split('T')[0]

  const uid = booleansToNumbers([
    options.betterNames ?? false,
    options.keepInactive ?? false,
    options.keepNonPassenger ?? false
  ])

  const cachePath = path.join(
    process.cwd(),
    '.cache',
    `stations_${uid}_${calendarDate}.json`
  )

  if (!(await hasCacheDirectory())) {
    await makeCacheDirectory()
  }

  try {
    const file = await fs.readFile(cachePath, { encoding: 'utf8' })

    return JSON.parse(file)
  } catch {
    const stations = await defaultFetch()

    await fs.writeFile(cachePath, JSON.stringify(stations))

    return stations
  }
}

async function hasCacheDirectory() {
  return fs
    .opendir(path.join(process.cwd(), '.cache'))
    .then(dir => {
      dir.closeSync()
      return true
    })
    .catch(() => false)
}

async function makeCacheDirectory() {
  await fs.mkdir(path.join(process.cwd(), '.cache'))
}
