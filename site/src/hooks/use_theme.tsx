import React from 'react'

/**
 * @returns The current theme, using `window.__theme`; any updates to `window.__theme` are updated when document root class attribute changes.
 */
export const useTheme = (): 'light' | 'dark' => {
  const [theme, setTheme] = React.useState(window.__theme)

  React.useEffect(() => {
    const observer = new MutationObserver(() => setTheme(window.__theme))

    observer.observe(document.documentElement, {
      attributeFilter: ['class']
    })

    return function cleanup() {
      observer.disconnect()
    }
  }, [])

  return theme
}
