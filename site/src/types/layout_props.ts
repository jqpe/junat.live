import type constants from 'src/constants'
import type { ReactChild } from 'react'

export interface LayoutProps {
  children: ReactChild | ReactChild[]
  layoutProps: typeof constants & { locale: 'fi' | 'en' | 'sv' }
}
