import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import '../styles/global.css'
import '../styles/reset.css'

import { Menu } from '~/components/menu'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="m-auto w-[100%]">
        <Menu />

        <div className="m-auto min-h-screen max-w-[500px] px-[1.875rem] pt-16">
          <Outlet />
        </div>
      </div>

      <TanStackRouterDevtools />
    </>
  ),
})
