import {
  getStations,
  GetStationsOptions,
  GetStationsOptionsWithLocale,
  LocalizedStation,
  Station
} from '~digitraffic'

import fs from 'node:fs/promises'
import path from 'node:path'

interface GetStationsFromCache {
  <T extends Station[]>(options?: GetStationsOptions): Promise<T>
  <T extends LocalizedStation[]>(
    options: GetStationsOptionsWithLocale
  ): Promise<T>
}

/**
 * In development, hitting the Digitraffic API multiple times can result in API limits.
 *
 * When this function is first invoked, it will cache stations from the API with localized data for
 * Finnish, English and Swedish so that any subsequent calls will hit the disk instead of the Digitraffic endpoint.
 */
export const getStationsFromCache: GetStationsFromCache = async (
  options?: GetStationsOptions
) => {
  const cacheDirectory = path.join(process.cwd(), '.cache')
  const files = new Set(await fs.readdir(cacheDirectory))

  const production = process.env.NODE_ENV === 'production'

  if (production) {
    return await getStations(options)
  }

  if (files.has('stations.json')) {
    return JSON.parse(
      await fs.readFile(path.join(cacheDirectory, 'stations.json'), {
        encoding: 'utf-8'
      })
    ) as LocalizedStation[]
  }

  const stations = await getStations({
    omitInactive: false,
    locale: ['fi', 'en', 'sv']
  })

  await fs.writeFile(
    path.join(cacheDirectory, 'stations.json'),
    JSON.stringify(stations)
  )

  return stations as LocalizedStation[]
}
