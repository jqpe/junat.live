import type { GetTranslatedValue, TranslateFn } from '@junat/core/i18n'

import { createContext } from 'react'

/* eslint-disable @typescript-eslint/naming-convention */

export interface UiCtx {
  t: GetTranslatedValue
  translate: TranslateFn
  Link: React.ForwardRefExoticComponent<
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string
    } & React.RefAttributes<HTMLAnchorElement>
  >
}

export const UiContext = createContext<UiCtx>(null!)
