import type { HTMLMotionProps } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'

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

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          whileTap={{ scale: 1.1 }}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          onClick={handleClick}
          {...rest}
        >
          {isLoading ? loadingText : text}
        </motion.button>
      )}
    </AnimatePresence>
  )
}
