import type { Meta, StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { Header } from './'

type Props = ComponentPropsWithoutRef<typeof Header>

export const Default: StoryFn<Props> = args => {
  return <Header {...args}></Header>
}

export default {
  component: Header,
  args: {
    heading: 'Header',
  },
} satisfies Meta<typeof Header>
