import {
  DropdownMenuCheckboxItem,
  type MenuCheckboxItemProps
} from '@radix-ui/react-dropdown-menu'
import { className } from './item'

type Props = Omit<MenuCheckboxItemProps, 'className'>

export const CheckboxItem = (props: Props) => {
  return <DropdownMenuCheckboxItem {...props} className={className} />
}
