import type { Meta, StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { Locale } from '~/types/common'
import translate from '~/utils/translate'
import { getLocale } from '~/utils/get_locale'
import { LOCALES } from '~/constants'
import { StyledNoScript } from './styles'

type Props = Partial<ComponentPropsWithoutRef<typeof StyledNoScript>> & {
  locale: Locale
}

export const Default: StoryFn<Props> = args => {
  return (
    // As the NoScript component is a <noscript /> html tag we'll use the styles instead so we can see it.
    <StyledNoScript as="div">
      <p>{translate(getLocale(args.locale))('errors', 'nojs')}</p>
    </StyledNoScript>
  )
}

export default {
  component: StyledNoScript,
  args: {
    locale: 'en'
  },
  argTypes: {
    ...Object.fromEntries(
      ['children', 'ref', 'as', 'css'].map(element => [
        element,
        { table: { disable: true } }
      ])
    ),
    locale: { defaultValue: 'en', type: { name: 'enum', value: [...LOCALES] } }
  }
} satisfies Meta<Props>
