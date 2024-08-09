import type { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'

import { DropdownMenuCheckboxItem } from '@radix-ui/react-dropdown-menu'

import { className } from './item'

type Props = Omit<DropdownMenuCheckboxItemProps, 'className'>

export const CheckboxItem = (props: Props) => {
  return <DropdownMenuCheckboxItem {...props} className={className} />
}
