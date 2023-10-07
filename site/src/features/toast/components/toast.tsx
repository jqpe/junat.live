import { AnimatePresence, motion } from 'framer-motion'

import CloseIcon from '@components/icons/close.svg'

import { useColorScheme } from '@hooks/use_color_scheme'

import {
  ToastClose,
  Root,
  ToastTitle,
  ToastViewport
} from '@radix-ui/react-toast'

import { useToast } from '../stores/toast'

export interface ToastProps {
  handleOpenChange?: (open: boolean) => void
}

export function Toast({ handleOpenChange }: ToastProps) {
  const { colorScheme } = useColorScheme()
  const [toast, close] = useToast(state => [state.current, state.close])

  return (
    <>
      <AnimatePresence mode="wait">
        {toast && (
          <Root
            className={`pointer-events-auto px-[0.725rem] py-[0.35rem] rounded-[3px] bg-grayA-800 text-gray-200 [backdrop-filter:blur(3px)] justify-between items-center max-w-[500px] leading-[130%] flex
            dark:bg-grayA-800 dark:[border:1px_solid_theme(colors.gray.800)]`}
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
                className="right-0 flex rounded-full min-h-[1.5rem] min-w-[1.5rem] content-center items-center"
              >
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
              </ToastClose>
            </motion.li>
          </Root>
        )}
      </AnimatePresence>
      <ToastViewport className="pointer-events-none p-4 fixed inset-0 flex items-end justify-start max-w-[100vw" />
    </>
  )
}
