import type { Meta, StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'
import type { Locale } from '~/types/common'

import { LOCALES } from '@junat/core/constants'

import { getSupportedLocale, translate } from '~/i18n'
import { NoScript } from './'

type Props = Partial<ComponentPropsWithoutRef<typeof NoScript>> & {
  locale: Locale
}

export const Default: StoryFn<Props> = args => {
  return (
    <NoScript as="div">
      <p>{translate(getSupportedLocale(args.locale))('errors.nojs')}</p>
    </NoScript>
  )
}

export default {
  component: NoScript,
  args: {
    locale: 'en',
  },
  argTypes: {
    ...Object.fromEntries(
      ['children', 'ref', 'as', 'css'].map(element => [
        element,
        { table: { disable: true } },
      ]),
    ),
    locale: { defaultValue: 'en', type: { name: 'enum', value: [...LOCALES] } },
  },
} satisfies Meta<Props>
