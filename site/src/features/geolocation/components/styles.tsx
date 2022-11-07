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
  '@large': {
    right: 'calc(50% - 300px)'
  }
})
