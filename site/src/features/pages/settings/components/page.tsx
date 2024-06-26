import type { SVGProps } from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import Globe from '~/components/icons/globe.svg'
import Palette from '~/components/icons/palette.svg'

import { Header } from '~/components/header'

import Page from '~/layouts/page'

import { translate } from '@junat/locales'
import { getLocale } from '~/utils/get_locale'

import { LanguageToggle } from './language_toggle'
import { SettingsToggleItem } from './settings_toggle_item'

import { Head } from '~/components/head'
import { Label } from '~/components/label'

const ThemeToggle = dynamic(
  import('./theme_toggle').then(mod => mod.ThemeToggle),
  { ssr: false, loading: () => <div className="h-[31px]" /> }
)

export const Settings = () => {
  const router = useRouter()
  const t = translate(getLocale(router.locale))

  const icon: SVGProps<SVGElement> = {
    className: 'dark:fill-gray-500 fill-gray-400',
    height: 16,
    width: 16,
    viewBox: '0 0 24 24'
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
