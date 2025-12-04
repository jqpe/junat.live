import type { Meta, StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { expect, userEvent, within } from '@storybook/test'

import { RadioGroup } from './radio_group'

type Props = ComponentPropsWithoutRef<typeof RadioGroup>

export const Default: StoryFn<Props> = args => {
  return <RadioGroup {...args}></RadioGroup>
}

// Can change value
Default.play = async ctx => {
  const radiogroup = await within(ctx.canvasElement).findByRole('radiogroup')
  const radios = await within(radiogroup).findAllByRole('radio')

  await userEvent.click(radios.at(-1)!)

  const checkedRadio = await within(radiogroup).findByRole('radio', {
    checked: true,
  })

  await expect(checkedRadio.nextElementSibling).toHaveTextContent('English')
}

export default {
  component: RadioGroup,
  args: {
    defaultValue: 'fi',
    values: {
      fi: 'Suomi',
      en: 'English',
    },
  },
} satisfies Meta<typeof RadioGroup>
