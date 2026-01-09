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
                // Apple 风格字体栈 - SF Pro + 苹方
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"SF Pro Display"',
                    '"SF Pro Text"',
                    '"Helvetica Neue"',
                    'Helvetica',
                    'Arial',
                    '"PingFang SC"',
                    '"Hiragino Sans GB"',
                    '"Microsoft YaHei UI"',
                    '"Microsoft YaHei"',
                    'sans-serif'
                ],
                // 等宽字体栈 - 用于代码
                mono: [
                    '"SF Mono"',
                    'SFMono-Regular',
                    'ui-monospace',
                    'Menlo',
                    'Monaco',
                    'Consolas',
                    '"Liberation Mono"',
                    'monospace'
                ],
                // 标题字体 - 使用 SF Pro Display
                display: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"SF Pro Display"',
                    '"Helvetica Neue"',
                    'Helvetica',
                    'Arial',
                    '"PingFang SC"',
                    '"Microsoft YaHei"',
                    'sans-serif'
                ],
                // 正文字体
                body: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"SF Pro Text"',
                    '"Helvetica Neue"',
                    'Helvetica',
                    'Arial',
                    '"PingFang SC"',
                    '"Hiragino Sans GB"',
                    '"Microsoft YaHei"',
                    'sans-serif'
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
