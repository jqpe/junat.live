import type { TranslateFn } from '@junat/core/i18n'
import type { Locale } from '~/types/common'

import { create } from 'zustand'

import { DEFAULT_LOCALE, LOCALES } from '@junat/core/constants'

interface I18nStore {
  locale: Locale
  changeLocale: (locale: Locale) => void
}

export const useI18nStore = create<I18nStore>(set => ({
  locale: DEFAULT_LOCALE,
  changeLocale: locale => set({ locale: getSupportedLocale(locale) }),
}))

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

export const translate: TranslateFn = locale => {
  return function getTranslatedValue(path) {
    const getLocale = (localeName: Omit<Locale, 'all'> = locale) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, unicorn/prefer-module
      const json = require(`@junat/i18n/${localeName}.json`)
      return path.split('.').reduce((obj, key) => obj[key], json)
    }

    if (locale === 'all') {
      const locales = LOCALES.map(l => [l, getLocale(l)])

      return Object.fromEntries(locales)
    }

    return getLocale()
  }
}
