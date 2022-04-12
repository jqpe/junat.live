import type { HTMLMotionProps } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'

interface FetchTrainsButtonProps extends HTMLMotionProps<'button'> {
  disabled: boolean
  isLoading: boolean
  handleClick: VoidFunction
  text: string
  visible: boolean
}

export default function FetchTrainsButton(props: FetchTrainsButtonProps) {
  const { visible, handleClick, text, isLoading, ...rest } = props

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          onClick={handleClick}
          {...rest}
        >
          {isLoading ? <span>loading</span> : text}
        </motion.button>
      )}
    </AnimatePresence>
  )
}
