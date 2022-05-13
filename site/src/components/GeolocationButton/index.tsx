import type { MouseEventHandler } from 'react'
import React from 'react'

import styles from './GeolocationButton.module.scss'

interface GeolocationButtonProps {
  label: string
  disabled?: boolean
  handleClick: MouseEventHandler<HTMLButtonElement>
}

import { AnimatePresence, motion } from 'framer-motion'

import variables from '../../sass/theme/colors.module.scss'

import Position from './Position.svg'
import Compass from './Compass.svg'

export default function GeolocationButton({
  label,
  handleClick,
  disabled
}: GeolocationButtonProps) {
  const [clicked, setClicked] = React.useState(false)

  React.useEffect(() => {
    if (disabled) {
      setClicked(false)
    }
  }, [disabled])

  const iconProps = {
    width: 24,
    height: 24,
    fill: variables.slateGray300
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      aria-label={label}
      disabled={disabled || clicked}
      onClick={event => {
        setClicked(true)
        handleClick(event)
      }}
      className={styles.geolocationButton}
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
    </motion.button>
  )
}
