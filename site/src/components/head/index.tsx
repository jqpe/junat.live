import NextHead from 'next/head'
import type { ReactNode } from 'react'

import { DEFAULT_LOCALE, LOCALES, SITE_NAME, SITE_URL } from '~/constants'
import type { Locale } from '~/types/common'
import { fullUrl } from './helpers'

interface Props {
  path: string
  title: string
  description: string

  children?: ReactNode | ReactNode[]
  replace?: Record<Locale, Record<string, string>>
  locale?: Locale
}

/**
 * Inject elements into `<head>` by passing props or children.
 *
 * ---
 * ## Alternate links
 *
 * Adds `<link rel="alternate"/>` -elements by leveraging the {@link DEFAULT_LOCALE} and {@link LOCALES} constants.
 * `DEFAULT_LOCALE` will be "x-default" and other locales are considered alternative.
 * ---
 *
 * ## Replace localized path segments
 *
 * Some paths might have localizations. In this case, you can pass `replace` and `locale` parameters.
 * - `replace` contains all possible translations in the form of: `Record<Locale, Record<string, string>>`.
 * - `locale` is the current locale; it's used to determine the string to replace.
 *
 * @example
 * ```ts
 * {
 *   replace: { [DEFAULT_LOCALE]: { train: 'juna' }, en: { train: 'train' } }, /// ...
 *   locale: DEFAULT_LOCALE,
 * }
 * ```
 *
 * Above, `path` is expected to have string 'juna' somewhere in it. For `x-default` it will remain unchanged, but for 'en' alternative it will be replaced with 'train'.
 * E.g. `/juna/1` would become `/train/1`. Note that only values specified in {@link LOCALES} will work.
 *
 * ---
 */
export const Head = (props: Props) => {
  const IMAGE_URL = `${SITE_URL}/api/open_graph?title=${props.title}` as const
  const IMAGE_ALT = props.description
  const URL = `${SITE_URL}${props.path}` as const

  const alternativeLocales = LOCALES.filter(locale => locale !== DEFAULT_LOCALE)

  return (
    <NextHead>
      {alternativeLocales.map(locale => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={fullUrl(props.path, {
            locale,
            currentLocale: props.locale,
            replace: props.replace
          })}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={fullUrl(props.path)} />

      <title>{props.title}</title>
      <meta name="description" content={props.description} />

      {/** Open Graph */}
      <meta property="og:url" content={`${SITE_URL}${props.path}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta property="og:image" content={IMAGE_URL} />
      <meta property="og:image:alt" content={IMAGE_ALT} />
      <meta property="og:locale" content={props.locale} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/** Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@junat_live" />
      <meta name="twitter:url" content={URL} />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:image" content={IMAGE_URL} />
      <meta name="twitter:image:alt" content={IMAGE_ALT} />

      {props.children}
    </NextHead>
  )
}
