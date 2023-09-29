import type { LayoutProps } from '@typings/layout_props'

import dynamic from 'next/dynamic'

import { StyledContent, StyledPage } from './styles'
import { useRouter } from 'next/router'
import { useStations } from '~/lib/digitraffic'

const Footer = dynamic(() => {
  return import('@components/common/footer').then(mod => mod.AppFooter)
})

export default function Page({ children }: LayoutProps) {
  const router = useRouter()
  const { data: stations = [] } = useStations()

  return (
    <StyledPage>
      <StyledContent>{children}</StyledContent>
      <Footer router={router} stations={stations} />
    </StyledPage>
  )
}
