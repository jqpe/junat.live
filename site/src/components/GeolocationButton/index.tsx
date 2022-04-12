import { MouseEventHandler, useEffect, useState } from 'react'

import styles from './GeolocationButton.module.scss'

interface GeolocationButtonProps {
  label: string
  error?: GeolocationPositionError
  handleClick: MouseEventHandler<HTMLButtonElement>
}

import { motion } from 'framer-motion'

export default function GeolocationButton({
  label,
  handleClick,
  error
}: GeolocationButtonProps) {
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    if (!error) {
      return
    }

    setClicked(false)
  }, [error])

  return (
    <button
      aria-label={label}
      disabled={clicked}
      onClick={event => {
        setClicked(true)
        handleClick(event)
      }}
      className={styles.geolocationButton}
    >
      {clicked ? (
        <motion.div
          style={{ display: 'flex' }}
          animate={{ rotate: 360, scale: [0.8, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="white"
          >
            <path d="M11.42 21.815a1.004 1.004 0 0 0 1.16 0C12.884 21.598 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.996c-.029 6.444 7.116 11.602 7.42 11.819zM12 4c3.309 0 6 2.691 6 6.004.021 4.438-4.388 8.423-6 9.731-1.611-1.308-6.021-5.293-6-9.735 0-3.309 2.691-6 6-6z"></path>
            <path d="M11 14h2v-3h3V9h-3V6h-2v3H8v2h3z"></path>
          </svg>
        </motion.div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="#D4D8E1"
        >
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M13 4.069V2h-2v2.069A8.01 8.01 0 0 0 4.069 11H2v2h2.069A8.008 8.008 0 0 0 11 19.931V22h2v-2.069A8.007 8.007 0 0 0 19.931 13H22v-2h-2.069A8.008 8.008 0 0 0 13 4.069zM12 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"></path>
        </svg>
      )}
    </button>
  )
}
