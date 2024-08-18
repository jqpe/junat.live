import { ToastProvider } from '@radix-ui/react-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'

import { DialogProvider } from '@junat/ui/components/dialog'

import { useWakeLock } from '~/hooks/use_wake_lock'
import { queryClient } from '~/lib/react_query'

export const Route = createRootRoute({
  component: () => {
    void useWakeLock()

    return (
      <>
        <QueryClientProvider client={queryClient}>
          <DialogProvider>
            <ToastProvider>
              <Outlet />
            </ToastProvider>
          </DialogProvider>
        </QueryClientProvider>
      </>
    )
  },
})
