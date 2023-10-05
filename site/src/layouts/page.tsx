import type { LayoutProps } from '@typings/layout_props'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/router'
import { useStations } from '~/lib/digitraffic'

const Footer = dynamic(() => {
  return import('@components/common/footer').then(mod => mod.AppFooter)
})

export default function Page({ children }: LayoutProps) {
  const router = useRouter()
  const { data: stations = [] } = useStations()

  return (
    <div className="pt-[1.875rem] m-auto w-max">
      <div className="px-[1.875rem] max-w-[500px] m-auto min-h-screen">
        {children}
      </div>
      <Footer router={router} stations={stations} />
    </div>
  )
}
