import type { FormEvent, RefObject } from 'react'

import { createRef } from 'react'
import Search from '@components/icons/Search.svg'

import { styled } from '@junat/stitches'
import { getStationPath } from '@junat/digitraffic/utils'
import { LocalizedStation } from '@junat/digitraffic/types'
import { Locale } from '@typings/common'
import { useRouter } from 'next/router'
import { getLocale } from '@utils/get_locale'
import { handleSearch } from '@utils/search'

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
  event: FormEvent<HTMLFormElement>,
  inputRef: RefObject<HTMLInputElement>,
  stations: LocalizedStation[],
  locale: Locale,
  callback: (stations: LocalizedStation[]) => unknown
) => {
  handleSearch(
    event,
    inputRef
  )({
    stations,
    locale,
    callback
  })
}

export interface SearchBarProps {
  stations: LocalizedStation[]
  changeCallback: (stations: LocalizedStation[]) => unknown
  submitCallback: (route: string) => unknown
  placeholder: string
  ariaLabel: string
}

export default function SearchBar({
  changeCallback,
  submitCallback,
  stations,
  placeholder,
  ariaLabel
}: SearchBarProps) {
  const inputRef = createRef<HTMLInputElement>()
  const locale = getLocale(useRouter().locale)

  return (
    <StyledSearchBar>
      <Form
        onFocus={handleFocus}
        onChange={event =>
          handleChange(event, inputRef, stations, locale, changeCallback)
        }
        onSubmit={event =>
          handleSubmit(event, submitCallback, stations, locale)
        }
      >
        <input type="text" ref={inputRef} placeholder={placeholder} />
        <SubmitButton type="submit" aria-label={ariaLabel}>
          <SearchIcon width="24" height="24" />
        </SubmitButton>
      </Form>
    </StyledSearchBar>
  )
}
