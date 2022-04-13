import AppFooter from '@components/AppFooter'
import type { LayoutProps } from '@typings/layout_props'

import styles from './Page.module.scss'

export default function Page({ children, layoutProps }: LayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.content}>{children}</div>
      <AppFooter licenseHtml={layoutProps.LICENSE[layoutProps.locale]} />
    </div>
  )
}
