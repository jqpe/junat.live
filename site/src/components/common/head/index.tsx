import NextHead from 'next/head'
import { ReactNode } from 'react'

import { DEFAULT_LOCALE, LOCALES } from '~/constants'
import { Locale } from '~/types/common'
import { fullUrl } from './helpers'

interface Props {
  path: string
  title: string
  description: string

  children?: ReactNode | ReactNode[]
  replace?: Record<Locale, Record<string, string>>
}

export const Head = (props: Props) => {
  const alternateLocales = LOCALES.filter(locale => locale !== DEFAULT_LOCALE)

  return (
    <NextHead>
      {alternateLocales.map(locale => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={fullUrl(props.path, locale)}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={fullUrl(props.path)} />

      <title>{props.title}</title>
      <meta name="description" content={props.description} />

      {props.children}
    </NextHead>
  )
}
