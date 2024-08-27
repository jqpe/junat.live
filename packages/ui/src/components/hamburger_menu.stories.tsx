import type { Meta, StoryFn } from '@storybook/react'

import React from 'react'
import { userEvent, within } from '@storybook/test'

import { HamburgerMenu } from './hamburger_menu'

export const Default: StoryFn<typeof HamburgerMenu> = args => {
  const [isOpen, setIsOpen] = React.useState(false)

  return <HamburgerMenu isOpen={isOpen} onOpenChange={setIsOpen} t={args.t} />
}

Default.play = async ctx => {
  const button = await within(ctx.canvasElement).findByRole('button')

  await userEvent.click(button)

  await userEvent.click(button)
}

export default {
  component: HamburgerMenu,
  args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: (() => 'toggle menu') as any,
  },
} satisfies Meta<typeof HamburgerMenu>
