import React from 'react'

import { styled, theme } from '@junat/stitches'

export interface GeolocationButtonProps {
  label: string
  disabled?: boolean
  clicked?: boolean
  handleClick: (
    open: boolean,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void
}

import { AnimatePresence, motion } from 'framer-motion'

import Position from '@components/icons/Position.svg'
import Compass from '@components/icons/Compass.svg'

const Button = styled(motion.button, {
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

export function GeolocationButton({
  label,
  handleClick,
  clicked,
  disabled
}: GeolocationButtonProps) {
  const iconProps = {
    width: 24,
    height: 24,
    fill: theme.colors.slateGray300
  }

  return (
    <Button
      type="button"
      whileHover={{ scale: 1.1 }}
      aria-label={label}
      disabled={disabled || clicked}
      onClick={event => {
        handleClick(!clicked, event)
      }}
    >
      <AnimatePresence>
        {clicked ? (
          <motion.div
            style={{ display: 'flex' }}
            initial={{ opacity: 0 }}
            animate={{ rotate: 360, scale: [0.8, 1], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <Compass {...iconProps} />
          </motion.div>
        ) : (
          <motion.div
            style={{ display: 'flex' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Position {...iconProps} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
