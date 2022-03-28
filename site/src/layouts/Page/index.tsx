import { ReactChild } from 'react'

import styles from './Page.module.scss'

export default function Page({
  children
}: {
  children: ReactChild | ReactChild[]
}) {
  return <div className={styles.page}>{children}</div>
}
