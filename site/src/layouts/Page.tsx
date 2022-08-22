import type { LayoutProps } from '@typings/layout_props'

import { styled } from '@config/theme'

import Footer from '@components/common/AppFooter'

const StyledPage = styled('div', {
  paddingTop: '1.875rem',
  width: '100%',
  margin: 'auto',
  '& header': {
    marginBottom: '20px'
  }
})

const StyledContent = styled('div', {
  paddingInline: '1.875rem',
  margin: 'auto',
  maxWidth: '500px',
  minHeight: '100vh'
})

export default function Page({ children }: LayoutProps) {
  return (
    <StyledPage>
      <StyledContent>{children}</StyledContent>
      <Footer />
    </StyledPage>
  )
}
