import type { HTMLMotionProps } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'

import { useColorScheme } from '@hooks/use_color_scheme'

import type React from 'react'

import { Background } from './background'
import { StyledButton, StyledBackground } from './styles'

interface AnimatedButtonProps
  extends React.PropsWithChildren<HTMLMotionProps<'button'>> {
  disabled: boolean
  isLoading: boolean
  handleClick: VoidFunction
  loadingText: string
  visible: boolean
}

export default function AnimatedButton(props: AnimatedButtonProps) {
  const { colorScheme } = useColorScheme()
  const {
    visible,
    handleClick,
    loadingText,
    isLoading,
    children,
    ...buttonProps
  } = props

  return (
    <AnimatePresence>
      {visible && (
        <StyledButton
          whileTap={{ scale: isLoading ? 1 : 1.1 }}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          onClick={handleClick}
          {...buttonProps}
        >
          <StyledBackground
            style={{ animation: isLoading ? undefined : 'none' }}
          >
            <Background style={colorScheme} />
          </StyledBackground>
          <span style={{ zIndex: 1, position: 'relative' }}>
            {isLoading ? loadingText : children}
          </span>
        </StyledButton>
      )}
    </AnimatePresence>
  )
}
