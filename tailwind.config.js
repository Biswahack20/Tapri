/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tapri: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        clay: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        cardamom: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        slatebg: '#0F172A',
        warmbg: '#FFFDF9',
        cardbg: '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        display: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 8px 30px -4px rgba(180, 83, 9, 0.12), 0 4px 12px -2px rgba(180, 83, 9, 0.08)',
        'warm-lg': '0 14px 40px -4px rgba(180, 83, 9, 0.18), 0 6px 16px -2px rgba(180, 83, 9, 0.12)',
        'stamp': '0 0 0 4px #b45309, 0 0 0 6px #fde68a',
      },
      animation: {
        'steam': 'steam 2.5s infinite ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
        'fade-in': 'fadeIn 0.25s ease-out',
      },
      keyframes: {
        steam: {
          '0%': { transform: 'translateY(0) scaleX(0.8)', opacity: '0' },
          '40%': { opacity: '0.7' },
          '100%': { transform: 'translateY(-14px) scaleX(1.3)', opacity: '0' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
