import * as ToastPrimitive from '@radix-ui/react-toast'
import { AnimatePresence, motion } from 'framer-motion'

import { useColorScheme } from '@hooks/use_color_scheme'
import CloseIcon from '../assets/Close.svg'
import { styled } from '@config/theme'
import { useToast } from '../stores/toast'

import { Title } from './Title'
import { Close } from './Close'
import { Root } from './Root'

// #region Styled components

export const Viewport = styled(ToastPrimitive.Viewport, {
  pointerEvents: 'none',
  padding: '$3',
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  maxWidth: '100vw'
})
// #endregion

export interface ToastProps {
  handleOpenChange?: (open: boolean) => void
}

export function Toast({ handleOpenChange }: ToastProps) {
  const { colorScheme } = useColorScheme()
  const [toast, close] = useToast(state => [state.current, state.close])

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {toast && (
          <Root
            key={toast.id}
            duration={toast.duration}
            open={toast !== undefined}
            onOpenChange={handleOpenChange}
            asChild
          >
            <motion.li
              initial={{ opacity: 0.5, x: 0, y: 100 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Title>{toast.title}</Title>
              <Close asChild>
                <motion.button
                  onClick={close}
                  whileHover={{
                    boxShadow:
                      colorScheme === 'light'
                        ? '0px 0px 0px 1px hsla(0, 0%,100%, 0.5)'
                        : '0px 0px 0px 1px hsla(0, 0%,100%, 0.3)'
                  }}
                >
                  <CloseIcon height="24" width="24" fill="white" />
                </motion.button>
              </Close>
            </motion.li>
          </Root>
        )}
      </AnimatePresence>
      <Viewport />
    </>
  )
}
