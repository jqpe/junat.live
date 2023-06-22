import { styled } from '@junat/design'

export const StyledLabel = styled('label', {
  color: '$slateGray700',
  fontSize: '$mobile-caption',
  ':root.dark': {
    color: '$slateGray300'
  },
  '@large': {
    fontSize: '$pc-caption'
  }
})
