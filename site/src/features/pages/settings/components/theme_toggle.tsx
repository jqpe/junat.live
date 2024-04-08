import { useRouter } from 'next/router'

import { RadioGroup } from '~/components/radio_group'

import translate from '~/utils/translate'
import { getLocale } from '~/utils/get_locale'

export const ThemeToggle = () => {
  const defaultValue = localStorage.getItem('theme') ?? 'system'
  const router = useRouter()
  const t = translate(getLocale(router.locale))

  return (
    <RadioGroup
      defaultValue={defaultValue}
      values={{
        light: t('themeVariants', 'light'),
        dark: t('themeVariants', 'dark'),
        system: t('themeVariants', 'system')
      }}
      onValueChange={onValueChange}
    />
  )
}

const onValueChange = (value: string) => {
  if (value === 'light') {
    window.__setPreferredTheme('light')
    return
  }

  if (value === 'dark') {
    window.__setPreferredTheme('dark')
    return
  }

  window.__setPreferredTheme()
  localStorage.removeItem('theme')

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  window.document.documentElement.classList[prefersDark ? 'add' : 'remove'](
    'dark'
  )
}
