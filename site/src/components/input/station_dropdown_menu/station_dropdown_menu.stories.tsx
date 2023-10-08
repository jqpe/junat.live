import { Meta } from '@storybook/react'
import { StationDropdownMenu } from '.'

export const Default = () => {
  return (
    <StationDropdownMenu currentStation="HKI" locale="en" long={1} lat={1} />
  )
}

export default { component: StationDropdownMenu } satisfies Meta<
  typeof StationDropdownMenu
>
