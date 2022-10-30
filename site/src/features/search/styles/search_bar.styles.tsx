import { styled } from '@junat/design'

import Search from '@components/icons/search.svg'

export const StyledSearchBar = styled('nav', {
  border: '1px solid $slateGray200',
  borderRadius: '30px',
  padding: '4px 16px',
  marginInline: '-16px',
  marginBottom: '16px',
  '@dark': {
    borderColor: '$slateGray800'
  }
})

export const StyledInput = styled('input', {
  '&:focus::-webkit-search-cancel-button': {
    display: 'none'
  }
})

export const StyledForm = styled('form', {
  display: 'flex',
  justifyContent: 'space-between'
})

export const StyledSearchIcon = styled(Search, {
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

export const StyledSubmitButton = styled('button', {
  outline: '1px solid transparent !important',
  width: 'fit-content',
  display: 'flex',
  transition: 'box-shadow 150ms cubic-bezier(0.39, 0.575, 0.565, 1)',
  padding: '4px',
  borderRadius: '30px',
  '&:focus': {
    transform: 'scale(1.05)',
    backgroundColor: '$secondary300',
    [`& ${StyledSearchIcon}`]: {
      fill: '$secondary800'
    }
  },
  '@dark': {
    '&:focus,&:hover': {
      backgroundColor: '$secondary600',
      [`& ${StyledSearchIcon}`]: {
        fill: '$primary100'
      }
    }
  }
})
