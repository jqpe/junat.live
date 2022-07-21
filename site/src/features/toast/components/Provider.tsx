import { ToastProvider } from '@radix-ui/react-toast'
import { ReactNode } from 'react'

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
