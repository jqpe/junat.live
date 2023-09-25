import { styled, theme } from '@junat/design'
import { motion } from 'framer-motion'

export const StyledNotification = styled(motion.aside, {
  marginBlock: '$m',
  backgroundColor: '$secondaryA400',
  borderRadius: 3,
  padding: 5,
  position: 'relative',
  boxShadow: `0px 0px 2px 1px ${theme.colors.secondaryA500}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '$s'
})
