import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'
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

const readStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  if (stored === 'auto') return 'system'
  return 'system'
}

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [density, setDensityState] = useState<Density>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(DENSITY_STORAGE_KEY) as Density) || 'comfortable'
    }
    return 'comfortable'
  })
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() =>
    prefersDark() ? 'dark' : 'light'
  )

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  const setDensity = (newDensity: Density) => {
    setDensityState(newDensity)
    localStorage.setItem(DENSITY_STORAGE_KEY, newDensity)
  }

  useEffect(() => {
    const apply = () => {
      const resolved: 'dark' | 'light' =
        theme === 'system' ? (prefersDark() ? 'dark' : 'light') : theme
      setResolvedTheme(resolved)
      document.documentElement.setAttribute('data-theme', resolved)
      document.documentElement.style.colorScheme = resolved
    }

    apply()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') apply()
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
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
