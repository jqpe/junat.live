import type { LayoutProps } from '@typings/layout_props'

import dynamic from 'next/dynamic'

import { StyledContent, StyledPage } from './styles'

const Footer = dynamic(() => {
  return import('@components/common/footer').then(mod => mod.AppFooter)
})

export default function Page({ children }: LayoutProps) {
  return (
    <StyledPage>
      <StyledContent>{children}</StyledContent>
      <Footer />
    </StyledPage>
  )
}
