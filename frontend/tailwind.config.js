/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cine: {
          void: '#07080B',
          surface: '#101116',
          elevated: '#17181E',
          red: '#E60914',
          shadowRed: '#5C040B',
          softWhite: '#F5F2F0',
          muted: '#94969F',
          spotlight: '#F5B048',
          // Mood colors
          purpleMood: '#3E2B58',
          slateMood: '#1A1F26',
          crimsonMood: '#70121D',
        }
      },
      borderRadius: {
        'card': '12px'
      }
    },
  },
  plugins: [],
}
