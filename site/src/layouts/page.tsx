import type { PropsWithChildren } from 'react'

import dynamic from 'next/dynamic'

import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { translate } from '~/i18n'

const Footer = dynamic(() => {
  return import('~/components/footer').then(mod => mod.AppFooter)
})

const Menu = dynamic(() => import('~/components/menu').then(mod => mod.Menu))

export default function Page({ children }: Readonly<PropsWithChildren>) {
  const { data: stations = [] } = useStations({ t: translate('all') })

  return (
    <div className="m-auto w-[100%]">
      <Menu />

      <div className="m-auto min-h-screen max-w-[500px] px-[1.875rem] pt-16">
        {children}
      </div>
      <Footer stations={stations} />
    </div>
  )
}
