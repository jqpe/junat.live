import type { Meta, StoryFn } from '@storybook/react'

import { Menu } from '.'

export const Default: StoryFn<typeof Menu> = () => {
  return <Menu asPath="/routes.settings" pathname="routes.settings" />
}

export default {
  component: Menu,
} satisfies Meta<typeof Menu>
