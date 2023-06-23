try {
  const preferences = window.localStorage.getItem('preferences')
  const localTheme = JSON.parse(preferences).state.theme

  if (localTheme === 'light') {
    document.documentElement.classList.remove('dark')
  }

  if (localTheme === 'dark') {
    document.documentElement.classList.add('dark')
  }

  if (localTheme === 'auto') {
    const action = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'add'
      : 'remove'

    document.documentElement.classList[action]('dark')
  }
} catch {}
