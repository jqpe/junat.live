import type { Meta, Story } from '@storybook/react'

import type { DialogProps } from '~/components/elements/dialog'

import {
  Dialog,
  DialogButton,
  DialogProvider
} from '~/components/elements/dialog'

const story: Meta = {
  title: 'Components/Dialog',
  component: Dialog
}

const Template: Story<DialogProps> = args => {
  return (
    <DialogProvider>
      <DialogButton>open</DialogButton>

      <Dialog {...args} />
    </DialogProvider>
  )
}

export const Default = Template.bind({})

Default.args = {
  title: 'Dialog title',
  description: 'My description'
}

export const VerticalOverflow = Template.bind({})

VerticalOverflow.args = {
  title: 'Vertically overflowing content',
  description: 'Tests whether vertical oveflow is handled.',
  children: Array.from({ length: 200 })
    .fill(null)
    .map((_, i) => <div key={i}>{i + 1}</div>)
}

export const HorizontalOverflow = Template.bind({})

HorizontalOverflow.args = {
  title: 'Horizontally overflowing content',
  description: 'Tests whether horizontal oveflow is handled.',
  children: Array.from({ length: 200 })
    .fill(null)
    .map((_, i) => <span key={i}>{i + 1}</span>)
}

export default story
