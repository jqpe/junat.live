import type { PropsWithChildren } from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { translate } from '~/i18n'

const Footer = dynamic(() =>
  import('~/components/footer').then(mod => mod.AppFooter),
)

const Menu = dynamic(() =>
  import('@junat/ui/components/menu/index').then(mod => mod.Menu),
)

export default function Page({ children }: Readonly<PropsWithChildren>) {
  const { data: stations = [] } = useStations({ t: translate('all') })
  const router = useRouter()

  return (
    <div className="m-auto w-full">
      <Menu asPath={router.asPath} pathname={router.pathname} />

      <div className="m-auto min-h-screen max-w-[500px] px-[1.875rem] pt-16">
        {children}
      </div>
      <Footer stations={stations} />
    </div>
  )
}
