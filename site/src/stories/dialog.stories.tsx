import type { StoryFn, StoryObj } from '@storybook/react'

import type { DialogProps } from '~/components/elements/dialog'

import {
  Dialog,
  DialogButton,
  DialogProvider
} from '~/components/elements/dialog'

const DialogTemplate: StoryFn<DialogProps> = args => {
  return (
    <DialogProvider>
      <DialogButton>open</DialogButton>

      <Dialog {...args} />
    </DialogProvider>
  )
}

export const Default: StoryObj<DialogProps> = {}
export const VerticalOverflow: StoryObj<DialogProps> = {
  args: {
    title: 'Vertically overflowing content',
    description: 'Tests whether vertical oveflow is handled.',
    children: Array.from({ length: 200 })
      .fill(null)
      .map((_, i) => <div key={i}>{i + 1}</div>)
  }
}

export const HorizontalOverflow: StoryObj<DialogProps> = {
  args: {
    title: 'Horizontally overflowing content',
    description: 'Tests whether horizontal oveflow is handled.',
    children: Array.from({ length: 200 })
      .fill(null)
      .map((_, i) => <span key={i}>{i + 1}</span>)
  }
}

export default {
  component: DialogTemplate,
  args: { title: 'Dialog', description: 'Dialog description' }
}
