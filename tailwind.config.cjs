/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'var(--color-border)', /* primary with opacity */
        input: 'var(--color-input)', /* stone-200 */
        ring: 'var(--color-ring)', /* amber-300 */
        background: 'var(--color-background)', /* stone-50 */
        foreground: 'var(--color-foreground)', /* stone-900 */
        primary: {
          DEFAULT: 'var(--color-primary)', /* red-900 */
          foreground: 'var(--color-primary-foreground)', /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* stone-100 */
          foreground: 'var(--color-secondary-foreground)', /* stone-900 */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* amber-300 */
          foreground: 'var(--color-accent-foreground)', /* stone-950 */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red-600 */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* green-600 */
          foreground: 'var(--color-success-foreground)', /* white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* orange-600 */
          foreground: 'var(--color-warning-foreground)', /* white */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red-600 */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* stone-100 */
          foreground: 'var(--color-muted-foreground)', /* stone-600 */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* stone-100 */
          foreground: 'var(--color-card-foreground)', /* stone-800 */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* stone-100 */
          foreground: 'var(--color-popover-foreground)', /* stone-800 */
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)', /* 6px */
        md: 'var(--radius-md)', /* 12px */
        lg: 'var(--radius-lg)', /* 18px */
        xl: 'var(--radius-xl)', /* 24px */
      },
      fontFamily: {
        heading: ['Lora', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        caption: ['Karla', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'h1': ['2.75rem', { lineHeight: '1.15', fontWeight: '700' }],
        'h2': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h3': ['1.75rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h4': ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h5': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '100': '100',
        '200': '200',
        '300': '300',
        '400': '400',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '250': '250ms',
      },
      keyframes: {
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        slideDown: 'slideDown 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        slideIn: 'slideIn 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}