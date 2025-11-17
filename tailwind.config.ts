import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './**/*.{ts,tsx,html}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: '#1D4ED8',
        'primary-dark': '#1E40AF',
        secondary: '#10B981',
        'secondary-dark': '#059669',
        dark: '#111827',
        light: '#f9fafb',
      },
    },
  },
} satisfies Config