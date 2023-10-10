import type { Meta, StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { SwitchButton } from './'
import HeartFilled from '~/components/icons/heart_filled.svg'
import HeartOutline from '~/components/icons/heart_outline.svg'
import React from 'react'

type Props = ComponentPropsWithoutRef<typeof SwitchButton>

export const Default: StoryFn<Props> = args => {
  const [checked, setChecked] = React.useState(args.checked)

  return (
    <SwitchButton {...args} checked={checked} onCheckedChange={setChecked} />
  )
}

export default {
  component: SwitchButton,
  args: {
    checked: false,
    children: [
      HeartOutline({ className: 'dark:fill-gray-300' }),
      HeartFilled({ className: 'dark:fill-gray-300' })
    ],
    disabled: false
  },
  argTypes: {
    ...Object.fromEntries(
      ['children', 'id', 'onCheckedChange', 'checked'].map(key => [
        key,
        { table: { disable: true } }
      ])
    ),

    disabled: {
      defaultValue: false,
      type: 'boolean'
    }
  }
} satisfies Meta<Props>
