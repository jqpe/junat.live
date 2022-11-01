import { styled } from '@junat/design'

export const StyledPrimaryButton = styled('button', {
  borderRadius: '9999px',
  border: '2px solid transparent',
  background: '$slateGray800',
  userSelect: 'none',
  cursor: 'pointer',

  transition: 'border-color 250ms ease-out' + ', background 150ms ease-out',

  padding: '$xs $m',
  '&:focus': {
    outlineColor: 'transparent',
    borderColor: '$slateGray700'
  },
  '&:hover': {
    background: '$slateGray700'
  },

  variants: {
    size: {
      xs: {
        fontSize: '14px',
        padding: '2.5px 15px',
        fontFamily: 'Poppins'
      }
    }
  }
})
