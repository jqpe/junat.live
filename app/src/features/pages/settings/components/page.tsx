import { Label } from '@junat/ui/components/form/label'
import { Header } from '@junat/ui/components/header'
import Globe from '@junat/ui/icons/globe.svg'
import Palette from '@junat/ui/icons/palette.svg'

import { useTranslations } from '~/i18n'
import Page from '~/layouts/page'
import { LanguageToggle } from './language_toggle'
import { SettingsToggleItem } from './settings_toggle_item'

const { ThemeToggle } = await import('./theme_toggle')

export const Settings = () => {
  const t = useTranslations()

  const icon = {
    className: 'dark:fill-gray-500 fill-gray-400',
    height: 16,
    width: 16,
    viewBox: '0 0 24 24',
  }

  return (
    <>
      <main>
        <Header heading={t('settings')} />
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
