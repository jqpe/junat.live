import type DefaultTheme from 'tailwindcss/defaultTheme'

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '~/../tailwind.config'

const { theme: resolvedTheme } = resolveConfig(tailwindConfig)

type Resolved = typeof resolvedTheme

// `extend` key is coerced into actual values at runtime, `resolveConfig` returns the `extend` key which does not infact exist.
// See https://github.com/tailwindlabs/tailwindcss/issues/6422 and https://github.com/tailwindlabs/tailwindcss/pull/9972#issuecomment-1644475526.
// Here we create a new type with values from `extend.key` merged with the default theme.
type Theme = {
  [K in keyof Resolved['extend']]: Resolved['extend'][K]
} & Omit<Resolved, 'extend'> &
  typeof DefaultTheme

export const theme = resolvedTheme as unknown as Theme
