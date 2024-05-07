import {
  DropdownMenuItem,
  type MenuItemProps
} from '@radix-ui/react-dropdown-menu'
import React from 'react'

type Props = Omit<MenuItemProps, 'className'>

export const Item = React.forwardRef<HTMLDivElement, Props>(function Item(
  props: Props,
  ref
) {
  return (
    <DropdownMenuItem
      {...props}
      ref={ref}
      className="px-3 rounded-sm select-none transition-[background-color] duration-200 grid grid-cols-[1fr,24px]
          items-center cursor-pointer min-h-[35px] text-[13px] font-ui"
    />
  )
})
