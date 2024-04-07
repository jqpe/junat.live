import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import Palette from '~/components/icons/palette.svg'

import { Header } from '~/components/header'
import Page from '~/layouts/page'
import { getLocale } from '~/utils/get_locale'
import translate from '~/utils/translate'
import { SettingsToggleItem } from './settings_toggle_item'

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
      <div className="dark:bg-gray-800 dark:bg-opacity-40 bg-gray-200 bg-opacity-50 px-2 py-2 rounded-md flex flex-col gap-2">
        <SettingsToggleItem
          icon={<Palette className="dark:fill-gray-500 fill-gray-400" />}
          label={t('theme')}
          toggle={<ThemeToggle />}
        />
      </div>
    </main>
  )
}

Settings.layout = Page
