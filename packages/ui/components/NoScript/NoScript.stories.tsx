import type { ComponentMeta } from '@storybook/react'

import { NoScript } from './NoScript'

export default {
  component: NoScript
} as ComponentMeta<typeof NoScript>

const Template = (args: ComponentMeta<typeof NoScript>['args']) => {
  return <NoScript {...args} as="div" />
}

export const Default = Template.bind({})
