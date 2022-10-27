import { styled, keyframes } from '@junat/design'
import { motion } from 'framer-motion'

const translate = keyframes({
  '0%': { transform: 'translate3d(-500%, -500%, 0)' },
  '100%': { transform: 'translate3d(0, 0, 0)' }
})

export const StyledBackground = styled('div', {
  maxWidth: 'inherit',
  position: 'absolute',
  zIndex: 0,
  inset: 0,
  animation: `${translate} 1s`,
  animationIterationCount: 'infinite',
  '@media (prefers-reduced-motion)': {
    animation: 'none'
  }
})

export const StyledButton = styled(motion.button, {
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  zIndex: 1,
  border: '1px solid $primary600',
  color: '$primary800',
  padding: '0.3125rem 1.25rem',
  borderRadius: '2rem',
  '&:disabled': {
    cursor: 'not-allowed',
    backgroundColor: '$slateGray100',
    border: '1px solid $primary300'
  },
  '@dark': {
    backgroundColor: '$slateGray900',
    borderColor: '$primary400',
    color: '$primary200',
    '&:disabled': {
      backgroundColor: '$slateGray900',
      borderColor: '$primary800'
    }
  }
})
