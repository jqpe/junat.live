import type { PropsWithChildren } from 'react'
import type React from 'react'

import { cx } from 'cva'

import { useTranslations } from '~/i18n'

export function NoScript(
  props: PropsWithChildren<{
    as?: React.ElementType
  }>,
) {
  const As = props.as ?? 'noscript'
  const t = useTranslations()

  return (
    <As
      className={cx(
        'fixed left-0 right-0 top-header-height flex flex-col items-center justify-center',
        'z-50 bg-gray-900 p-[10px] text-gray-100 dark:bg-gray-100 dark:text-gray-900',
      )}
    >
      <p>{props.children ?? t('errors.nojs')}</p>
    </As>
  )
}

export default NoScript
