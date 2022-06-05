import { useEffect, useState } from 'react'

/**
 * Checks the user's color scheme preference with `window.matchMedia` and listens to updates.
 */
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
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
  }, [])

  return { colorScheme, setColorScheme }
}
