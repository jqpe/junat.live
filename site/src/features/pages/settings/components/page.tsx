import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Label } from '@junat/ui/components/form/label'
import Globe from '@junat/ui/icons/globe.svg'
import Palette from '@junat/ui/icons/palette.svg'

import { Head } from '~/components/head'
import { useTranslations } from '~/i18n'
import Page from '~/layouts/page'
import { LanguageToggle } from './language_toggle'
import { SettingsToggleItem } from './settings_toggle_item'

const ThemeToggle = dynamic(
  import('./theme_toggle').then(mod => mod.ThemeToggle),
  { ssr: false, loading: () => <div className="h-[31px]" /> },
)

export const Settings = () => {
  const router = useRouter()
  const t = useTranslations()

  const icon = {
    className: 'dark:fill-gray-500 fill-gray-400',
    height: 16,
    width: 16,
    viewBox: '0 0 24 24',
  }

  return (
    <>
      <Head
        title={t('settings')}
        description={t('settings')}
        path={router.asPath}
      >
        <meta name="robots" content="noindex" />
      </Head>
      <main>
        <h1 className="mb-5 md:mb-8">{t('settings')}</h1>
        <div className="flex flex-col gap-2">
          <SettingsToggleItem
            icon={<Palette {...icon} />}
            label={<Label>{t('theme')}</Label>}
            toggle={<ThemeToggle />}
          />
          <SettingsToggleItem
            icon={<Globe {...icon} />}
            label={<Label>{t('language')}</Label>}
            toggle={<LanguageToggle />}
          />
        </div>
      </main>
    </>
  )
}

Settings.layout = Page
