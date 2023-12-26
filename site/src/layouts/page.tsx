import type { LayoutProps } from '@typings/layout_props'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/router'
import { useStations } from '~/lib/digitraffic'

const Footer = dynamic(() => {
  return import('~/components/footer').then(mod => mod.AppFooter)
})

export default function Page({ children }: LayoutProps) {
  const router = useRouter()
  const { data: stations = [] } = useStations()

  return (
    <div>
      <div
        data-notification-slot
        className="h-[1.875rem] w-full [&:not:empty]:bg-primary-600 text-primary-200"
        aria-live="polite"
      />
      <div className="mt-2 px-[1.875rem] max-w-[500px] m-auto min-h-screen">
        {children}
      </div>
      <Footer router={router} stations={stations} />
    </div>
  )
}
