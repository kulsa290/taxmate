/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shell: 'var(--shell-bg)',
        panel: 'var(--panel-bg)',
        border: 'var(--panel-border)',
        accent: 'var(--accent)',
        ink: 'var(--text-primary)',
        muted: 'var(--text-muted)',
      },
      boxShadow: {
        soft: '0 24px 64px rgba(15, 23, 42, 0.10)',
        panel: '0 18px 48px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'shell-gradient': 'radial-gradient(circle at top left, rgba(148, 163, 184, 0.18), transparent 30%), radial-gradient(circle at top right, rgba(203, 213, 225, 0.28), transparent 28%), linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(241, 245, 249, 0.96))',
      },
    },
  },
  plugins: [],
}

