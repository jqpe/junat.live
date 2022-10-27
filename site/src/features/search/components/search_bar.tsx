import type { FormEvent, RefObject } from 'react'
import type FuseTypes from 'fuse.js'
import type { Locale } from '@typings/common'
import type { LocalizedStation } from '@lib/digitraffic'

import React from 'react'
import Search from '../assets/Search.svg'

import { styled } from '@junat/design'
import { getStationPath } from '@junat/digitraffic/utils'

// #region Styled components
const StyledSearchBar = styled('nav', {
  border: '1px solid $slateGray200',
  borderRadius: '30px',
  padding: '4px 16px',
  marginInline: '-16px',
  marginBottom: '16px',
  '@dark': {
    borderColor: '$slateGray800'
  }
})

const StyledInput = styled('input', {
  '&:focus::-webkit-search-cancel-button': {
    display: 'none'
  }
})

const Form = styled('form', {
  display: 'flex',
  justifyContent: 'space-between'
})

const SearchIcon = styled(Search, {
  transition: 'fill 150ms cubic-bezier(0.39, 0.575, 0.565, 1)',
  fill: '$slateGray500',
  '&:hover': {
    fill: '$primary600'
  },
  '@dark': {
    fill: '$slateGray600',
    '&:hover': {
      fill: '$primary500'
    }
  }
})

const SubmitButton = styled('button', {
  outline: '1px solid transparent !important',
  width: 'fit-content',
  display: 'flex',
  transition: 'box-shadow 150ms cubic-bezier(0.39, 0.575, 0.565, 1)',
  padding: '4px',
  borderRadius: '30px',
  '&:focus': {
    transform: 'scale(1.05)',
    backgroundColor: '$secondary300',
    [`& ${SearchIcon}`]: {
      fill: '$secondary800'
    }
  },
  '@dark': {
    '&:focus,&:hover': {
      backgroundColor: '$secondary600',
      [`& ${SearchIcon}`]: {
        fill: '$primary100'
      }
    }
  }
})
// #endregion

// Import fuse.js on focus (e.g. tab or user clicked on input) to reduce delay between input and displaying search results.
// On fast networks this is not that big of a difference, but for slow connection speeds this can result in a few seconds of improvement.
// It's safe to import fuse.js multiple times as imports are automatically cached.
const handleFocus = () => import('fuse.js')

const handleSubmit = (
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

const handleChange = (
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

export interface SearchBarProps {
  stations: LocalizedStation[]
  initialStations: LocalizedStation[]
  changeCallback: (stations: LocalizedStation[]) => unknown
  submitCallback: (route: string) => unknown
  locale: Locale
  placeholder: string
  ariaLabel: string
}

export function SearchBar({
  changeCallback,
  submitCallback,
  initialStations,
  stations,
  locale,
  placeholder,
  ariaLabel
}: SearchBarProps) {
  const inputRef = React.createRef<HTMLInputElement>()

  return (
    <StyledSearchBar>
      <Form
        onFocus={handleFocus}
        onChange={() =>
          handleChange(inputRef, initialStations, locale, changeCallback)
        }
        onSubmit={event =>
          handleSubmit(event, submitCallback, stations, locale)
        }
      >
        <StyledInput
          type="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          role="combobox"
          ref={inputRef}
          aria-autocomplete="list"
          placeholder={placeholder}
        />
        <SubmitButton type="submit" aria-label={ariaLabel}>
          <SearchIcon width="24" height="24" />
        </SubmitButton>
      </Form>
    </StyledSearchBar>
  )
}
