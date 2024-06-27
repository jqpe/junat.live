import type { Router } from 'next/router'
import type { ReactNode } from 'react'
import type { Locale } from '~/types/common'

import React, { useContext } from 'react'
import { LOCALES } from 'src/constants'

import { DEFAULT_LOCALE } from '~/constants'
import { translate } from '~/utils/translate'

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
