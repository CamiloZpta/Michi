import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ===== Paleta Michi =====
        beige: {
          50: '#FBF8F3',
          100: '#F3ECE1', // fondo base
          200: '#EAE0D0',
        },
        rose: {
          50: '#F7E9E6',
          100: '#EFD6D1',
          300: '#DCAAA4', // acento primario (palo de rosa)
          500: '#C0837D',
          700: '#9C6259', // acento hover / profundo
        },
        sage: {
          100: '#E7ECDE',
          300: '#C3D0AC',
          500: '#93A776', // estados positivos
        },
        ink: {
          DEFAULT: '#4A3C36', // texto principal, café cálido (nunca negro puro)
          soft: '#7A6A62',
        },
        alerta: '#C4665B',
        stamp: '#B5493F', // rojo sello, solo para el "timbre" de fecha/confirmación
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-work-sans)', 'sans-serif'],
        mono: ['var(--font-courier)', 'monospace'],
      },
      borderRadius: {
        michi: '1.25rem',
      },
      boxShadow: {
        michi: '0 4px 24px -8px rgba(74, 60, 54, 0.15)',
      },
    },
  },
  plugins: [],
}
export default config
