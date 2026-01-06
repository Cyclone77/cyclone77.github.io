/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#137fec',
                'background-light': '#f6f7f8',
                'background-dark': '#101922',
                'surface-light': '#ffffff',
                'surface-dark': '#1c242d',
                'text-primary-light': '#111418',
                'text-primary-dark': '#ffffff',
                'text-secondary-light': '#637588',
                'text-secondary-dark': '#9dabb9',
                'border-dark': '#283039',
            },
            fontFamily: {
                display: ['Space Grotesk', 'sans-serif'],
                body: ['Noto Sans', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg: '0.5rem',
                xl: '0.75rem',
                '2xl': '1rem',
                full: '9999px',
            },
        },
    },
    plugins: [],
};
