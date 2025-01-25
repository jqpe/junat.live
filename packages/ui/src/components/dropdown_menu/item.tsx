import type { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu'

import React from 'react'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { cx } from 'cva'

export const Item = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function Item(props, ref) {
    return (
      <DropdownMenuItem
        {...props}
        ref={ref}
        className={cx(className, props.className)}
      />
    )
  },
)

export const className = cx(
  'grid grid-cols-[1fr,24px] rounded-sm px-3 duration-200 select-none',
  'font-ui min-h-[35px] items-center text-[13px]',
  'transition-[background-color] focus-visible:bg-gray-100 dark:focus-visible:bg-gray-700',
)
