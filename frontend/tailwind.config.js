/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#ecfbff',
        twitter: '#1DA1F2',
        bluesky: '#0085FF',
        'active-green': '#0f766e',
        'card-border': '#8eb4c6',
        'pill-active-bg': '#dff6fd',
        'pill-active-fg': '#0b4f71',
        'pill-active-border': '#5ca9ca',
        'pill-inactive-bg': '#e4f1f7',
        'pill-inactive-fg': '#456479',
        'pill-inactive-border': '#9bb9c9',
        console: '#02111f',
        'console-fg': '#a8d5ea',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
