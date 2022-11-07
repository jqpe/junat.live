import { styled, keyframes } from '@junat/design'

const spinner = keyframes({
  to: {
    transform: 'rotate(1turn)'
  }
})

const gradient =
  'conic-gradient(#0000 10%,#000), linear-gradient(#000 0 0) content-box'

export const StyledSpinner = styled('div', {
  width: '24px',
  padding: '3px',
  aspectRatio: 1,
  borderRadius: '50%',
  background: '$primary200',
  WebkitMask: gradient,
  mask: gradient,
  WebkitMaskComposite: 'source-out',
  maskComposite: 'subtract',
  animation: `${spinner} 1s infinite linear`
})
