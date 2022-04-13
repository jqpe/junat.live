import styles from './AppFooter.module.scss'

interface AppFooterProps {
  licenseHtml: string
}

export default function AppFooter({ licenseHtml }: AppFooterProps) {
  return (
    <footer className={styles.footer}>
      <section>
        <span
          dangerouslySetInnerHTML={{
            __html: licenseHtml
          }}
        />
      </section>
    </footer>
  )
}
