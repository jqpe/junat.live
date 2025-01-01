import type { Locale } from '~/types/common'

import React from 'react'

import Search from '@junat/ui/icons/search.svg'

import { handleChange, handleFocus } from './helpers'

import 'core-js/actual/structured-clone'

import { cx } from 'cva'

import { STATION_LIST_ID } from '~/components/station_list'

type Station<T extends { stationName: Record<Locale, string> }> = T

export interface SearchBarProps<
  T extends { stationName: Record<Locale, string> },
> {
  ref?: React.RefObject<HTMLInputElement>
  stations: Station<T>[]
  changeCallback: (stations: Station<T>[]) => unknown
  onSubmit: React.FormEventHandler

  locale: Locale
  placeholder: string
}

export function SearchBar<T extends { stationName: Record<Locale, string> }>(
  props: {
    stations: T[]
  } & Omit<SearchBarProps<T>, 'stations'>,
) {
  const { changeCallback, stations, locale, placeholder } = props

  const localInputRef = React.useRef<HTMLInputElement>(null!)
  const inputRef = props.ref ?? localInputRef

  const [expanded, setExpanded] = React.useState(false)
  const { current: initialStations } = React.useRef(structuredClone(stations))

  return (
    <form
      className={cx(
        '-mx-4 mb-4 flex justify-between rounded-full px-4 py-1',
        '[border:1px_solid_theme(colors.gray.200)] dark:border-gray-800',
      )}
      onFocus={handleFocus}
      onChange={() => {
        handleChange(inputRef, initialStations, locale, newStations => {
          setExpanded(
            newStations.length !== initialStations.length &&
              newStations.length > 0,
          )

          changeCallback(newStations)
        })
      }}
      onSubmit={props.onSubmit}
    >
      <input
        className={cx(
          'max-w-[calc(100%-32px)] grow text-[1rem]',
          '[&:focus-visible::-webkit-search-cancel-button]:[display:none]',
        )}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        aria-expanded={expanded}
        aria-controls={STATION_LIST_ID}
        enterKeyHint="go"
        role="combobox"
        ref={inputRef}
        aria-autocomplete="list"
        placeholder={placeholder}
      />

      <Search className="flex fill-gray-500 p-1" width="32" height="32" />
    </form>
  )
}
