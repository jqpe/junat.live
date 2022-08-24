import type { GetStationsOptions } from '@junat/digitraffic'
import type { LocalizedStation } from '@lib/digitraffic'

import { fetchStations } from '@junat/digitraffic'

import translate from './translate'

import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Transforms multiple booleans to their number representations. 0 for any falsy value, 1 for any truthy value.
 */
const booleansToNumbers = (booleans: Array<boolean | undefined>) => {
  return booleans.map(boolean => +!!boolean)
}

export const getStations = async (
  options: GetStationsOptions
): Promise<LocalizedStation[]> => {
  const t = translate('all')

  if (typeof globalThis.window !== 'undefined') {
    return fetchStations({ ...options, i18n: t('stations'), proxy: true })
  }

  const calendarDate = new Date().toISOString().split('T')[0]

  const cachePath = path.join(
    process.cwd(),
    '.cache',
    `stations_${booleansToNumbers([
      options.betterNames ?? false,
      options.keepInactive ?? false,
      options.keepNonPassenger ?? false
    ])}_${calendarDate}.json`
  )

  if (
    !(await fs
      .opendir(path.join(process.cwd(), '.cache'))
      .then(dir => {
        dir.closeSync()
        return true
      })
      .catch(() => false))
  ) {
    await fs.mkdir(path.join(process.cwd(), '.cache'))
  }

  try {
    const file = await fs.readFile(cachePath, { encoding: 'utf8' })

    return JSON.parse(file)
  } catch {
    const stations = await fetchStations({
      ...options,
      i18n: t('stations'),
      proxy: true
    })
    await fs.writeFile(cachePath, JSON.stringify(stations))

    if (!stations) {
      return []
    }

    return stations
  }
}
