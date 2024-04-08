import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import Globe from '~/components/icons/globe.svg'
import Palette from '~/components/icons/palette.svg'

import { Header } from '~/components/header'
import { RadioGroup } from '~/components/radio_group'
import { LOCALES } from '~/constants'
import Page from '~/layouts/page'
import { getLocale } from '~/utils/get_locale'
import translate from '~/utils/translate'
import { SettingsToggleItem } from './settings_toggle_item'

const ThemeToggle = dynamic(
  import('./theme_toggle').then(mod => mod.ThemeToggle),
  { ssr: false, loading: () => <div className="h-[31px]" /> }
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
        <SettingsToggleItem
          icon={<Globe className="dark:fill-gray-500 fill-gray-400" />}
          label={t('language')}
          toggle={
            <RadioGroup
              defaultValue={getLocale(router.locale)}
              values={Object.fromEntries(
                LOCALES.map<string[]>(locale => [locale, locale.toUpperCase()])
              )}
              onValueChange={locale => {
                router.replace(router.pathname, router.asPath, { locale })

                Cookies.set('NEXT_LOCALE', locale, {
                  sameSite: 'Lax',
                  secure: true,
                  expires: 365
                })
              }}
            />
          }
        />
      </div>
    </main>
  )
}

Settings.layout = Page
