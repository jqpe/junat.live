import type { PropsWithChildren } from 'react'

const { AppFooter: Footer } = await import('~/components/footer')

const { Menu } = await import('~/components/menu')

export default function Page({ children }: PropsWithChildren) {
  return (
    <div className="m-auto w-[100%]">
      <Menu />

      <div className="m-auto min-h-screen max-w-[500px] px-[1.875rem] pt-16">
        {children}
      </div>
      <Footer />
    </div>
  )
}
