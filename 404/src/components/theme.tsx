import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'layout-dark-mode'

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => (
    window.localStorage.getItem(THEME_STORAGE_KEY) === 'true'
  ))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    window.localStorage.setItem(THEME_STORAGE_KEY, String(isDarkMode))
  }, [isDarkMode])

  return {
    isDarkMode,
    toggleTheme: () => setIsDarkMode((currentValue) => !currentValue),
  }
}
