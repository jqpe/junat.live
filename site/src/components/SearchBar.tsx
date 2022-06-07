import type {
  FocusEventHandler,
  FormEvent,
  FormEventHandler,
  RefObject
} from 'react'

import { createRef } from 'react'
import Search from '@components/icons/Search.svg'

import { styled } from '@junat/stitches'

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

export interface SearchBarProps {
  handleChange: (
    event: FormEvent<HTMLFormElement>,
    inputRef: RefObject<HTMLInputElement>
  ) => void
  handleSubmit: FormEventHandler<HTMLFormElement>
  handleFocus: FocusEventHandler<HTMLFormElement>
  placeholder: string
  ariaLabel: string
}

export default function SearchBar({
  handleChange,
  handleSubmit,
  handleFocus,
  placeholder,
  ariaLabel
}: SearchBarProps) {
  const inputRef = createRef<HTMLInputElement>()

  return (
    <StyledSearchBar>
      <Form
        onFocus={event => handleFocus(event)}
        onChange={event => handleChange(event, inputRef)}
        onSubmit={handleSubmit}
      >
        <input type="text" ref={inputRef} placeholder={placeholder} />
        <SubmitButton type="submit" aria-label={ariaLabel}>
          <SearchIcon width="24" height="24" />
        </SubmitButton>
      </Form>
    </StyledSearchBar>
  )
}
