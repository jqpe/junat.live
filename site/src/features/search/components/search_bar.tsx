import type { Locale } from '@typings/common'
import type { LocalizedStation } from '@lib/digitraffic'

import React from 'react'

import translate from '@utils/translate'

import {
  StyledForm,
  StyledSearchIcon,
  StyledInput,
  StyledSearchBar,
  StyledSubmitButton
} from '../styles/search_bar.styles'

import { handleChange, handleFocus, handleSubmit } from '../helpers/search_bar'

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
  const [expanded, setExpanded] = React.useState(false)

  return (
    <StyledSearchBar>
      <StyledForm
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
        <StyledInput
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
        <StyledSubmitButton type="submit" aria-label={ariaLabel}>
          <StyledSearchIcon
            width="24"
            height="24"
            aria-label={translate(locale)('searchIcon')}
          />
        </StyledSubmitButton>
      </StyledForm>
    </StyledSearchBar>
  )
}
