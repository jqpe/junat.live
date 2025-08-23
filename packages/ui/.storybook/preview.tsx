import type { Preview, ReactRenderer } from '@storybook/react'
import type { GetTranslatedValue, TranslateFn } from '@junat/core/i18n'

import { withThemeByClassName } from '@storybook/addon-themes'

import { UiContext } from '@junat/react-hooks/ui/provider'

import './reset.css'
import './tailwind.css'

const preview: Preview = {
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
    Story => (
      <UiContext
        value={{
          locale: 'en',
          Link: ((props: any) => <a {...props} />) as any,
          t: (key => key) as GetTranslatedValue,
          translate: (_ => s => s) as TranslateFn,
        }}
      >
        <Story />
      </UiContext>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
  globalTypes: {
    globalTypes: { theme: { type: 'string' } },
  },
}

export default preview
