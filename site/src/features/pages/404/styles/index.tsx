import { styled } from '@junat/design'

import Image from 'next/image'

export const StyledDiv = styled('div', {
  height: '100vh',
  width: '100vw',

  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px'
})

export const StyledContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '25px',
  maxWidth: '90vw'
})

export const StyledImage = styled(Image, {
  filter: 'opacity(50%) ',
  '@dark': {
    filter: 'opacity(25%)'
  },

  zIndex: '-1'
})
