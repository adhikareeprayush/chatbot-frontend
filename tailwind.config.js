/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb',
        },
        secondary: '#6b7280',
        background: '#0f172a',
        surface: '#1e293b',
        error: '#ef4444',
        success: '#22c55e',
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#f3f4f6',
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd',
              },
            },
            strong: {
              color: '#f9fafb',
            },
            code: {
              color: '#93c5fd',
            },
            pre: {
              backgroundColor: '#1f2937',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};