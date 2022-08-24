import type constants from 'src/constants'
import type { ReactNode } from 'react'
import type { Locale } from './common'

export interface LayoutProps {
  children: ReactNode | ReactNode[]
  layoutProps: typeof constants & { locale: Locale }
}
