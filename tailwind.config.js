/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        xit: {
          gold: {
            DEFAULT: '#D4AF37',
            light: '#FFD700',
            dark: '#B8860B',
            mid: '#FDB931',
          },
          blue: {
            DEFAULT: '#00BFFF',
            glow: '#00E5FF',
            navy: '#001F3F',
            ui: '#3B82F6',
          },
        },
      },
      boxShadow: {
        'xit-gold': '0 10px 40px -10px rgba(212, 175, 55, 0.35)',
        'xit-blue': '0 10px 40px -10px rgba(0, 191, 255, 0.25)',
      },
    },
  },
  plugins: [],
};
