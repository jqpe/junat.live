import type { LayoutProps } from '@typings/layout_props'

import dynamic from 'next/dynamic'

import { StyledContent, StyledPage } from './styles'

const Footer = dynamic(() => import('@components/common/footer'))

export default function Page({ children }: LayoutProps) {
  return (
    <StyledPage>
      <StyledContent>{children}</StyledContent>
      <Footer />
    </StyledPage>
  )
}
