import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'

const ToastProvider = dynamic(() =>
  import('@features/toast').then(mod => mod.ToastProvider)
)
const DialogProvider = dynamic(() =>
  import('@components/elements/dialog').then(mod => mod.DialogProvider)
)

const Toast = dynamic(() => import('@features/toast').then(mod => mod.Toast))

interface AppProviderProps {
  children: ReactNode | ReactNode[]
}

export function AppProvider({ children }: AppProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1 } }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <DialogProvider>
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </DialogProvider>
    </QueryClientProvider>
  )
}
