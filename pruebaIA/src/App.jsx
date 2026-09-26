import { ThemeToggle } from './components/ThemeToggle/ThemeToggle.jsx'
import { useTheme } from './context/ThemeContext.jsx'

const swatches = [
  { name: 'bg', className: 'bg-bg' },
  { name: 'surface', className: 'bg-surface' },
  { name: 'surface-2', className: 'bg-surface-2' },
  { name: 'line', className: 'bg-line' },
  { name: 'accent', className: 'bg-accent' },
  { name: 'accent-soft', className: 'bg-accent-soft' },
]

const cards = [
  {
    kicker: '01 · Color',
    title: 'Todo pasa por tokens',
    body: 'Ocho custom properties registradas con @property. Al flipar data-theme el navegador interpola cada una en sRGB, en vez de saltar de un valor al otro.',
  },
  {
    kicker: '02 · Transición',
    title: 'Revelado circular',
    body: 'El snapshot nuevo entra con un clip-path circle() que crece desde el centro del botón. El viejo se queda quieto debajo, sin cross-fade: no hay tono sucio a mitad.',
  },
  {
    kicker: '03 · Movimiento',
    title: 'Sólo transform y opacity',
    body: 'La perilla y los iconos viajan con translate y opacity, compuestos en GPU. Ninguna transición toca width, height ni box-shadow en caliente.',
  },
]

export default function App() {
  const { theme, isNight, resetTheme } = useTheme()

  const handleReset = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    resetTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="theme-glow pointer-events-none absolute inset-x-0 top-0 h-[26rem]" />

      <main className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-14 px-6 py-16 sm:px-10 sm:py-20">
        <header className="flex items-start justify-between gap-8">
          <div>
            <p className="theme-accent text-xs font-semibold tracking-[0.2em] uppercase">
              pruebaIA
            </p>
            <h1 className="theme-text mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Day / Night
            </h1>
            <p className="theme-muted mt-4 max-w-md text-[0.95rem] leading-relaxed">
              Un interruptor de tema con revelado circular mediante View
              Transitions, respaldo en transiciones CSS y cero destellos al
              recargar.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="theme-surface grid gap-4 rounded-2xl border p-6 sm:grid-cols-3 sm:gap-6">
          {swatches.map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-2">
              <span
                className={`h-10 w-full rounded-lg border border-line ${swatch.className}`}
              />
              <span className="theme-muted text-xs tracking-wide">{swatch.name}</span>
            </div>
          ))}
        </section>

        <section className="grid gap-5 sm:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.kicker}
              className="theme-surface flex flex-col gap-3 rounded-2xl border p-6"
            >
              <p className="theme-accent text-xs font-semibold tracking-[0.14em] uppercase">
                {card.kicker}
              </p>
              <h2 className="theme-text text-lg font-semibold">{card.title}</h2>
              <p className="theme-muted text-sm leading-relaxed">{card.body}</p>
            </article>
          ))}
        </section>

        <footer className="theme-border mt-auto flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <p className="theme-muted text-sm">
            Tema activo:{' '}
            <span className="theme-text font-medium">{isNight ? 'noche' : 'día'}</span>
            <span className="theme-muted"> ({theme})</span>
          </p>
          <button type="button" className="theme-btn" onClick={handleReset}>
            Usar preferencia del sistema
          </button>
        </footer>
      </main>
    </div>
  )
}
