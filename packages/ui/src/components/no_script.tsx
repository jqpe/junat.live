import type { ForwardRefComponent } from '../types/polymorphic'

import React from 'react'
import { cx } from 'cva'

import { useUi } from '@junat/react-hooks/ui'

export const NoScript = React.forwardRef(
  ({ as: As = 'noscript', ...props }, ref) => {
    const { t } = useUi()

    return (
      <As
        {...props}
        ref={ref}
        className={cx(
          'fixed inset-x-0 top-header-height flex flex-col items-center justify-center',
          'z-50 bg-gray-900 p-[10px] text-gray-100 dark:bg-gray-100 dark:text-gray-900',
          props.className,
        )}
      >
        {props.children ?? <p>{t('errors.nojs')}</p>}
      </As>
    )
  },
) as ForwardRefComponent<'noscript'>
