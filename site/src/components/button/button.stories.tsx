import type { Meta, StoryFn } from '@storybook/react'

import { Button } from '.'

export const Default: StoryFn<typeof Button> = args => {
  return <Button {...args}>primary button</Button>
}

export default {
  component: Button,
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof Button>
