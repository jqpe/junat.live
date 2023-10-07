import type { Locale } from '@typings/common'

import React from 'react'

import translate from '@utils/translate'

import Search from '@components/icons/search.svg'

import { handleChange, handleFocus, handleSubmit } from '../helpers/search_bar'

type Station<T extends { stationName: Record<Locale, string> }> = T

export interface SearchBarProps<
  T extends { stationName: Record<Locale, string> }
> {
  stations: Station<T>[]
  changeCallback: (stations: Station<T>[]) => unknown
  submitCallback: (route: string) => unknown
  locale: Locale
  placeholder: string
  ariaLabel: string
}

export function SearchBar<T extends { stationName: Record<Locale, string> }>({
  changeCallback,
  submitCallback,
  stations,
  locale,
  placeholder,
  ariaLabel
}: {
  stations: T[]
} & Omit<SearchBarProps<T>, 'stations'>) {
  const inputRef = React.createRef<HTMLInputElement>()
  const [expanded, setExpanded] = React.useState(false)
  const { current: initialStations } = React.useRef(structuredClone(stations))

  return (
    <nav className="[border:1px_solid_theme(colors.gray.200)] rounded-full px-4 py-1 mb-4 -mx-4 dark:border-gray-800">
      <form
        className="flex justify-between"
        onFocus={handleFocus}
        onChange={() => {
          handleChange(inputRef, initialStations, locale, newStations => {
            setExpanded(
              newStations.length !== initialStations.length &&
                newStations.length > 0
            )

            changeCallback(newStations)
          })
        }}
        onSubmit={event => {
          handleSubmit(event, submitCallback, stations, locale)
        }}
      >
        <input
          className="text-[1rem] [&:focus::-webkit-search-cancel-button]:[display:none]"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          aria-expanded={expanded}
          aria-controls="stations-list"
          role="combobox"
          ref={inputRef}
          aria-autocomplete="list"
          placeholder={placeholder}
        />
        <button
          type="submit"
          aria-label={ariaLabel}
          className="group focus:outline-none w-fit flex [transition:box-shadow_150ms_cubic-bezier(0.39,0.575,0.565,1)] p-1 rounded-full focus:bg-secondary-300 focus:dark:bg-secondaryA-800"
        >
          <Search
            className="fill-gray-500 group-focus:fill-secondary-800 group-focus:dark:fill-secondary-200 "
            width="24"
            height="24"
            aria-label={translate(locale)('searchIcon')}
          />
        </button>
      </form>
    </nav>
  )
}
