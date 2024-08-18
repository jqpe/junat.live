import type { TranslateFn } from '@junat/core/i18n'
import type { Locale } from '~/types/common'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DEFAULT_LOCALE, LOCALES } from '@junat/core/constants'

import { zustandTauriAdapter } from '~/store'

interface I18nStore {
  locale: Locale
  changeLocale: (locale: Locale) => void
}

export const useI18nStore = create<I18nStore>()(
  persist(
    set => ({
      locale: DEFAULT_LOCALE,
      changeLocale: locale => set({ locale: getSupportedLocale(locale) }),
    }),
    {
      name: 'locale-preference',
      storage: zustandTauriAdapter(),
      partialize(state) {
        return { locale: state.locale }
      },
    },
  ),
)

export const getSupportedLocale = (locale?: string): Locale => {
  const isSupportedLocale = (locale?: string): locale is Locale => {
    return LOCALES.includes(locale as Locale)
  }

  if (!locale || !isSupportedLocale(locale)) {
    throw new Error(`Unimplemented locale ${locale}`)
  }
  return locale
}

export function useTranslations() {
  const locale = useI18nStore(state => state.locale)
  return translate(locale)
}

const json = {
  fi: (await import('@junat/i18n/fi.json')).default,
  en: (await import('@junat/i18n/en.json')).default,
  sv: (await import('@junat/i18n/sv.json')).default,
}

export const translate: TranslateFn = locale => {
  return function getTranslatedValue(path) {
    const getLocale = (localeName: Omit<Locale, 'all'> = locale) => {
      // @ts-expect-error Type 'Omit<"fi" | "en" | "sv", "all">' cannot be used as an index type. ts(2538)
      return path.split('.').reduce((obj, key) => obj[key], json[localeName])
    }

    if (locale === 'all') {
      const locales = LOCALES.map(l => [l, getLocale(l)])

      return Object.fromEntries(locales)
    }

    return getLocale()
  }
}
