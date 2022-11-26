import { styled } from '@junat/design'

export const StyledNoScript = styled('noscript', {
  background: '$slateGray900',
  color: '$slateGray100',
  '@dark': {
    background: '$slateGray100',
    color: '$slateGray900'
  },
  padding: '$xs',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',

  position: 'fixed',
  top: 0,
  right: 0,
  left: 0
})
