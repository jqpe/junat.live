import {
  DropdownMenuCheckboxItem,
  type MenuCheckboxItemProps
} from '@radix-ui/react-dropdown-menu'

type Props = Omit<MenuCheckboxItemProps, 'className'>

export const CheckboxItem = (props: Props) => {
  return (
    <DropdownMenuCheckboxItem
      {...props}
      className="group px-3 rounded-sm select-none transition-[background-color] duration-200 grid grid-cols-[1fr,24px]
    items-center cursor-pointer min-h-[35px] text-[13px] font-ui"
    />
  )
}
