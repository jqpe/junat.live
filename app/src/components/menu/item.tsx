import React from 'react'
import { Link } from '@tanstack/react-router'
import { cx } from 'cva'

type Props = React.ComponentProps<typeof Link>

export const MenuItem = (props: Props) => {
  return (
    <li>
      <Link
        {...props}
        activeProps={{
          'aria-current': 'page',
        }}
        data-menu-item={true}
        className={cx(
          'text-2xl tracking-wider dark:text-gray-300 dark:hover:decoration-white',
          'text-gray-800 decoration-transparent hover:text-primary-600',
          'font-bold focus-visible:text-primary-600 dark:hover:text-white',
          'dark:focus-visible:text-white dark:focus-visible:decoration-white',
        )}
      />
    </li>
  )
}
