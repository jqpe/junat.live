import type {
  GetStations,
  GetStationsOptions,
  GetStationsOptionsWithLocale
} from '~digitraffic'
import { getStations as getStationsFromApi } from '~digitraffic'

import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Transforms multiple booleans to their number representations. 0 for any falsy value, 1 for any truthy value.
 */
const booleansToNumbers = (booleans: Array<boolean | undefined>) => {
  return booleans.map(boolean => +!!boolean)
}

export const getStations: GetStations = async (
  options: GetStationsOptions | GetStationsOptionsWithLocale = {}
) => {
  if (typeof globalThis.window !== 'undefined') {
    return await getStationsFromApi(options)
  }

  const dateYyyyMmDd = new Date().toISOString().split('T')[0]
  const cachePath = path.join(
    process.cwd(),
    '.cache',
    `stations_${booleansToNumbers([
      options.betterNames ?? true,
      options.includeNonPassenger ?? true,
      options.omitInactive ?? true
    ])}${options.locale ? `_${options.locale}` : ''}_${dateYyyyMmDd}.json`
  )

  if (
    !(await fs
      .opendir(path.join(process.cwd(), '.cache'))
      .then(dir => {
        dir.closeSync()
        return true
      })
      .catch(_ => false))
  ) {
    await fs.mkdir(path.join(process.cwd(), '.cache'))
  }

  try {
    const file = await fs.readFile(cachePath, { encoding: 'utf-8' })

    return JSON.parse(file)
  } catch {
    const stations = await getStationsFromApi(options)
    await fs.writeFile(cachePath, JSON.stringify(stations))

    return stations
  }
}
