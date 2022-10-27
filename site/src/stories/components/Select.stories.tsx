import { Story } from '@storybook/react'
import { Select, SelectProps } from '../../components/input/Select'

const story = {
  title: 'Components/Select',
  component: Select
}

const Template: Story<SelectProps> = args => {
  return <Select {...args} />
}

const DEFAULT_VALUE = 'one' as const

const ITEMS: SelectProps['items'] = {
  [DEFAULT_VALUE]: 'One',
  two: 'Two'
} as const

export const Default = Template.bind({})
Default.args = {
  items: ITEMS,
  defaultValue: DEFAULT_VALUE
}

export const Icon = Template.bind({})
Icon.args = {
  items: ITEMS,
  defaultValue: DEFAULT_VALUE,
  Icon: (
    <svg width="24" height="24">
      <circle cx="12" cy="12" r="6" fill="red" />
    </svg>
  )
}

export const Placeholder = Template.bind({})
Placeholder.args = {
  items: ITEMS,
  placeholder: 'Placeholder'
}

export default story
