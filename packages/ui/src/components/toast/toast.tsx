import {
  Root,
  ToastClose,
  ToastTitle,
  ToastViewport,
} from '@radix-ui/react-toast'
import { cx } from 'cva'
import { AnimatePresence, motion } from 'framer-motion'
import { shallow } from 'zustand/shallow'

import CloseIcon from '@junat/ui/icons/close.svg?react'

import { useToast } from './store'

export interface ToastProps {
  handleOpenChange?: (open: boolean) => void
}

export function Toast({ handleOpenChange }: ToastProps) {
  const [toast, close] = useToast(
    state => [state.current, state.close],
    shallow,
  )

  return (
    <>
      <AnimatePresence mode="wait">
        {toast && (
          <Root
            className={cx(
              'pointer-events-auto flex max-w-[500px] items-center justify-between text-gray-200',
              'rounded-[3px] bg-grayA-800 px-[0.725rem] py-[0.35rem] leading-[130%]',
              'backdrop-blur-sm dark:bg-grayA-800 dark:[border:1px_solid_theme(colors.gray.800)]',
            )}
            key={toast.id}
            duration={toast.duration}
            open={toast !== undefined}
            onOpenChange={handleOpenChange}
            asChild
          >
            <motion.li
              initial={{ opacity: 0.5, x: 0, y: 100 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              drag="x"
              dragConstraints={{ right: 0 }}
              dragElastic={false}
              dragTransition={{ power: 10 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < 0) {
                  close()
                }
              }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ToastTitle className="m-auto">{toast.title}</ToastTitle>
              <ToastClose
                asChild
                className={cx(
                  'right-0 flex min-h-[1.5rem] min-w-[1.5rem]',
                  'content-center items-center rounded-full',
                )}
              >
                <motion.button
                  onClick={close}
                  className="[--toast-shadow:.5] dark:[--toast-shadow:.3]"
                  whileHover={{
                    boxShadow:
                      '0px 0px 0px 1px hsla(0, 0%,100%, var(--toast-shadow))',
                  }}
                >
                  <CloseIcon height="24" width="24" fill="white" />
                </motion.button>
              </ToastClose>
            </motion.li>
          </Root>
        )}
      </AnimatePresence>
      <ToastViewport
        className={cx(
          'max-w-[100vw pointer-events-none fixed inset-0',
          'flex items-end justify-start p-4',
        )}
      />
    </>
  )
}
