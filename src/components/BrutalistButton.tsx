import { ButtonHTMLAttributes, ReactNode } from 'react';

interface BrutalistButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    accentColor?: string;
}

const VARIANT_STYLES = {
    primary: 'bg-primary text-black border-2 border-black dark:border-white',
    secondary: 'bg-blue-500 text-white border-2 border-black dark:border-white',
    outline: 'bg-transparent border-2 border-black dark:border-white text-black dark:text-white',
};

const SIZE_STYLES = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
};

export default function BrutalistButton({
    children,
    variant = 'primary',
    size = 'md',
    accentColor,
    className = '',
    ...props
}: BrutalistButtonProps) {
    const baseStyles = `
        font-mono font-bold uppercase tracking-tighter
        shadow-brutal dark:shadow-brutal-white
        active:translate-x-[2px] active:translate-y-[2px]
        active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]
        transition-all duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variantStyle = accentColor
        ? `${accentColor} text-white border-2 border-black dark:border-white`
        : VARIANT_STYLES[variant];

    return (
        <button
            className={`${baseStyles} ${variantStyle} ${SIZE_STYLES[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
