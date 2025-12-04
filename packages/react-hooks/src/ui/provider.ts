import type { GetTranslatedValue, TranslateFn } from '@junat/core/i18n'
import type { Locale } from '@junat/core/types'

import { createContext } from 'react'

/* eslint-disable @typescript-eslint/naming-convention */

export interface UiCtx {
  t: GetTranslatedValue
  translate: TranslateFn
  locale: Locale
  Link: React.ForwardRefExoticComponent<
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string
    } & React.RefAttributes<HTMLAnchorElement> &
      NextLinkProps
  >
}

export const UiContext = createContext<UiCtx>(null!)

type NextLinkProps = Partial<{
  locale: string | false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNavigate: (event: any) => unknown
  shallow?: boolean
  replace?: boolean
  scroll?: boolean
  prefetch?: boolean
  legacyBehavior?: boolean
  passHref?: boolean
}>
