import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'prueba-ia:theme'
const THEMES = ['day', 'night']
const DARK_QUERY = '(prefers-color-scheme: dark)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const ThemeContext = createContext(null)

function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return THEMES.includes(value) ? value : null
  } catch {
    return null
  }
}

function readSystemTheme() {
  return window.matchMedia(DARK_QUERY).matches ? 'night' : 'day'
}

/**
 * El atributo del <html> se escribe imperativamente, no desde el estado de
 * React: dentro del callback de startViewTransition tiene que estar puesto
 * antes de que el navegador capture el snapshot, y un setState no llega a
 * tiempo (y react@19.3 ya no exporta flushSync).
 */
function writeTheme(theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* storage bloqueado: el tema no se recuerda */
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readStoredTheme() ?? readSystemTheme())

  // Mantiene el DOM sincronizado con el estado (montaje, StrictMode, HMR).
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
  }, [theme])

  // Mientras el usuario no elija nada, seguimos la preferencia del sistema.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const onChange = (event) => {
      if (readStoredTheme()) return
      setTheme(event.matches ? 'night' : 'day')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  /**
   * @param next    tema destino
   * @param origin  {x, y} de donde sale el revelado circular
   * @param prepare escrituras DOM críticas para el snapshot (p. ej. el
   *                data-night del botón). Se ejecutan de forma sincrónica
   *                dentro del callback, antes de que React repinte.
   */
  const commit = useCallback((next, origin, prepare) => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches
    const canTransition = typeof document.startViewTransition === 'function'

    const apply = () => {
      writeTheme(next)
      prepare?.(next)
      setTheme(next)
    }

    if (reducedMotion || !canTransition) {
      apply()
      return
    }

    root.style.setProperty('--vt-x', `${origin?.x ?? window.innerWidth / 2}px`)
    root.style.setProperty('--vt-y', `${origin?.y ?? window.innerHeight / 2}px`)
    root.classList.add('vt-active')

    let transition
    try {
      transition = document.startViewTransition(apply)
    } catch {
      apply()
      root.classList.remove('vt-active')
      return
    }

    // .then(ok, ko) en lugar de .finally: si la promesa se rechaza, el
    // .finally devolvería otra promesa rechazada y sin capturar.
    const clear = () => root.classList.remove('vt-active')
    transition.finished.then(clear, clear)
  }, [])

  const toggleTheme = useCallback(
    (origin, prepare) => {
      commit(theme === 'night' ? 'day' : 'night', origin, prepare)
    },
    [commit, theme],
  )

  const resetTheme = useCallback(
    (origin) => {
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignorado */
      }
      commit(readSystemTheme(), origin)
    },
    [commit],
  )

  const value = useMemo(
    () => ({ theme, isNight: theme === 'night', toggleTheme, resetTheme }),
    [theme, toggleTheme, resetTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme() {
  const context = use(ThemeContext)
  if (!context) {
    throw new Error('useTheme() sólo puede usarse dentro de <ThemeProvider>')
  }
  return context
}
