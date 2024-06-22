import type { ReactNode } from 'react'

import { ToastProvider } from '@radix-ui/react-toast'

export const Provider = ({
  children
}: {
  children?: ReactNode | ReactNode[]
}) => {
  return (
    <ToastProvider swipeDirection="left" swipeThreshold={20}>
      {children}
    </ToastProvider>
  )
}
