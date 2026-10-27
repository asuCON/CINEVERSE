/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cineverse: {
          red: '#E50914',
          crimson: '#B81D24',
          dark: '#0B0B0B',
          card: '#141414',
          cardHover: '#1f1f1f',
          surface: '#181818',
          border: '#2a2a2a',
          muted: '#808080'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to top, #0B0B0B 10%, rgba(11, 11, 11, 0.7) 40%, rgba(11, 11, 11, 0.2) 75%, transparent 100%)',
        'card-gradient': 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(229, 9, 20, 0.5)',
        'modal': '0 20px 50px rgba(0, 0, 0, 0.9)'
      }
    },
  },
  plugins: [],
}
