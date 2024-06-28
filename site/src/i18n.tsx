import type { Router } from 'next/router'
import type { ReactNode } from 'react'
import type { TranslateFn } from '@junat/core/i18n'
import type { Locale } from '~/types/common'

import React, { useContext } from 'react'

import { DEFAULT_LOCALE, LOCALES } from '@junat/core/constants'

interface LocaleProviderProps {
  locale: Router['locale']
  children: ReactNode | ReactNode[]
}

export const LocaleProvider = (props: LocaleProviderProps) => {
  const value = React.useMemo(
    () => ({ locale: getSupportedLocale(props.locale) }),
    [props.locale],
  )

  return (
    <LocaleContext.Provider value={value}>
      {props.children}
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
    const getLocale = (localeName: Omit<Locale, 'all'> = locale) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
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
