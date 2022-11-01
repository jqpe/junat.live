import { styled } from '@junat/design'

export const StyledIconButton = styled('button', {
  borderRadius: '9999px',
  position: 'absolute',
  display: 'flex',

  padding: '$xs',
  margin: '-$xs',

  transition: 'fill 250ms ease-in',
  cursor: 'pointer',
  fill: '$slateGray600',
  top: '5px',
  right: '5px',
  '&:focus': {
    outlineColor: 'transparent',
    fill: 'white'
  },
  '&:hover': {
    fill: '$slateGray500'
  }
})
