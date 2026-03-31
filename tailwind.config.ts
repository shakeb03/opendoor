import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        green: {
          DEFAULT: '#1a7a4a',
          light: '#25c076',
        },
        ink: {
          DEFAULT: '#0f1710',
          2: '#2a3d31',
          3: '#657a6d',
          4: '#a4b8ac',
          5: '#dce8e1',
        },
        bg: '#f7f4ef',
        warm: '#f0ebe0',
      },
    },
  },
  plugins: [],
};
export default config;
