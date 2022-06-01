import type { LocalizedStation } from '@junat/digitraffic/lib/types'
import type { GetStationsOptionsWithLocale } from '@junat/digitraffic'

import { fetchStations } from '@junat/digitraffic'

import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Transforms multiple booleans to their number representations. 0 for any falsy value, 1 for any truthy value.
 */
const booleansToNumbers = (booleans: Array<boolean | undefined>) => {
  return booleans.map(boolean => +!!boolean)
}

export const getStations = async (
  options: GetStationsOptionsWithLocale
): Promise<LocalizedStation[]> => {
  if (typeof globalThis.window !== 'undefined') {
    return await fetchStations(options)
  }

  const dateYyyyMmDd = new Date().toISOString().split('T')[0]
  const localePrefix = `_${options.locale}`

  const cachePath = path.join(
    process.cwd(),
    '.cache',
    `stations_${booleansToNumbers([
      options.betterNames ?? true,
      options.includeNonPassenger ?? true,
      options.omitInactive ?? true
    ])}${localePrefix}_${dateYyyyMmDd}.json`
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
    const stations = await fetchStations(options)
    await fs.writeFile(cachePath, JSON.stringify(stations))

    if (!stations) {
      return []
    }

    return stations
  }
}
