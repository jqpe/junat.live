import type { PropsWithChildren } from 'react'

import dynamic from 'next/dynamic'

const Footer = dynamic(() => {
  return import('~/components/footer').then(mod => mod.AppFooter)
})

const Menu = dynamic(() => import('~/components/menu').then(mod => mod.Menu))

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
