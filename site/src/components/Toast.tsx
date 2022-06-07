import type { ReactNode } from 'react'
import type { DragHandlers } from 'framer-motion'

import * as ToastPrimitive from '@radix-ui/react-toast'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { useColorScheme } from '@junat/ui/hooks/use_color_scheme'
import CloseIcon from '@components/icons/Close.svg'
import { styled } from '@junat/stitches'

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
  minHeight: '50px',
  lineHeight: '130%',
  display: 'flex',
  '@dark': {
    backgroundColor: '$slateGrayA800',
    border: '1px solid $slateGray800'
  },
  '&::before': {
    content: "''",
    width: '2px',
    position: 'absolute',
    left: '3px',
    top: '10%',
    bottom: '10%',
    backgroundColor: '$primary500',
    borderRadius: '30px'
  }
})
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
// #endregion

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
              initial={{ opacity: 0.5, x: 0, y: 100 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Title>{title}</Title>
              <Close asChild>
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
