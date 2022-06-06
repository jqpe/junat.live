import type { Locale } from '@junat/cms/dist/types/common'

export const getLocale = (locale?: string) => {
  if (!locale || !/(fi)|(en)|(sv)/.test(locale)) {
    throw new Error(`Unimplemented locale ${locale}`)
  }
  return locale as Locale
}
