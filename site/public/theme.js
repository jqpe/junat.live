const preferences = window.localStorage.getItem('preferences')
const localTheme = JSON.parse(preferences).state.theme

if (localTheme === 'light' || localTheme === 'auto') {
  document.documentElement.classList.remove('dark')
}

if (localTheme === 'dark') {
  document.documentElement.classList.add('dark')
}
