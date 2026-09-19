import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext(undefined)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () =>
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        style={{
          background: theme === 'light' ? '#ffffff' : '#1f2937',
          color: theme === 'light' ? '#1f2937' : '#f9fafb',
          minHeight: '100vh',
          padding: '1rem',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}

export default ThemeContext