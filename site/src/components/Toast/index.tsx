import type { ReactNode } from 'react'
import type { DragHandlers } from 'framer-motion'

import {
  ToastProvider,
  Root,
  ToastTitle,
  ToastViewport,
  ToastClose
} from '@radix-ui/react-toast'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import styles from './Toast.module.scss'

import { useColorScheme } from '@junat/ui/hooks/use_color_scheme'
import Close from './Close.svg'

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
    <ToastProvider swipeDirection="left" swipeThreshold={Infinity}>
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
              <ToastTitle className={styles.title}>{title}</ToastTitle>
              <ToastClose className={styles.closeButton} asChild>
                <motion.button
                  whileHover={{
                    boxShadow:
                      colorScheme === 'light'
                        ? '0px 0px 0px 1px hsla(0, 0%,0%, 0.3)'
                        : '0px 0px 0px 1px hsla(0, 0%,100%, 0.3)'
                  }}
                >
                  <Close height="24" width="24" fill="white" />
                </motion.button>
              </ToastClose>
            </motion.li>
          </Root>
        )}
      </AnimatePresence>

      <ToastViewport className={styles.viewport} data-open={open} />
    </ToastProvider>
  )
}
