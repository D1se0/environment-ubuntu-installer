import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0b0b0e',
        panel: '#131318',
        edge: '#232329',
        whs: {
          red: '#e0303c',
          redbright: '#ff3b4b',
          reddark: '#8f1f28',
          ink: '#d6d6dc',
          grey: '#8a8f98',
          green: '#3fb850',
          orange: '#e95420'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'glow-red': '0 0 24px 0 rgba(224, 48, 60, 0.4)',
        'glow-red-lg': '0 0 60px 0 rgba(224, 48, 60, 0.25)',
        'glow-green': '0 0 20px 0 rgba(63, 184, 80, 0.35)'
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.6' },
          '80%, 100%': { transform: 'scale(1.9)', opacity: '0' }
        },
        gridDrift: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '48px 48px' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        blink: 'blink 1.1s step-end infinite',
        scanline: 'scanline 8s linear infinite',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        pulseRing: 'pulseRing 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        gridDrift: 'gridDrift 6s linear infinite',
        shimmer: 'shimmer 3.5s linear infinite'
      }
    }
  },
  plugins: []
} satisfies Config
