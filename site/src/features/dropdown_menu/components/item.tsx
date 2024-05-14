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
  return <DropdownMenuItem {...props} ref={ref} className={className} />
})

export const className = `
    px-3 rounded-sm select-none duration-200 grid grid-cols-[1fr,24px]
    items-center cursor-pointer min-h-[35px] text-[13px] font-ui
    dark:focus:bg-gray-700 focus:bg-gray-100 transition-[background-color]
`
