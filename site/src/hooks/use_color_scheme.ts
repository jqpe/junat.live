import React, { useEffect, useState } from 'react'
import { usePreferences } from './use_preferences'

/**
 * Checks the user's color scheme preference with `window.matchMedia` and listens to updates.
 *
 * Works in tandem with {@link usePreferences} hook to support system theme or user choice.
 */
export const useColorScheme = () => {
  const preferredTheme = usePreferences(state => state.theme)
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light')

  React.useMemo(() => {
    if (colorScheme !== preferredTheme) {
      if (typeof window !== 'undefined') {
        const action = preferredTheme === 'light' ? 'remove' : 'add'

        document.documentElement.classList[action]('dark')

        if (preferredTheme === 'auto') {
          const action = colorScheme === 'light' ? 'remove' : 'add'

          document.documentElement.classList[action]('dark')
        }
      }

      if (preferredTheme !== 'auto') {
        setColorScheme(preferredTheme)
      }
    }
  }, [preferredTheme, colorScheme])

  useEffect(() => {
    if (preferredTheme !== 'auto') {
      return
    }

    // See https://caniuse.com/matchmedia for supported user agents.
    if (!window.matchMedia) return

    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
    setColorScheme(matchMedia.matches ? 'dark' : 'light')

    const controller = new AbortController()

    matchMedia.addEventListener(
      'change',
      event => {
        setColorScheme(event.matches ? 'dark' : 'light')
      },
      { signal: controller.signal }
    )

    return function cleanup() {
      controller.abort()
    }
  }, [preferredTheme])

  return { colorScheme, setColorScheme }
}
