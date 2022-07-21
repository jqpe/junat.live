import * as ToastPrimitive from '@radix-ui/react-toast'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { useColorScheme } from '@junat/ui/hooks/use_color_scheme'
import CloseIcon from '@components/icons/Close.svg'
import { styled, keyframes } from '@junat/stitches'
import { useToast } from '../stores/toast'

const slideLeft = keyframes({
  from: { transform: 'translateX(-var(--radix-toast-swipe-end-x))' },
  to: { transform: 'translateX(-100%)', opacity: 0 }
})

// #region Styled components
const Title = styled(ToastPrimitive.Title, {
  margin: 'auto'
})
const Close = styled(ToastPrimitive.Close, {
  right: '0',
  display: 'flex',
  borderRadius: '30px',
  minHeight: '1.5rem',
  minWidth: '1.5rem',
  justifyContent: 'center',
  alignItems: 'center'
})
const Root = styled(ToastPrimitive.Root, {
  pointerEvents: 'all',
  padding: '0.35rem 0.725rem',
  borderRadius: '3px',
  backgroundColor: '$slateGrayA800',
  color: '$slateGray200',
  backdropFilter: 'blur(3px)',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '500px',
  lineHeight: '130%',
  display: 'flex',
  '@dark': {
    backgroundColor: '$slateGrayA800',
    border: '1px solid $slateGray800'
  },
  '@media (prefers-reduced-motion: no-preference)': {
    '&[data-swipe="move"]': {
      transform: 'translateX(var(--radix-toast-swipe-move-x))'
    },
    '&[data-state="closed"]': {
      animation: `${slideLeft} 100ms ease-in forwards`
    },
    '&[data-swipe="cancel"]': {
      transform: 'translateX(0)',
      transition: 'transform 200ms ease-out'
    },
    '&[data-swipe="end"]': {
      animation: `${slideLeft} 500ms cubic-bezier(.02,1.23,1,.99) forwards`
    }
  }
})
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
  handleOpenChange: (open: boolean) => void
}

export function Toast({ handleOpenChange }: ToastProps) {
  const { colorScheme } = useColorScheme()
  const [toast, close] = useToast(state => [state.current, state.close])

  return (
    <AnimatePresence>
      {toast ? (
        <>
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
          <Viewport />
        </>
      ) : (
        <></>
      )}
    </AnimatePresence>
  )
}
