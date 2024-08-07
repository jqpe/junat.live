import React from 'react'

export const useTheme = () => {
  const [theme, setTheme] = React.useState('light')

  React.useEffect(() => {
    const dark = window.document.documentElement.classList.contains('dark')

    setTheme(dark ? 'dark' : 'light')

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const dark = (mutation.target as HTMLElement).classList.contains(
            'dark',
          )

          setTheme(dark ? 'dark' : 'light')
        }
      }
    })
    observer.observe(document.documentElement, { attributes: true })

    return function cleanup() {
      observer.disconnect()
    }
  }, [])

  return { theme }
}
