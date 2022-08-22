import type { Locale } from '../types/common'

export const getLocale = (locale?: string) => {
  if (!locale || !/(fi)|(en)|(sv)/.test(locale)) {
    throw new Error(`Unimplemented locale ${locale}`)
  }
  return locale as Locale
}
