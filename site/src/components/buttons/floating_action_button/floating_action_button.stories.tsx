import type { StoryFn, Meta } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { FloatingActionButton } from './'
import Close from '~/components/icons/close.svg'

type Props = ComponentPropsWithoutRef<typeof FloatingActionButton>

export const Default: StoryFn<Props> = args => {
  return (
    <FloatingActionButton {...args}>
      <Close fill="white" />
    </FloatingActionButton>
  )
}

export default {
  component: FloatingActionButton,
  argTypes: {
    as: {
      table: {
        disable: true
      }
    },
    css: {
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<Props>
