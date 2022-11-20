import type { FormEvent, RefObject } from 'react'
import type FuseTypes from 'fuse.js'
import type { Locale } from '@typings/common'
import type { LocalizedStation } from '@lib/digitraffic'

import { getStationPath } from '@junat/digitraffic'

// Import fuse.js on focus (e.g. tab or user clicked on input) to reduce delay between input and displaying search results.
// On fast networks this is not that big of a difference, but for slow connection speeds this can result in a few seconds of improvement.
// It's safe to import fuse.js multiple times as imports are automatically cached.
export const handleFocus = () => import('fuse.js')

export const handleSubmit = (
  event: FormEvent<HTMLFormElement>,
  callback: (route: string) => unknown,
  stations: LocalizedStation[],
  locale: Locale
) => {
  event.preventDefault()

  const inputElement = event.currentTarget.querySelector('input')
  const input = inputElement?.value

  if (stations.length === 0 || input?.length === 0) return

  if (inputElement) inputElement.value = ''

  callback(`/${getStationPath(stations[0].stationName[locale])}`)
}

export const handleChange = (
  inputRef: RefObject<HTMLInputElement>,
  stations: LocalizedStation[],
  locale: Locale,
  callback: (stations: LocalizedStation[]) => unknown
) => {
  const searchQuery = inputRef.current?.value

  if (searchQuery === undefined) return

  import('fuse.js').then(({ default: fusejs }) => {
    const fuse = new fusejs(stations, {
      keys: [`stationName.${locale}`],
      threshold: 0.3
    })

    const result: FuseTypes.FuseResult<LocalizedStation>[] =
      fuse.search(searchQuery)

    if (searchQuery === '' && result.length === 0) {
      callback(stations)
      return
    }

    callback(result.map(res => res.item))
  })
}
