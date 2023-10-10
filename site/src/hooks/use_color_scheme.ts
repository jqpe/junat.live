import React from 'react'

/**
 * Checks the user's color scheme preference with `window.matchMedia` and listens to updates.
 */
export const useColorScheme = () => {
  const [colorScheme, updateColorScheme] = React.useState<'light' | 'dark'>(
    'light'
  )

  const setColorScheme = (theme: 'light' | 'dark') => {
    updateColorScheme(theme)
    window.__setPreferredTheme(theme)
  }

  React.useEffect(() => {
    // See https://caniuse.com/matchmedia for supported user agents.
    if (!window.matchMedia) return

    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
    updateColorScheme(matchMedia.matches ? 'dark' : 'light')

    const controller = new AbortController()

    matchMedia.addEventListener(
      'change',
      event => {
        if (localStorage.getItem('theme')) {
          return
        }

        updateColorScheme(event.matches ? 'dark' : 'light')
      },
      { signal: controller.signal }
    )

    return function cleanup() {
      controller.abort()
    }
  }, [])

  return { colorScheme, setColorScheme }
}
