import type { ForwardRefComponent } from '../../types/polymorphic'

import React from 'react'
import { cx } from 'cva'

import { useUi } from '@junat/react-hooks/ui/index'

export const MenuItem = React.forwardRef(props => {
  const { Link } = useUi()

  return (
    <li>
      <Link
        {...props}
        data-menu-item={true}
        className={cx(
          'text-2xl tracking-wider dark:text-gray-300 dark:hover:decoration-white',
          'text-gray-800 decoration-transparent hover:text-primary-600',
          'font-bold focus-visible:text-primary-600 dark:hover:text-white',
          'dark:focus-visible:text-white dark:focus-visible:decoration-white',
          props.className,
        )}
      />
    </li>
  )
}) as ForwardRefComponent<'a', { href: string }>
