import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101418',
        field: '#1f7a5a',
        clay: '#b8562f',
        sun: '#f5b84b',
        steel: '#4b6674'
      },
      boxShadow: {
        soft: '0 16px 40px rgba(16, 20, 24, 0.10)'
      }
    }
  },
  plugins: []
};

export default config;
