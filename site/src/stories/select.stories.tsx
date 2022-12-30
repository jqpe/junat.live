import type { StoryObj } from '@storybook/react'
import type { SelectProps } from '~/components/input/select'

import { Select } from '~/components/input/select'

const DEFAULT_VALUE = 'one' as const

const ITEMS: SelectProps['items'] = {
  [DEFAULT_VALUE]: 'One',
  two: 'Two'
} as const

export const Default: StoryObj<SelectProps> = {}

export const Icon = {
  args: {
    Icon: (
      <svg width="24" height="24">
        <circle cx="12" cy="12" r="6" fill="red" />
      </svg>
    )
  }
}

export const Placeholder: StoryObj<SelectProps> = {
  args: {
    placeholder: 'Placeholder'
  }
}

export default {
  component: Select,
  args: { items: ITEMS, defaultValue: DEFAULT_VALUE }
}
