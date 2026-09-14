import {type JSX, useState, useRef, useCallback, useEffect, type CSSProperties} from 'react'

const MAX_INTENSITY = 40
const DECAY_INTERVAL = 80

function getFlameStyle(intensity: number): CSSProperties {
    if (intensity === 0) return {}

    const heat = intensity / MAX_INTENSITY
    const hue = lerp(60, -120, heat / 0.8)
    const fadeToWhite = (heat - 0.8) / 0.2
    const sat = heat > 0.8 ? `${lerp(100, 0, fadeToWhite)}%` : '100%'
    const light = heat > 0.8 ? `${lerp(50, 100, fadeToWhite)}%` : '50%'
    const glowStrength = Math.round(heat * 65)
    const pulseSpeed = lerp(0.5, 0.06, heat)
    const chaotic = heat >= 0.55
    const glitching = heat >= 0.8
    const trembling = heat >= 0.35

    const animations: string[] = []
    if (trembling) {
        const trembleSpeed = lerp(0.15, 0.04, heat)
        animations.push(`border-tremble ${trembleSpeed}s linear infinite`)
    }
    if (glitching) {
        const glitchSpeed = lerp(0.12, 0.03, (heat - 0.8) / 0.2)
        animations.push(`flame-crazy ${pulseSpeed}s linear infinite`)
        animations.push(`flame-glitch ${glitchSpeed}s steps(3) infinite`)
    } else if (chaotic) {
        animations.push(`flame-crazy ${pulseSpeed}s linear infinite`)
    } else if (intensity > 2) {
        animations.push(`flame-pulse ${pulseSpeed}s ease-in-out infinite alternate`)
    }

    const borderColor = heat > 0.9
        ? `hsl(${hue}, 10%, 100%)`
        : `hsla(${hue}, 80%, 60%, ${(0.3 + heat * 0.7).toFixed(2)})`

    return {
        background: `hsl(${hue}, ${sat}, ${light})`,
        color: heat >= 0.85 ? '#1a1a1a' : heat < 0.3 ? '#1a1a1a' : '#fff',
        boxShadow: [
            `0 0 ${glowStrength}px hsla(${hue}, 90%, 50%, 0.8)`,
            `0 0 ${glowStrength * 2}px hsla(${hue}, 90%, 40%, 0.5)`,
            `0 0 ${glowStrength * 3}px hsla(${hue}, 80%, 30%, 0.3)`,
        ].join(', '),
        border: `2px solid ${borderColor}`,
        outline: `2px solid ${borderColor}`,
        animation: animations.length > 0 ? animations.join(', ') : undefined,
        transform: !chaotic && heat > 0.15 ? `scale(${1 + heat * 0.04})` : undefined,
    }
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * Math.max(0, Math.min(1, t))
}

function Counter(): JSX.Element {
    const [count, setCount] = useState<number>(0)
    const [intensity, setIntensity] = useState<number>(0)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const decayRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const clearDecay = useCallback(() => {
        if (decayRef.current) {
            clearInterval(decayRef.current)
            decayRef.current = null
        }
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }, [])

    const startDecay = useCallback(() => {
        clearDecay()
        timerRef.current = setTimeout(() => {
            decayRef.current = setInterval(() => {
                setIntensity((prev) => {
                    if (prev <= 1) {
                        clearDecay()
                        return 0
                    }
                    return prev - 1
                })
            }, DECAY_INTERVAL)
        }, 600)
    }, [clearDecay])

    useEffect(() => {
        return () => clearDecay()
    }, [clearDecay])

    const handleClick = (): void => {
        setCount((c) => c + 1)
        setIntensity((prev) => Math.min(prev + 1, MAX_INTENSITY))
        startDecay()
    }

    const flameStyle = getFlameStyle(intensity)

    return (
        <button
            className="counter p-4 w-fit rounded-lg shadow-md cursor-pointer transition-all duration-700 ease-in-out"
            style={{
                ...flameStyle,
                background: intensity === 0 ? '#dcfce7' : flameStyle.background,
            }}
            onClick={handleClick}
        >
            Llevas : {count} clicks
        </button>
    )
}

export default Counter
