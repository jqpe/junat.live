import { styled } from '@junat/design'

import { motion } from 'framer-motion'

export const StyledButton = styled(motion.button, {
  position: 'fixed',
  cursor: 'pointer',
  bottom: '1rem',
  right: '1rem',
  borderRadius: '100%',
  background: '$primary700',
  display: 'flex',
  padding: '0.75rem',
  boxShadow: '2px 2px 30px hsla(0,0%,0%,0.15)',
  '@large': {
    right: 'calc(50% - 300px)'
  }
})
