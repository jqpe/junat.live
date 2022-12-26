import type { ComponentProps } from 'react'

import { PrimaryButton } from '~/components/buttons/primary'

import { Meta, Story } from '@storybook/react'

const story: Meta = {
  title: 'Components/PrimaryButton',
  component: PrimaryButton
}

type Props = ComponentProps<typeof PrimaryButton>

const Template: Story<Props> = (args: Partial<Props>) => {
  return <PrimaryButton {...args} />
}

export const Default = Template.bind({})
Default.args = {
  children: 'primary button',
  size: 'xs'
}

export default story
