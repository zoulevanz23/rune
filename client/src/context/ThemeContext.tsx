import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'auto'
type Density = 'compact' | 'comfortable'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'dark' | 'light'
  setTheme: (theme: Theme) => void
  density: Density
  setDensity: (density: Density) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const THEME_STORAGE_KEY = 'rune-theme'
const DENSITY_STORAGE_KEY = 'rune-density'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'auto'
    }
    return 'auto'
  })
  const [density, setDensityState] = useState<Density>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(DENSITY_STORAGE_KEY) as Density) || 'comfortable'
    }
    return 'comfortable'
  })
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  const setDensity = (newDensity: Density) => {
    setDensityState(newDensity)
    localStorage.setItem(DENSITY_STORAGE_KEY, newDensity)
  }

  useEffect(() => {
    const updateResolvedTheme = () => {
      let resolved: 'dark' | 'light'
      if (theme === 'auto') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        resolved = theme
      }
      setResolvedTheme(resolved)
      document.documentElement.setAttribute('data-theme', resolved)
    }

    updateResolvedTheme()

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => updateResolvedTheme()
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density)
  }, [density])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, density, setDensity }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}