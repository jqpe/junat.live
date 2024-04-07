import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Header } from '~/components/header'
import Page from '~/layouts/page'
import { getLocale } from '~/utils/get_locale'
import translate from '~/utils/translate'

const ThemeToggle = dynamic(
  import('~/components/theme_toggle').then(mod => mod.ThemeToggle),
  { ssr: false, loading: () => <div className="h-[34px]" /> }
)

export const Settings = () => {
  const router = useRouter()
  const t = translate(getLocale(router.locale))

  return (
    <main>
      <Header heading={t('settings')} />
      <div className="dark:bg-gray-800 dark:bg-opacity-40 bg-gray-200 bg-opacity-50 px-2 py-2 rounded-md flex justify-between items-center flex-wrap">
        <span>{t('theme')}</span>
        <ThemeToggle />
      </div>
    </main>
  )
}

Settings.layout = Page
