// Configuración de Tailwind

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",

    "./src/**/*.{vue,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '25': '6.25rem',
      },
      gridTemplateRows: {
        'layout': '72px 1fr 100px',
      },
      colors: {
        celeste: '#33ccff',
        azul: '#000066',
        violeta: '#6666ff',
        verde: '#009999',
        skeleton: {
          base: 'rgba(255, 255, 255, 0.1)',
          highlight: 'rgba(255, 255, 255, 0.1)'
        }
      },
      screens: {
        'xs': '380px',
      },
    },
  },
  plugins: [],
}

