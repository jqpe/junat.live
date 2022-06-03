import type constants from 'src/constants'
import type { ReactNode } from 'react'

export interface LayoutProps {
  children: ReactNode | ReactNode[]
  layoutProps: typeof constants & { locale: 'fi' | 'en' | 'sv' }
}
