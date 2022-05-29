import type { HTMLMotionProps } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'

import { useColorScheme } from '@junat/ui/hooks/use_color_scheme'

import DarkBackground from './background_dark.svg'
import LightBackground from './background_light.svg'

import styles from './FetchTrainsButton.module.scss'

interface FetchTrainsButtonProps extends HTMLMotionProps<'button'> {
  disabled: boolean
  isLoading: boolean
  handleClick: VoidFunction
  text: string
  loadingText: string
  visible: boolean
}

export default function FetchTrainsButton(props: FetchTrainsButtonProps) {
  const { visible, handleClick, text, loadingText, isLoading, ...rest } = props
  const { colorScheme } = useColorScheme()

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className={styles.button}
          whileTap={{ scale: isLoading ? 1 : 1.1 }}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          onClick={handleClick}
          {...rest}
        >
          <div className={styles.background}>
            {colorScheme === 'light' ? <LightBackground /> : <DarkBackground />}
          </div>
          <span>{isLoading ? loadingText : text}</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
