import type { ReactNode } from 'react'
import type { TranslateFn, TranslationBase } from '@junat/core/i18n'
import type { Locale } from '~/types/common'

import React, { useContext } from 'react'

import { DEFAULT_LOCALE, LOCALES } from '@junat/core/constants'

const i18n = Object.entries(
  import.meta.glob('../../packages/i18n/src/*.json', {
    eager: true,
    import: 'default',
  }),
).reduce(
  (acc, [path, translations]) => {
    const locale = path.split('/').pop()?.replace('.json', '') as Locale
    return { ...acc, [locale]: translations }
  },
  {} as Record<Locale, TranslationBase>,
)

interface LocaleProviderProps {
  locale: string
  children: ReactNode | ReactNode[]
}

export const LocaleProvider = (props: LocaleProviderProps) => {
  const value = React.useMemo(
    () => ({ locale: getSupportedLocale(props.locale) }),
    [props.locale],
  )

  return (
    <LocaleContext.Provider value={value}>
      {props.children}q
    </LocaleContext.Provider>
  )
}

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
  const context = useContext(LocaleContext)

  if (!context) {
    throw new TypeError('useTranslations must be used inside LocaleProvider!')
  }

  return translate(context.locale)
}

export function useLocale() {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new TypeError('useLocale must be used inside LocaleProvider!')
  }

  return context.locale
}

/**
 * @private
 */
const LocaleContext = React.createContext({ locale: DEFAULT_LOCALE as Locale })

export const translate: TranslateFn = locale => {
  return function getTranslatedValue(path) {
    const getLocale = (localeName: Locale = locale as Locale) => {
      console.log(localeName, i18n)

      // @ts-expect-error TODO: string can not be used to index type
      return path.split('.').reduce((obj, key) => obj[key], i18n[localeName])
    }

    if (locale === 'all') {
      const locales = LOCALES.map(l => [l, getLocale(l)])

      return Object.fromEntries(locales)
    }

    return getLocale()
  }
}
