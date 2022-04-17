import type { SearchBarProps } from '@components/SearchBar'
import type FuseTypes from 'fuse.js'
import { FormEvent, RefObject } from 'react'

import { LocalizedStation } from '~digitraffic'

interface SearchHandlerProps {
  stations: LocalizedStation[]
  locale: 'fi' | 'en' | 'sv'
  callback: (arr: LocalizedStation[]) => void
}

export const handleSearch = (
  _event: FormEvent<HTMLFormElement>,
  inputRef: RefObject<HTMLInputElement>
) => {
  return function handler({ stations, callback, locale }: SearchHandlerProps) {
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
}
