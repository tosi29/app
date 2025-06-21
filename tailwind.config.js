/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        secondary: '#6366f1',
        accent: '#8b5cf6',
        'text-primary': '#333333',
        'text-secondary': '#666666',
        'text-muted': '#888888',
        app: '#fafafa',
        card: '#ffffff',
      },
      boxShadow: {
        'app-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'app-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'app-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}