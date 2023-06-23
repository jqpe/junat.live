import { styled } from '@junat/design'

export const StyledLink = styled('a', {
  textDecoration: 'underline',
  color: '$slateGray800',
  cursor: 'pointer',
  '&:hover,&:focus': {
    color: '$primary600',
    transition: 'color 150ms cubic-bezier(0.075, 0.82, 0.165, 1)'
  },
  ':root.dark &': {
    color: '$slateGray200'
  },

  variants: {
    preset: {
      footer: {
        ':root.dark &': {
          color: '$primary500'
        }
      }
    }
  }
})
