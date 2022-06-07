import type { ReactNode } from 'react'
import type { DragHandlers } from 'framer-motion'

import * as ToastPrimitive from '@radix-ui/react-toast'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import styles from './Toast.module.scss'

import { useColorScheme } from '@junat/ui/hooks/use_color_scheme'
import CloseIcon from '@components/icons/Close.svg'
import { styled } from '@junat/stitches'

const Title = styled(ToastPrimitive.Title, {
  margin: 'auto'
})
const Close = styled(ToastPrimitive.Close, {})
const Root = styled(ToastPrimitive.Root, {})
const Viewport = styled(ToastPrimitive.Viewport, {
  pointerEvents: 'none',
  padding: '$3',
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  maxWidth: '100vw'
})

interface ToastProps {
  open: boolean
  title: ReactNode
  handleOpenChange: (open: boolean) => void
  /**
   * Duration in milliseconds
   *
   * @default 3000
   */
  duration?: number
}

export default function Toast({
  open,
  handleOpenChange,
  title,
  duration = 3000
}: ToastProps) {
  const onDrag: DragHandlers['onDrag'] = (_, info) => {
    if (info.offset.x <= 3) handleOpenChange(false)
  }

  React.useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        handleOpenChange(false)
      }, duration)

      return () => {
        window.clearTimeout(timeout)
      }
    }
  }, [duration, handleOpenChange, open])

  const { colorScheme } = useColorScheme()

  return (
    <ToastPrimitive.ToastProvider
      swipeDirection="left"
      swipeThreshold={Infinity}
    >
      <AnimatePresence>
        {open && (
          <Root
            duration={Infinity}
            open={open}
            onOpenChange={handleOpenChange}
            asChild
          >
            <motion.li
              drag="x"
              dragConstraints={{ left: -300, right: 0 }}
              onDragEnd={onDrag}
              className={styles.toast}
              initial={{ opacity: 0.5, x: 0, y: 100 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Title className={styles.title}>{title}</Title>
              <Close className={styles.closeButton} asChild>
                <motion.button
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

      <Viewport data-open={open} />
    </ToastPrimitive.ToastProvider>
  )
}
