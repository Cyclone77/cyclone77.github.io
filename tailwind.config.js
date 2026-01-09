/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Brutalist Matrix Green
                primary: '#00FF41',
                // Brutalist backgrounds
                'background-light': '#F0F0F0',
                'background-dark': '#0A0A0A',
                // Surface colors
                'surface-light': '#FFFFFF',
                'surface-dark': '#18181B',
                // Text colors
                'text-primary-light': '#000000',
                'text-primary-dark': '#FFFFFF',
                'text-secondary-light': 'rgba(0,0,0,0.6)',
                'text-secondary-dark': 'rgba(255,255,255,0.6)',
                // Border colors
                'border-light': '#000000',
                'border-dark': '#FFFFFF',
            },
            fontFamily: {
                // Ant Design 风格字体栈 - 完整降级支持
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    '"Noto Sans"',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                    '"Noto Color Emoji"'
                ],
                // 代码字体栈 - 更清晰的等宽字体
                mono: [
                    '"Lucida Console"',
                    'Consolas',
                    '"Courier New"',
                    'Monaco',
                    'monospace'
                ],
            },
            borderRadius: {
                DEFAULT: '0px',
                none: '0px',
                full: '9999px',
            },
            boxShadow: {
                brutal: '4px 4px 0px 0px rgba(0,0,0,1)',
                'brutal-hover': '8px 8px 0px 0px rgba(0,0,0,1)',
                'brutal-white': '4px 4px 0px 0px rgba(255,255,255,1)',
                'brutal-white-hover': '8px 8px 0px 0px rgba(255,255,255,1)',
            },
            animation: {
                shimmer: 'shimmer 1.5s ease-in-out infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
            },
        },
    },
    plugins: [],
};
