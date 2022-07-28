import React from 'react'

import { styled, theme } from '@config/theme'

import { motion } from 'framer-motion'

import Position from '../assets/Position.svg'

export interface GeolocationButtonProps {
  label: string
  handleClick?: React.MouseEventHandler<HTMLButtonElement>
}

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
  handleClick
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
      onClick={handleClick}
    >
      <Position {...iconProps} />
    </Button>
  )
}
