import { useState } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    fallback?: string;
    className?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop';

export default function LazyImage({ src, alt, fallback = DEFAULT_FALLBACK, className = '' }: LazyImageProps) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [currentSrc, setCurrentSrc] = useState(src || fallback);

    const handleLoad = () => {
        setStatus('loaded');
    };

    const handleError = () => {
        setStatus('error');
        if (currentSrc !== fallback) {
            setCurrentSrc(fallback);
        }
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* 加载中的骨架屏 */}
            {status === 'loading' && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-border-dark animate-pulse" />
            )}
            
            <img
                src={currentSrc}
                alt={alt}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                    status === 'loaded' ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </div>
    );
}
