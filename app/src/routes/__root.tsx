import { ToastProvider } from '@radix-ui/react-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router'

import { useWakeLock } from '@junat/react-hooks/use_wake_lock'
import { DialogProvider } from '@junat/ui/components/dialog'

import { queryClient } from '~/lib/react_query'

export const Route = createRootRoute({
  component: () => {
    void useWakeLock()

    return (
      <>
        <QueryClientProvider client={queryClient}>
          <DialogProvider>
            <ToastProvider>
              <ScrollRestoration />
              <Outlet />
            </ToastProvider>
          </DialogProvider>
        </QueryClientProvider>
      </>
    )
  },
})
