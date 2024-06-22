import type { LayoutProps } from '~/types/layout_props'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/router'
import { useStations } from '~/lib/digitraffic'


const Footer = dynamic(() => {
  return import('~/components/footer').then(mod => mod.AppFooter)
})

const Menu = dynamic(() => import('~/components/menu').then(mod => mod.Menu))

export default function Page({ children }: LayoutProps) {
  const router = useRouter()
  const { data: stations = [] } = useStations()

  return (
    <div className="m-auto w-[100%]">
      <Menu />

      <div className="px-[1.875rem] max-w-[500px] m-auto min-h-screen pt-16">
        {children}
      </div>
      <Footer router={router} stations={stations} />
    </div>
  )
}
