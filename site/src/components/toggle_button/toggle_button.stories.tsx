import type { Meta, StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import React from 'react'

import HeartFilled from '@junat/ui/icons/heart_filled.svg'
import HeartOutline from '@junat/ui/icons/heart_outline.svg'

import { ToggleButton } from '.'

type Props = ComponentPropsWithoutRef<typeof ToggleButton>

export const Default: StoryFn<Props> = args => {
  const [checked, setChecked] = React.useState(args.checked)

  return (
    <ToggleButton {...args} checked={checked} onCheckedChange={setChecked} />
  )
}

export default {
  component: ToggleButton,
  args: {
    checked: false,
    children: [
      HeartOutline({ className: 'dark:fill-gray-300' }),
      HeartFilled({ className: 'dark:fill-gray-300' }),
    ],
    disabled: false,
  },
  argTypes: {
    ...Object.fromEntries(
      ['children', 'id', 'onCheckedChange', 'checked'].map(key => [
        key,
        { table: { disable: true } },
      ]),
    ),

    disabled: {
      defaultValue: false,
      type: 'boolean',
    },
  },
} satisfies Meta<Props>
