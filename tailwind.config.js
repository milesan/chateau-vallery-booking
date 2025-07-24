/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'château': {
          'dark': '#0a0a0f',
          'darker': '#000000',
          'parchment': '#d4c5a0',
          'gold': '#c9a961',
          'stone': '#666666',
          'mist': '#ffffff',
          'night': '#0f0f17',
          'border': 'rgba(212, 197, 160, 0.1)',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'radial-château': 'radial-gradient(ellipse at center, rgba(212, 197, 160, 0.05) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}