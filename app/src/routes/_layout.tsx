import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Toast } from '~/components/toast'

export const Route = createFileRoute('/_layout')({
  component: PageLayout,
})

const { AppFooter: Footer } = await import('~/components/footer')

const { Menu } = await import('~/components/menu')

function PageLayout() {
  return (
    <div className="m-auto w-[100%]">
      <Menu />

      <div className="m-auto min-h-screen max-w-[500px] px-[1.875rem] pt-16">
        <Outlet />
      </div>

      <Toast />

      <Footer />
    </div>
  )
}
