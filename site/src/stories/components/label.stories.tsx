import type { Meta, Story } from '@storybook/react'

import { Label, LabelProps } from '~/components/elements/label'

const story: Meta = {
  title: 'Form/Label',
  component: Label
}

const Template: Story<LabelProps> = args => {
  return <Label {...args} />
}

export const Default = Template.bind({})
Default.args = {
  children: 'label'
}

export default story
