import type { FuseResult } from 'fuse.js'
import type { RefObject } from 'react'
import type { Locale } from '~/types/common'

// Import fuse.js on focus (e.g. tab or user clicked on input) to reduce delay between input and displaying search results.
// On fast networks this is not that big of a difference, but for slow connection speeds this can result in a few seconds of improvement.
// It's safe to import fuse.js multiple times as imports are automatically cached.
export const handleFocus = () => import('fuse.js')

type Station<T extends { stationName: Record<Locale, string> }> = T

export const handleChange = <T extends { stationName: Record<Locale, string> }>(
  inputRef: RefObject<HTMLInputElement>,
  stations: Station<T>[],
  locale: Locale,
  callback: (stations: Station<T>[]) => unknown,
) => {
  const searchQuery = inputRef.current?.value

  if (searchQuery == undefined) return

  import('fuse.js').then(({ default: fusejs }) => {
    const fuse = new fusejs(stations, {
      keys: [`stationName.${locale}`],
      threshold: 0.3,
    })

    const result: FuseResult<Station<T>>[] = fuse.search(searchQuery)

    if (searchQuery === '' && result.length === 0) {
      callback(stations)
      return
    }

    callback(result.map(res => res.item))
  })
}
