import type { PropsWithChildren } from 'react'

import dynamic from 'next/dynamic'

import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { translate } from '~/i18n'

const Footer = dynamic(() => {
  return import('~/components/footer').then(mod => mod.AppFooter)
})

const Menu = dynamic(() => import('~/components/menu').then(mod => mod.Menu))

export default function FullWidthPage({
  children,
}: Readonly<PropsWithChildren>) {
  const { data: stations = [] } = useStations({ t: translate('all') })

  return (
    <div className="m-auto w-full">
      <Menu />

      <div className="min-h-screen">{children}</div>
      <div className="-mt-[3rem]">
        <Footer stations={stations} />
      </div>
    </div>
  )
}
