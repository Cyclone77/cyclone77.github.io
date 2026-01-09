import { useState } from 'react';

interface DuotoneImageProps {
    src: string;
    alt: string;
    overlayColor?: string;
    fallback?: string;
    className?: string;
    badge?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop';

const OVERLAY_COLORS: Record<string, string> = {
    primary: 'bg-primary/20',
    blue: 'bg-blue-500/20',
    red: 'bg-red-500/20',
    purple: 'bg-purple-500/20',
    orange: 'bg-orange-500/20',
    green: 'bg-green-500/20',
};

export default function DuotoneImage({
    src,
    alt,
    overlayColor = 'primary',
    fallback = DEFAULT_FALLBACK,
    className = '',
    badge,
}: DuotoneImageProps) {
    const [currentSrc, setCurrentSrc] = useState(src || fallback);

    const handleError = () => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
    };

    const overlayClass = OVERLAY_COLORS[overlayColor] || OVERLAY_COLORS.primary;

    return (
        <div className={`relative overflow-hidden bg-primary/30 ${className}`}>
            {/* Duotone filtered image - always visible, bg color shows while loading */}
            <img
                src={currentSrc}
                alt={alt}
                onError={handleError}
                className="w-full h-full object-cover duotone-img group-hover:scale-110 transition-transform duration-700"
            />

            {/* Colored overlay */}
            <div className={`absolute inset-0 ${overlayClass} mix-blend-multiply`} />

            {/* Optional badge */}
            {badge && (
                <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 text-xs font-mono uppercase">
                    {badge}
                </div>
            )}
        </div>
    );
}
